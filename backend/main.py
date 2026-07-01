from fastapi import FastAPI, Header , HTTPException
from fastapi.sse import EventSourceResponse, ServerSentEvent
from pydantic import BaseModel
from datetime import datetime 
from typing import Annotated
from fastapi.middleware.cors import CORSMiddleware
from collections.abc import AsyncIterable
import uuid
import json
import asyncio

app = FastAPI()


##models
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    video_url: str

class AnalysisResponse(BaseModel):
    analysis_id: str
    status: str

# class Job(BaseModel):
#     analysis_id: str
#     stage: str
#     progress: float
#     message: str
#     timestamp: datetime

tasks={}

event=[
    {"stage":"queued", "duration":0,"progress":0,"message":"Queued","status":"incomplete"},
    {"stage":"downloading_video", "duration":3,"progress":0.14,"message":"Downloading video","status":"incomplete"},
    {"stage":"extracting_frames", "duration":6,"progress":0.28,"message":"Extracting frames","status":"incomplete"},
    {"stage":"detecting_actions", "duration":10,"progress":0.47,"message":"Detecting actions","status":"incomplete"},
    {"stage":"segmenting_rounds", "duration":5,"progress":0.73,"message":"Segmenting rounds","status":"incomplete"},
    {"stage":"generating_insights", "duration":4,"progress":0.89,"message":"Generating insights","status":"incomplete"},
    
]
async def process_task(analysis_id):
    try:
        for item in event:

            await asyncio.sleep(item["duration"])

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

        tasks[analysis_id]["status"] = "completed"

    except Exception:
        tasks[analysis_id]["status"] = "failed"

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
    asyncio.create_task(process_task(analysis_id))
    return AnalysisResponse(
        analysis_id= analysis_id,
        status= status
    )

@app.get("/analyses/{id}/stream", response_class=EventSourceResponse )
async def stream_task(id:str , last_event_id: Annotated[int | None, Header()]= None) -> AsyncIterable[ServerSentEvent]:
    last_stage = -1 if last_event_id is None else last_event_id
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
        if stage_index != last_stage:
            yield ServerSentEvent( 
                data = json.dumps(current),
                id = str(stage_index)
            )
            last_stage = stage_index

        if current["status"] in ("completed", "failed"):
            break

        await asyncio.sleep(1)

@app.get("/analyses/{id}")
async def current_snapshot(id: str):
    if id not in tasks:
         raise HTTPException(
                        status_code=404, detail=f"Analysis of video of analysis_id {id} does not exist")
    return tasks[id]
