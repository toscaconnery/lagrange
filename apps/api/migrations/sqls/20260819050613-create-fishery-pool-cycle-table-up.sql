CREATE TABLE fishery_pool_cycles (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pool_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED NOT NULL,
    label VARCHAR(100) NULL COMMENT 'mis. "Periode II"',
    seed_date DATE NULL COMMENT 'tgl masuk bibit',
    seed_count INT UNSIGNED NULL COMMENT 'jumlah bibit (ekor)',
    seed_price DECIMAL(12,2) NULL,
    status ENUM('ongoing','partial_harvest','finished') NOT NULL DEFAULT 'ongoing',
    end_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (pool_id) REFERENCES fishery_pools(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);