window.opener.postMessage(location.href.slice(location.href.indexOf("?")+1), window.location.origin);
window.close();