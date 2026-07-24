import bcrypt
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from app.core.config import settings

class PasswordHasher:
    @staticmethod
    def hash(password: str) -> str:
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')

    @staticmethod
    def verify(plain_password: str, hashed_password: str) -> bool:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

class JWTHandler:
    @staticmethod
    def create_access_token(subject: str | int, expires_delta: timedelta = None) -> str:
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode = {"exp": expire, "sub": str(subject)}
        encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
        return encoded_jwt
        
    @staticmethod
    def decode_access_token(token: str) -> dict | None:
        try:
            payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
            return payload
        except JWTError:
            return None

import hashlib
import base64
from cryptography.fernet import Fernet

class EncryptionHandler:
    @staticmethod
    def get_fernet() -> Fernet:
        key = settings.ENCRYPTION_KEY.encode('utf-8')
        if len(key) != 44:
            digest = hashlib.sha256(key).digest()
            key = base64.urlsafe_b64encode(digest)
        return Fernet(key)

    @staticmethod
    def encrypt(text: str) -> str:
        if not text:
            return text
        f = EncryptionHandler.get_fernet()
        return f.encrypt(text.encode('utf-8')).decode('utf-8')

    @staticmethod
    def decrypt(cipher_text: str) -> str:
        if not cipher_text:
            return cipher_text
        f = EncryptionHandler.get_fernet()
        return f.decrypt(cipher_text.encode('utf-8')).decode('utf-8')
