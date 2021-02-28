/*
Based on FSM from "How (Not) to Code a Finite State Machine" by
Douglas W. Jones (1988)
*/

int fsm(const char* input) {
  const char *front = input;
  char cur;

  if (!front)
    return 0;

 A:
  cur = (*(front++));
  if (cur == '0') goto B;
  else if (cur == '1') return 1;
  else goto C;

 B:
  if ((*(front++)) == '0') goto B;
  else goto C;

 C:
  if ((*(front++)) == '0') goto D;
  else goto C;

 D:
  if ((*(front++)) == '0') goto A;
  else goto C;
}
