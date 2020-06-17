const jwt = require('jsonwebtoken');
const User = require('../models/user');
const expressJwt = require('express-jwt');

require('dotenv').config();

exports.signup = async (req,res) => {
    const userExists = await User.findOne({ email: req.body.email })
    if (userExists) {
        return res.status(403).json({
            error: "L'email est déjà utilisé"
        });
    }
    const user = await new User(req.body)
    await user.save()
    res.status(200).json({ message: "Inscription réussie! Veuillez vous connecter." });
};

exports.signin = (req, res) => {
    //On cherche l'user dans la base avec l'email
    const { email, password } = req.body
    User.findOne({email}, (err, user) => {

    //Si une erreure ou que l'user n'existe pas
    if (err || !user){
        return res.status(400).json({
            error: "L'email n'existe pas"
        })
    }
        //Si l'user existe, on verifie que l'email et le mdp correspondent
        if (!user.authenticate(password)) {
            return res.status(400).json({
            error: "L'email et le mot de passe ne correspondent pas"
            })
        }     
    // Génére un token avec l'id et le 'secret'
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
    
    // on enregistre le token 't' dans les cookies  avec une date d'expiration 
    res.cookie("t", token, {expire: new Date() + 86400})
    
    // On retourne une réponse avec l'utilisateur et son token au frontend client
    const {_id, name, email} = user
    return res.json({token, user: {_id, email, name}});
    });  
};

exports.signout = (req, res) => {
    res.clearCookie("t");
    return res.json({message: "Déconnexion réussie !"})
};

exports.requireSignin = expressJwt({
    // Si le token est valide, express jwt  ajoute l'id de l'user
    // dans une clé d'authenfication à la requếte d'objet
    secret: process.env.JWT_SECRET,
    userProperty: "auth"   
});