import { jest } from './package.json'
import 'dotenv/config'

process.env.NODE_ENV = 'TEST'

export default {
  ...jest,
  testTimeout: 60000,
  testEnvironment: 'node',
  testRegex: '.e2e-spec.ts$',
  coverageDirectory: './coverage/e2e',
}
