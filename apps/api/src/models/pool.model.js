import pool from '../config/db.js';

export const findPoolById = async (id) => {
    const [rows] = await pool.query(`
        SELECT p.id, p.label, p.status, p.manager, p.owner,
        pu.name AS owner_name, pm.name AS manager_name,
        pc.fish_count,
        pft.name AS fish_type_name
        FROM pools p
        LEFT JOIN pool_users pu ON p.owner = pu.id
        LEFT JOIN pool_users pm ON p.manager = pm.id
        LEFT JOIN pool_cycles pc ON p.last_cycle_id = pc.id
        LEFT JOIN pool_fish_types pft ON pc.fish_type = pft.id
        WHERE p.id = ?`,
        [id]
    );
    return rows[0] ?? null;
}

export const listPools = async () => {
    const [rows] = await pool.query(`
        SELECT
            p.id, p.label, p.status,
            po.name AS owner_name, 
            pm.name AS manager_name,
            pc.fish_type, pc.fish_count, pc.start_date AS fill_date,
            pft.name AS fish_type_name
        FROM pools p
        LEFT JOIN pool_users po ON p.owner = po.id
        LEFT JOIN pool_users pm ON p.manager = pm.id
        LEFT JOIN pool_cycles pc ON p.last_cycle_id = pc.id
        LEFT JOIN pool_fish_types pft ON pc.fish_type = pft.id
        WHERE p.deleted_at IS NULL;
    `)
    return rows
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

export const deletePool = async ({ poolId }) => {
    const [result] = await pool.query(
        'UPDATE pools SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?',
        [poolId]
    )
    return result;
}

export const managePool = async ({ poolId, manager }) => {
    const [result] = await pool.query(
        'UPDATE pools SET manager = ? WHERE id = ? AND deleted_at IS NULL',
        [manager, poolId]
    );
    return result;
};

export const updatePoolStatus = async ({pool_id, status, cycle_id}) =>  {
    const [result] = await pool.query(
        'UPDATE pools SET status = ?, last_cycle_id = ? where id = ?',
        [status, cycle_id, pool_id]
    );
    return result
}