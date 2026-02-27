from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from jose import JWTError

from database import get_db
from auth_jwt import decode_access_token
from models import LoginBarbero  # ✅ modelo correcto

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login-barbero")


def get_current_login_barbero(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = decode_access_token(token)
        user_id = payload.get("sub")

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido"
            )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido"
        )

    login_barbero = (
        db.query(LoginBarbero)
        .filter(
            LoginBarbero.id == int(user_id),
            LoginBarbero.is_active == True
        )
        .first()
    )

    if not login_barbero:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario no válido"
        )

    return login_barbero
