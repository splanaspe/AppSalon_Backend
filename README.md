# Proyecto MEVN (Backend)

Backend del proyecto AppSalon el cual será una web completa de citas y servicios de una peluquería. Tecnologías que usaremos es MEVN: MongoDb, Express, VueJs y Node. 

Documentaré en este archivo el proceso de formación del proyecto para dejarlo como guía y recuerdo

## Inicios

- Creamos una carepta inicial "App_Salon", dentro "backend" y "frontend" , proyectos separados
- Dentro de backend, iniciamos proyecto node: npm init
- Creamos index.js
- Escrivimos scripts e instalamos nodemon: npm i -D nodemon (equivale al npm node --watch)
- ESM nomenclatura, añadimos en package.json, "type" : "module"
- Instalamos Express (servidor) : npm i express
- Escrivimos la parte inicial del código como ejemplo y probamos que funciona

```javascript
import express from 'express' // ESM = Emma Script Modules

// 1 - Configurar la App - inicilizar servidor
const app = express() 

// Definimos una ruta de tipo GET
app.get('/', (req, rest) => {
    
    const producto = {
        nombre: 'Jilbab Verde',
        precio: '54',
        cantidad: '10'
    }

    // rest.send(producto)
    rest.json(producto)
})

// 3 - Definir puerto
const PORT = process.env.PORT || 4000
// Este codigo es para que asigne el hosting un puerto automaticamente o el 4000

// 4 - Arrancar la App
app.listen(PORT, () => {
    console.log('El servidor se está ejecutando en el puerto: ',PORT)
})
```

El resultado es que en localhost:4000 veremos los datos del producto en formato JSON

- Seguidamente, creamos la carpeta /routes/servicesRoutes.js, el cual contiene la misma ruta, pero definimos aparte los servicios para hacer un código modular

## Conectar MongoDB

- Creamos perfil MongoDB, obtenemos credenciales
- Instalamos Mongoose: npm i mongoose
- Creamos /config/db.js 

```javascript
import mongoose from 'mongoose'

export const db = async () => {
    try{
        const db = await mongoose.connect(process.env.MONGO_URI)
        console.log("Conectados a la bd de MongoDB")
        
    } catch (error) {
        console.log(error)
        process.exit(1) //Detenemos la ejecución si cae el servidor
    }
}
```
- Lógicamente importamos db.json en index.js y llamamos la funcion db() (código en el repositorio)
- Instalamos la dependencia dotenv: npm i env
- Creamos archivo .env (lo añadimos a .gitignore)
- Definimos url privada -> MONGO_URI
- Inicializamos en index.js y ya podemos usar las variables secretas
- Instalamos colors: npm i colors (frikada para que quede chulo y organizadas las respuestas del server)


### Creamos el primer modelo

Creamos carpeta /models/Service.js es el nombre del modelo Service

```javascript
import mongoose from 'mongoose'

const serviceSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    precio: {
        type: Number,
        required: true,
        trim: true,
    }
})

const Services = mongoose.model('Services', serviceSchema)
export default Services
```
Con esto, tenemos disponible este schema para usarlo en todo el backend
- Instalamos postman para simular las request antes de realizarlas, sea de get, put, patch, delete, etc. Crear una collection para el proyecto y almacenas los distintos urls con el metodo adecuado
- Alternativa en VSC: Thunderclient (VSC Extension) - funciona muy bien


##  Modelo, Schema y Controlador

Hemos creado carpeta /controllers/servicesController.js
- Este archivo es la que conecta con la db y devuelve al servicio servicesRoutes.js los datos que él debe devolver en formato json y responder a la request

```javascript
// Codigo del controlador
import { services } from './../data/beautyServices.js' // Simula los datos que aun no estan en la db

const getServices = (req,rest) => {
    rest.json(services)
}

export {
    getServices
}

// codigo del servicio servicesRoutes.js

import express from 'express'
import { getServices } from '../controllers/servicesControllers.js'

const router = express.Router()

router.get('/', getServices)

export default router
```

- Extendemos todos los otros metodos del servicio: obtenerServicios, obtenerServicioById, updateServicio, deleteServicio
- Estamos ya interactuando con la bd simulando peticiones y es muy bonito, muy contento, el codigo del servicio es este:
- [Enlace al archivo](./controllers/servicesControllers.js) Lo indico así para no hacer este archivo demasiado extenso, el documento este es el controller que comunica entre el servicio y la bd
- Creamos /data/seeds.js con dos funciones seedDB() y clearDB() | La primera inserta todos los registros a la bd, datos los coge del archivo en data | La segunda elimina todos los registros de la bd
- Creamos dos scripts para esto, ejecuta cada una de las funciones
    - "npm run seed-import" : "node data/seed.js --import"
    - "npm run seed-export" : "node data/seed.js --export" 
- Reescrivimos el metodo para obtener todos los servicios: services = await Services.find()

