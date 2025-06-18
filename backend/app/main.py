from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .route import groups, expenses, chatbot

app = FastAPI(title="Splitwise Clone API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

app.include_router(groups.router, prefix="/groups", tags=["Groups"])
app.include_router(chatbot.router)
app.include_router(expenses.router, tags=["Expenses"]) 

@app.get("/")
def root():
    return {"message": "Backend is working!"}
