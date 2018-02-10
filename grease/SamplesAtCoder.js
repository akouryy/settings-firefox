// ==UserScript==
// @name        SamplesAtCoder
// @version     1.0.0
// @description cmd + shift + s => copy all samples
// @author      akouryy
// @include     https://beta.atcoder.jp/contests/*/tasks/*
// @require     http://code.jquery.com/jquery-3.3.1.slim.min.js
// @grant       none
// ==/UserScript==

const range = n => [...Array(n).keys()];

jQuery($ => {
  'use strict';
  const $body = $(`body`);

  $(window).keydown(e => {
    if(e.metaKey && e.shiftKey && e.keyCode == 83 /* S */) {
      const $textarea = $(`<textarea>`).css({
        position: `fixed`,
        top: 0,
        left: 0,
      }).appendTo($body);

      console.log($textarea.val());
      const lang = $(`.lang-ja #pre-sample0`).length !== 0 ? `.lang-ja` : ``;
      for(const i of range(100)) {
        let $s = $(`${lang} #pre-sample${i}`);
        if($s.length == 0) continue;
        const s = $(`#pre-sample${i}`).text().trim();
        console.log(s);
        $textarea.val($textarea.val() + `=====#${i}=====\n` + s + `\n`);
      }
      $textarea.select();
      document.execCommand(`copy`);
      $body.remove($textarea);

      e.preventDefault();
    }
  });
});
