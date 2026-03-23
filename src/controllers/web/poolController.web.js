import * as PoolModel from '../../models/pool.model.js'
import * as PoolUserModel from '../../models/poolUser.model.js'

export const poolHome = async (req, res, next) => {
    try {
        res.render('pools/pool-home', {
            title: 'Pools'
        })
    } catch (error) {
        next(error)
    }
}

export const listPool = async (req, res, next) => {
    try {
        const pools = await PoolModel.findAllPools()
        res.render('pools/list-pool', {
            title: 'List Pools',
            pools
        })
    } catch (error) {
        next(error)
    }
}

export const addPool = async (req, res, next) => {
    try {
        const users = await PoolUserModel.findAllPoolUsers()

        res.render('pools/add-pool', {
            title: 'Add Pool',
            users
        });
    } catch (error) {
        next(error)
    }
}

export const listPoolUser = async (req, res, next) => {
    try {
        const poolUsers = await PoolUserModel.findAllPoolUsers()
        res.render('pools/list-pool-user', {
            title: 'List Pool Users',
            users: poolUsers
        })
    } catch (error) {
        next(error)
    }
}

export const addPoolUser = async (req, res, next) => {
    try {
        res.render('pools/add-pool-user', {
            title: 'Add Pool User'
        })
    } catch (error) {
        next(error)
    }
}

export const managePool = async (req, res, next) => {
    try {
        const poolId = req.params.id

        const pool = await PoolModel.findPoolById(poolId)
        
        res.render('pools/manage-pool', {
            title: 'Manage Pool',
            poolId: poolId,
            pool
            // pool: {
            //     ...pool,
            //     status: pool.status
            //         ? pool.status.charAt(0).toUpperCase() + pool.status.slice(1).toLowerCase()
            //         : '-',
            //     fish_species
            // },
        })
    } catch (error) {
        next(error)
    }
}