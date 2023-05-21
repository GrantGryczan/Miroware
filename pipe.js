'use strict';
console.log('< Pipe >')
const fs = require('fs');
const http = require('http');
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const archiver = require('archiver');
const youKnow = require('./secret/youknow.js');
const axios = require('axios');

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const withTwoDigits = value => `0${value}`.slice(-2);

/** Formats a date for the `Last-Modified` header. */
const getLastModifiedString = date => {
	date = new Date(date);

	const weekday = weekdays[date.getUTCDay()];
	const month = months[date.getUTCMonth()];
	const dateString = `${withTwoDigits(date.getUTCDate())} ${month} ${date.getUTCFullYear()}`;
	const timeString = `${withTwoDigits(date.getUTCHours())}:${withTwoDigits(date.getUTCMinutes())}:${withTwoDigits(date.getUTCSeconds())}`;

	return `${weekday}, ${dateString} ${timeString} GMT`
};

(async () => {
	require('replthis')(v => eval(v));
	const db = (await MongoClient.connect(youKnow.db, {
		useUnifiedTopology: true
	})).db('web');
	const users = db.collection('users');
	const items = db.collection('items');

	let b2Authorization;
	const AUTHORIZATION_PERIOD = 1000 * 60 * 60 * 24 * 7;
	const authorizeB2 = async () => {
		const { data } = await axios.get('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
			auth: {
				username: youKnow.b2.auth.accessKeyId,
				password: youKnow.b2.auth.secretAccessKey
			}
		});

		const { data: data2 } = await axios.post(`${data.apiUrl}/b2api/v2/b2_get_download_authorization`, {
			bucketId: youKnow.b2.bucketID,
			fileNamePrefix: '',
			validDurationInSeconds: AUTHORIZATION_PERIOD / 1000
		}, {
			headers: {
				Authorization: data.authorizationToken
			}
		});

		b2Authorization = data2.authorizationToken;
	};
	await authorizeB2();
	setInterval(authorizeB2, AUTHORIZATION_PERIOD - 1000 * 60 * 10);
	const getB2 = path => axios.get(`https://b2.filegarden.com/${path}`, {
		responseType: 'stream',
		headers: {
			Authorization: b2Authorization
		}
	});

	const app = express();
	app.disable('X-Powered-By');
	app.get('*', async (req, res) => {
		let path = req.path;
		if (path === '/') {
			res.redirect(302, 'https://filegarden.com/');
			return;
		}
		res.set('Access-Control-Allow-Origin', '*').set('Content-Security-Policy', 'default-src file.garden linkh.at data: mediastream: blob: \'unsafe-inline\' \'unsafe-eval\'');
		if (req.hostname === 'pipe.miroware.io') {
			const referrer = req.get('Referer');
			if (referrer) {
				console.log(referrer, req.url);
			}
			let url = req.url.slice(1);
			url = url.replace(/^[0-9a-f]{24}/, hex => Buffer.from(hex, 'hex').toString('base64url'));
			res.redirect(301, `https://file.garden/${url}`);
			return;
		}

		path = path.slice(1);
		try {
			path = decodeURIComponent(path);
		} catch (err) {
			res.header('Content-Type', 'text/plain').status(400).send(err.message);
			return;
		}
		const slashIndex = path.indexOf('/');
		const pathRoot = path.slice(0, slashIndex);
		let userQuery;
		if (pathRoot.startsWith('@')) {
			userQuery = {
				tag: pathRoot.slice(1)
			};
		} else {
			try {
				if (slashIndex === -1) {
					throw 404;
				}
				userQuery = {
					_id: new ObjectId(
						Buffer.from(pathRoot, 'base64url')
					)
				};
			} catch {
				res.sendStatus(404);
				return;
			}
		}

		const user = await users.findOne(userQuery);

		if (!user) {
			res.sendStatus(404);
			return;
		}

		path = path.slice(slashIndex + 1);

		if (path.startsWith(`${user.pipe.find(item => item.id === 'trash').path}/`)) {
			res.sendStatus(404);
			return;
		}

		const item = user.pipe.find(item => item.path === path) || (
			await items.findOne({
				userID: user._id,
				path,
			})
		);

		if (!item || item.privacy === 2) {
			res.sendStatus(404);
			return;
		}

		const userIDString = user._id.toString('base64url');
		if (item.type === '/') {
			res.set('Content-Type', 'application/zip');
			const archive = archiver('zip');
			archive.on('error', error => {
				throw error;
			});
			archive.pipe(res);
			const sliceStart = path.length + 1; // Change `path.length` to `path.lastIndexOf('/')` to put the folder inside of the ZIP instead of having the ZIP be the folder itself.
			const promises = [];
			const scan = parent => {
				for (const item of user.pipe) {
					if (item.parent === parent && item.privacy === 0) {
						if (item.type === '/') {
							scan(item.id);
						} else {
							promises.push(getB2(`/${userIDString}/${item.id}`).then(({ data }) => {
								archive.append(data, {
									name: item.path.slice(sliceStart)
								});
							}));
						}
					}
				}
			};
			scan(item.id);
			Promise.all(promises).then(() => {
				archive.finalize();
			});
		} else {
			getB2(`${userIDString}/${item.id}`).then(response => {
				res.set('Content-Type', item.type);
				res.set('Content-Length', response.headers['content-length']);
				res.set('Last-Modified', getLastModifiedString(item.date));
				response.data.pipe(res);
			}).catch(error => {
				console.error(error);
				res.status(error.statusCode).send(error.message);
			});
		}
	});
	http.createServer(app).listen(8082);
})();
fs.watch(__filename, () => {
	process.exit();
});
