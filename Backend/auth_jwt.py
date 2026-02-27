from datetime import datetime, timedelta
from jose import jwt, JWTError

SECRET_KEY = "CAMBIAR_ESTE_SECRET_EN_PROD"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 8  


def create_access_token(data: dict) -> str:
    """
    Crea un JWT.
    data DEBE incluir:
    - sub: id del usuario (barbero)
    - role: rol del usuario (admin | barbero)
    """
    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def decode_access_token(token: str) -> dict:
    """
    Decodifica y valida un JWT.
    Lanza JWTError si es inválido o expiró.
    """
    return jwt.decode(
        token,
        SECRET_KEY,
        algorithms=[ALGORITHM]
    )
