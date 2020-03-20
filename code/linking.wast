;; The environment with a utility function for printing
(module $env
  (import "spectest" "print_i32" (func $f (param i32)))
  (func (export "print_i32") (param i32) (call $f (local.get 0)))
)
(register "env" $env)

;; Declaring a module with just the shared memory and function table
(module $shared
  (memory (export "memory") 1 500)
  (table (export "table") 10 funcref)
)
(register "shared" $shared)

;; Load module1 and register it.
(input $module1 "module1.wat")
(register "module1" $module1)

;; Load module2 and register it.
(input $module2 "module2.wat")
(register "module2" $module2)

;; Call the function doIt
(invoke $module2 "doIt")
