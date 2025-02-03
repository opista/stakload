export const assertNever = (value: never) => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};
