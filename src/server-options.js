'use strict';

const catboxRedis = require('catbox-redis');

const options = {
	host: process.env.HOST || 'localhost',
	port: process.env.PORT || 4000,
	routes: {
		cors: {
			origin: ['*'],
			exposedHeaders: ['x-quantity', 'x-last-page'],
		},
	},
	cache: [
		{
			name: process.env.CATBOX_REDIS_NAME || 'catbox-redis',
			engine: catboxRedis,
			partition: process.env.CATBOX_PARTITION_NAME || 'cache',
			host: process.env.REDIS_HOST || 'localhost',
			port: process.env.REDIST_PORT || 6379,
		},
	],
};

module.exports = options;
