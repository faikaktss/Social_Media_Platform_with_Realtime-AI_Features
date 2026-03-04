const BaseRepository = require('./BaseRepository');

class UserRepository extends BaseRepository {
    constructor() {
        super('user');
    }

    async findByEmail(email) {
        return await this.prisma.user.findUnique({
            where: { email }
        });
    }

    async findByUsername(username, includeProfile = true) {
        if (includeProfile === false) {
            // For authentication - return all fields including password
            return await this.prisma.user.findUnique({
                where: { username }
            });
        }
        
        return await this.prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                email: true,
                profilePic: true,
                bio: true,
                followerCount: true,
                followingCount: true,
                createdAt: true
            }
        });
    }

    async findByIdWithProfile(id) {
        return await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                email: true,
                profilePic: true,
                bio: true,
                followerCount: true,
                followingCount: true,
                createdAt: true
            }
        });
    }

    async updateProfile(userId, data) {
        return await this.prisma.user.update({
            where: { id: userId },
            data,
            select: {
                id: true,
                username: true,
                email: true,
                profilePic: true,
                bio: true,
                followerCount: true,
                followingCount: true,
                createdAt: true
            }
        });
    }

    async incrementFollowerCount(userId) {
        return await this.prisma.user.update({
            where: { id: userId },
            data: {
                followerCount: { increment: 1 }
            }
        });
    }

    async decrementFollowerCount(userId) {
        return await this.prisma.user.update({
            where: { id: userId },
            data: {
                followerCount: { decrement: 1 }
            }
        });
    }

    async incrementFollowingCount(userId) {
        return await this.prisma.user.update({
            where: { id: userId },
            data: {
                followingCount: { increment: 1 }
            }
        });
    }

    async decrementFollowingCount(userId) {
        return await this.prisma.user.update({
            where: { id: userId },
            data: {
                followingCount: { decrement: 1 }
            }
        });
    }
}

module.exports = new UserRepository();
