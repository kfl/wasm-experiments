(module
  (import "shared" "memory" (memory 1))
  (import "shared" "table" (table 1 anyfunc))

  (import "io" "print" (func $print (param i32)))
  (import "module1" "read0" (func $m1_read0 (result i32)))

  (type $void_to_i32 (func (result i32)))

  (func (export "doIt")
     (i32.store (i32.const 0) (i32.const 42))   ;; store 42 at address 0
     (i32.store (i32.const 4) (i32.const 23))   ;; store 23 at address 4

     (call $m1_read0)
     (call $print)

     (call_indirect (type $void_to_i32) (i32.const 0)) ;; indirect call to table[0]
     (call $print))
)
