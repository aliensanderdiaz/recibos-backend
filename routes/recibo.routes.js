const { Router } = require("express");
const Recibo = require('../models/recibo.model')

const recibosRoutes = Router()

recibosRoutes.get('/', async (req, res) => {
    const recibos = await Recibo.find().exec()

    res.json({
        ok: true,
        recibos
    })
})

recibosRoutes.post('/', (req, res) => {
    const { body } = req

    Recibo.create(body).then(reciboDB => {
        
        res.json({
            ok: true,
            recibo: reciboDB
        })
    }).catch( err => {
        res.json(err)
    })
})

module.exports = recibosRoutes