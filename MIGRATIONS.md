# Database Migrations Guide

This guide covers database migrations for BlockPort Global using Alembic.

## 🗃️ Overview

We use Alembic for database schema management. This allows us to:

- Version control database schema changes
- Apply incremental updates to production databases
- Rollback changes if needed
- Maintain consistency across environments

## 🚀 Quick Start

### Initial Setup (First Time Only)

```bash
cd backend
alembic init alembic
```

This creates the `alembic/` directory with migration scripts.

### Creating Your First Migration

```bash
# Generate migration from model changes
alembic revision --autogenerate -m "Initial migration"

# Apply the migration
alembic upgrade head
```

## 📋 Common Commands

### Create a New Migration

```bash
# Auto-generate migration from model changes
alembic revision --autogenerate -m "Add user table"

# Create empty migration (for data migrations)
alembic revision -m "Seed initial data"
```

### Apply Migrations

```bash
# Apply all pending migrations
alembic upgrade head

# Apply specific migration
alembic upgrade <revision_id>

# Apply one migration forward
alembic upgrade +1
```

### Rollback Migrations

```bash
# Rollback to previous migration
alembic downgrade -1

# Rollback to specific migration
alembic downgrade <revision_id>

# Rollback all migrations
alembic downgrade base
```

### Check Migration Status

```bash
# Show current migration status
alembic current

# Show migration history
alembic history

# Show pending migrations
alembic show <revision_id>
```

## 🏗️ Migration Workflow

### 1. Development Environment

```bash
# 1. Make changes to your SQLAlchemy models
# 2. Generate migration
alembic revision --autogenerate -m "Add new column to users"

# 3. Review the generated migration file
# 4. Apply migration
alembic upgrade head

# 5. Test your changes
```

### 2. Production Deployment

```bash
# 1. Deploy your code
# 2. Run migrations
alembic upgrade head

# 3. Verify deployment
```

## 📝 Migration Best Practices

### 1. Always Review Auto-Generated Migrations

```python
# Example migration file: alembic/versions/001_add_user_table.py
def upgrade():
    # Review these operations before applying
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

def downgrade():
    # Always provide a downgrade path
    op.drop_table('users')
```

### 2. Use Descriptive Migration Messages

```bash
# Good
alembic revision --autogenerate -m "Add email verification to users"

# Bad
alembic revision --autogenerate -m "Update users"
```

### 3. Test Migrations Locally

```bash
# Apply migration
alembic upgrade head

# Test your application

# If issues, rollback
alembic downgrade -1
```

## 🔧 Configuration

### Environment Variables

Set these in your `.env` file:

```env
DATABASE_URL=postgresql://user:password@host:5432/database_name
```

### Alembic Configuration

The `alembic.ini` file contains:

```ini
[alembic]
script_location = alembic
sqlalchemy.url = postgresql://user:password@localhost/blockport_global
```

## 🚨 Troubleshooting

### Common Issues

#### 1. "Target database is not up to date"

```bash
# Check current status
alembic current

# Apply pending migrations
alembic upgrade head
```

#### 2. "Can't locate revision identified by"

```bash
# Check migration history
alembic history

# Reset to a known good state
alembic stamp head
```

#### 3. "Multiple heads detected"

```bash
# Merge multiple migration branches
alembic merge heads -m "Merge migrations"
```

### Recovery Commands

```bash
# Mark database as up-to-date without running migrations
alembic stamp head

# Force a specific revision
alembic stamp <revision_id>

# Show SQL without executing
alembic upgrade head --sql
```

## 📊 Production Considerations

### 1. Backup Before Migrations

```bash
# PostgreSQL backup
pg_dump -h host -U user -d database > backup.sql
```

### 2. Zero-Downtime Migrations

For large tables, consider:

- Adding columns as nullable first
- Backfilling data in batches
- Making columns non-nullable in a separate migration

### 3. Monitoring

```bash
# Check migration status in production
alembic current

# Verify table structure
\d+ table_name  # In psql
```

## 🔄 Example Migration Scenarios

### Adding a New Column

```python
# Migration file
def upgrade():
    op.add_column('users', sa.Column('phone', sa.String(20), nullable=True))

def downgrade():
    op.drop_column('users', 'phone')
```

### Creating an Index

```python
def upgrade():
    op.create_index('ix_users_email', 'users', ['email'])

def downgrade():
    op.drop_index('ix_users_email', 'users')
```

### Data Migration

```python
from alembic import op
import sqlalchemy as sa

def upgrade():
    # Schema change
    op.add_column('users', sa.Column('status', sa.String(20), nullable=True))

    # Data migration
    connection = op.get_bind()
    connection.execute(
        "UPDATE users SET status = 'active' WHERE status IS NULL"
    )

    # Make column non-nullable
    op.alter_column('users', 'status', nullable=False)

def downgrade():
    op.drop_column('users', 'status')
```

## 📚 Additional Resources

- [Alembic Documentation](https://alembic.sqlalchemy.org/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🆘 Getting Help

If you encounter issues:

1. Check the migration history: `alembic history`
2. Review the generated SQL: `alembic upgrade head --sql`
3. Consult the team or create an issue on GitHub
