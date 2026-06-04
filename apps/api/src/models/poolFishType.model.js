import pool from '../config/db.js';

export const findAllFishTypes = async () => {
    const [rows] = await pool.query('SELECT id, name FROM pool_fish_types')
    return rows;
}

export const createPoolFishType = async ({name}) => {
    const [result] = await pool.query(
        'INSERT INTO pool_fish_types (name) VALUES (?)',
        [name]
    )
    return result.insertId
}