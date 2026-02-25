const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/UserRepository');

async function findExistingUser(username, email) {
    const userByUsername = await userRepository.findByUsername(username, false);
    if (userByUsername) return userByUsername;
    
    const userByEmail = await userRepository.findByEmail(email);
    return userByEmail;
}

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function createUser(username, email, hashedPassword) {
    return await userRepository.create({
        username,
        email,
        password: hashedPassword
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
    return await userRepository.findByUsername(username, false);
}

async function comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

async function findUserByEmail(email) {
    return await userRepository.findByEmail(email);
}

async function searchUsers(query, limit = 10) {
    return await userRepository.findAll({
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