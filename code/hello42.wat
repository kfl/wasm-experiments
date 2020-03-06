;; file hello42.wat
(module
  (import "host" "print" (func $pri (param i32)))
  (func $awesome
    i32.const 42
    call $pri)
  (export "awesomefun" (func $awesome))

)

;; assemble binary Wasm file
;; wat2wasm hello42.wat

;; run binary (imported function host.print is provided by the interpreter)
;; wasm-interp --host-print --run-all-exports hello42.wasm
