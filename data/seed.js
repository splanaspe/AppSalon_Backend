import {db} from './../config/db.js'
import dotenv from 'dotenv'
import colors from 'colors'
import {services} from './../data/beautyServices.js'
import Services from '../models/Service.js'

dotenv.config()
await db()
colors.enable()

async function seedDB(){

    try{
        await Services.insertMany(services) // insertMany es una funcion de mongoose
        console.log(colors.blue.bold('Se agregaron los registros'))
        process.exit(0) //finalizar ejecucion, 0 es ok, 1 significa error
    } catch (error) {
        console.log('Error en introducir los registros'.red)
        process.exit(1) //finalizar ejecucion, 0 es ok, 1 significa error
    }
}

async function clearDB(){
    try{
        await Services.deleteMany() // insertMany es una funcion de mongoose
        console.log(colors.green.bold('Se eliminarion los registros'))
        process.exit(0) //finalizar ejecucion, 0 es ok, 1 significa error
    } catch (error) {
        console.log('Error en eliminar los registros'.red)
        process.exit(1) //finalizar ejecucion, 0 es ok, 1 significa error
    }
}

// Process.argv[2] code el tercer valor de lo que se escribe en la terminal, en el caso, --import
if(process.argv[2] == '--import'){
    seedDB()
} else{
    clearDB()
}