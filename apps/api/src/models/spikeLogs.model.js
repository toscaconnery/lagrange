import pool from '../config/db.js';

export const findAllLogs = async () => {
    const [rows] = await pool.query('SELECT * FROM spike_logs')
}