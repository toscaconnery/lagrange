import pool from '../config/db.js';

export const listFisheryPools = async () => {
    const [rows] = await pool.query(`
        SELECT p.*
        FROM fishery_pools p
        WHERE p.deleted_at IS NULL;
    `)
    return rows
}

export const listFisheryPoolsWithNoCycle = async () => {
    const [rows] = await pool.query(`
        SELECT p.*
        FROM fishery_pools p
        WHERE p.deleted_at IS NULL
        AND NOT EXISTS (
              SELECT 1
              FROM fishery_pool_cycles c
              WHERE c.pool_id = p.id
                AND c.deleted_at IS NULL
                AND c.status IN ('ongoing', 'partial_harvest')
          )
        ORDER BY p.name;
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

export const findFisheryPoolById = async (id) => {
    const [rows] = await pool.query(
        'SELECT * FROM fishery_pools WHERE id = ?',
        [id]
    );
    return rows[0] ?? null;
};