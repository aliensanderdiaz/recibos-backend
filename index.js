require('dotenv').config()
const express = require('express')
const app = express()

const port = process.env.PORT || 3000

app.get('/', function (req, res) {
  res.json({ message: 'Hello World'})
})

app.listen(port, () => {
    console.log('Encendido en el puerto: ' + port)
})