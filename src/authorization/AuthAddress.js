'use strict';

function authorizationAddress({ address }) {
    let requestAddress = [];
    if (address) {
        requestAddress = address.split('.');
    }
	let ipAddress = process.env.PRODUCTS_URL ? process.env.PRODUCTS_URL.split('.') : [];
	if (requestAddress[0] === ipAddress[0] && requestAddress[1] === ipAddress[1]) {
		return true;
	}
	ipAddress = process.env.PRODUCTS_NEW_URL ? process.env.PRODUCTS_NEW_URL.split('.') : [];
	if (requestAddress[0] === ipAddress[0] && requestAddress[1] === ipAddress[1]) {
		return true;
	}
	ipAddress = process.env.NOTIFICATIONS_URL ? process.env.NOTIFICATIONS_URL.split('.') : [];
	if (requestAddress[0] === ipAddress[0] && requestAddress[1] === ipAddress[1]) {
		return true;
	}
	ipAddress = process.env.ACL_URL ? process.env.ACL_URL.split('.') : [];
	if (requestAddress[0] === ipAddress[0] && requestAddress[1] === ipAddress[1]) {
		return true;
	}
	return false;
}

module.exports = authorizationAddress;
