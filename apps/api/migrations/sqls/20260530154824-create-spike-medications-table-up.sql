CREATE TABLE spike_medications (
    log_id BIGINT REFERENCES spike_logs(id) ON DELETE CASCADE,
    medication_name VARCHAR(100) NOT NULL, 
    dosage VARCHAR(50) DEFAULT NULL,
    PRIMARY KEY (log_id, medication_name)
);