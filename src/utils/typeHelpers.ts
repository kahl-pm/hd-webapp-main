/*
  AtLeast: Make some properties of an object required
  Usage: AtLeast<{a: string, b: string}, 'a'> = {a: string, b?: string}
  Usage: AtLeast<{a: string, b: string, c: number}, 'a' | 'b'> = {a: string, b: string, c?: number}
*/
export type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;
/*
  Omit: Remove some properties of an object
  Usage: Omit<{a: string, b: string}, 'a'> = {b: string}
  Usage: Omit<{a: string, b: string, c: number}, 'a' | 'b'> = {c: number}
*/
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/*
  AtLeastOne: Make at least one property of an object must be present
  Usage: AtLeastOne<{a: string, b: string}> = {a: string, b?: string} | {a?: string, b: string}
  Usage: AtLeastOne<{a: string, b: string, c: number}> =
    {a: string, b?: string, c?: number} |
    {a?: string, b: string, c?: number} |
    {a?: string, b?: string, c: number}
*/
export type AtLeastOne<T, U = {[K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U];

/**
 * Get the subset of U that is assignable to T
 * Usage: Subset<{a: string, b: string}, {a: string}> = {a: string}
 */
export type Subset<T extends U, U> = U;
