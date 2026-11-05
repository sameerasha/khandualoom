-- ===================================================================
-- Khandua Looms Enterprise Microservices - PostgreSQL Isolated Schemas
-- Multi-Tenant Schema Partitioning for Zero Cross-Service Coupling
-- ===================================================================

CREATE SCHEMA IF NOT EXISTS auth_schema;
CREATE SCHEMA IF NOT EXISTS user_schema;
CREATE SCHEMA IF NOT EXISTS product_schema;
CREATE SCHEMA IF NOT EXISTS inventory_schema;
CREATE SCHEMA IF NOT EXISTS order_schema;
CREATE SCHEMA IF NOT EXISTS payment_schema;
CREATE SCHEMA IF NOT EXISTS notification_schema;
CREATE SCHEMA IF NOT EXISTS audit_schema;

-- Enable UUID extension in public and schemas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- Grant usage on schemas to application user
GRANT ALL ON SCHEMA auth_schema TO postgres;
GRANT ALL ON SCHEMA user_schema TO postgres;
GRANT ALL ON SCHEMA product_schema TO postgres;
GRANT ALL ON SCHEMA inventory_schema TO postgres;
GRANT ALL ON SCHEMA order_schema TO postgres;
GRANT ALL ON SCHEMA payment_schema TO postgres;
GRANT ALL ON SCHEMA notification_schema TO postgres;
GRANT ALL ON SCHEMA audit_schema TO postgres;
