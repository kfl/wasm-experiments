import { allocate, push_frame, pop_frame, getfield, setfield } from "./copygc";

// ---- API smoke tests ----

@inline
function cons(x: u32, tail: u32): u32 {
  let local = push_frame(1);
  setfield(local, 0, tail);
  let cell = allocate(2 * sizeof<u32>());
  setfield(cell, 0, x)
  setfield(cell, 1, getfield(local, 0));
  pop_frame(1);
  return cell;
}

export function iota(n: i32): u32 {
  let local = push_frame(1);
  setfield(local, 0, 0); // empty list
  let i = n;
  while( i --> 0 ) {
    let cell = cons(u32(2*i + 1), getfield(local, 0));
    setfield(local, 0, cell);
  }
  local = getfield(local, 0);
  pop_frame(1);
  return local;
}

export function reverse_iter(xs: u32): u32 {
  let local = push_frame(2);
  setfield(local, 0, xs);
  setfield(local, 1, 0);
  while( getfield(local, 0) != 0 ) {
    xs = getfield(local, 0);
    let cell = cons(getfield(xs, 0), getfield(local, 1));
    xs = getfield(local, 0);
    setfield(local, 0, getfield(xs, 1));
    setfield(local, 1, cell);
  }
  local = getfield(local, 1);
  pop_frame(2);
  return local;
}

export function makework(elems: i32, reverses: i32): u32 {
  let local = push_frame(1);
  setfield(local, 0, iota(elems));
  for(let i = 0; i < reverses; i++) {
    setfield(local, 0, reverse_iter(getfield(local, 0)));
  }
  local = getfield(local, 0);
  pop_frame(1);
  return local;
}
