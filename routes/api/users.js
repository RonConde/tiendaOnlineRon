const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const { checkToken, checkErrors } = require('../../helpers/middlewares');
const { createToken } = require('../../helpers/utils');
const User = require('../../models/user.model'); // Es mejor traernos la variable del modelo

router.get('/', checkToken, async (req, res) => {
    try {
        const users = await User.find().populate('products'); //asosciar-desplegar-recuperar su informacin total.
        res.json(users);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});

router.get('/cart', checkToken, async (req, res) => {

    const user = await req.user.populate('products');
    res.send(user.products);
});



router.get('/cart/add/:productId', checkToken, async (req, res) => {
    const { productId } = req.params //rescato el productoid----ya tenemos el usuario logado en req.user

    req.user.products.push(productId); //lo agrego (modifico el array)

    await req.user.save(); // (guardo )metodo save aplicado sobre objeto extraido me guarda las modificaciones. y lo GUARDO
    res.json({ succes: 'Producto isertado' })
});


router.get('/cart/remove/:productId', checkToken, async (req, res) => {


    const { productId } = req.params; //extraido ID

    req.user.products.pull(productId);

    await req.user.save(); //repetimos, si no se hace el save no se queda guarado el pull anterior.

    res.json({ success: 'producto eliminado' });
});


router.post('/',
    body('username') //!Validaciones
        .exists().withMessage('El username es requerido')
        .isLength({ min: 3 }).withMessage('El campo de username debe tener más de 3'),
    body('email')
        .isEmail().withMessage('El email debe ser correcto'),
    body('password')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,8}$/).withMessage('la password es incorrecta'),
    body('role')
        .isIn(['regular', 'admin', 'moderator']).withMessage('El rol no está admitido'),
    body('age')
        .custom((value) => {
            return value >= 18 && value <= 65
        }).withMessage('la edad debe estar entre 18 y 65 años'),
    checkErrors
    , async (req, res) => {


        try {
            req.body.password = bcrypt.hashSync(req.body.password, 9);

            const user = await User.create(req.body);
            res.json(user);
        } catch (error) {
            console.log(error)
            res.json({ fatal: error.message });
        }

    });

router.post('/login', async (req, res) => {
    try {
        //¿existe el email en la BD?
        const user = await User.findOne({ email: req.body.email });
        if (!user) {  //negativo
            return res.json({ fatal: 'Error en usuario y/o contraseña' })
        }

        //¿Coinciden las password?
        const equals = bcrypt.compareSync(req.body.password, user.password);
        console.log(req.body.password)
        console.log(user.password)
        if (!equals) { //SI NO COINCIDEN
            return res.json({ fatal: 'Error en usuario y/o contraseña' })

        }
        res.json({
            succes: 'login Correcto',
            token: createToken(user)
        });

    } catch (error) {
        res.json({ fatal: error.message });
    }


});


router.put('/:userId', checkToken, async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
        res.json(user);
    } catch (error) {
        res.json({ fatal: error.message });
    }
});


router.delete('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findByIdAndDelete(userId);
        res.json(user);
    } catch (error) {
        res.json({ fatal: error.message });
    }

});



module.exports = router;