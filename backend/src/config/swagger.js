const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Instagram Clone API',
            version: '1.0.0',
            description: 'Instagram Clone Backend API Documentation',
            contact: {
                name: 'API Support',
                email: 'support@instagram-clone.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            }
        ],
        tags: [
            { name: 'Auth', description: 'Authentication endpoints' },
            { name: 'Users', description: 'User profile management' },
            { name: 'Posts', description: 'Post CRUD operations' },
            { name: 'Likes', description: 'Like/unlike functionality' },
            { name: 'Comments', description: 'Comment management' },
            { name: 'Follows', description: 'Follow/unfollow operations' },
            { name: 'Feed', description: 'Feed generation' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
