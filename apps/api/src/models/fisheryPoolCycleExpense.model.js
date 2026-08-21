import pool from '../config/db.js';

export const listFisheryPoolCycleExpensesById = async (poolCycleId) => {
    const [rows] = await pool.query(
        'SELECT * FROM fishery_expenses WHERE pool_cycle_id = ? AND deleted_at IS NULL',
        [poolCycleId]
    );
    return rows;
}

export const createFisheryPoolCycleExpense = async ({ pool_cycle_id, category, feed_id, description, expense_date, volume, unit, unit_price, amount }) => {
    const [result] = await pool.query(
        `INSERT INTO fishery_expenses 
        (pool_cycle_id, category, feed_id, description, expense_date, volume, unit, unit_price, amount) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [pool_cycle_id, category, feed_id, description, expense_date, volume, unit, unit_price, amount]
    );

    return result.insertId;
}