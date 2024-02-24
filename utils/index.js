import mongoose from 'mongoose'

function validateObjectId(id, res){
    if(!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("El id del Servicio no es válido")
        return res.status(400).json({
            msg: error.message
        })
    }
}

function notFoundError(message,res){
    const error = new Error(message)
    return res.status(404).json({
        msg: error.message
    })
}

export {
    validateObjectId,
    notFoundError
}