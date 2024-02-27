import { sendEmailVerification } from '../emails/authEmailService.js'
import User from '../models/User.js'


const register = async (req,res) => {
    
    // Validar todos los campos
    if(Object.values(req.body).includes('')){
        const error = new Error('Todos los campos son obligatorios')
        return res.status(400).json({ msg: error.message })
    }

    const {email, password, nombre} = req.body // -> Aplicamos destruction

    // Evitar registros duplicados
    const userExists = await User.findOne({email})
    if(userExists){
        const error = new Error('Usuario ya registrado')
        return res.status(400).json({ msg: error.message })
    }

    // Validar la extensión del password - min 8
    const MIN_PASSWORD_LENGTH = 8
    if(password.trim().length < MIN_PASSWORD_LENGTH) {
        const error = new Error(`El password debe contener ${MIN_PASSWORD_LENGTH} carácteres`)
        return res.status(400).json({ msg: error.message })
    }

    try{
        const user = new User(req.body)
        const result = await user.save()
        
        const { nombre, email, token} = result
        sendEmailVerification({ nombre, email, token})

        res.json({
            msg: "El usuario se creó correctamente, revisa tu email"
        })
    } catch (error){
        console.log(error)
    }
}


const verifyAccount = async (req,res) => {
    const {token} = req.params.token

    const user = await User.findOne({token})
    if(user){
        // Cambiar el atributo de verified a true
        
    } else{
        // No encontrado, devolver respuesta
        const err = new Error("Token no encontrado/válido. no verificamos usuario")
        return res.status(401).json({
            msg: err
        })
    }
}

export{
    register,
    verifyAccount
}