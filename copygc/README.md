Experiments with AssemblyScript
================================

Implementation of a simple copying garbage collector in
[AssemblyScript](https://docs.assemblyscript.org).


Build and run tests
-------------------

To compile the AssemblyScript to WebAssembly, run:

    $ npm run asbuild

To run the tests:

    $ npm test


Files of interest
-----------------

 * `assembly/copygc.ts` contains the implementation of a simple
   semi-space copying garbage collector.

 * `assembly/smoketest.ts` contains a few functions that exercise the
   GC API. The function `makework(m, n)` will create a list
   (represented with pairs) with `m` elements and then reverse it `n`
   times (creating a fresh copy each time).

 * `test/index.ts` calls `makework` and check that we get the expected
   result.

The directory `build` will contain the files `untouched.{wat,wasm}`
and `optimized.{wat,wasm}` which is the resulting WebAssembly.


API
---

The public API consists of the functions:

 * `init_memory(init_in_mb: i32)` for initialising the internal
   bookkeeping, argument is the size of the heap in MB.

 * `allocate(n: i32): i32` for allocating `n` bytes on the
   heap. Returns a pointer to the allocated block.

 * `push_frame(n: i32): i32` pushes a frame of `n` words on the
   shadow stack, returns a pointer to the first word of the frame.

 * `pop_frame(n: i32)` pops a frame of `n` words from the shadow
   stack. Push and pop should match in their arguments.
