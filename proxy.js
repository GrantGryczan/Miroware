const redbird = require("redbird")({
	port: 8080,
	secure: true,
	ssl: {
		port: 8443,
		key: "/etc/letsencrypt/live/miroware.io/privkey.pem",
		cert: "/etc/letsencrypt/live/miroware.io/cert.pem",
		ca: "/etc/letsencrypt/live/miroware.io/chain.pem"
	}
});
redbird.register("d.miroware.io", "http://localhost:8081");
redbird.register("miroware.io", "http://localhost:8081");
redbird.register("www.miroware.io", "http://localhost:8081");
