const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String, //validacion a nivel de Schema!!
        required: [true, 'el campo username es obligatorio'] // se pueden incluir mensajes de aviso
    },
    email: String,
    password: String,
    address: String,
    age: {          //validacion
        type: Number,
        min: 0,
        max: 100
    },
    role: { // validacion
        type: String,
        enum: ['regular', 'admin', 'moderador']
    },
    products: [{ type: Schema.Types.ObjectId, ref: 'product' }] // products es un unico objeto que hace referencia a product y añadiendo corchetes [] ya me deja añadir todos los productos que quiera.Lo trato como array
});

module.exports = model('user', userSchema);