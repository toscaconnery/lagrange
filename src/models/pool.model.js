import pool from '../config/db.js';

export const findPoolById = async (id) => {
    const [rows] = await pool.query(
        'SELECT id, label, status, fish_species, fish_count, notes, manager, owner, fill_date FROM pools WHERE id = ?',
        [id]
    );
    return rows[0] ?? null;
}

export const findAllPools = async () => {
    const [rows] = await pool.query('SELECT id, label, status, fish_species, fish_count, notes, manager, owner, fill_date FROM pools')
    return rows;
}

export const createPool = async ({ label, fish_species, owner }) => {
    const status = 'inactive'
    const notes = ''
    const manager = 1
    const fill_date = null
    const [result] = await pool.query(
        'INSERT INTO pools (label, status, fish_species, notes, manager, owner, fill_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [label, status, fish_species, notes, manager, owner, fill_date]
    );
    return result.insertId;
};