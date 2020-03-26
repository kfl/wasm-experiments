const assert = require("assert");
const myModule = require("..");

function len(xs) {
  let n = 0;
  while( xs != 0 ) {
    xs = myModule.getfield(xs, 1);
    n += 1;
  }
  return n;
}

function observe(xs) {
  while( xs != 0 ) {
    console.log(myModule.getfield(xs, 0));
    xs = myModule.getfield(xs, 1);
  }
}

myModule.init_memory(1);
let elems = 10000;
let n = 2000;
console.log(`Create a list with ${elems} elements and reverse it ${n} times`);
console.time("makework");
let xs = myModule.makework(elems, n);
console.timeEnd("makework");
//observe(xs);
assert.equal(len(xs), elems);

console.log("ok");
