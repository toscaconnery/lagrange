CREATE TABLE plantation_activities (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

    plantation_id INT UNSIGNED NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    description TEXT,
    amount DECIMAL(10,2),
    unit VARCHAR(50),
    activity_date DATE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (plantation_id) REFERENCES plantations(id) ON DELETE CASCADE
);