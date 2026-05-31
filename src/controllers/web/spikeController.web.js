import * as SpikeLogsModel from '../../models/spikeLogs.model.js'

export const listLog = async (req, res, next) => {
    try {
        const logs = await SpikeLogsModel.findAllLogs()

        res.render('spikes/logs', {
            title: 'Spike Logs',
            logs
        })

    } catch (error) {
        next(error)
    }
}

