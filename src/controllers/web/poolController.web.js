import * as PoolModel from '../../models/pool.model.js'
import * as PoolUserModel from '../../models/poolUser.model.js'
import * as PoolFishTypeModel from '../../models/poolFishType.model.js'
import { formatDate } from '../../utils/formatter.js'

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
            layout: 'main-wide',
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
        const formattedPoolUsers = poolUsers.map((p) => {
            return {
                ...p,
                created: formatDate(p.created_at)
            }
        })
        res.render('pools/list-pool-user', {
            title: 'List Pool Users',
            users: formattedPoolUsers
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

export const poolDetails = async (req, res, next) => {
    try {
        const poolId = req.params.id

        const pool = await PoolModel.findPoolById(poolId)
        
        res.render('pools/pool-details', {
            title: 'Pool Details',
            poolId: poolId,
            pool
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
        })
    } catch (error) {
        next(error)
    }
}

export const listPoolFishType = async (req, res, next) => {
    try {
        // const poolUsers = await PoolUserModel.findAllPoolUsers()
        const fishTypes = await PoolFishTypeModel.findAllFishTypes()
        res.render('pools/list-fish-type', {
            title: 'List Fish Type',
            fishTypes
        })
    } catch (error) {
        next(error)
    }
}

export const addFishType = async (req, res, next) => {
    try {
        res.render('pools/add-fish-type', {
            title: 'Add Fish Type'
        })
    } catch (error) {
        next(error)
    }
}
