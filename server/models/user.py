from dataclasses import dataclass
import bcrypt

from ..enums.user_roles import UserRole
from ..enums.user_identities import UserIdentity

@dataclass
class User:
    id: int
    name: str
    email: str
    hashed_password: str
    active: bool
    role: UserRole
    identity: UserIdentity

    @staticmethod
    def hash_password(password: str) -> str:
        pwd_bytes = password.encode('utf-8')
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password=pwd_bytes, salt=salt)
        return hashed_password.decode('utf-8') 

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        password_byte_enc = plain_password.encode('utf-8')
        return bcrypt.checkpw(password_byte_enc, hashed_password.encode('utf-8'))