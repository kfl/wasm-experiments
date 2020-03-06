(module $simpleallocate
  (global $ALIGN_MASK i32 (i32.const 7))
  (global $MAX_SIZE_32 i32 (i32.const 1073741824))
  (global $PAGE_SIZE i32 (i32.const 65536))
  (global $next_free (mut i32) (i32.const 0))

  (func $bytes_to_pages (param $n i32) (result i32)
    (i32.add (i32.div_u (local.get $n)
                        (global.get $PAGE_SIZE))
             (i32.const 1)))

  ;; Add $ptr and $n 8 byte aligned
  (func $next_aligned (param $ptr i32) (param $n i32) (result i32)
    ;; we assume that $n is larger than 1
    (i32.add
       (i32.add (local.get $ptr)
                (local.get $n))
       (global.get $ALIGN_MASK))

    (i32.xor (global.get $ALIGN_MASK)
             (i32.const -1))

    i32.and)

  (memory $memory (export "memory") 0)

  ;; Export allocate
  ;; allocte n bytes, 8 byte aligned
  (func $allocate (export "allocate") (param $n i32) (result i32)
    (local $ptr i32) (local $new_next i32) (local $current_pages i32) (local $pages_needed i32)

    ;; fail if we try to allocate more than 1GB
    (if (i32.gt_u (local.get $n)
                  (global.get $MAX_SIZE_32))
        (then unreachable))

    (local.set $ptr           (global.get $next_free))
    (local.set $new_next      (call $next_aligned (local.get $ptr) (local.get $n)))
    (local.set $current_pages (i32.shl (memory.size) (i32.const 16)))

    ;; Do we need to grow memory
    (if (i32.gt_u (local.get $new_next)
                  (local.get $current_pages))
      (then
         (local.set $pages_needed (call $bytes_to_pages (local.get $new_next)))
         (if (i32.lt_s (memory.grow (local.get $pages_needed))
                       (i32.const 0))
               (then unreachable))))

    (global.set $next_free (local.get $new_next))
    (local.get $ptr)
  )
)