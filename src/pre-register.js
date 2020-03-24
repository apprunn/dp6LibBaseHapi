'use strict';

const AuthBearer = require('hapi-auth-bearer-token');
const raven = require('./raven');
const paginate = require('./plugins/paginate');

function createPreRegister(config) {
	return async function preRegister(server) {
		await server.register(raven);
		await server.register(paginate);
		if (config.validate) {
			await server.register(AuthBearer);
			server.auth.strategy('simple', 'bearer-access-token', {
				validate: config.validate,
			});
			server.auth.default('simple');
		}
		server.ext('onPreResponse', request => {
			server.plugins['hapi-raven'].client.setContext({
				user: request.auth.credentials,
			});
			if (
				request.response.isBoom &&
				request.response.output.statusCode === 400
			) {
				server.plugins['hapi-raven'].client.captureException(request.response, {
					extra: {
						query: request.query,
						payload: request.payload,
						params: request.params,
						response: request.response,
					},
					level: 'warning',
					tags: {
						statusCode: 400,
					},
				});
			}
			return request.response;
		});
	};
}

module.exports = createPreRegister;
