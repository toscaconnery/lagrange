CREATE TABLE spike_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY, -- Added AUTO_INCREMENT so IDs generate automatically
    glucose_value INT NOT NULL, -- Actual blood sugar value (mg/dL)
    context_type ENUM(
        'first_wake_up', 
        'before_meal', 
        'after_meal', 
        'two_hours_after_meal', 
        'at_bedtime',
        'random'
    ) NOT NULL,
    hba1c DECIMAL(3, 1) DEFAULT NULL, -- Optional, since it's only tested every 3 months
    measured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT DEFAULT NULL,

    -- Inline MySQL Index definition
    INDEX idx_spike_measured_at (measured_at)
);