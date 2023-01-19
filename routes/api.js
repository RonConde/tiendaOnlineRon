const router = require('express').Router();

const { checkToken } = require('../helpers/middlewares');


router.use('/products', checkToken, require('./api/products')); //* si se quiere interactuar con los productos tienen que pasar por checktoken
router.use('/users', require('./api/users')); // si quiere bloquear solo algunas rutas hay que ir al .js

module.exports = router;