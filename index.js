// Archivo principal del backend
// con el comando "node index.js" ejecutamos el codigo 

import express from 'express' // ESM = Emma Script Modules
import {db} from './config/db.js'
import dotenv from 'dotenv'
import colors from 'colors'
import servicesRoutes from './routes/servicesRoutes.js'


// PASOS

// activamos variables de entorno
dotenv.config()

// Configurar la App - inicilizar servidor
const app = express() 

// Habilitamos que el servidor pueda leer datos via body
app.use(express.json())

// Inicializamos la conexion a la BD
db()

// 2 - Definir una ruta (ENDPOINT)
app.use('/api/services', servicesRoutes) 
// Redirige al servicio routes/servicesRoutes.js y se encarga este de todos los metodos definidos par esta ruta

// 3 - Definir puerto
const PORT = process.env.PORT || 4000
// Este codigo es para que asigne el hosting un puerto automaticamente o el 4000


// 4 - Arrancar la App
app.listen(PORT, () => {
    console.log( colors.bgGreen.cyan('El servidor se está ejecutando en el puerto: ',PORT))
})


