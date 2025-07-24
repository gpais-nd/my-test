require('@testing-library/jest-dom');
const nodeCrypto = require('crypto');

window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

// This solves crypto.getRandomValues() not supported exception.
// https://stackoverflow.com/questions/52612122/how-to-use-jest-to-test-functions-using-crypto-or-window-mscrypto
window.crypto = {
  getRandomValues: array => {
    return nodeCrypto.randomFillSync(array);
  },
};

global.ResizeObserver = require('resize-observer-polyfill');
