CREATE TABLE active_sessions (
    id BIGSERIAL PRIMARY KEY,
    token VARCHAR(1024) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    expiry_date TIMESTAMP NOT NULL
);

CREATE INDEX idx_active_token ON active_sessions(token);
