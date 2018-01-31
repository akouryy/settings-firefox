'use strict';

const range = n => [...Array(n).keys()];

const url = window.location.href;
const match = url.match(/^https?:\/\/beta.atcoder.jp\/contests\/([^/]+)/);
if(match) {
  const taskCount = /a[br]c/.test(match[1]) ? 4 : /a[g]c/.test(match[1]) ? 6 : 5;
  const dirs = [
    ...range(taskCount).map(i => `tasks/${match[1]}_${String.fromCharCode(97 + i)}`),
    `standings`, `submissions/me`, `clarifications`,
  ];
  executeInBackground((base, dirs) => {
    dirs.reverse();
    for(const dir of dirs) {
      getActiveTab(tab => browser.tabs.create({
        url: base + `/` + dir,
        index: tab.index + 1,
        active: false,
      }));
    }
  }, [match[0], dirs]);
} else {
  alert(`Invalid AtCoder URL: ${url}`);
}
