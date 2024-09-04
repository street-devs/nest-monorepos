import * as dotenv from 'dotenv'
import * as dotenvExpand from 'dotenv-expand'
import { logger } from './logger'

export function loadEnv(paths: string[]): void {
  logger.info(`Loading environment variables from ${paths.join(', ')}`)
  dotenvExpand.expand(dotenv.config({ path: paths }))
}

export function envRequired(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Environment variable ${name} is required`)
  }
  return value
}

export function envOptional(defaultValue: string, name: string): string {
  return process.env[name] ?? defaultValue
}

export function envNumberRequired(name: string): number {
  const value = envRequired(name)
  const number = Number(value)
  if (isNaN(number)) {
    throw new Error(`Environment variable ${name} is not a number`)
  }
  return number
}

export function envNumberOptional(defaultValue: number, name: string): number {
  const value = envOptional(defaultValue.toString(), name)
  const number = Number(value)
  if (isNaN(number)) {
    return defaultValue
  }
  return number
}

export function envBooleanRequired(name: string): boolean {
  const value = envRequired(name)
  if (value === 'true') {
    return true
  } else if (value === 'false') {
    return false
  }
  throw new Error(`Environment variable ${name} is not a boolean`)
}
export function envBooleanOptional(
  defaultValue: boolean,
  name: string
): boolean {
  const value = envOptional(defaultValue.toString(), name)
  if (value === 'true') {
    return true
  } else if (value === 'false') {
    return false
  }
  return defaultValue
}
export function envListRequired(name: string): string[] {
  const value = envRequired(name)
  return value.split(',')
}

export function envListOptional(
  defaultValue: string[],
  name: string
): string[] {
  const value = envOptional(defaultValue.join(','), name)
  return value.split(',')
}

export function envUnionRequired<T extends string>(
  union: readonly T[],
  name: string
): T {
  const value = envRequired(name)
  if (!union.includes(value as T)) {
    throw new Error(
      `Environment variable ${name} is not one of ${union.join(', ')}`
    )
  }
  return value as T
}

export function envUnionOptional<T extends string>(
  union: readonly T[],
  defaultValue: T,
  name: string
): T {
  const value = envOptional(defaultValue, name)
  if (!union.includes(value as T)) {
    return defaultValue
  }
  return value as T
}
