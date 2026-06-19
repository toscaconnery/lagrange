CREATE TABLE plantation_activity_schedules (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    activity_id INT UNSIGNED NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (activity_id) REFERENCES plantation_activities(id) ON DELETE CASCADE,
    INDEX idx_activity_schedules_activity (activity_id)
);