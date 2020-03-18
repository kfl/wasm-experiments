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
and `optimized.{wat,wasm}` which is the resulting WebAssembly after
compiling the AssemblyScript.


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

 * `getfield(p: i32, i: i32) : i32` for getting the `i`'th field of
   `p`.

 * `setfield(p: i32, i: i32, x: i32)` for setting the `i`'th field of
   `p` to `x`.

The collector is a *moving* collector, which means that it moves
allocated objects during collection. Thus, it is not safe to have
local variables containing pointers. Instead local variables with
pointers should be stored in a frame on the shadow stack (allocated
with `push_frame`) before allocating (every call to `allocate` might
trigger a collection). Every `push_frame` should have a matching
`pop_frame`; otherwise space is leaked on the shadow stack.

Every field in an allocated object is either a pointer, or an
*unboxed* integer. As all pointers are four byte aligned we a can use
the least significant bit for representing unboxed integers. Thus, we
represent an unboxed integer `n` as `2n+1`.


Alternative design
------------------

Treating every field in an allocated object as a pointer or
an unboxed integer has the disadvantage that we don't have opaque
objects. That is, objects where the collector copy the data, rather
than chasing pointers. Opaque objects are needed for representing boxed
integers and floats, or strings.

To support opaque objects, we can extend `HEADER` with an extra
`tag` field that we can use to specify if an object is opaque or
not. However, currently we use 32 bit for the field `wosize` (size of
the allocated object in words), and no object will ever need all 32
bits, so we could repurpose a couple of bits of `wosize` for the tag.


Issues
------

 * The biggest issues is that `copy` is recursive. Thus, if there is
   a deeply nested data structure on the heap, the collector will
   exhaust the stack.

   This issue can be provoked with `makework` by creating a list with
   100000 elements. Creating the list is not a problem, but when the
   collector kicks in (after a few reversals) the stack is exhausted.

 * The current API for `push_frame` is slightly sub-optimal. When we
   create a new frame all elements are initialised to zero. However,
   most (all?) of the time we overwrite the frame with the actual
   content. A more optimal solution would be to take the initial
   content of the frame as arguments.

 * There is no sanity or error checking. For instance, `allocate`
   assumes that there is enough room on the heap after a collections
   (the right solution would be to grow the heap if needed). Likewise,
   all pointers reachable by the collector is assumed to into the
   heap.

 * There is no support for large objects. Thus, large long-lived
   objects will be copied repeatably by the collector.

 * Memory returned from `allocate` is not initialised, and may contain
   garbage that could confuse the collector. The mutator is expected
   to initialise memory before `allocate` is called again. This is
   inconsistent with `push_frame` and the two functions should be
   streamlined.
