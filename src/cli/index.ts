import type { DefineSchema, Schemas, UserSchemaTypes } from '../schema'
import type { GqfPackage } from '../utils/package'
import { $enum, gqf, gqp } from '../core'

export { sync, type Output } from './sync'
export type { Config, ClientConfig, SchemaConfig } from './config'

export type LoadFromUrl<T extends string> =
  T extends keyof Schemas
    ? Schemas[T] extends UserSchemaTypes | DefineSchema<any>
      ? Schemas[T]
      : undefined
    : undefined

export function useSchema<T extends string>(
  _url?: T,
): GqfPackage<LoadFromUrl<T>> {
  return { gqf, gqp, $enum } as any
}
export type { GqfPackage }
