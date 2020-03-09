Testing with the reference interpreter
======================================

Setup
-----

You have some WASM code in [`fact.wat`](fact.wat) that you want to test.

You have installed the [WebAssembly reference
interpreter](https://github.com/WebAssembly/spec/tree/master/interpreter),
and can call it as `wasm` (or `<some_path>/wasm`).


Writting and running tests
--------------------------

I like to write my tests in a separate file WAST, here
[`fact_test.wast`](fact_test.wast), and keep my WAT files in pure WAT
which can then be processed with other tools.

The structure of my WAST scripts is typically to read in the WAT
file(s) under test with the `input` meta command (see the first line
of `fact_test.wast`), and then have a bunch of `assert_return` or
`assert_trap` assertions.

To run the tests use the command:

    $ wasm fact_test.wast

Which will give **no output** if everything goes well. If you would
like to see that the computer is doing something, then you can ask the
interpreter to trace the execution with the `-t` flag:

```
$ wasm -t fact_test.wast
-- Running ("(input \"fact_test.wast\")")...
-- Parsing...
-- Running...
-- Loading (fact_test.wast)...
-- Parsing...
-- Running...
-- Loading (fact.wat)...
-- Parsing...
-- Running...
-- Checking...
-- Initializing...
-- Asserting return...
-- Invoking function "fact"...
```

Using WABT
----------

If you for some reason would like to test with WABT (maybe your
teammates cannot compile the reference interpreter) then you have to
jump through a few hoops.

First, WABT does not understand the `input` meta-command. Fortunately,
the reference interpreter can help you:

    $ wasm wasm fact_test.wast -o fact_test_for_wabt.wast

This will produce the file `fact_test_for_wabt.wast` where `fact.wat`
has been inlined. You can then use the `wast2json` from WABT to
produce the files `fact_test_for_wabt.json` and
`fact_test_for_wabt.0.wasm` (if you have multiple modules in your WAST
then there will be multiple `.wasm` files). Which you can then test
with the `spectest-interp` command:

    $ spectest-interp fact_test_for_wabt.json
    1/1 tests passed.

If you crave more output then use the `-t` flag to trace the execution.
