WebAssembly Experimental Code
=============================

This repository contains some short guides and small snippets of
WebAssembly (WASM) and code interacting with WASM.

The repository started out as a various examples, gists and guides
that I have made either for students or for understanding a specific
aspect of WASM or how to use some tool.

If you find anything confusing, misleading, out of date, or plain
wrong. Please open an issue or make a PR.

The code and guides are currently focused on writing WASM by hand in
the textual format, aka WAT.


Tools and resources
-------------------

The following list is incomplete. I mostly use the following tools:

* The [official WebAssembly webpage](https://webassembly.org/)

* [The reference
  interpreter](https://github.com/WebAssembly/spec/tree/master/interpreter)
  is a fantastic Swiss Army knife for working with WASM. It
  understands both the textual and binary format of WASM and can
  translate between formats, it has an interactive interpreter, and a
  scripting language (WAST) that can be used for testing WASM
  modules.

* [WABT](https://github.com/WebAssembly/wabt) is a suite of standalone
  cli tools for WASM. Easy to install on most platforms.

* [Binaryen](https://github.com/WebAssembly/binaryen) both a suite of
  cli tools, and a compiler and toolchain infrastructure library.


Converting between the textual format and the binary format
-----------------------------------------------------------

The reference interpreter can translate WAT to WASM:

    $ wasm fact.wat -o fact.wasm

or from WASM to WAT ( *be careful you don't overwrite your files* ),
which can be useful if you want to inspect some WASM created by an
other tool or compiler:

    $ wasm fact.wasm -o fact.wat

Or you can use `wat2wasm` and `wasm2wat` from WABT:

    $ wat2wasm fact.wat
    $ wasm2wat fact.wasm
