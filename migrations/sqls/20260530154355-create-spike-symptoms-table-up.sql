CREATE TABLE spike_symptoms (
    log_id BIGINT NOT NULL,
    symptom ENUM(
        'anxiety', 
        'stress', 
        'happy', 
        'normal', 
        'heartburn', 
        'headache', 
        'debility', 
        'diarrhea'
    ) NOT NULL,
    PRIMARY KEY (log_id, symptom),
    
    -- Explicitly define the foreign key for MySQL to enforce ON DELETE CASCADE
    CONSTRAINT fk_spike_symptoms_log_id 
        FOREIGN KEY (log_id) 
        REFERENCES spike_logs(id) 
        ON DELETE CASCADE
);