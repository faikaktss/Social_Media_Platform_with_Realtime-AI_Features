const express = require('express');
const {createPost, getAllPosts, getPost, updatePost, deletePost} = require('../controllers/postController');
const authenticateToken = require('../middlewares/authMiddleware');
const { postLimiter } = require('../middlewares/rateLimiter');
const {uploadSingleImage} = require('../middlewares/uploadMiddleware');


const router = express.Router();

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Yeni post oluştur
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               caption:
 *                 type: string
 *                 example: "Güzel bir gün!"
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post başarıyla oluşturuldu
 *       401:
 *         description: Yetkisiz erişim
 */
router.post('/',postLimiter,authenticateToken,...uploadSingleImage('image'),createPost);

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Tüm postları listele
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Post listesi
 */
router.get('/',authenticateToken,getAllPosts);

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: Belirli bir postu getir
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post detayı
 *       404:
 *         description: Post bulunamadı
 */
router.get('/:id',authenticateToken,getPost);

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: Postu güncelle
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               caption:
 *                 type: string
 *     responses:
 *       200:
 *         description: Post güncellendi
 *       403:
 *         description: Yetkiniz yok
 */
router.put('/:id',authenticateToken,updatePost);

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: Postu sil
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Post silindi
 *       403:
 *         description: Yetkiniz yok
 */
router.delete('/:id',authenticateToken,deletePost);

module.exports = router;