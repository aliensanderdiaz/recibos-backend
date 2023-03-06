var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var servicioDosSchema = new Schema({
    foto: Boolean,
    audio: Boolean,
    estadoDelProducto: String,
    nombreDelCliente: String,
    telefonoDelCliente: String,
    direccionDelCliente: String,
    identificacionDelCliente: String,
    fechaDeIngreso: String,
    horaDeIngreso: String,
    fechaEstimadaDeEntrega: String,
    horaEstimadaDeEntrega: String,
    fechaDeCompra: String,
    numeroDeServicio: Number,
    cliente: { type: Schema.ObjectId, ref: 'Usuario' },
    // telefono: String,
    codigoWeb: String,
    codigo: String,
    producto: String,
    descripcion: String,
    analisisTecnico: String,
    falla: String,
    referencia: String,
    lugarDeCompra: String,
    numeroDeFactura: String,
    tipoDeServicio: String,
    
    // fechaDeCompra: Date,
    repuestos: [{
      _id: false,
      nombre: { type: String },
      precio: { type: Number },
    }],
    observaciones: [{
      _id: false,
      descripcion: { type: String },
      fecha: { type: String },
    }],
    total: Number,
    abono: Number,
    saldo: Number,
    estado: {
      type: String,
      enum: [
        'Recibido',
        'Revisado',
        'Aprobado',
        'Reparado',
        'Abandonado',
        'Entregado'
      ]
    },
    historial: [
      {
        _id: false,
        estado: String,
        fecha: String,
        hora: String
      }
    ],
    entrega: Date,
    fechaDeEntrega: Date,
    fechaDeRecibido: Date,
},
{ timestamps: true });


module.exports = mongoose.model('ServicioDos', servicioDosSchema);
