-- ===================================================================
-- Khandua Looms Enterprise Microservices - Database Roles & Permissions
-- Principle of Least Privilege: Dedicated Database Role per Microservice
-- ===================================================================

-- 1. Create Dedicated Microservice Service Roles
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'auth_role') THEN
        CREATE ROLE auth_role WITH LOGIN PASSWORD 'auth_secure_pass_2026';
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'user_role') THEN
        CREATE ROLE user_role WITH LOGIN PASSWORD 'user_secure_pass_2026';
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'product_role') THEN
        CREATE ROLE product_role WITH LOGIN PASSWORD 'product_secure_pass_2026';
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'inventory_role') THEN
        CREATE ROLE inventory_role WITH LOGIN PASSWORD 'inventory_secure_pass_2026';
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'order_role') THEN
        CREATE ROLE order_role WITH LOGIN PASSWORD 'order_secure_pass_2026';
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'payment_role') THEN
        CREATE ROLE payment_role WITH LOGIN PASSWORD 'payment_secure_pass_2026';
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'notification_role') THEN
        CREATE ROLE notification_role WITH LOGIN PASSWORD 'notification_secure_pass_2026';
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'audit_role') THEN
        CREATE ROLE audit_role WITH LOGIN PASSWORD 'audit_secure_pass_2026';
    END IF;
END $$;

-- 2. Revoke Public Default Access
REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA auth_schema FROM PUBLIC;
REVOKE ALL ON SCHEMA user_schema FROM PUBLIC;
REVOKE ALL ON SCHEMA product_schema FROM PUBLIC;
REVOKE ALL ON SCHEMA inventory_schema FROM PUBLIC;
REVOKE ALL ON SCHEMA order_schema FROM PUBLIC;
REVOKE ALL ON SCHEMA payment_schema FROM PUBLIC;
REVOKE ALL ON SCHEMA notification_schema FROM PUBLIC;
REVOKE ALL ON SCHEMA audit_schema FROM PUBLIC;

-- 3. Grant Isolated Schema Ownership & DML Permissions
-- auth_role: Only auth_schema
GRANT USAGE, CREATE ON SCHEMA auth_schema TO auth_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth_schema TO auth_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA auth_schema TO auth_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth_schema GRANT ALL ON TABLES TO auth_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA auth_schema GRANT ALL ON SEQUENCES TO auth_role;

-- user_role: Only user_schema
GRANT USAGE, CREATE ON SCHEMA user_schema TO user_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA user_schema TO user_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA user_schema TO user_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA user_schema GRANT ALL ON TABLES TO user_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA user_schema GRANT ALL ON SEQUENCES TO user_role;

-- product_role: Only product_schema
GRANT USAGE, CREATE ON SCHEMA product_schema TO product_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA product_schema TO product_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA product_schema TO product_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA product_schema GRANT ALL ON TABLES TO product_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA product_schema GRANT ALL ON SEQUENCES TO product_role;

-- inventory_role: Only inventory_schema
GRANT USAGE, CREATE ON SCHEMA inventory_schema TO inventory_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA inventory_schema TO inventory_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA inventory_schema TO inventory_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA inventory_schema GRANT ALL ON TABLES TO inventory_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA inventory_schema GRANT ALL ON SEQUENCES TO inventory_role;

-- order_role: Only order_schema
GRANT USAGE, CREATE ON SCHEMA order_schema TO order_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA order_schema TO order_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA order_schema TO order_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA order_schema GRANT ALL ON TABLES TO order_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA order_schema GRANT ALL ON SEQUENCES TO order_role;

-- payment_role: Only payment_schema
GRANT USAGE, CREATE ON SCHEMA payment_schema TO payment_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA payment_schema TO payment_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA payment_schema TO payment_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA payment_schema GRANT ALL ON TABLES TO payment_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA payment_schema GRANT ALL ON SEQUENCES TO payment_role;

-- notification_role: Only notification_schema
GRANT USAGE, CREATE ON SCHEMA notification_schema TO notification_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA notification_schema TO notification_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA notification_schema TO notification_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA notification_schema GRANT ALL ON TABLES TO notification_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA notification_schema GRANT ALL ON SEQUENCES TO notification_role;

-- audit_role: Only audit_schema
GRANT USAGE, CREATE ON SCHEMA audit_schema TO audit_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA audit_schema TO audit_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA audit_schema TO audit_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA audit_schema GRANT ALL ON TABLES TO audit_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA audit_schema GRANT ALL ON SEQUENCES TO audit_role;
