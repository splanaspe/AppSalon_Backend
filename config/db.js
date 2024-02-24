import mongoose from 'mongoose'
import colors from 'colors'

export const db = async () => {
    try{
        const db = await mongoose.connect(process.env.MONGO_URI)
        const url = `${db.connection.host} : ${db.connection.port}`
        console.log(colors.yellow.bold('Conectados a la bd de MongoDB', url))
    } catch (error) {
        console.log(error)
        process.exit(1) //Detenemos la ejecución si cae el servidor
    }
}