const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function findExistingUser(username, email) {
    return await prisma.user.findFirst({
        where: {
            OR: [
                { username },
                { email }
            ]
        }
    });
}

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function createUser(username, email, hashedPassword) {
    return await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword
        }
    });
}

function generateToken(user) {
    return jwt.sign(
        { userId: user.id, username: user.username },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
    );
}

async function findUserByUsername(username) {
    return await prisma.user.findUnique({
        where: { username }
    });
}

async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

async function findUserByEmail(email) {
    return await prisma.user.findUnique({
        where: { email }
    });
}

async function searchUsers(query, limit = 10) {
    return await prisma.user.findMany({
        where: {
            username: {
                contains: query,
                mode: 'insensitive'
            }
        },
        take: limit,
        select: {
            id: true,
            username: true,
            profilePic: true,
            bio: true
        }
    });
}

module.exports = {
    findExistingUser,
    hashPassword,
    createUser,
    generateToken,
    findUserByUsername,
    comparePassword,
    findUserByEmail,
    searchUsers
};