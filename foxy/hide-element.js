'use strict';

window.foxyval = window.foxyval || {};
const hidden = window.foxyval.hiddenElems = window.foxyval.hiddenElems || [];
hidden.push(mouseDown.target);
mouseDown.target.style.visibility = `hidden`;
