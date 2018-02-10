'use strict';

const selection = window.getSelection();
const urls =
  selection && !selection.isCollapsed ?
    [...selection.getRangeAt(0).cloneContents().querySelectorAll(`a`)].map(a => a.href) :
    data.element.linkHref ? [data.element.linkHref] : [];

if(urls.length < 7 || window.confirm(`Open ${urls.length} tabs?`)) {
  executeInBackground(urls => {
    urls.reverse();
    for(const url of urls) {
      getActiveTab(tab => browser.tabs.create({
        url,
        index: tab.index + 1,
        active: false,
      }));
    }
  }, [urls]);
}
