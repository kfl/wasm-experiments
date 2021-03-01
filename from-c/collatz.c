#include<stdint.h>

uint32_t collatz(uint32_t n) {
  // Collatz' theorem is strictly speaking not defined for 0. However,
  // if we leave this clause out, then LLVM optimises the entire
  // function to `return 1`
  if (n == 0) return 0;
  if (n == 1) return 1;
  if (n % 2 == 0) {
    return collatz(n / 2);
  } else {
    return collatz(3 * n + 1);
  }
}
