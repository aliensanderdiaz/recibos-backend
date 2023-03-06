const express = require('express');

let app = express();

let servicioDosControllers = require('../controllers/servicioDos.controllers');

app.get('/servicios-v2', servicioDosControllers.obtenerServicios);
app.get('/garantias', servicioDosControllers.obtenerGarantias);
app.get('/ultimos-servicios-v2', servicioDosControllers.obtenerUltimosServicios);
app.get('/servicios-v2/:codigo', servicioDosControllers.obtenerServicio);
app.get('/servicios-v2-por-codigo-web/:codigoWeb', servicioDosControllers.obtenerServicioPorCodigoWeb);
app.get('/servicios-v2-por-numero-id/:numeroId', servicioDosControllers.obtenerServicioPorNumeroId);
app.post('/servicios-v2', servicioDosControllers.crearServicio);
app.post('/servicios-v2/:id', servicioDosControllers.editarServicio);
app.post('/servicios-v2/agregar-item-historial/:id', servicioDosControllers.agregarItemHistorial);
app.post('/servicios-v2/agregar-observacion/:codigo', servicioDosControllers.agregarObservacion);

app.post('/servicios-v2/editar/subir-imagen', servicioDosControllers.subirImagen)
app.post('/servicios-v2/editar/subir-audio', servicioDosControllers.subirAudio)

module.exports = app;
