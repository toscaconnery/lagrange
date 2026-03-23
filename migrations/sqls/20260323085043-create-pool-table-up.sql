CREATE TABLE pools (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(100) NOT NULL,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'inactive',
    fish_species VARCHAR(20),
    fish_count INT NOT NULL DEFAULT 0,
    notes VARCHAR(100),
    manager INT UNSIGNED,
    owner INT UNSIGNED,
    fill_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_pool_manager FOREIGN KEY (manager) REFERENCES pool_users(id),
    CONSTRAINT fk_pool_owner FOREIGN KEY (owner) REFERENCES pool_users(id)
);