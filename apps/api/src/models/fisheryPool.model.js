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

export const createPool = async ({ label, owner }) => {
    const status = 'inactive'
    // const notes = ''
    // const fish_species = null
    const manager = null
    // const fill_date = null
    const [result] = await pool.query(
        'INSERT INTO pools (label, status,manager, owner) VALUES (?, ?, ?, ?)',
        [label, status, manager, owner]
    );
    return result.insertId;
};