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
