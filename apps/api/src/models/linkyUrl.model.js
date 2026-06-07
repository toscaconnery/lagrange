import pool from '../config/db.js';

export const storeShortenedLink = async ({originalLink, shortCode, title}) => {
    const [result] = await pool.query(
        'INSERT INTO linky_urls (original_url, short_code, title) VALUES (?, ?, ?)',
        [originalLink, shortCode, title]
    )
    
    return result;
}

export const findByShortCode = async (shortCode) => {
    const [rows] = await pool.query(`
        SELECT *
        FROM linky_urls l
        WHERE l.short_code = ?`,
        [shortCode]
    )
    return rows[0] ?? null;
}

export const findAll = async () => {
    const [rows] = await pool.query(`
        SELECT *
        FROM linky_urls l
    `
    )
    return rows ?? null;
}