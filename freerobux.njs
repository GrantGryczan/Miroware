this.status = 401;
this.res.set("WWW-Authenticate", "Enter your Minecraft username and password.");
this.done();
