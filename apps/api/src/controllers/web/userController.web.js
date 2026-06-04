import * as UserModel from '../../models/user.model.js'
import { formatDate } from '../../utils/formatter.js'

export const listUser = async (req, res, next) => {
    try {
        const users = await UserModel.findAllUsers()
        let usersFormatted = users.map((m) => {
            
            return {
                ...m,
                created: formatDate(m.created_at)
            }
        })
        res.render('users/list-user', {
            title: 'List User',
            users: usersFormatted
        })
    } catch (error) {
        next(error)
    }
}

