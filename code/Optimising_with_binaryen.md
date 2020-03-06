Optimising with Binaryen
========================

The cli tool `wasm-opt` from the Binaryen toolchain can
optimise WASM code.


Even/Odd example
----------------

For example, given a file, `evenodd.wat`, with the following module
with two mutually recursive functions:

```wat
(module $evenodd
  (func $even (export "even") (param $n i32) (result i32)
        (if (result i32) (i32.eqz (local.get $n))
          (then (i32.const 1))
          (else (call $odd (i32.sub (local.get $n) (i32.const 1))))))

  (func $odd (param $n i32) (result i32)
        (if (result i32) (i32.eqz (local.get $n))
          (then (i32.const 0))
          (else (call $even (i32.sub (local.get $n) (i32.const 1))))))
)
```

Note that only `even` is exported.

We can now compile this to WASM and optimise it with `wasm-opt`:

    $ wasm evenodd.wat -o evenodd.wasm
    $ wasm-opt -O4 evenodd.wasm -o evenodd.wasm

After optimisation, we get the following code (slightly cleaned up for
easier comparison with the original module):

```wat
(module
  (func $even (param $n i32) (result i32)
    (if (result i32)
      (local.get $n)
      (then
        (if (result i32)
          (local.tee $n (i32.sub (local.get $n) (i32.const 1)))
          (then (call $even (i32.sub (local.get $n) (i32.const 1))))
          (else
            (i32.const 0))))
      (else
        (i32.const 1))))
  (export "even" (func $even)))
```

Where we can see that the original call to `odd` has been inlined.



Simple allocate example
-----------------------

Having easy access to an optimiser is convenient when writing WAT by
hand. Because it allows us to use abstractions such as named variables
and functions without worrying too much about performance degradation.

For instance, consider this following module, `simpleallocate.wat`,
that implements a simple `allocate` function for allocation `n` bytes
in linear memory, with the extra requirement that the returned
"pointer" should be 8 byte aligned:

```wat
(module $simpleallocate
  (global $ALIGN_MASK i32 (i32.const 7))
  (global $MAX_SIZE_32 i32 (i32.const 1073741824))
  (global $PAGE_SIZE i32 (i32.const 65536))
  (global $next_free (mut i32) (i32.const 0))

  (func $bytes_to_pages (param $n i32) (result i32)
    (i32.add (i32.div_u (local.get $n)
                        (global.get $PAGE_SIZE))
             (i32.const 1)))

  ;; Add $ptr and $n 8 byte aligned
  (func $next_aligned (param $ptr i32) (param $n i32) (result i32)
    ;; we assume that $n is larger than 1
    (i32.add
       (i32.add (local.get $ptr)
                (local.get $n))
       (global.get $ALIGN_MASK))

    (i32.xor (global.get $ALIGN_MASK)
             (i32.const -1))

    i32.and)

  (memory $memory (export "memory") 0)

  ;; Export allocate
  ;; allocte n bytes, 8 byte aligned
  (func $allocate (export "allocate") (param $n i32) (result i32)
    (local $ptr i32) (local $new_next i32)
    (local $current_pages i32) (local $pages_needed i32)

    ;; fail if we try to allocate more than 1GB
    (if (i32.gt_u (local.get $n)
                  (global.get $MAX_SIZE_32))
        (then unreachable))

    (local.set $ptr           (global.get $next_free))
    (local.set $new_next      (call $next_aligned (local.get $ptr) (local.get $n)))
    (local.set $current_pages (i32.shl (memory.size) (i32.const 16)))

    ;; Do we need to grow memory
    (if (i32.gt_u (local.get $new_next)
                  (local.get $current_pages))
      (then
         (local.set $pages_needed (call $bytes_to_pages (local.get $new_next)))
         (if (i32.lt_s (memory.grow (local.get $pages_needed))
                       (i32.const 0))
               (then unreachable))))

    (global.set $next_free (local.get $new_next))
    (local.get $ptr)
  )
)
```

Here we use a number of global constants, for example `$MAX_SIZE_32`,
and a couple of helper functions, `$bytes_to_pages` and
`$next_aligned`.

After optimising with `wasm-opt` we get the following code:

```wat
(module
  (type $i32_=>_i32 (func (param i32) (result i32)))
  (memory $memory 0)
  (global $next_free (mut i32) (i32.const 0))
  (export "memory" (memory $0))
  (export "allocate" (func $allocate))
  (func $allocate (param $n i32) (result i32)
    (local $ptr i32)
    (if
      (i32.gt_u
        (local.get $n)
        (i32.const 1073741824))
      (then
        (unreachable)))
    (if
      (i32.gt_u
        (local.tee $n
          (i32.and
            (i32.add
              (i32.add
                (local.tee $ptr
                  (global.get $next_free))
                (local.get $n))
              (i32.const 7))
            (i32.const -8)))
        (i32.shl
          (memory.size)
          (i32.const 16)))
      (then
        (if
          (i32.lt_s
            (memory.grow
              (i32.add
                (i32.div_u
                  (local.get $n)
                  (i32.const 65536))
                (i32.const 1)))
            (i32.const 0))
          (then
            (unreachable)))))
    (global.set $next_free
      (local.get $n))
    (local.get $ptr))
)
```

Here we see that the two helper functions have been inlined and
eliminated, and so have all the global constants. Furthermore, instead
of four locals we only have one, `$ptr`.
