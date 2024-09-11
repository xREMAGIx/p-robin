type GetElementType<T extends any[]> = T extends (infer U)[] ? U : never; // Get type of array items
type NonNullable<T> = {
  [P in keyof T]-?: Exclude<T[P], null | undefined>;
}; // Remove null and undefined from T;
