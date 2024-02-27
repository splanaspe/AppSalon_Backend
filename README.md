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

<<<<<<< HEAD
=======
## Instalamos CORS
Muy importante este paso para poder hacer peticiones desde el dominio (diferente) del frontend, esta es la configuración default

```javascript
import cors from 'cors'

//Configuramos cors
const whiteList = [process.env.FRONTEND_URL, undefined]

const corsOptions = {
    origin: function(origin, callback){
        // origin es el dominio que está haciendo el request
        if(whiteList.includes(origin) || !origin ){
            //Permitimos conexion
            callback(null, true)
        } else{
            // NO permitimos la conexion

        }
    }
}
app.use(cors(corsOptions))
```
- ```undefined ``` Añadimos esto en la validación para que deje hacer peticiones desde Thunderclient o postman
- origin en la funcion es el dominio desde el cual se hace la peticion
- whiteList es la lista de todos los dominios permitidos y comprobamos que el dominio desde el que hacemos la petición "incluya" el deseado para dar permiso

## Sistema de autenticación de usuarios
Detallaré aquí para mi propio uso las partes fundamentales para el sistema de logueado

### Conceptos de seguridad y base
- Los usuarios deben tener algo único que les identifique: nº targeta, dni, id, email, etc.
- La cuenta nueva debe ser siempre confirmada por el usuario, debemos crear el mecanismo para que el usuario confirme su nueva cuenta y evitar así el spam y reforzar la seguridad
- Autenticación: 
  - Email + Password
  - Dispositivo: Token, Mensaje movil, 2FAS Auth
  - Enlace mágico: usuario introduce email de login, le enviamos email con un enlace para darle acceso a la app durante unos minutos
  - Huella / Cara  
- Los passwords deben estar siempre hasheados (no se puede recuperar ni revertir la contraseña) por temas de seguridad y crear el algoritmo para que pueda recuperar la contraseña, escribiendo una nueva

### 1 - Creamos el modelo User.js
```javascript
import mongoose from 'mongoose'
import { uniqueId } from '../utils'

const userSchema = mongoose.Schema({
    nombre: {
        type: String,
        required:true,
        trim: true
    },
    password: {
        type: String,
        required:true,
        trim: true
    },
    email: {
        type: String,
        required:true,
        trim: true,
        unique:true
    },
    token: {
        type: String,
        default: () => uniqueId()
    },
    verified: {
        type: Boolean,
        default: false
    },
    admin:{
        type: Boolean,
        default: false
    }
})

const User = mongoose.model('User',userSchema)

export default User
```
- Definimos que el email sea único
- Creamos la función uniqueId() para crear un Id único para cada usuario
```javascript
const uniqueId = () => Date.now().toString(32) + Math.random().toString(32).substring(2)
```

- Definimos un campo para ver si está verificado o no y otro para permitir el admin

### 2 - Librerías para hashear contraseñas
- bcrypt, crypto-js... cogemos la más reciente
```javascript
npm i bcrypt
```
En el modelo User.js, escribimos este código para que hashe la contraseña antes de crear el nuevo registro de usuario

```javascript
userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password =  await bcrypt.hash(this.password, salt)
})
```
- Con "pre" indicamos que se debe ejecutar esta funcion antes de almacenar el registro
- La comprobación del if es para ver si ya ha sido hasheada la contraseña, no hacerlo dos veces
- salt es de la propia librería de bcrypt y crea un valor que se usa en el hasheo
- no hay forma de recuperar la contraseña inicial, pero sí que bcrypt ofrece la funcion .compare() para el login

### 3 - MAILTRAP y NODEMAILER
- Usamos Mailtrap para usar correos de prueba, es gratis ![ENLACe](https://mailtrap.io/)
- Nodemailer para integrar este servicio de email al proyecto node
- ![Web Oficial](https://nodemailer.com/)
- Creamos un archivo de configuracion con los datos que nodemailer nos ofrece y esta funcion la llamamos cada vez que queramos enviar un email, creamos un servicio para ello
```javascript
import nodemailer from 'nodemailer'

export function createTransport(host, port, user, pass) {
    const transporter = nodemailer.createTransport({
        host,
        port,
        auth: {
            user,
            pass
        }
    });

    return transporter
}  
```
>>>>>>> 409cc03 (Trabajando en ,la autentificacion)
