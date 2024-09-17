from http.client import HTTPException
from fastapi import FastAPI, Response, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from typing import List
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone

from .models.user import User
from .models.response_models import UserCreate, UserResponse, LoginRequest, PasswordUpdateRequest

from .enums.user_roles import UserRole
from .enums.user_identities import UserIdentity

from .db.db import DBConnection

app = FastAPI()
db_connection = DBConnection()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "4864cb4857a68e3a5d57af391a92d5644ecfa64569dea322fa7192c61489cba9"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )
        return {"detail": "Token is valid!"}
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

@app.post("/verify-token")
def verify_token_route(token: str = Depends(oauth2_scheme)):
    return verify_token(token)

@app.post("/register", status_code=status.HTTP_201_CREATED)
def register_user(user: UserCreate, response: Response):
    try:
        hashed_password = User.hash_password(user.password)
        created_user = db_connection.insert_user(
            name=user.name,
            email=user.email,
            hashed_password=hashed_password,
            role=user.role,
            identity=user.identity
        )
        return {"detail": "User registered successfully!", "user": created_user}
    except ValueError as e:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"detail": str(e)}
    
@app.get("/users", status_code=status.HTTP_200_OK)
def get_all_users(response: Response):
    rows = db_connection.get_all_users()
    users: List[User] = []
 
    if not rows:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"detail": "No users found"}

    for row in rows:
        print(row)
        users.append(
            UserResponse(
                id=row[0],
                name=row[1],
                email=row[2],
                active=bool(row[3]),
                role=UserRole(row[4]),
                identity=UserIdentity(row[5])
            )
        )

    return {"detail": "Users found with success!", "users": users}

@app.post("/login", status_code=status.HTTP_200_OK)
def login(request: LoginRequest, response: Response):
    try: 
        user = db_connection.get_user_by_email(request.email)
        if user.active and User.verify_password(request.password, user.hashed_password):
            access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
            token = create_access_token(
                data={"sub": user.email}, expires_delta=access_token_expires
            )

            return {"detail": "Login successful", "access_token": token, "token_type": "bearer"}
        else:
            response.status_code = status.HTTP_401_UNAUTHORIZED
            return {"detail": "Invalid credentials or inactive user"}
    except ValueError as e:
        response.status_code = status.HTTP_404_NOT_FOUND
        return {"detail": str(e)}
    
@app.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(request: PasswordUpdateRequest, response: Response):
    if request.new_password != request.confirm_password:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"detail": "Passwords do not match"}

    try:
        db_connection.update_password(request.email, request.new_password)
        return {"detail": "Password updated successfully"}
    except ValueError as e:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"detail": str(e)}