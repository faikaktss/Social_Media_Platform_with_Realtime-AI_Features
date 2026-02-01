const express = require('express');
const {getProfile, updateProfile} = require('../controllers/userController');


const router = express.Router();

router.get('/:username',getProfile)
router.put('/profile',updateProfile);

module.exports = router;