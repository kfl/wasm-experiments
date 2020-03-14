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
let n = 10000;
let xs = myModule.makework(n, 1000);
//observe(xs);
assert.equal(len(xs), n);

console.log("ok");
