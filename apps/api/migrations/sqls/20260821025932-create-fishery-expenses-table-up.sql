CREATE TABLE fishery_expenses (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    pool_cycle_id INT UNSIGNED NOT NULL,
    category ENUM('bibit','servis_kolam','listrik','boster','pakan','transportasi','operasional_lain') NOT NULL,
    feed_id INT UNSIGNED NULL COMMENT 'diisi kalau category = pakan',
    description VARCHAR(255) NOT NULL COMMENT 'Uraian',
    expense_date DATE NULL,
    volume DECIMAL(12,2) NOT NULL DEFAULT 0,
    unit VARCHAR(20) NULL COMMENT 'OH, Ekor, Bks, Kg, Sak, Bulan, Trip',
    unit_price DECIMAL(12,2) NOT NULL DEFAULT 0,
    amount DECIMAL(14,2) NOT NULL DEFAULT 0 COMMENT 'Jumlah',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL DEFAULT NULL,
    FOREIGN KEY (pool_cycle_id) REFERENCES fishery_pool_cycles(id),
    FOREIGN KEY (feed_id) REFERENCES fishery_feeds(id)
);