#!/usr/bin/env python3
"""
Database initialization script for production deployment.
Run this script once to create tables in production.

Usage:
    python scripts/init_db.py           # Normal run
    python scripts/init_db.py --dry-run # Test imports only
"""

import sys
import os
from pathlib import Path


def setup_paths():
    """Setup Python paths for imports."""
    # Get the backend directory (parent of scripts)
    script_dir = Path(__file__).resolve().parent
    backend_dir = script_dir.parent

    # Add backend directory to Python path
    if str(backend_dir) not in sys.path:
        sys.path.insert(0, str(backend_dir))

    print(f"Added to Python path: {backend_dir}")
    return backend_dir


def main():
    """Main function to initialize database."""
    try:
        # Check for dry-run flag
        dry_run = "--dry-run" in sys.argv
        if dry_run:
            print("DRY RUN MODE: Testing imports only")

        # Setup paths first
        backend_dir = setup_paths()

        # Change to backend directory
        os.chdir(backend_dir)
        print(f"Changed directory to: {os.getcwd()}")

        # Now import modules
        print("Loading environment variables...")
        from dotenv import load_dotenv
        load_dotenv()

        print("Importing database modules...")
        from app.core.database import engine, Base
        from app.models.user import User
        from app.core.config import settings

        print("Setting up logging...")
        import logging
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        logger = logging.getLogger(__name__)

        # Show current database URL (masked for security)
        db_url = settings.DATABASE_URL
        masked_url = db_url.split(
            '@')[0].split('://')[0] + "://***:***@" + db_url.split('@')[1] if '@' in db_url else db_url
        print(f"Database URL: {masked_url}")

        if dry_run:
            print("DRY RUN: All imports successful!")
            print("DRY RUN: Would create tables for models:")
            for table_name, table in Base.metadata.tables.items():
                print(f"  - {table_name}")
            return True

        print("Creating database tables...")
        logger.info("Creating database tables...")

        # Test database connection first
        try:
            print("Testing database connection...")
            with engine.connect() as conn:
                print("✅ Database connection successful!")
        except Exception as db_error:
            print(f"❌ Database connection failed: {db_error}")
            print("\n🔧 Troubleshooting steps:")
            print("1. Make sure you're using the EXTERNAL database URL from Render")
            print("2. Check if your IP is whitelisted (if required)")
            print("3. Verify the database is running and accessible")
            print("4. For Render databases, use the external hostname, not internal")
            print("\n📝 Expected URL format:")
            print("postgresql://user:pass@dpg-xxxxx-a.oregon-postgres.render.com/dbname")
            print("\n🚫 NOT the internal format:")
            print("postgresql://user:pass@dpg-xxxxx-a/dbname")
            return False

        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully!")

        # Verify tables were created
        print("Verifying tables...")
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        logger.info(f"Created tables: {tables}")
        print(f"✅ Successfully created tables: {tables}")

        return True

    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("🚀 Starting database initialization...")
    success = main()
    if success:
        print("✅ Database initialization completed successfully!")
        sys.exit(0)
    else:
        print("❌ Database initialization failed!")
        sys.exit(1)
