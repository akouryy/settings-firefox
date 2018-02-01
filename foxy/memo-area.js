'use strict';

const range = n => [...Array(n).keys()];

const div = document.createElement(`div`);
document.body.appendChild(div);
div.style.zIndex = 10000;
div.style.position = `fixed`;
div.style.bottom = 0;
div.style.left = `50%`;
div.style.width = `50%`;

const readCpp = document.createElement(`button`);
div.appendChild(readCpp);
readCpp.innerText = `read C++ code`;
readCpp.accessKey = `R`;
readCpp.style.display = `block`;

const textarea = document.createElement(`textarea`);
div.appendChild(textarea);
textarea.className = `foxy-memo-area`;
textarea.style.fontFamily = `"Source Code Pro", monospace`;
textarea.rows = 10;
textarea.cols = 80;
textarea.focus();

const hide = _ => {
  setTimeout(() => document.body.removeChild(div), 100);
};

const idre = `[A-Z][a-z_]*`;
const re = new RegExp(`
    (${idre}|\\b\\d+)\\( 
  | (-)?(${idre}) | '(${idre}) | "(${idre}) | (-)?\\.(${idre})
  | (\\))
`.replace(/#.*\n|\s+/g, ``), `g`);
const cinRe = /cin>>([\w[\]>>]+);cin>>([\w[\]>>]+);/g;
const defTypeRe = /(\w+)\s+([\w\s,]+);\s*\1\s+([\w\s,]+);/;

const readCppFn = _ => {
  const indexes = n => range(n).map(i => `[Ri_${i}]`).join(``);
  const typ = (baseType, d) =>
    (`vec<`.repeat(d) + baseType + `>`.repeat(d))
      .replace(/vec<(bool|char|int|double|string)>/g, (_, t) => `V` + t[0].toUpperCase())
      .replace(/vec<V([A-Z])>/g, `W$1`);

  try {
    let beforeCode = ``;
    const num = 3, flt = 7, chr = 4, str = 5, bopen = 1, bclose = 8, ndec = 2, fdec = 6;
    const dims = new Map();
    const reps = [], resizes = [], codes = [``];
    let d = 0;
    let match;
    while((match = re.exec(textarea.value))) {
      let m;
      if((m = match[num] || match[chr] || match[str] || match[flt])) {
        const fixedSize = d > 0 && reps.every(r => !dims.get(r));
        const baseType =
          match[num] ? `int` : match[chr] ? `char` : match[str] ? `string` : `double`;

        dims.set(m, d);
        const m_wi = m + indexes(d);
        codes[d] += `cin>>${m_wi};`;
        if(match[ndec] || match[fdec]) codes[d] += `--${m_wi};`;

        if(fixedSize) {
          codes[0] += `${typ(baseType, d)} ${m}(`;
          for(const e of range(d - 1)) codes[0] += `${reps[e]},${typ(baseType, d - 1 - e)}(`;
          codes[0] += reps[d - 1] + `)`.repeat(d) + `;`;
        } else {
          beforeCode += `${typ(baseType, d)} ${m};`;
          for(const vs of resizes) vs.push(m);
        }
      } else if((m = match[bopen])) {
        reps.push(m); resizes.push([]); codes.push(``);
        ++d;
      } else if(match[bclose]) {
        --d;
        const rep = reps.pop(), vs = resizes.pop(), c = codes.pop();
        const rep_wi = rep + indexes(dims.get(rep) || 0);
        for(const v of vs) {
          codes[d] += `${v}${indexes(d)}.resize(${rep_wi});`;
        }
        codes[d] += `times(${rep_wi},Ri_${d}){${c}}`;
      }
    }

    {
      let c = beforeCode + codes[0];
      if(0) {
        while(cinRe.test(c)) c = c.replace(cinRe, `cin>>$1>>$2;`);
        while(defTypeRe.test(c)) c = c.replace(defTypeRe, `$1 $2,$3;`);
      }
      c = c.replace(/.{80}(?=[;(){}[\] ])|.{1,79}[;(){}[\] ]/g, `$&\n`);
      textarea.value =
        `// ${textarea.value}\n/* <foxy.memo-area> */\n${c.trim()}\n/* </foxy.memo-area> */`;
    }

    textarea.select();
    document.execCommand(`copy`);
    hide();
  } catch(e) {
    console.error(e);
    alert(`an error occurred`);
  }
};

textarea.addEventListener(`keypress`, e => {
  if(e.keyCode === 13 && e.metaKey) {
    readCppFn();
  }
});

readCpp.addEventListener(`click`, readCppFn);
document.addEventListener(`copy`, hide);
document.addEventListener(`cut`, hide);
