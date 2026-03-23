import * as UserModel from '../../models/user.model.js'

export const listUser = async (req, res, next) => {
    try {
        const users = await UserModel.findAllUsers()
        res.render('users/list-user', {
            title: 'List User',
            users
        })
    } catch (error) {
        next(error)
    }
}