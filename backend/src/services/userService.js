const userRepository = require('../repositories/UserRepository');

async function getUserById(id) {
    return await userRepository.findByIdWithProfile(id);
}

async function getUserByUsername(username) {
    return await userRepository.findByUsername(username, true);
}

async function updateProfile(userId, data) {
    return await userRepository.updateProfile(userId, data);
}

async function searchUsers(query, limit = 10) {
    return await userRepository.findAll({
        where: {
            username: {
                contains: query,
                mode: 'insensitive' //Todo: Büyük/küçük harf duyarsız arama
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

async function getUsers(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    return await userRepository.findAll({
        skip,
        take: limit,
        select: {
            id: true,
            username: true,
            profilePic: true,
            bio: true
        }
    });
}

async function deleteUser(id) {
    return await userRepository.delete(id);
}

module.exports = {
    getUserById,
    getUserByUsername,
    updateProfile,
    searchUsers,
    getUsers,
    deleteUser
};