const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/user.model'); //me traigo modelo user

const checkToken = async (req, res, next) => {
    //*Comprobar si el token viene incluido en las cabeceras
    if (!req.headers['authorization']) { // si no tienes autorizacion ERROR
        return res.json({ fatal: 'Debes incluir el token' })
    }

    const token = req.headers['authorization']; // cracion de variable para mas comodidad de uso posterior.

    //* Compropar si el token es correcto
    let payload // se crea una variable de payload para que se pueda uasr en los siguientes pasos.
    try {
        payload = jwt.verify(token, process.env.SECRET_KEY) // de jwt llamamos el metodo verify que me comprueba si la fecha esta en curso y si esta firmado(lleva la secret key)
    } catch (error) {
        return res.json({ fatal: 'El token es incorrecto' });
    }

    //* Recuperar el usuario
    req.user = await User.findById(payload.user_id); //


    //* dar paso al siguiente manejador
    next(); //si todo se cumple, das paso al sigiente manejador. si estas logado, etc...
}

const checkErrors = (req, res, next) => {
    //* DENTRO DEL MANEJADOR Comprobamos errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {// nos comprueba si este objeto esta vacio o si no esta!

        const mensajes = errors.array().map(error => error.msg);
        return res.json(mensajes);


        // return res.json(errors.array()); //* mapped o array me devuelve la estructura con los errores posibles y no deja que siga adelante

    } else {
        next();
    }
}

module.exports = {
    checkToken, checkErrors
}