const express = require('express');
const {toggleLike, getLikeCount, isPostLikedByUser, getLikesByPost} = require('../controllers/likeController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/likes/toggle:
 *   post:
 *     summary: Postu beğen/beğenmekten vazgeç
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *             properties:
 *               postId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Beğeni durumu değişti
 */
router.post('/toggle', authenticateToken, toggleLike);

/**
 * @swagger
 * /api/likes/count/{postId}:
 *   get:
 *     summary: Post beğeni sayısını getir
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Beğeni sayısı
 */
router.get('/count/:postId', getLikeCount);

/**
 * @swagger
 * /api/likes/check/{postId}:
 *   get:
 *     summary: Post beğenildi mi kontrol et
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Beğeni durumu
 */
router.get('/check/:postId', authenticateToken, isPostLikedByUser);

/**
 * @swagger
 * /api/likes/post/{postId}:
 *   get:
 *     summary: Postun beğenilerini listele
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Beğeni listesi
 */
router.get('/post/:postId', getLikesByPost);

module.exports = router;