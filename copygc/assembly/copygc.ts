
const PAGE_SIZE: u32 = 65536;
const MEBIBYTE: u32 = 1024 * 1024;

const ALIGN_SIZE: u32 = 4;
const ALIGN_MASK: u32 = ALIGN_SIZE-1;


let HEAP_SIZE: u32    = 0;
let HALF_SIZE: u32    = 0;
let shadow_stack: u32 = 0;
let shadow_top: u32   = 0;
let to_space: u32     = 0;
let from_space: u32   = 0;
let next_free: u32    = 0;
let new_free: u32     = 0;

// Something allocated always starts with a header
// We'll manage these headers ourself
@unmanaged class HEADER {
  forward: u32;
  wosize: u32; // word size
}

const WORD_SIZE: u32 = sizeof<u32>();
const HEADER_SIZE: u32 = (offsetof<HEADER>() + ALIGN_MASK) & ~ALIGN_MASK;

export function init_memory(init_in_mb: u32): void {
  if (init_in_mb > 0) {
    memory.grow( (init_in_mb+1) * (MEBIBYTE / PAGE_SIZE) + 1 );
    HEAP_SIZE = init_in_mb * MEBIBYTE;
    HALF_SIZE = HEAP_SIZE / 2;
    shadow_stack = 1 * MEBIBYTE;
    shadow_top   = shadow_stack;
    from_space     = shadow_stack + 1 * WORD_SIZE;
    to_space       = to_space + HALF_SIZE;
    next_free      = from_space;
  }
}

@inline function is_unboxed(x: u32) : bool {
  return (((x) & 1) == 1);
}
@inline function is_block(x: u32) : bool {
  return (((x) & 1) == 0);
}
@inline function header_of(ptr: u32) : HEADER {
  return changetype<HEADER>(ptr - HEADER_SIZE);
}

export function allocate(n: u32): u32 {
  let aligned_size = max<u32>((n + ALIGN_MASK) & ~ALIGN_MASK, ALIGN_SIZE);
  maybe_garbage_collect(aligned_size + HEADER_SIZE);
  let ptr = next_free + HEADER_SIZE;
  let header = header_of(ptr);
  header.forward = 0;
  header.wosize = aligned_size / WORD_SIZE;
  next_free = ptr + aligned_size;
  return ptr;
}

function maybe_garbage_collect(room_for: u32): void {
  if ( next_free + room_for < to_space + HALF_SIZE ) { return; }

  new_free = to_space;
  scan_shadow_stack();
  let tmp = from_space;
  from_space = to_space;
  to_space = tmp;
  next_free = new_free;
}

function fresh_alloc(n: u32): u32 {
  let ptr = new_free + HEADER_SIZE;
  new_free += HEADER_SIZE + n;
  return ptr;
}


function scan_shadow_stack(): void {
  for (let i: u32 = shadow_stack; i > shadow_top; i -= WORD_SIZE) {
    let x = load<u32>(i);
    store<u32>(i, copy(x));
  }
}

function copy(p: u32): u32 {
  if ( is_unboxed(p) || p == 0 ) {
    return p;
  } else {
    let header = header_of(p);
    if (header.forward == 0) {
      let q = fresh_alloc(header.wosize * WORD_SIZE);
      header.forward = q;
      let hq = header_of(q);
      for(let i: u32 = 0; i < header.wosize * WORD_SIZE; i += WORD_SIZE) {
        let x = load<u32>(p+i);
        if ( is_unboxed(x) ) {
          store<u32>(q+i, x);  // q[i] = x
        } else {
          store<u32>(q+i, copy(x));
        }
        hq.forward = 0;
        hq.wosize = header.wosize;
      }
    }
    return header.forward;
  }
}

export function push_frame(n: u32): u32 {
  shadow_top -= n * WORD_SIZE;
  return shadow_top;
}

export function pop_frame(n: u32): void {
  shadow_top += n * WORD_SIZE;
}
