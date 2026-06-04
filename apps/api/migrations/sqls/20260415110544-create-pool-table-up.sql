CREATE TABLE pools (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'inactive',
    manager INT UNSIGNED,
    owner INT UNSIGNED,
    last_cycle_id INT UNSIGNED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_pool_manager FOREIGN KEY (manager) REFERENCES pool_users(id),
    CONSTRAINT fk_pool_owner FOREIGN KEY (owner) REFERENCES pool_users(id),
    CONSTRAINT fk_pool_cycle FOREIGN KEY (last_cycle_id) REFERENCES pool_cycles(id)
);