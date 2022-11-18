'use strict';

const AuthBearer = require('hapi-auth-bearer-token');
const raven = require('./raven');
const paginate = require('./plugins/paginate');
const AuthAddress = require('./authorization/AuthAddress');
const AuthServices = require('./authorization/AuthServices');

function createPreRegister(config) {
	return async function preRegister(server) {
		await server.register(raven);
		await server.register(paginate);
		if (config.optionViews) {
			await server.register(require('vision'));
			
			server.views({
				engines: {
					html: require('handlebars')
				},
				...config.optionViews,
			});
		}
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
				const newOutPut = request.response.output;
				if (newOutPut.payload.message && newOutPut.payload.message.indexOf(' ' < 0)) {
					newOutPut.payload.messageError = getMessageError(newOutPut.payload.message);
				}
				if (request.response.data && request.response.data.details) {
					newOutPut.payload.details = request.response.data.details;
				}
				server.plugins['hapi-raven'].client.captureException(request.response, {
					extra: {
						query: request.query,
						payload: request.payload,
						params: request.params,
						response: { ...request.response, output: newOutPut },
					},
					level: 'warning',
					tags: {
						statusCode: 400,
					},
				});
			}
			const { servicesPath } =
						request.auth && request.auth.credentials
							? request.auth && request.auth.credentials
							: {};
			if (request.route) {
				const { path, method } = request.route;
				const { address } = request.info;
				const validAddress = AuthAddress({ address });
				if (!validAddress) {
					const authorization = AuthServices({ servicesPath, path, method });
					return authorization ? request.response :
						h.response({ message: 'Service not authorized for the role of this user' }).code(403);
				}
			}
			return request.response;
		});
	};
}

module.exports = createPreRegister;
