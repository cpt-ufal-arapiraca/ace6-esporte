from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from .models.user import User
from .models.response_models import UserCreate, UserResponse, LoginRequest, PasswordUpdateRequest

from .enums.user_roles import UserRole
from .enums.user_identities import UserIdentity

from .db.db import DBConnection

app = FastAPI()
db_connection = DBConnection()

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
            return {"detail": "Login successful", "user": user}
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