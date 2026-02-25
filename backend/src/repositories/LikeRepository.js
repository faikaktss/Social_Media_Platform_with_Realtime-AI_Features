const BaseRepository = require('./BaseRepository');

class LikeRepository extends BaseRepository {
    constructor() {
        super('like');
    }

    async findByUserAndPost(userId, postId) {
        return await this.prisma.like.findUnique({
            where: {
                userId_postId: { userId, postId }
            }
        });
    }

    async createLike(userId, postId) {
        return await this.prisma.like.create({
            data: { userId, postId }
        });
    }

    async deleteLike(userId, postId) {
        return await this.prisma.like.delete({
            where: {
                userId_postId: { userId, postId }
            }
        });
    }

    async countByPostId(postId) {
        return await this.count({ postId });
    }

    async findUsersByPostId(postId) {
        return await this.prisma.like.findMany({
            where: { postId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        profilePic: true
                    }
                }
            }
        });
    }
}

module.exports = new LikeRepository();
