#!/usr/bin/env python3
import sys
import os
import argparse
import uuid
from datetime import datetime

# Add the parent directory (project root) to sys.path to allow importing src modules.
# This assumes the script is in the backend directory
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '.')))

from src.db.database import SessionLocal
from src.core.security import get_password_hash
from sqlalchemy import Column, String, Boolean, DateTime, Integer, Text
from sqlalchemy.ext.declarative import declarative_base

# Use a minimal User model to avoid circular imports
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(50), primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(100), nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    profile_image_base64 = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    login_streak = Column(Integer, default=0)
    is_verified = Column(Boolean, default=False)
    verification_token = Column(String(100), nullable=True)
    is_subscribed = Column(Boolean, default=False)

# Optional: Create tables if they don't exist.
# This might be useful if running the script before the main app has ever run.
# However, typically the main app (app/main.py) handles table creation.
# To enable, uncomment the following line:
# Base.metadata.create_all(bind=engine)

def create_admin(username: str, email: str, password: str) -> bool:
    """
    Creates an admin user in the database.

    Args:
        username: The username for the admin.
        email: The email address for the admin.
        password: The password for the admin.

    Returns:
        True if the admin was created successfully, False otherwise.
    """
    db = SessionLocal()
    try:
        # Check if user with the same username already exists
        existing_user_by_username = db.query(User).filter(User.username == username).first()
        if existing_user_by_username:
            print(f"Error: User with username '{username}' already exists.")
            return False

        # Check if user with the same email already exists
        existing_user_by_email = db.query(User).filter(User.email == email).first()
        if existing_user_by_email:
            print(f"Error: User with email '{email}' already exists.")
            return False

        # Create new admin user
        hashed_password = get_password_hash(password)
        new_admin_user = User(
            id=str(uuid.uuid4()),  # Generate UUID for id
            username=username,
            email=email,
            hashed_password=hashed_password,
            is_admin=True,
            is_active=True,  # Admins should be active by default
            created_at=datetime.utcnow()
        )
        
        db.add(new_admin_user)
        db.commit()
        # db.refresh(new_admin_user) # Not strictly necessary for this script's output
        
        print(f"Admin user '{username}' created successfully.")
        return True
    
    except Exception as e:
        print(f"An error occurred while creating the admin user: {e}")
        db.rollback() # Rollback in case of error during commit
        return False
    
    finally:
        db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Create an admin user for the FastAPI application."
    )
    parser.add_argument(
        "--username",
        type=str,
        required=True,
        help="Username for the new admin user (e.g., 'admin')."
    )
    parser.add_argument(
        "--email",
        type=str,
        required=True,
        help="Email address for the new admin user (e.g., 'admin@example.com')."
    )
    parser.add_argument(
        "--password",
        type=str,
        required=True,
        help="Password for the new admin user. Choose a strong password."
    )
    
    args = parser.parse_args()

    # Basic password validation (optional, but good practice)
    if len(args.password) < 3:
        print("Error: Password must be at least 3 characters long.")
        sys.exit(1) # Exit with an error code
    
    if create_admin(args.username, args.email, args.password):
        sys.exit(0) # Exit successfully
    else:
        sys.exit(1) # Exit with an error code