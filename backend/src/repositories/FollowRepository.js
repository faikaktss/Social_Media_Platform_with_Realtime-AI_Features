const BaseRepository = require('./BaseRepository');

class FollowRepository extends BaseRepository {
    constructor() {
        super('follow');
    }

    async findByFollowerAndFollowing(followerId, followingId) {
        return await this.prisma.follow.findUnique({
            where: {
                followerId_followingId: { followerId, followingId }
            }
        });
    }

    async createFollow(followerId, followingId) {
        return await this.prisma.follow.create({
            data: { followerId, followingId }
        });
    }

    async deleteFollow(followerId, followingId) {
        return await this.prisma.follow.delete({
            where: {
                followerId_followingId: { followerId, followingId }
            }
        });
    }

    async findFollowersByUserId(userId) {
        return await this.prisma.follow.findMany({
            where: { followingId: userId },
            include: {
                follower: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        profilePic: true,
                        createdAt: true
                    }
                }
            }
        });
    }

    async findFollowingByUserId(userId) {
        return await this.prisma.follow.findMany({
            where: { followerId: userId },
            include: {
                following: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        profilePic: true,
                        createdAt: true
                    }
                }
            }
        });
    }

    async getFollowingUserIds(userId) {
        const follows = await this.prisma.follow.findMany({
            where: { followerId: userId },
            select: { followingId: true }
        });
        return follows.map(f => f.followingId);
    }
}

module.exports = new FollowRepository();
