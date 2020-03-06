(input "fact.wat")
(assert_return (invoke "fact" (i32.const 5)) (i32.const 120))