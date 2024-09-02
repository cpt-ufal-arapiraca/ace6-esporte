from pydantic import BaseModel
from pydantic import BaseModel, EmailStr

from ..enums.user_roles import UserRole
from ..enums.user_identities import UserIdentity

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: UserRole
    identity: UserIdentity

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    active: bool
    role: UserRole
    identity: UserIdentity

class LoginRequest(BaseModel):
    email: str
    password: str

class PasswordUpdateRequest(BaseModel):
    email: str
    new_password: str
    confirm_password: str