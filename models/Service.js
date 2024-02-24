import mongoose from 'mongoose'


// Cada objeto que guardemos, requirse su esquema.Con este definimos la estructura de los datos que almacenaremos, obtendremos, etc.
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

// En la web hay todos los tipo, schematypes, hay ObjectId, automaticamente crea el id