const mongoose = require('mongoose');

const Product = require('./models/product.model');
const User = require('./models/user.model');

(async () => {

	mongoose.set('strictQuery', false)
	await mongoose.connect('mongodb://127.0.0.1:27017/tienda_online'); // hay que hacer una conexion especifica solo para este script por ser de prueba. // ponemos un await por que devuelve una promesa

	// const response = await Product.create({

	//   name: 'pantalones marrones',
	//   description: 'son para tren inferior',
	//   price: 64,
	//   department: 'deporte',
	//   available: true,
	//   stock: 30,
	//   image: 'https://www.bolf.es/spa_pl_Pantalon-chino-para-hombre-color-marron-Bolf-1146-86886_9.jpg'

	// });

	// const products = await Product.find({
	// 	price: { $gt: 50 }, //*$gt es un operador. sigmifica mayor que... $gte (menor que),$lt, $lte
	// 	available: true
	// });// find me permite recuperar documentos en base de datos y los filtros.


	// const products = await Product.findOne({
	// 	stock: { $lte: 30 } // menor o igual que lte
	// })

	// console.log(products);

	const user = await User.create({
		username: 'mario',
		email: 'mario@gmail.com',
		password: 12345,
		address: 'calle G vía 23',
		age: 35,
		role: 'admin'



	})

	console.log(user)

	await mongoose.disconnect();

})();

