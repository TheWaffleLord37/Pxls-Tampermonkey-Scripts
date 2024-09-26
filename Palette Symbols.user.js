// ==UserScript==
// @name         Palette Symbols
// @namespace    http://notkaz.com/
// @version      1.0
// @description  Adds symbols to the palette for QOL
// @author       Kaz
// @match        https://pxls.space/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pxls.space
// @grant        GM_addStyle
// ==/UserScript==

const map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefgh";
let symbolEntry = false;
let symbolPalette = false;

function togglePaletteStyle(symbolStyle) {
  const buttons = document.getElementsByClassName("palette-button");

  Array.from(buttons).forEach((button) => {
    const paletteColors = button.querySelector(
      ".palette-color:not(#palette-symbols)"
    );
    const paletteSymbols = button.querySelector("#palette-symbols");

    if (!paletteColors || !paletteSymbols) return;

    if (symbolStyle) {
      paletteColors.style.display = "none";
      paletteSymbols.style.display = "flex";
    } else {
      paletteColors.style.display = "flex";
      paletteSymbols.style.display = "none";
    }
  });
}

function createSymbolPalette() {
  const squares = document.getElementsByClassName("palette-color");
  Array.from(squares).forEach((item, i) => {
    const parent = item.parentElement;

    const squareWidth = item.offsetWidth;
    const squareHeight = item.offsetHeight;

    const div = document.createElement("div");
    div.className = "palette-color";
    div.id = "palette-symbols";

    div.style.width = squareWidth + "px";
    div.style.height = squareHeight + "px";
    div.style.display = "none";
    div.style.justifyContent = "center";
    div.style.alignItems = "center";

    const h3 = document.createElement("h3");
    h3.className = "palette-symbol";
    h3.innerHTML = map[i - 1];
    h3.style.color = item.style.backgroundColor;
    h3.style.fontFamily = "PxlsSymbols";
    h3.style.margin = 0;
    h3.style.width = "100%";
    h3.style.height = "100%";

    h3.style.display = "flex";
    h3.style.justifyContent = "center";
    h3.style.alignItems = "center";
    h3.style.fontSize = "calc(1em + 2vw)";

    div.append(h3);

    if (item.childElementCount > 0) {
      const numbers = item.childNodes[0].cloneNode(true);
      div.append(numbers);
    }

    parent.append(div);
  });
}

function removeSymbols() {
  const numbers = document.getElementsByClassName("palette-number");
  Array.from(numbers).forEach((elem, index) => {
    elem.style.fontFamily = "unset";
    elem.style.fontSize = ".75rem";
    if (map.indexOf(elem.innerText) !== -1) {
      elem.innerText = map.indexOf(elem.innerText);
    }
  });
}

function replaceNumbers() {
  const numbers = document.getElementsByClassName("palette-number");
  Array.from(numbers).forEach((elem, index) => {
    elem.style.fontFamily = "PxlsSymbols";
    elem.innerText = map[parseInt(elem.innerText)];
    elem.style.fontSize = "1.5em";
  });
}

function handlePaletteToggle(checked) {
  if (checked) {
    if (document.getElementsByClassName("palette-symbol").length === 0) {
      createSymbolPalette();
    }
    togglePaletteStyle(true);
  } else {
    togglePaletteStyle(false);
  }

  localStorage.setItem("k-symbol-palette", checked.toString());
}

function replacePaletteSetting() {
  const div = document.createElement("div");
  const label = document.createElement("label");
  const input = document.createElement("input");
  const whitespace = document.createTextNode("\u00A0");
  const span = document.createElement("span");

  div.setAttribute("data-keywords", "indexed colors; palette indices");
  label.className = "input-group";
  input.id = "setting-ui-palette-as-symbols";
  input.type = "checkbox";
  span.className = "label-text";
  span.innerText = "Replace the palette squares for symbols";

  input.checked = symbolPalette;

  handlePaletteToggle(symbolPalette);
  input.onchange = () => handlePaletteToggle(input.checked);

  label.append(input);
  label.append(whitespace);
  label.append(span);

  div.append(label);

  return div;
}

function handleEntryToggle(checked) {
  if (checked) {
    replaceNumbers();
  } else {
    removeSymbols();
  }

  localStorage.setItem("k-symbol-entry", checked.toString());
}

function replaceNumbersSetting(paletteEntrySetting) {
  const div = document.createElement("div");
  const label = document.createElement("label");
  const input = document.createElement("input");
  const whitespace = document.createTextNode("\u00A0");
  const span = document.createElement("span");

  div.setAttribute("data-keywords", "indexed colors; palette indices");
  div.className = "fake-indent";
  label.className = "input-group";
  input.id = "setting-ui-palette-symbols-enable";
  input.type = "checkbox";
  span.className = "label-text";
  span.innerText = "Replace the numbers for symbols";

  input.checked = symbolEntry;

  handleEntryToggle(symbolEntry);

  if (paletteEntrySetting.checked) {
    input.disabled = false;
  } else {
    input.disabled = true;
  }

  paletteEntrySetting.onchange = () => {
    input.disabled = !input.disabled;
  };

  input.onchange = () => handleEntryToggle(input.checked);

  label.append(input);
  label.append(whitespace);
  label.append(span);

  div.append(label);

  return div;
}

function createSettings() {
  const settings = document.querySelector('article[data-id="ui"');
  const paletteSetting = settings.querySelector(
    'div[data-keywords="indexed colors;palette indicies"]'
  );
  const paletteInput = paletteSetting.querySelector("label > input");

  const numSetting = replaceNumbersSetting(paletteInput);
  const palSetting = replacePaletteSetting();

  paletteSetting.insertAdjacentElement("afterend", numSetting);
  numSetting.insertAdjacentElement("afterend", palSetting);
}

function loadSettings() {
  symbolEntry = localStorage.getItem("k-symbol-entry") === "true";
  symbolPalette = localStorage.getItem("k-symbol-palette") === "true";
}

function waitForPalette(interv) {
  const palette = document.getElementById("palette");
  if (palette) {
    createSettings();
    clearInterval(interv);
  }
}

(function () {
  "use strict";

  const fontUrl = "https://www.evilneuro.com/PxlsSymbols.ttf";

  GM_addStyle(`
        @font-face {
            font-family: 'PxlsSymbols';
            src: url('${fontUrl}') format('truetype');
        }
    `);

  loadSettings();
  const interv = setInterval(() => {
    waitForPalette(interv);
  }, 500);
})();
