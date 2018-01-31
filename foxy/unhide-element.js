'use strict';

window.foxyval = window.foxyval || {};
const hidden = window.foxyval.hiddenElems = window.foxyval.hiddenElems || [];
const e = hidden.pop();
if(e) {
  e.style.visibility = ``;
} else {
  alert(`No elements to unhide.`);
}
