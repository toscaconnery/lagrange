// import * as UserModel from '../../models/user.model.js'
import * as PoolModel from '../../models/pool.model.js'
import * as PoolUserModel from '../../models/poolUser.model.js'

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
        res.render('pools/add-pool', {
            title: 'Add Pool',
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