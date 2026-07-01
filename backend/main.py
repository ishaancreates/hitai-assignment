from fastapi import FastAPI, Header , HTTPException
# pyrefly: ignore [missing-import]
from fastapi.sse import EventSourceResponse, ServerSentEvent
from pydantic import BaseModel
from datetime import datetime 
from typing import Annotated
from fastapi.middleware.cors import CORSMiddleware
from collections.abc import AsyncIterable
import uuid
import asyncio
import json
import os
from contextlib import asynccontextmanager

class AnalysisRequest(BaseModel):
    video_url: str

class AnalysisResponse(BaseModel):
    analysis_id: str
    status: str

# In-memory and on-disk task storage setup
TASKS_FILE = os.path.join(os.path.dirname(__file__), "tasks.json")
tasks_lock = asyncio.Lock()
tasks = {}

def load_tasks():
    global tasks
    if os.path.exists(TASKS_FILE):
        try:
            with open(TASKS_FILE, "r") as f:
                tasks = json.load(f)
        except Exception as e:
            print(f"Error loading tasks: {e}")
            tasks = {}
    else:
        tasks = {}

async def save_tasks():
    async with tasks_lock:
        try:
            await asyncio.to_thread(_write_tasks_file)
        except Exception as e:
            print(f"Error saving tasks: {e}")

def _write_tasks_file():
    with open(TASKS_FILE, "w") as f:
        json.dump(tasks, f, indent=4)

event=[
    {"stage":"queued", "duration":0,"progress":0,"message":"Queued","status":"incomplete"},
    {"stage":"downloading_video", "duration":3,"progress":14,"message":"Downloading video","status":"incomplete"},
    {"stage":"extracting_frames", "duration":6,"progress":28,"message":"Extracting frames","status":"incomplete"},
    {"stage":"detecting_actions", "duration":10,"progress":47,"message":"Detecting actions","status":"incomplete"},
    {"stage":"segmenting_rounds", "duration":5,"progress":73,"message":"Segmenting rounds","status":"incomplete"},
    {"stage":"generating_insights", "duration":4,"progress":89,"message":"Generating insights","status":"incomplete"},
]

async def process_task(analysis_id):
    if analysis_id not in tasks:
        return
    try:
        current_stage = tasks[analysis_id].get("stage", "queued")
        start_index = 0
        for i, item in enumerate(event):
            if item["stage"] == current_stage:
                start_index = i
                break

        for idx, item in enumerate(event[start_index:]):
            # Set the stage immediately so it's visible right away
            if analysis_id not in tasks:
                return

            tasks[analysis_id]["stage"] = item["stage"]
            tasks[analysis_id]["progress"] = item["progress"]
            tasks[analysis_id]["message"] = item["message"]
            tasks[analysis_id]["timestamp"] = datetime.now().isoformat()

            tasks[analysis_id]["logs"].append({
                "analysis_id": analysis_id,
                "stage": item["stage"],
                "progress": item["progress"],
                "message": item["message"],
                "timestamp": datetime.now().isoformat()
            })

            if len(tasks[analysis_id]["logs"]) > 10:
                tasks[analysis_id]["logs"].pop(0)

            await save_tasks()
           
            await asyncio.sleep(item["duration"])

        if analysis_id not in tasks:
            return

        tasks[analysis_id]["stage"] = "completed"
        tasks[analysis_id]["status"] = "completed"
        tasks[analysis_id]["progress"] = 100
        tasks[analysis_id]["message"] = "Analysis completed"
        tasks[analysis_id]["timestamp"] = datetime.now().isoformat()
        tasks[analysis_id]["logs"].append({
            "analysis_id": analysis_id,
            "stage": "completed",
            "progress": 100,
            "message": "Analysis completed",
            "timestamp": datetime.now().isoformat()
        })
        await save_tasks()

    except Exception:
        if analysis_id in tasks:
            tasks[analysis_id]["stage"] = "failed"
            tasks[analysis_id]["status"] = "failed"
            tasks[analysis_id]["message"] = "Analysis failed"
            tasks[analysis_id]["timestamp"] = datetime.now().isoformat()
            await save_tasks()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load tasks and resume processing on startup
    load_tasks()
    for analysis_id, task in list(tasks.items()):
        if task.get("status") == "processing":
            asyncio.create_task(process_task(analysis_id))
    yield
    # Save tasks on shutdown
    await save_tasks()

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyses", response_model=AnalysisResponse)  
async def create_analysis (request: AnalysisRequest):
    analysis_id=str(uuid.uuid4())
    status= "queued"
    tasks[analysis_id] = {
        "analysis_id": analysis_id,
        "stage": "queued",
        "status": "processing",
        "progress": 0,
        "message": "",
        "timestamp": datetime.now().isoformat(),
        "video_url": request.video_url,
        "logs": []
    }   
    await save_tasks()
    asyncio.create_task(process_task(analysis_id))
    return AnalysisResponse(
        analysis_id= analysis_id,
        status= status
    )

@app.get("/analyses/{id}/stream", response_class=EventSourceResponse )
async def stream_task(id:str , last_event_id: Annotated[int | None, Header()]= None) -> AsyncIterable[ServerSentEvent]:
    last_stage = -1 if last_event_id is None else last_event_id
    first_send = True
    while True:
        if id not in tasks:
            raise HTTPException(
                status_code=404, detail=f"Analysis of video of analysis_id {id} does not exist"
            )
        current = tasks[id]
        stage_index = len(event) #default value
        for i,e in enumerate(event):
            if e["stage"] == current["stage"]:
                stage_index=i
                break
        if first_send or stage_index != last_stage:
            yield ServerSentEvent( 
                data = current,
                id = str(stage_index)
            )
            last_stage = stage_index
            first_send = False

        if current["status"] in ("completed", "failed"):
            break

        await asyncio.sleep(1)

@app.get("/analyses/{id}")
async def current_snapshot(id: str):
    if id not in tasks:
         raise HTTPException(
                        status_code=404, detail=f"Analysis of video of analysis_id {id} does not exist")
    return tasks[id]

