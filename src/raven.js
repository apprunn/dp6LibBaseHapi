const raven = require('hapi-raven');

const ravenOptions = {
	plugin: raven,
	options: {
		environment: process.env.NODE_ENV,
		dsn: process.env.SENTRY_DNS,
	},
};

module.exports = ravenOptions;
