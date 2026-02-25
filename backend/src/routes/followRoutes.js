const express = require('express');
const {
  toggleFollow,
  getFollowers,
  getFollowing,
  checkFollowStatus
} = require('../controllers/followController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/follows/{userId}/follow:
 *   post:
 *     summary: Follow or unfollow a user
 *     description: Toggle follow/unfollow status for a user (authenticated users only)
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to follow/unfollow
 *     responses:
 *       200:
 *         description: Follow status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User followed successfully"
 *       400:
 *         description: Cannot follow yourself
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.post('/:userId/follow', authenticateToken, toggleFollow);

/**
 * @swagger
 * /api/follows/{userId}/followers:
 *   get:
 *     summary: Get followers list
 *     description: Retrieve list of users following the specified user
 *     tags: [Follows]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user whose followers to retrieve
 *     responses:
 *       200:
 *         description: List of followers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 followers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: User not found
 */
router.get('/:userId/followers', getFollowers);

/**
 * @swagger
 * /api/follows/{userId}/following:
 *   get:
 *     summary: Get following list
 *     description: Retrieve list of users that the specified user is following
 *     tags: [Follows]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user whose following list to retrieve
 *     responses:
 *       200:
 *         description: List of users being followed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 following:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       username:
 *                         type: string
 *                       email:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       404:
 *         description: User not found
 */
router.get('/:userId/following', getFollowing);

/**
 * @swagger
 * /api/follows/{userId}/follow-status:
 *   get:
 *     summary: Check follow status
 *     description: Check if authenticated user is following the specified user
 *     tags: [Follows]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to check follow status for
 *     responses:
 *       200:
 *         description: Follow status retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isFollowing:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/:userId/follow-status', authenticateToken, checkFollowStatus);

module.exports = router;