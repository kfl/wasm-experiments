/*
Based on FSM from "How (Not) to Code a Finite State Machine" by
Douglas W. Jones (1988)
*/

int fsm(const char* input, char* output) {
  const char *front = input;
  char cur;

  if (!front)
    return 0;

 A:                     // We successfully end on zero terminator,
  cur = (*(front++));   // if we are in the A state.
  if (cur == 0) {       // Should this be extended to the other states
    *(output++) = 0;    // as well?
    return 1;
  }
  *(output++) = 'A';
  if (cur == '0') goto B;
  else goto C;

 B:
  *(output++) = 'B';
  if ((*(front++)) == '0') goto B;
  else goto C;

 C:
  *(output++) = 'C';
  if ((*(front++)) == '0') goto D;
  else goto C;

 D:
  *(output++) = 'D';
  if ((*(front++)) == '0') goto A;
  else goto C;
}
