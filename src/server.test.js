'use strict';

const assert = require('assert');
const glueConfig = require('./server');

(async () => {
	const server = await glueConfig();
	await server.start();
	assert.equal(server.info.port, 4000, 'Default port must be 4000');
	assert.equal(
		server.info.host,
		'localhost',
		'Default host must be http://localhost',
	);
	await server.stop();
})();

(async () => {
	async function validate() {
		return { isValid: true, credentials: { id: 1 } };
	}

	const server = await glueConfig({ validate });

	server.route({
		method: 'GET',
		path: '/private',
		handler(request) {
			return request.auth.credentials.id;
		},
	});

	const { result } = await server.inject({
		url: '/private',
		credentials: { id: 1 },
	});

	assert.equal(result, 1, 'The ID of the user must be ONE');

	const { statusCode } = await server.inject({
		url: '/private',
	});

	assert.equal(
		statusCode,
		401,
		'Request without credentials must return 401 status code',
	);
})();

(async () => {
	const myPlugin = {
		name: 'my-plugin',
		register(server) {
			server.route({
				handler() {
					return 'I am a plugin';
				},
				method: 'GET',
				path: '/my-plugin',
			});
		},
		version: '1.0.0',
	};
	const plugins = [myPlugin];
	const server = await glueConfig({ plugins });

	const { result } = await server.inject({ url: '/my-plugin' });

	assert.equal(result, 'I am a plugin', 'The result must be "I am a plugin"');
})();

(async () => {
	const server = await glueConfig();

	server.route({
		method: 'GET',
		path: '/pagination',
		handler(request, h) {
			return h.paginate({ results: [], total: 20 }, request.query);
		},
	});

	const { headers } = await server.inject({
		url: '/pagination?page=2&limit=10',
	});

	assert.equal(headers['x-last-page'], 2, 'The last page must be TWO');
	assert.equal(headers['x-quantity'], 20, 'The quantity must be TWENTY');
})();
