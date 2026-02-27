from sqlalchemy.orm import Session
from models import LoginBarberos
from Backend.core.security import verify_password

def authenticate_login_barbero(
    db: Session,
    email: str,
    password: str
):
    login = (
        db.query(LoginBarberos)
        .filter(LoginBarberos.email == email)
        .first()
    )

    if not login:
        return None

    if not verify_password(password, login.password_hash):
        return None

    return login
