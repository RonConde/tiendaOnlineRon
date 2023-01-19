const { model, Schema } = require('mongoose');


const productSchema = new Schema({ //me creo una istancia/nuevo esquema
  name: String,
  description: String,
  price: Number,
  available: Boolean,
  stock: Number,
  department: String,
  image: String,
  owner: { type: Schema.Types.ObjectId, ref: 'user' }  //aqui no pongo array por que quiero que el creador sea unico.

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }

});

//prod.price_tax
productSchema.virtual('price_tax').get(function () {//!ojo no se hace arrowFunction, se pone la normal
  return (this.price * 1.21);
}) //se llama al metodo virtual que recibe como parametro el nombre de la propiedad virtual con la que vamos a trabajar

//prod.price_tax =1856
productSchema.virtual('price_tax').set(function (newValue) {
  this.price = newValue / 1.21;

});

//Generacion metodo estatico
productSchema.statics.actives = function () { //cuando ejecute el metodo actives retornamos
  return model('product').find({//va a la base a capon a buscar 
    stock: { $gt: 0 },
    available: true
  })
}




module.exports = model('product', productSchema);//relacionamos el nombre que le hemos puesto a la colección con el schema.