import pool from '../config/db.js';

export const listFisheryPools = async () => {
    const [rows] = await pool.query(`
        SELECT p.*
        FROM fishery_pools p
        WHERE p.deleted_at IS NULL;
    `)
    return rows
}

export const createFisheryPool = async ({ name, userId}) => {
    const status = 'inactive'

    const [result] = await pool.query(
        'INSERT INTO fishery_pools (name, user_id, status) VALUES (?, ?, ?)',
        [name, userId, status]
    )

    return result.insertId;
}