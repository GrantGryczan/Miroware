const purgeCacheWithOrigin = async (url, origin) => {
  let errors = 0;
  do {
    await wait(1000);
    try {
      await fetch(`https://api.cloudflare.com/client/v4/zones/${youKnow.cloudflare.zone}/purge_cache`, {
        method: "POST",
        headers: {
          "Authorization": youKnow.cloudflare.auth,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          files: [{ url, headers: { Origin: origin } }]
        })
      });
    } catch (err) {
      if (++errors < 60) {
        continue;
      } else {
        throw err;
      }
    }
    break;
  } while (true);
};

if (typeof this.req.body.origin !== "string") {
  this.value = {
    error: "The `origin` value must be a string."
  };
  this.status = 400;
  this.done();
  return;
}

const {user, isMe} = await parseUser(this);
if (isMe) {
	const found = user.pipe.find(item => item.id === this.params.item);
	if (found) {
		if (found.type === "/") {
			this.value = {
				error: "Directories cannot be purged."
			};
			this.status = 422;
			this.done();
		} else {
      const encodedPath = encodeForPipe(found.path);
      const userID = stringifyID(user._id);
			await purgeCacheWithOrigin(`https://file.garden/${userID}/${encodedPath}`, this.req.body.origin);
			this.done();
		}
	} else {
		this.value = {
			error: "That item does not exist."
		};
		this.status = 404;
		this.done();
	}
} else {
	this.value = {
		error: "You do not have permission to access that user's garden."
	};
	this.status = 403;
	this.done();
}
