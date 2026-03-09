from fastapi import APIRouter

router = APIRouter()

@router.get("/graph")
def get_graph():

    return {
        "nodes":[
            {"id":"Typhoon"},
            {"id":"Semiconductors"},
            {"id":"NVIDIA"},
            {"id":"Portfolio"}
        ],
        "edges":[
            {"source":"Typhoon","target":"Semiconductors"},
            {"source":"Semiconductors","target":"NVIDIA"},
            {"source":"NVIDIA","target":"Portfolio"}
        ]
    }
