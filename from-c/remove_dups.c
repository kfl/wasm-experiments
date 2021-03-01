#include<stdbool.h>
#include<stdint.h>
#include<stddef.h>


bool test_appears(int v, int* arr, size_t end) {
  return end > 0 &&
    (v == arr[end - 1] || test_appears(v, arr, end - 1));
}

size_t remove_duplicate (int *arr, int n) {
  size_t res = 0;
  for(int i = 0; i < n; i++) {
    if ( ! test_appears(arr[i], arr, res) ) {
      arr[res] = arr[i];
      res ++;
    }
  }
  return res;
}
