const multiRequest = require('./index')
const {setupServer} = require('msw/node')
const {rest} = require('msw')


describe('multiRequest', () => {

  const server = setupServer()

  beforeAll(() => server.listen({
    onUnhandledRequest: 'warn',
  }))
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())
    

  it('should throw an error if the urls are not provided', () => {
    expect(() => multiRequest()).toThrow('multiRequest urls parameter is required')
  })

  it('should throw an error if the urls argument is not an array', () => {
    expect(() => multiRequest('foo')).toThrow('multiRequest first argument should be an array')
  })

  it('should throw an error if urls argument is an empty array', () => {
    expect(() => multiRequest([])).toThrow('multiRequest urls argument array should contain a list of urls')
  })

  describe('when the requests are successful', () => {
    beforeEach(() => {
      server.use(
        rest.get('/foo', (req, res, ctx) => {
          return res(ctx.json({success: true}), ctx.status(200))
        }),
        rest.get('/bar', (req, res, ctx) => {
          return res(ctx.json({success: true}), ctx.status(200))
        }),
        rest.get('/baz', (req, res, ctx) => {
          return res(ctx.json({success: true}), ctx.status(200))
        })
      )
    })

    it('should return a an array of responses', async () => {
      const urls = ['/foo', '/bar', '/baz']
    
      return multiRequest(urls).then(data => {
        expect(data).toStrictEqual([
          {success: true},
          {success: true},
          {success: true},
        ])
      })
  
    })

    it('should returned array length should match the urls argument', async () => {
      const urls = ['/foo', '/bar', '/baz']
    
      return multiRequest(urls).then(data => {
        expect(data.length).toEqual(3)
      })
    })

  })

  describe('when a response fails', () => {
    beforeEach(() => {
      server.use(
        rest.get('/foo', (req, res, ctx) => {
          return res(ctx.json({error: "foo unavailable"}), ctx.status(500))
        }),
        rest.get('/bar', (req, res, ctx) => {
          return res(ctx.json({success: true}), ctx.status(200))
        }),
        rest.get('/baz', (req, res, ctx) => {
          return res(ctx.json({success: true}), ctx.status(200))
        })
      )
    })

    it('should reject', () => {
      const urls = ['/foo', '/bar', '/baz']
    
      return multiRequest(urls).catch(e => {
        expect(e).toStrictEqual({error: "foo unavailable"})
      })
    })
  })



})