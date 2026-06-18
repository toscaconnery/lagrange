import pool from '../config/db.js';

export const findPlantationById = async (id) => {
    const [rows] = await pool.query(
        'SELECT id, name, area_ha, created_at FROM plantations WHERE id = ?',
        [id]
    );
    return rows[0] ?? null;
};

export const findAllPlantations = async () => {
    const [rows] = await pool.query(
        'SELECT id, name, area_ha, created_at FROM plantations ORDER BY created_at DESC'
    );
    return rows;
};

export const createPlantation = async ({ name, area_ha }) => {
    const [result] = await pool.query(
        'INSERT INTO plantations (name, area_ha) VALUES (?, ?)',
        [name, area_ha]
    );
    return result.insertId;
};