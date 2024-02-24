
import Services from './../models/Service.js'
import {validateObjectId , notFoundError } from './../utils/index.js'

const createService = async(req,res) => {
    if(Object.values(req.body).includes('')) {
        const error = new Error("Todos los campos son obligatorios")
        return res.status(400).json({
            msg: error.message
        })
        // Finalizamos la funcion aqui
        //status 400 es para que detecte que es un error, que no ha sido posible el request
    }

    try{
        // Metemos los datos en la bd
        const service = new Services(req.body)
        await service.save() // guardamos asi en la bd
        console.log('El servicio se registró correctamente')
        res.json({
            msg: 'El Servicio se registró correctamente en la bd'
        })
        

    } catch (error) {
        console.log(error)
    }
}


const getServices = async (req,res) => {
    try{
        const services = await Services.find()
        res.json(services)
    } catch(error){
        console.log(error)
    }
}

const getServiceById =  async (req,res) => {
    // en req.params.id hay el id que han pasado a traves del url
    const {id} = req.params
    // Validar un ObjectId
    if (validateObjectId(id, res) ) return

    // Validar que exista
    const service = await Services.findById(id)
    if(!service){
        return notFoundError('No encontrado el Servicio de la id proporcionada',res)
    }

    // Mostrar el servicio
    res.json(service)
}

const updateService = async (req,res) => {
    const {id} = req.params

    // Validar un ObjectId
    if (validateObjectId(id, res) ) return

    // Validar que exista
    const service = await Services.findById(id)
    if(!service){
        return notFoundError('No encontrado el Servicio de la id proporcionada',res)
    }

    // reescribimos el objeto para reguardarlo
    service.nombre = req.body.nombre || service.nombre 
    service.precio = req.body.precio || service.precio 

    try{
        await service.save()
        console.log('El Servicio se ha actualizado correctamente')
        res.json({
            msg: 'El servicio se actualizó correctamente'
        })
    } catch (error) {
        console.log(error)
    }
}

const deleteService = async (req,res) => {
    const {id} = req.params

    // Validar un ObjectId
    if (validateObjectId(id, res) ) return

    // Validar que exista
    const service = await Services.findById(id)
    if(!service){
        return notFoundError('No encontrado el Servicio de la id proporcionada',res)
    }

    try{
        await service.deleteOne()
        res.json({
            msg: 'Servicio eliminado correctamente'
        })
    } catch (error) {
        console.log(error)
    }

}

export {
    getServices,
    createService,
    getServiceById,
    updateService,
    deleteService
}