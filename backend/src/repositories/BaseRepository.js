const { PrismaClient } = require('@prisma/client');


class BaseRepository {
    constructor(model) {
        this.prisma = new PrismaClient();
        this.model = model; 
    }

    async findById(id, options = {}) {
        return await this.prisma[this.model].findUnique({
            where: { id },
            ...options
        });
    }

    async findAll(options = {}) {
        return await this.prisma[this.model].findMany(options);
    }

    async findOne(where, options = {}) {
        return await this.prisma[this.model].findFirst({
            where,
            ...options
        });
    }

    async create(data, options = {}) {
        return await this.prisma[this.model].create({
            data,
            ...options
        });
    }

    async update(id, data, options = {}) {
        return await this.prisma[this.model].update({
            where: { id },
            data,
            ...options
        });
    }

    async delete(id) {
        return await this.prisma[this.model].delete({
            where: { id }
        });
    }

    async count(where = {}) {
        return await this.prisma[this.model].count({ where });
    }

    async exists(where) {
        const count = await this.count(where);
        return count > 0;
    }
}
module.exports = BaseRepository;