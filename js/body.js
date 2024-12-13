function snowfetti(el = document.body, opt_properties) {
  if (!el) {
    console.error("Must have element to populate the confetti!");
    return;
  }
  const defaultProperties = {
    addBlur: true,
    angle: 0,
    beginStart: false,
    drop: 400,
    fadeout: true,
    fixedSize: false,
    flakes: 100,
    scale: 1,
    speed: 5000,
    spread: 400,
    spin: true,
    zSpin: true
  };
  const c = {...defaultProperties, ...opt_properties};
  const randInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const baseEncode = (vall = document.querySelector("#usrInput").value) => {
    let usrVal = vall.replace(/\s\s+/g, ` `);
    let btoa = window.btoa(usrVal);
    let res = encodeURI(vall);
    if (res.indexOf("xmlns=") == -1) res = res.replace(`%3Csvg`, `%3Csvg xmlns=%22http://www.w3.org/2000/svg%22`);
    res = res.replaceAll(`#`, `%23`).replaceAll(`%22`, `'`).replaceAll(`%0A`, ``).replaceAll(`%09`, ``).replaceAll(`%20`, ` `).replace(/\s\s+/g, ` `);
    let baseEncodedSVG = `data:image/svg+xml,${res}`;
    let bgIm = `background-image: url("${baseEncodedSVG}");`;
    return [`data:image/svg+xml;base64,${btoa}`, baseEncodedSVG];
  }
  const oo = randInt(80,100)/100;
  const hh = c.drop;
  const ww = c.spread;
  const randomBlur = () => {
    if (c.addBlur) return randInt(1, 2);
    else return 1;
  };
  const overlayId = `conf${randInt(0, 1000)}etti${randInt(0, 1000)}ver${randInt(0, 1000)}lay`;
  let animatedConfetti = ``;
  // make sure number of flakes is a number
  if (!c.flakes || Number.isNaN(c.flakes * 1)) {
    c.flakes = 100;
  }
  for (let i = 0; i < c.flakes; i++) {
    const conId = `con${randInt(0, 1000)}fet${randInt(0, 1000)}ti${randInt(0, 1000)}`;
    const confettiDur = `${randInt(c.speed / 2, c.speed)}`;
    let confettiSpin = ``;
    let confettiType = ``;
    if (c.spin) {
      confettiSpin = `<animateTransform attributeName="transform" type="rotate" values="0 0 0; ${(Math.random() < 0.5 ? -1 : 1) * 360} 0 0" dur="${randInt(c.speed / 6, c.speed / 2)}ms" begin="-${randInt(100, 5000)}ms" repeatCount="indefinite" additive="sum" />`;
    }
    if (c.zSpin) {
      let xySpin = `-1 1`;
      if (randInt(0, 1) == 0) xySpin = `1 -1`;
      confettiSpin += `<animateTransform attributeName="transform" type="scale" values="1 1; ${xySpin}; 1 1" dur="${randInt(c.speed / 10, c.speed / 2)}ms" repeatCount="indefinite" additive="sum" />`;
    }
    let confettiColor = ``;
    let fixedScale = 1;
    if (!c.fixedSize) {
      fixedScale = randInt(5, 20) / 10;
    }
    let midpoints = randInt(3, 12);
    let snowFlakePath = `M 50 50 v-35`;
    for (let i = 0; i < midpoints; i++) {
      let linelength = randInt(20, 120) / 10;
      let yPos = 50 - randInt(50, 350) / 10;
      let path = `M50 ${yPos}l-${linelength} -${linelength}M50 ${yPos}l${linelength} -${linelength}`;
      snowFlakePath += path;
    }
    let arms = randInt(6, 12);
    let angle = 360 / arms;
    let armCopies = ``;
    let sw = randInt(10, 40) / 10;
    for (let i = 1; i < arms; i++) {
      armCopies += `<g transform="rotate(${angle * i} 50 50)"><path id="${conId + i}" fill="none" stroke="#fff" stroke-width="${sw}" d="${snowFlakePath}" opacity="${oo}"/></g>`;
    }
    let snowflake = `<svg viewBox="0 0 100 100"><g><path id="arm" d="${snowFlakePath}" fill="none" stroke="#fff" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" />${armCopies}</g></svg>`;
    confettiType = `<g transform="scale(${c.scale})" id="${conId}"><image href="${baseEncode(snowflake)[1]}" height="${fixedScale * 20}" width="${fixedScale * 20}" x="${fixedScale * -10}" y="${fixedScale * -10}">${confettiSpin}</image></g>`;


    let topY = (hh * randInt(5, 25)) / 100;
    let startX = (ww * randInt(0, 100)) / 100;
    animatedConfetti += `<g>${confettiType}<animateMotion xlink:href="#${conId}" dur="${confettiDur}ms" begin="${c.beginStart ? 0 : -randInt(0, c.speed)}ms" fill="freeze" repeatCount="indefinite" keyTimes="0;1" keySplines="${randInt(0, 1) / 10} ${randInt(0, 1) / 10} ${randInt(0, 10) / 10} ${randInt(0, 1) / 10}" calcMode="spline" path="M ${startX} ${hh * -0.1} q ${((ww * randInt(10, 40)) / 100) * (Math.random() < 0.5 ? -1 : 1)} ${(hh * randInt(20, 40)) / 100} 0 ${(hh * randInt(40, 60)) / 100} T ${startX} ${hh * 1.1}"></animateMotion></g>`;
  }
  const elemRect = el.getBoundingClientRect();
  const centerY = elemRect.top + (elemRect.bottom - elemRect.top) / 2;
  const centerX = elemRect.left - (elemRect.left - elemRect.right) / 2;
  let fadeAnim = ``;
  if (c.fadeout) fadeAnim = `<animate attributeName="opacity" values="1; 0" dur="${c.speed / 4}ms" begin="${c.speed / 4}ms" repeatCount="none" fill="freeze"/>`;
  const svg = `<svg id="${overlayId}" viewBox="0 0 ${ww} ${hh}" height="${hh}px" width="${ww}px" preserveAspectRatio="none" style="left:${centerX}px; top:${centerY}px; pointer-events: none; position: fixed; transform: translate(-50%,-50%) rotate(${c.angle}deg); user-select: none"><filter id="blur1" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur in="SourceGraphic" stdDeviation="0" /></filter><filter id="blur2" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur in="SourceGraphic" stdDeviation="1" /></filter><g>${animatedConfetti}${fadeAnim}</g></svg>`;
  const wrapper = document.createElement("div");
  wrapper.innerHTML = svg;
  const svgChild = wrapper.firstChild;
  el.appendChild(svgChild);
}


function letItSnow() {
  const randInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  snowfetti(undefined, {
    spread: window.innerWidth,
    flakes: randInt(20, 40),
    speed: randInt(25000, 40000),
    fadeout: false,
    drop: window.innerHeight,
    spin: true
  });
}

letItSnow();

