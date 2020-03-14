Experiments with AssemblyScript
================================

Implementation of a simple copying garbage collector in
[AssemblyScript](https://docs.assemblyscript.org).


Build
-----

To build the entry file to WebAssembly, run:

    $ npm run asbuild


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
