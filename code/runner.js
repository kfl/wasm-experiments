'use strict';

// To be used with node.js as we read files via the fs module
const fs = require('fs');

async function main() {

  // functions to be exposed from Javascript to WASM
  let reg = {
    env: {
      print_i32: console.log
    },
    shared: {
      memory : new WebAssembly.Memory({ initial: 1 }),
      table : new WebAssembly.Table({ initial: 1, element: "anyfunc" }) // for indirect calls
    }
  };

  // load module1
  let wasm1 = fs.readFileSync("module1.wasm");
  let module1 = (await WebAssembly.instantiate(wasm1, reg)).instance;

  // add the exports from module1 to the environment
  reg["module1"] = module1.exports;


  // // load module2
  let wasm2 = fs.readFileSync("module2.wasm");
  let module2 = (await WebAssembly.instantiate(wasm2, reg)).instance;

  // call doIt from module2
  module2.exports.doIt();
}

main();
