import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .database import Base, engine, get_db, SessionLocal
from .models import User
from .schemas import (
    LoginInput,
    Token,
    UserCreate,
    UserOut,
    UserUpdate,
    ModuleCreate,
    ModuleOut,
    AssignmentCreate,
    MeOut,
)
from .auth import create_access_token, verify_password, get_current_user, get_current_admin, get_password_hash
from . import crud


app = FastAPI(title="Access Control App")

origins_env = os.getenv("CORS_ORIGINS", "*")
origins = [o.strip() for o in origins_env.split(",") if o.strip()]
allow_any_origin = len(origins) == 1 and origins[0] == "*"
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if allow_any_origin else origins,
    allow_credentials=False if allow_any_origin else True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    # Create tables
    Base.metadata.create_all(bind=engine)
    # Seed admin user if configured
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")
    if admin_email and admin_password:
        with SessionLocal() as db:
            existing = crud.get_user_by_email(db, admin_email)
            if not existing:
                crud.create_user(db, email=admin_email, password=admin_password, full_name="Admin", is_admin=True)


@app.post("/auth/login", response_model=Token)
def login(data: LoginInput, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, data.email)
    if not user or not user.is_active or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}


@app.get("/me", response_model=MeOut)
def me(current: User = Depends(get_current_user), db: Session = Depends(get_db)):
    modules = crud.list_user_modules(db, user=current)
    return {
        "id": current.id,
        "email": current.email,
        "full_name": current.full_name,
        "is_admin": current.is_admin,
        "modules": modules,
    }


# Users (Admin)
@app.post("/users", response_model=UserOut)
def create_user(payload: UserCreate, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    if crud.get_user_by_email(db, payload.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    user = crud.create_user(
        db,
        email=payload.email,
        password=payload.password,
        full_name=payload.full_name,
        is_admin=payload.is_admin or False,
        is_active=payload.is_active if payload.is_active is not None else True,
    )
    return user


@app.get("/users", response_model=list[UserOut])
def get_users(db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    return crud.list_users(db)


@app.patch("/users/{user_id}", response_model=UserOut)
def patch_user(user_id: int, payload: UserUpdate, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.update_user(
        db,
        user,
        full_name=payload.full_name,
        is_admin=payload.is_admin,
        is_active=payload.is_active,
        password=payload.password,
    )


@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    user = crud.get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    crud.delete_user(db, user)
    return {"ok": True}


# Modules (Admin)
@app.post("/modules", response_model=ModuleOut)
def create_module(payload: ModuleCreate, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    return crud.create_module(db, name=payload.name, description=payload.description)


@app.get("/modules", response_model=list[ModuleOut])
def get_modules(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    return crud.list_modules(db)


@app.patch("/modules/{module_id}", response_model=ModuleOut)
def patch_module(module_id: int, payload: ModuleCreate, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    module = crud.get_module(db, module_id)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    return crud.update_module(db, module, name=payload.name, description=payload.description)


@app.delete("/modules/{module_id}")
def delete_module(module_id: int, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    module = crud.get_module(db, module_id)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    crud.delete_module(db, module)
    return {"ok": True}


# Assignments (Admin)
@app.post("/assignments")
def create_assignment(payload: AssignmentCreate, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    user = crud.get_user(db, payload.user_id)
    module = crud.get_module(db, payload.module_id)
    if not user or not module:
        raise HTTPException(status_code=404, detail="User or Module not found")
    crud.assign_module_to_user(db, user=user, module=module)
    return {"ok": True}


@app.delete("/assignments")
def delete_assignment(payload: AssignmentCreate, db: Session = Depends(get_db), _: User = Depends(get_current_admin)):
    user = crud.get_user(db, payload.user_id)
    module = crud.get_module(db, payload.module_id)
    if not user or not module:
        raise HTTPException(status_code=404, detail="User or Module not found")
    crud.remove_module_from_user(db, user=user, module=module)
    return {"ok": True}
