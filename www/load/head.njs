this.title = this.title === undefined ? "Miroware" : this.title;
this.author = this.author === undefined ? "Grant Gryczan" : this.author;
this.description = this.description === undefined ? "Hello, world!" : this.description;
this.tags = this.tags instanceof Array ? this.tags : [];
this.image = this.image === undefined ? "/images/icon/cube.png" : this.image;
const userAgent = this.req.get("User-Agent");
this.value = html`
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width,initial-scale=1">
		<meta name="author" content="$${this.author}">
		<meta name="description" content="$${this.description}">
		<meta name="keywords" content="$${["miroware", "miro", "ware", "grantgryczan", "grant", "gryczan", "magic", ...this.tags].join(",")}">
		<meta name="theme-color" content="${userAgent && userAgent.includes("Discordbot") ? "#ff0000" : "#202020"}">
		<meta property="og:type" content="website">
		<meta property="og:url" content="https://miroware.io/">
		<meta property="og:site_name" content="Miroware">
		<meta property="og:image" content="$${this.image.includes("//") ? this.image : `https://miroware.io${(this.image.startsWith("/") ? "" : "/") + this.image}`}">
		<meta property="og:title" content="$${this.title}">
		<meta property="og:description" content="$${this.description}">
		<meta name="google-signin-client_id" content="${youKnow.google.id}">`;
if(this.user) {
	this.value += html`
		<meta name="user" content="$${JSON.stringify((await load("api/users/@me", {
			...this,
			method: "GET"
		})).value)}">`;
}
this.value += html`
		<title>$${this.title}</title>
		<link rel="icon" href="/images/icon/cover.png">
		<link rel="stylesheet" href="/css/style.css">
		<script src="https://www.googletagmanager.com/gtag/js?id=UA-110090319-1" async></script>
		<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date),gtag("config","UA-110090319-1");</script>`;
this.done();
