ALTER TABLE active_sessions ADD COLUMN refresh_token VARCHAR(1024);
ALTER TABLE active_sessions ADD COLUMN refresh_expiry_date TIMESTAMP;
