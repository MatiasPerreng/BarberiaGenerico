from sqlalchemy.orm import Session
from models import LoginBarbero
from core.security import verify_password


def authenticate_barbero(
    db: Session,
    email: str,
    password: str
):
    barbero = (
        db.query(LoginBarbero)
        .filter(
            LoginBarbero.email == email,
            LoginBarbero.is_active == True
        )
        .first()
    )

    if not barbero:
        return None

    if not verify_password(password, barbero.password_hash):
        return None

    return barbero
