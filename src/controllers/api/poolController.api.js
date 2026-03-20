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

export const addPool = async (req, res, next) => {
    try {
        const { 
            label,
            fish_species,
            owner
        } = req.body
        console.log('--- add pool params :', label, fish_species, owner)

        if (!label) {
            return res.status(400).json({ success: false, message: 'Label required.' });
        }

        if (!fish_species) {
            return res.status(400).json({ success: false, message: 'Fish species required.' });
        }

        if (!owner) {
            return res.status(400).json({ success: false, message: 'Owner required.' });
        }

        const id = await PoolModel.createPool({ label, fish_species, owner})

        res.json({ success: true, data: {}})
    } catch (error) {
        next(error);
    }
}

export const addPoolUser = async (req, res, next) => {
    try {
        const { name } = req.body;

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
        const dateFileName = generateFormattedDateForFileName()
        const filename = `User-${dateFileName}.csv`;

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

export const exportPoolCSV = async (req, res, next) => {
    try {
        const dateFileName = generateFormattedDateForFileName()
        const filename = `Pool-${dateFileName}.csv`;

        const pools = await PoolModel.findAllPools();

        const headers = ['id', 'label', 'status', 'fish_species'];
        const lines = pools.map(p => `${p.id},${p.label},${p.status},${p.fish_species}`);
        const csv = [headers.join(','), ...lines].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(csv);
    } catch (err) {
        next(err);
    }
};

const generateFormattedDateForFileName = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`
}