// @ts-check

const http = require('http');
const https = require('https');
const { RequestError } = require('./request-error');

module.exports.request = request;

function request({ hostname, path, method = 'POST', headers = {}, json, protocol = 'https' }) {
	return new Promise((resolve, reject) => {
		let client = protocol === 'https' ? https : http;
		let payload;

		if (json) {
			payload = JSON.stringify(json);
			let bytes = Buffer.byteLength(payload);
			headers['content-type'] = 'application/json';
			headers['content-length'] = bytes;
		}

		let req = client.request({ hostname, path, method, headers }, res => {
			let bufs = [];
			res.on('error', err => reject(err));
			res.on('data', data => bufs.push(data));
			res.on('end', () => {
				let rawBody = Buffer.concat(bufs);
				let statusCode = res.statusCode;
				let body = safeParse(rawBody);
				if (statusCode === 200) {
					resolve(body);
				} else {
					let err = new RequestError(res.statusCode, body);
					reject(err);
				}
			});
		});
		req.on('error', err => reject(err));
		if (payload) {
			req.write(payload);
		}
		req.end();
	});
}

function safeParse(buf) {
	try {
		return JSON.parse(buf);
	} catch (ex) {
		return buf.toString('utf8');
	}
}
