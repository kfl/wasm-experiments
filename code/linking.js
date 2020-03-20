'use strict';
const loader = require("./loader.js");

let shared = {
  memory : new WebAssembly.Memory({ initial: 1 }),
  table : new WebAssembly.Table({ initial: 1, element: "anyfunc" }) // for indirect calls
};

loader.register_js("shared", shared);

let module1 = loader.load_register("module1.wasm", "module1");
let module2 = loader.load_register("module2.wasm", "module2");

loader.call(module2, "doIt", []);
