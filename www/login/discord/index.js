"use strict";
window.opener.postMessage(location.href.slice(location.href.indexOf("?") + 1), location.origin);
window.close();
