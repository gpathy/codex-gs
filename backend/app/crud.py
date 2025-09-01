from typing import List, Optional
from sqlalchemy.orm import Session

from .models import User, Module, UserModule
from .auth import get_password_hash


# Users
def create_user(db: Session, *, email: str, password: str, full_name: Optional[str] = None, is_admin: bool = False, is_active: bool = True) -> User:
    user = User(
        email=email.lower(),
        full_name=full_name,
        hashed_password=get_password_hash(password),
        is_admin=is_admin,
        is_active=is_active,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def list_users(db: Session) -> List[User]:
    return db.query(User).order_by(User.id.desc()).all()


def get_user(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email.lower()).first()


def update_user(db: Session, user: User, *, full_name: Optional[str] = None, is_admin: Optional[bool] = None, is_active: Optional[bool] = None, password: Optional[str] = None) -> User:
    if full_name is not None:
        user.full_name = full_name
    if is_admin is not None:
        user.is_admin = is_admin
    if is_active is not None:
        user.is_active = is_active
    if password is not None:
        user.hashed_password = get_password_hash(password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user: User) -> None:
    db.delete(user)
    db.commit()


# Modules
def create_module(db: Session, *, name: str, description: Optional[str] = None) -> Module:
    module = Module(name=name, description=description)
    db.add(module)
    db.commit()
    db.refresh(module)
    return module


def list_modules(db: Session) -> List[Module]:
    return db.query(Module).order_by(Module.name.asc()).all()


def get_module(db: Session, module_id: int) -> Optional[Module]:
    return db.query(Module).filter(Module.id == module_id).first()


def update_module(db: Session, module: Module, *, name: Optional[str] = None, description: Optional[str] = None) -> Module:
    if name is not None:
        module.name = name
    if description is not None:
        module.description = description
    db.add(module)
    db.commit()
    db.refresh(module)
    return module


def delete_module(db: Session, module: Module) -> None:
    db.delete(module)
    db.commit()


# Assignments
def assign_module_to_user(db: Session, *, user: User, module: Module) -> UserModule:
    link = db.query(UserModule).filter(UserModule.user_id == user.id, UserModule.module_id == module.id).first()
    if link:
        return link
    link = UserModule(user=user, module=module)
    db.add(link)
    db.commit()
    db.refresh(link)
    return link


def remove_module_from_user(db: Session, *, user: User, module: Module) -> None:
    link = db.query(UserModule).filter(UserModule.user_id == user.id, UserModule.module_id == module.id).first()
    if link:
        db.delete(link)
        db.commit()


def list_user_modules(db: Session, *, user: User) -> List[Module]:
    return [um.module for um in user.modules]

