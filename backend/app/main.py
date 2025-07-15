from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api import auth, users, recipes, menus, shopping_lists

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(recipes.router, prefix="/api/recipes", tags=["recipes"])
app.include_router(menus.router, prefix="/api/menus", tags=["menus"])
app.include_router(shopping_lists.router, prefix="/api/shopping", tags=["shopping"])

@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.app_name} API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}