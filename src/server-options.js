'use strict';

const catboxRedis = require('catbox-redis');

const options = {
	host: process.env.HOST || 'localhost',
	port: process.env.PORT || 4000,
	routes: {
		security: true,
		cors: {
			origin: ['*'],
			exposedHeaders: ['x-quantity', 'x-last-page', 'X-Frame-Options'],
			credentials: true,
		},
		validate: {
			failAction: (request, h, err) => err,
		},
	},
	cache: [
		{
			name: process.env.CATBOX_REDIS_NAME || 'catbox-redis',
			provider: {
				constructor: catboxRedis,
				options: {
					host: process.env.REDIS_HOST || 'localhost',
					port: process.env.REDIST_PORT || 6379,
					partition: process.env.CATBOX_PARTITION_NAME || 'cache',
				},
			},
		},
	],
};

module.exports = options;
