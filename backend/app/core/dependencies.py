from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.auth import service
from app.auth.model import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Resolve and verify the bearer token and return the authenticated User.

    Raises HTTP 401 with a `WWW-Authenticate: Bearer` header when the token
    is missing, invalid, or expired.
    """
    user = service.get_current_user(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return user

def get_admin_user(current_user: User = Depends(get_current_user)) -> User:
    """Dependency that ensures the current user has the `admin` role.

    Raises HTTP 403 when the user is not an admin.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user