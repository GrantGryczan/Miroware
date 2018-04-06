window.opener.postMessage(location.href.slice(location.href.indexOf("?")+6), "http://localhost:8081");
window.close();
