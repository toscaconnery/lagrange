import pool from '../config/db.js';

export const createPoolCycle = async ({ pool_id, manager_id, fish_count, fish_type, start_date }) => {
    const status = 'active'

    const [result] = await pool.query(
        'INSERT INTO pool_cycles (pool_id, manager_id, fish_type, fish_count, start_date, status) VALUES (?, ?, ?, ?, ?, ?)',
        [pool_id, manager_id, fish_type, fish_count, start_date, status]
    )

    return result.insertId;
};

export const findActivePoolCycleByPoolId = async ({pool_id}) => {
    const [rows] = await pool.query(`
        SELECT c.id, c.pool_id, c.manager_id, c.fish_type, c.fish_count, c.start_date, c.status
        FROM pool_cycles c
        WHERE c.pool_id = ?
        `,
        [pool_id]
    )
    return rows[0] ?? null;
}