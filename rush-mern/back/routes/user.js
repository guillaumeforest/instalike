const express = require('express');
const { userById, allUsers, getUser, updateUser, deleteUser, addFollowing, addFollower, removeFollowing, removeFollower } = require('../controllers/user');
const { requireSignin } = require('../controllers/auth');


const router = express.Router();


router.get("/users", allUsers);
router.get("/user/:userId", requireSignin, getUser);      //on accede à un user via son id en particulier seulement si login
router.put("/user/:userId", requireSignin, updateUser); 
router.delete("/user/:userId", requireSignin, deleteUser);

//follow
router.put('/user/follow', requireSignin, addFollowing, addFollower);
router.put("/user/unfollow", requireSignin, removeFollowing, removeFollower)

// Toutes les routes contenant :userId s'éxécuteront d'abord par userByid()

router.param("userId", userById);

module.exports = router;
