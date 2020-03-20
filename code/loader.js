'use strict';
// A simple loader for WASM modules, with some utility functions
// (inspired by/stolen from the reference interpreter) for linking
// modules together.

const fs = require('fs');

// The initial environment. Useful for binding JS functions that you
// want to call from WASM, or for declaring shared globals
let env = {
  print_i32: console.log.bind(console),
  // shared_global_i32: 42,
};

// A global registry for WASM modules
let handler = {
  get(target, prop) {
    return (prop in target) ?  target[prop] : {};
  }
};
let registry = new Proxy({env}, handler);

function register(name, instance) {
  registry[name] = instance.exports;
}
function register_js(name, mod) {
  registry[name] = mod;
}

// load a module from a file, Node specific as we use the fs module
function load_module(filename, imports = registry) {
  let bytes = fs.readFileSync(filename);
  let module = new WebAssembly.Module(bytes);
  let instance = new WebAssembly.Instance(module, imports);
  return instance;
}

function load_register(filename, name) {
  let instance = load_module(filename);
  register(name, instance);
  return instance;
}

function call(instance, name, args) {
  return instance.exports[name](...args);
}

function get(instance, name) {
  let v = instance.exports[name];
  return (v instanceof WebAssembly.Global) ? v.value : v;
}

function exports(name, instance) {
  return {[name]: instance.exports};
}

module.exports = {
  register: register,
  register_js: register_js,
  load_module: load_module,
  load_register: load_register,
  call: call,
  get: get,
  exports: exports,
};
