this.value = html`
<!DOCTYPE html>
<html>
	<head>
		<title>${this.title}</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<meta name="author" content="${this.author || "Grant Gryczan"}">
		<meta name="description" content="${this.description}">
		<meta name="keywords" content="${["miroware", "miro", "ware", "grant", "gryczan", "magic", "hello", "world", ...this.tags].join(",")}">
		<meta name="theme-color" content="#202020">
		<meta property="og:type" content="website">
		<meta property="og:url" content="https://miroware.io/">
		<meta property="og:site_name" content="Miroware">
		<meta property="og:image" content="${this.image || "/image/icon/main.png"}">
		<meta property="og:title" content="${this.title}">
		<meta property="og:description" content="${this.description}">
		<meta name="google-signin-client_id" content="${youKnow.google.clientId}">
		<link rel="icon" href="/image/icon/cover.png">
		<link rel="stylesheet" href="/css/miro.css">
		<script src="https://www.googletagmanager.com/gtag/js?id=UA-110090319-1" async></script>
		<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag("js",new Date),gtag("config","UA-110090319-1");</script>`;
this.exit();
