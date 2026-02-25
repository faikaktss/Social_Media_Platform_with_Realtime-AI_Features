const BaseRepository = require('./BaseRepository');

class PostRepository extends BaseRepository {
    constructor() {
        super('post');
    }

    async findAllWithPagination(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        
        const [posts, total] = await Promise.all([
            this.prisma.post.findMany({
                skip,
                take: limit,
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
            }),
            this.count()
        ]);

        return {
            posts,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalPosts: total,
                hasNextPage: page * limit < total
            }
        };
    }

    async findByIdWithUser(postId) {
        return await this.prisma.post.findUnique({
            where: { id: postId },
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
        return await this.prisma.post.findMany({
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
                }
            }
        });
    }

    async createPost(data) {
        return await this.prisma.post.create({
            data,
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                }
            }
        });
    }

    async updatePost(postId, data) {
        return await this.prisma.post.update({
            where: { id: postId },
            data,
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true
                    }
                }
            }
        });
    }

    async findByFollowingUsers(userIds, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        
        const [posts, total] = await Promise.all([
            this.prisma.post.findMany({
                where: {
                    userId: { in: userIds }
                },
                skip,
                take: limit,
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
            }),
            this.count({ userId: { in: userIds } })
        ]);

        return {
            posts,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalPosts: total,
                hasNextPage: page * limit < total
            }
        };
    }
}

module.exports = new PostRepository();
