import pool from '../config/db.js';

export const listFisheryPoolCycles = async () => {
    const [rows] = await pool.query(`
        SELECT c.*
        FROM fishery_pool_cycles c
        WHERE c.deleted_at IS NULL;
    `)
    return rows
}

export const createFisheryPoolCycle = async ({ pool_id, user_id, label, seed_date, seed_count, seed_price, status, end_date}) => {
    const [result] = await pool.query(
        'INSERT INTO fishery_pool_cycles (pool_id, user_id, label, seed_date, seed_count, seed_price, status, end_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [pool_id, user_id, label, seed_date, seed_count, seed_price, status, end_date]
    )

    return result.insertId;
}
