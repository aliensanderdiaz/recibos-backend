const { Schema, model } = require('mongoose')

const reciboSchema = new Schema({
    created: {
        type: Date
    },
    codigo: {
        type: String
    },
    img: {
        type: String
    }
})

reciboSchema.pre('save', function ( next ) {
    this.created = new Date()
    next()
})

module.exports = model('Recibo', reciboSchema)