(module
 (export "fact" (func $fact))

 (func $fact (param $n i32) (result i32)
  (local $result i32)
  (local.set $result (i32.const 1))
  (if
   (local.get $n)
   (then (loop $start
     (local.set $result (i32.mul (local.get $n) (local.get $result)))
     (local.tee $n      (i32.sub (local.get $n) (i32.const 1)))
     (br_if $start))))
  (local.get $result)))
