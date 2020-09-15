'use strict';

function authorizationServices({ path, method, servicesPath }) {
	if (servicesPath) {
		const newSer = JSON.parse(servicesPath);
		if (newSer.authorizationDefault) {
			const methodPatch = `${method.toUpperCase()}..${path}`;
			if (newSer.sales) {
				return !!newSer.sales[methodPatch];
			}
		}
	}
	return true;
}

module.exports = authorizationServices;
