import pool from '../config/db.js';

export const findExpensesByActivityId = async (activityId) => {
    const [rows] = await pool.query(
        `SELECT id, activity_id, description, amount, expense_date, created_at
         FROM plantation_activity_expenses
         WHERE activity_id = ?
         ORDER BY expense_date ASC`,
        [activityId]
    );
    return rows;
};

export const findExpensesByActivityIds = async (activityIds) => {
    if (activityIds.length === 0) return [];
    const placeholders = activityIds.map(() => '?').join(',');
    const [rows] = await pool.query(
        `SELECT id, activity_id, description, amount, expense_date, created_at
         FROM plantation_activity_expenses
         WHERE activity_id IN (${placeholders})
         ORDER BY expense_date ASC`,
        activityIds
    );
    return rows;
};

export const createExpense = async ({ activity_id, description, amount, expense_date }) => {
    const [result] = await pool.query(
        `INSERT INTO plantation_activity_expenses (activity_id, description, amount, expense_date)
         VALUES (?, ?, ?, ?)`,
        [activity_id, description, amount, expense_date]
    );
    return result.insertId;
};

export const updateExpense = async ({ id, description, amount, expense_date }) => {
    const [result] = await pool.query(
        `UPDATE plantation_activity_expenses
         SET description = ?, amount = ?, expense_date = ?
         WHERE id = ?`,
        [description, amount, expense_date, id]
    );
    return result.affectedRows;
};

export const deleteExpense = async (id) => {
    const [result] = await pool.query(
        `DELETE FROM plantation_activity_expenses WHERE id = ?`,
        [id]
    );
    return result.affectedRows;
};