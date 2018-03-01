this.title = this.title === undefined ? "Miroware" : this.title;
this.author = this.author === undefined ? "Grant Gryczan" : this.author;
this.description = this.description === undefined ? "Hello, world!" : this.description;
this.tags = this.tags instanceof Array ? this.tags : [];
this.image = this.image === undefined ? "/image/icon/main.png" : this.image;
console.log(this.req.get("User-Agent"));
this.value = html`
<!DOCTYPE html>
<html>
	<head>
		<title>${this.title}</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width,initial-scale=1">
		<meta name="author" content="${this.author}">
		<meta name="description" content="${this.description}">
		<meta name="keywords" content="${["miroware", "miro", "ware", "grantgryczan", "grant", "gryczan", "magic", ...this.tags].join(",")}">
		<meta name="theme-color" content="#202020">
		<meta property="og:type" content="website">
		<meta property="og:url" content="https://miroware.io/">
		<meta property="og:site_name" content="Miroware">
		<meta property="og:image" content="${this.image}">
		<meta property="og:title" content="${this.title}">
		<meta property="og:description" content="${this.description}">
		<meta name="google-signin-client_id" content="${youKnow.google.clientId}">
		<link rel="icon" href="/image/icon/cover.png">
		<link rel="stylesheet" href="/css/miro.css">
		<script src="https://www.googletagmanager.com/gtag/js?id=UA-110090319-1" async></script>
		<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date),gtag("config","UA-110090319-1");</script>`;
this.exit();
