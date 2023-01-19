const router = require('express').Router();
const { checkSchema } = require('express-validator');//* Check esquema me dejara validar la insercion en el post
const { checkErrors } = require('../../helpers/middlewares');
const { newProduct } = require('../../helpers/validators');
const multer = require('multer');
const upload = multer({ dest: 'public/images' })
const fs = require('fs');

const Product = require('../../models/product.model'); //importamos el modelo y la variable con mayuscula normalmente.


router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('owner'); //
    for (let product of products) { //recorro todos los productos
      console.log(product.price_tax);
    }
    res.json(products);

  } catch (error) {
    res.json({ fatal: error.message });
  }

});

router.get('/min/:minPrice/max/:maxPrice', async (req, res) => {
  const { minPrice, maxPrice } = req.params;

  try {
    const products = await Product.find({
      price: {
        $gte: minPrice,
        $lte: maxPrice
      }
    });
    res.json(products);

  } catch (error) {
    res.json({ fatal: error.message })
  }
});

router.get('/actives', async (req, res) => {

  try {

    const products = await Product.actives() //?hago llamada a metodo creado en model y me ahorro el tocho de abajo.

    // const products = await Product.find({

    //   stock: { $gt: 0 },
    //   available: true

    // });
    // const products = await Product.find({
    //   $or: [     // si se cumple alguna de las dos producto no disponible.
    //     { stock: 0 },
    //     { available: false }
    //   ]
    // });


    res.json(products)

  } catch (error) {
    res.json({ fatal: error.message });
  }


});


router.get('/:department', async (req, res) => {
  const { department } = req.params;

  try {
    const products = await Product.find({
      department
    });
    res.json(products);
  } catch (error) {
    res.json({ fatal: error.message });
  }
});









router.post('/',
  upload.single('image'),
  checkSchema(newProduct),
  checkErrors //la funcion que me checka los errores.
  , async (req, res) => {
    try {
      //*Agrefamos la extension a la imagen
      const extension = req.file.mimetype.split('/')[1] // partimos el string con split
      const newPath = `${req.file.path}.${extension}`;
      fs.renameSync(req.file.path, newPath);


      req.body.image = `${req.file.filename}.${extension}`
      req.body.owner = req.user._id; //al objeto body le estamos añadiendo owner

      const product = await Product.create(req.body);
      res.json(product)

    } catch (error) {
      res.json({ fatal: error.message });
    }

  });























router.put('/:productId', async (req, res) => {

  try {
    const { productId } = req.params; // una VEZ MAS para sacar ID DE PRODUCTO LO REQUIERO CON PARAMS

    const product = await Product.findByIdAndUpdate(productId, req.body, {
      new: true
    });
    res.json(product);

  } catch (error) {
    res.json({ fatal: error.message });
  }

});

router.delete('/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findByIdAndDelete(productId)

    res.json(product);
  } catch (error) {
    res.json({ fatal: error.message });
  }

});

module.exports = router;