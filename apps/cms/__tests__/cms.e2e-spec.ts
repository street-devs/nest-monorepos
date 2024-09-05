import { type TestingModule, Test } from '@nestjs/testing'
import { type Response as LightMyRequestResponse } from 'light-my-request'
import { CmsModule } from '../src/cms.module'
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify'

describe('CmsController (e2e)', () => {
  let app: NestFastifyApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CmsModule],
    }).compile()

    app = moduleFixture.createNestApplication(new FastifyAdapter())

    await app.init()
  })

  it('/ (GET)', () => {
    return app
      .inject({
        method: 'GET',
        url: '/',
      })
      .then((response: LightMyRequestResponse) => {
        expect(response.payload).toEqual('Hello World!')
      })
  })

  it('/health (GET)', () => {
    return app
      .inject({
        method: 'GET',
        url: '/health',
      })
      .then((response: LightMyRequestResponse) => {
        expect(JSON.parse(response.payload)).toMatchObject({
          status: 'OK',
        })
      })
  })
})
