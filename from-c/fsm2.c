/*
Based on FSM from "How (Not) to Code a Finite State Machine" by
Douglas W. Jones (1988)

This is similar to fsm.c, but here we are using labels as first-class
values.
*/

int fsm(const char* input, char* output) {
  const char *front = input;
  char cur;
  void *cont;

  if (!front)
    return 0;

 A:
  cont = &&A_k;
  goto done;
 A_k:
  *(output++) = 'A';
  if (cur == '0') goto B;
  else goto C;

 B:
  cont = &&B_k;
  goto done;
 B_k:
  *(output++) = 'B';
  if (cur == '0') goto B;
  else goto C;

 C:
  cont = &&C_k;
  goto done;
 C_k:
  *(output++) = 'C';
  if (cur == '0') goto D;
  else goto C;

 D:
  cont = &&D_k;
  goto done;
 D_k:
  *(output++) = 'D';
  if (cur == '0') goto A;
  else goto C;

 done:
  cur = (*(front++));
  if (cur == 0) {
    *(output++) = 0;
    return 1;
  } else
    goto *cont;
}
