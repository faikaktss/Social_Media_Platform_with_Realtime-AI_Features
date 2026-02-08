const express = require('express');
const {
  toggleFollow,
  getFollowers,
  getFollowing,
  checkFollowStatus
} = require('../controllers/followerController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

//Todo: Takip işlemi sadece giriş yapmış kullanıcılar tarafından yapılabilir
router.post('/:userId/follow', authenticateToken, toggleFollow);
//Todo:Takipçi listesi
router.get('/:userId/followers', getFollowers);
//Todo:Takip edilen listesi
router.get('/:userId/following', getFollowing);
//Todo: Takip durumu kontrol et
router.get('/:userId/follow-status', authenticateToken, checkFollowStatus);

module.exports = router;