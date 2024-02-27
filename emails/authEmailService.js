import { createTransport} from '../config/nodemailer.js'


export async function sendEmailVerification({nombre, email, token}){

    console.log("Hola desde sendEmailVerification")

    const transporter = createTransport("sandbox.smtp.mailtrap.io",2525,"82362975437231", "6241192906325d")

    // transporter tiene todos los metodos para enviar el email
    const info = await transporter.sendMail({
        from: 'AppSalon',
        to: email,
        subject: "AppSalon - Confirma tu cuenta",
        text: "Confirma tu cuenta porfavor",
        html: `<p> Hola ${nombre}, confirma tu cuenta </p>
        <p> Confirmala en este enlace: </p>
        <a href="http://localhost:4000/api/auth/verify/${token}"> Confirmar cuenta </a>
        <p> Ignora este correo si no creaste esta cuenta</p>
        `
    })

    // info tiene info si se envio el email o no
    console.log(info, info.messageId)
}