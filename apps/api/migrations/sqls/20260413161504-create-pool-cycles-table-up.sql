CREATE TABLE pool_cycles (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pool_id INT UNSIGNED NOT NULL,
    manager_id INT UNSIGNED NOT NULL,
    fish_type VARCHAR(50),
    fish_count INT NOT NULL DEFAULT 0,
    fish_price DECIMAL(10, 2) DEFAULT 0,
    total_harvest_weight DECIMAL(10, 2) DEFAULT 0,
    start_date DATE NOT NULL,
    harvest_date DATE,
    notes VARCHAR(100),
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active', 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_cycle_manager FOREIGN KEY (manager_id) REFERENCES pool_users(id)
);