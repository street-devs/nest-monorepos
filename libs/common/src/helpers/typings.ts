export type Nullable<T> = T | null | undefined

export type NullablePartial<T> = Nullable<Partial<T>>

export type CheckNullable<
  AllowNullable extends boolean,
  T,
> = AllowNullable extends true ? Nullable<T> : T

export type ExistOrUndefined<T> = T | undefined

export type UnknownRecord<
  V = unknown,
  K extends string | number | symbol = string,
> = Record<K, V>
