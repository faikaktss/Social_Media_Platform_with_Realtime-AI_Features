const express = require('express');
const {createComment, getCommentsByPost, deleteComment, updateComment, getCommentsByUser, getCommentById} = require('../controllers/commentController');
const authenticateToken = require('../middlewares/authMiddleware');
const {commentLimiter} = require('../middlewares/rateLimiter');

const router = express.Router();

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: Yeni yorum oluştur
 *     tags: [Comments]
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
 *               - content
 *             properties:
 *               postId:
 *                 type: integer
 *                 example: 1
 *               content:
 *                 type: string
 *                 example: "Harika bir paylaşım!"
 *     responses:
 *       201:
 *         description: Yorum oluşturuldu
 */
router.post('/', commentLimiter, authenticateToken, createComment);

/**
 * @swagger
 * /api/comments/post/{postId}:
 *   get:
 *     summary: Postun yorumlarını listele
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Yorum listesi
 */
router.get('/post/:postId', getCommentsByPost);

/**
 * @swagger
 * /api/comments/{commentId}:
 *   get:
 *     summary: Belirli bir yorumu getir
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Yorum detayı
 */
router.get('/:commentId', getCommentById);

/**
 * @swagger
 * /api/comments/user/{userId}:
 *   get:
 *     summary: Kullanıcının yorumlarını listele
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Kullanıcı yorumları
 */
router.get('/user/:userId', getCommentsByUser);

/**
 * @swagger
 * /api/comments/{commentId}:
 *   put:
 *     summary: Yorumu güncelle
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Yorum güncellendi
 */
router.put('/:commentId', authenticateToken, updateComment);

/**
 * @swagger
 * /api/comments/{commentId}:
 *   delete:
 *     summary: Yorumu sil
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Yorum silindi
 */
router.delete('/:commentId', authenticateToken, deleteComment);

module.exports = router;