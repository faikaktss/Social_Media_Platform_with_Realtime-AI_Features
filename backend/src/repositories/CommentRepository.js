const BaseRepository = require('./BaseRepository');

class CommentRepository extends BaseRepository {
    constructor() {
        super('comment');
    }

    async createComment(data) {
        return await this.prisma.comment.create({
            data,
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        profilePic: true
                    }
                }
            }
        });
    }

    async findByPostId(postId) {
        return await this.prisma.comment.findMany({
            where: { postId },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        profilePic: true
                    }
                }
            }
        });
    }

    async findByIdWithUser(commentId) {
        return await this.prisma.comment.findUnique({
            where: { id: commentId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        profilePic: true
                    }
                }
            }
        });
    }

    async findByUserId(userId) {
        return await this.prisma.comment.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        profilePic: true
                    }
                },
                post: {
                    select: {
                        id: true,
                        imageUrl: true,
                        caption: true
                    }
                }
            }
        });
    }

    async updateComment(commentId, content) {
        return await this.prisma.comment.update({
            where: { id: commentId },
            data: { content },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        profilePic: true
                    }
                }
            }
        });
    }
}

module.exports = new CommentRepository();
