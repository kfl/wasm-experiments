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
