export type getInstanceOf<T extends new() => object> = T extends new() => infer R ? R : never;
export const isInstanceOf = <T extends new() => object>(Class: T, a: object): a is getInstanceOf<T> => a instanceof Class;
