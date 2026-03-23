import pool from '../config/db.js';

export const findAllUsers = async () => {
    const [rows] = await pool.query('SELECT id, name FROM users');
    return rows;
};

export const findUserById = async (id) => {
    const [rows] = await pool.query(
        'SELECT id, name, email FROM users WHERE id = ?', [id]
    );
    return rows[0] ?? null;
};

export const create = async ({ name, email, password }) => {
    const [result] = await pool.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, password]
    );
    return { id: result.insertId, name, email };
};

export const findByEmail = async (email) => {
    const [rows] = await pool.query(
        'SELECT id, name, email, password FROM users WHERE email = ?', [email]
    );

    return rows[0] ?? null;
}