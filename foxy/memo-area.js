'use strict';

const textarea = document.createElement('textarea');
document.body.appendChild(textarea);
textarea.className = 'foxy-memo-area';
textarea.style.zIndex = 10000;
textarea.style.position = 'fixed';
textarea.style.bottom = 0;
textarea.style.left = '50%';
textarea.style.fontFamily = '"Source Code Pro", monospace';
textarea.rows = 10;
textarea.cols = 80;
document.oncopy = document.oncut = e => {
  setTimeout(() => document.body.removeChild(textarea), 100);
}
