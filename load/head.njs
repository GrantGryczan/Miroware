if(this.title === undefined) {
	this.title = "Miroware";
}
if(this.author === undefined) {
	this.author = "Grant Gryczan";
}
if(this.description === undefined) {
	this.description = "Hello, world!";
}
if(!(this.tags instanceof Array)) {
	this.tags = [];
}
if(this.image === undefined) {
	this.image = "/images/icon/full.png";
}
if(this.icon === undefined) {
	this.icon = "/images/icon/cover.png";
}
this.value = html`
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width,initial-scale=1">
		<meta name="author" content="$${this.author}">
		<meta name="description" content="$${this.description}">
		<meta name="keywords" content="$${["miroware", "miro", "ware", "grantgryczan", "grant", "gryczan", "magic", ...this.tags].join(",")}">
		<meta name="theme-color" content="#202020">
		<meta property="og:type" content="website">
		<meta property="og:site_name" content="Miroware">
		<meta property="og:url" content="https://miroware.io$${this.req.decodedURL}">
		<meta property="og:title" content="$${this.title}">
		<meta property="og:image" content="$${this.image.includes("//") ? this.image : `https://miroware.io${(this.image.startsWith("/") ? "" : "/") + this.image}`}">
		<meta property="og:description" content="$${this.description}">
		<meta name="google-signin-client_id" content="${youKnow.google.id}">
		<meta name="in" content="${!!this.user}">
		<meta name="data" content="$${this.data ? JSON.stringify(this.data) : null}">
		<title>$${this.title}</title>
		<link rel="icon" href="$${this.icon}">
		<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">
		<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
		<link rel="stylesheet" href="https://unpkg.com/material-components-web@0.41.1/dist/material-components-web.min.css">
		<link rel="stylesheet" href="/css/style.css">
		<script src="https://www.googletagmanager.com/gtag/js?id=UA-110090319-1" async></script>
		<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date),gtag("config","UA-110090319-1");</script>`;
this.done();
