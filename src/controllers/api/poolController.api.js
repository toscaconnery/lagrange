// import * as UserModel from '../../models/user.model.js';

import * as PoolModel from '../../models/pool.model.js'
import * as PoolUserModel from '../../models/poolUser.model.js'

export const getPools = async (req, res, next) => {
    try {
        const pools = await PoolModel.findAllPools()
        res.json({ success: true, data: pools })
    } catch (error) {
        next(error);
    }
}

export const getPoolUsers = async (req, res, next) => {
    try {
        const poolUsers = await PoolUserModel.findAllPoolUsers()
        res.json({ success: true, data: poolUsers})
    } catch (error) {
        next(error);
    }
}

export const addPoolUser = async (req, res, next) => {
    try {
        console.log('--- creating pool user')
        const { name } = req.body;
        console.log('--- name', name)

        if (!name) {
            return res.status(400).json({ success: false, message: 'Name required.' });
        }

        const id = await PoolUserModel.createPoolUser({ name });
        res.status(201).json({ success: true, data: { id, name } });

    } catch (error) {
        next(error)
    }
}

export const exportPoolUserCSV = async (req, res, next) => {
    try {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const filename = `User-${day}-${month}-${year}.csv`;

        const users = await PoolUserModel.findAllPoolUsers();

        const headers = ['id', 'name'];
        const lines = users.map(u => `${u.id},${u.name}`);
        const csv = [headers.join(','), ...lines].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csv);
    } catch (err) {
        next(err);
    }
};