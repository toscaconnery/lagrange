import pool from '../config/db.js';

export const findActivitiesByPlantationId = async (plantationId) => {
    const [rows] = await pool.query(
        `SELECT id, activity_type, description, amount, unit, activity_date, created_at
         FROM plantation_activities
         WHERE plantation_id = ?
         ORDER BY activity_date DESC`,
        [plantationId]
    );
    return rows;
};

export const createActivity = async ({ plantation_id, activity_type, description, amount, unit, activity_date }) => {
    const [result] = await pool.query(
        `INSERT INTO plantation_activities (plantation_id, activity_type, description, amount, unit, activity_date)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [plantation_id, activity_type, description, amount || null, unit || null, activity_date]
    );
    return result.insertId;
};