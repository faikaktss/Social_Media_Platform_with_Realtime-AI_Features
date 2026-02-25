const express = require('express');
const {getProfile, updateProfile} = require('../controllers/userController');

const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/users/{username}:
 *   get:
 *     summary: Kullanıcı profilini getir
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         example: johndoe
 *     responses:
 *       200:
 *         description: Kullanıcı profili
 *       404:
 *         description: Kullanıcı bulunamadı
 */
router.get('/:username', getProfile)

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Profili güncelle
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: newemail@example.com
 *               bio:
 *                 type: string
 *                 example: "Yeni bio"
 *     responses:
 *       200:
 *         description: Profil güncellendi
 *       401:
 *         description: Yetkisiz erişim
 */
router.put('/profile',authenticateToken, updateProfile);


module.exports = router;