import pool from '../config/db.js';

export const findAllPoolUsers = async () => {
    const [rows] = await pool.query('SELECT id, name, created_at FROM pool_users')
    return rows;
}

export const createPoolUser = async ({name}) => {
    const [result] = await pool.query(
        'INSERT INTO pool_users (name) VALUES (?)',
        [name]
    )
    return result.insertId
}