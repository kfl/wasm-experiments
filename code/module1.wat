(module
  (import "shared" "memory" (memory 1))
  (import "shared" "table" (table 1 anyfunc))
  (elem (i32.const 0) $read1)  ;; set table[0] to read1 for indirect calling

  (func $read1 (result i32)
   i32.const 4
   i32.load)

  (func $read0 (result i32)
   i32.const 0
   i32.load)

  (export "read0" (func $read0))
)
