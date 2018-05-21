import onRenderBody from '../on-render-body'

const createOptions = ({
  anonymize = true,
  gaPlugins = undefined,
  respectDNT = true,
  trackingId = '1',
} = {}) => ({
  anonymize,
  gaPlugins,
  respectDNT,
  trackingId,
})

describe('onRenderBody', () => {
  it('adds the google analytic scripts', () => {
    process.env.NODE_ENV = 'production'

    const setPostBodyComponents = jest.fn()
    const options = createOptions()
    const actual = onRenderBody({ setPostBodyComponents }, options)

    process.env.NODE_ENV = 'test'

    expect(setPostBodyComponents).toHaveBeenCalled()
    expect(setPostBodyComponents.mock.calls[0]).toMatchSnapshot()
  })

  it('adds the google analytic scripts with plugins', () => {
    process.env.NODE_ENV = 'production'

    const setPostBodyComponents = jest.fn()
    const gaPlugins = {
      config: [ 'eventTracker' ],
      sources: [ 'js/autotrack.custom.js' ],
    }
    const options = createOptions({ gaPlugins })
    const actual = onRenderBody({ setPostBodyComponents }, options)

    process.env.NODE_ENV = 'test'

    expect(setPostBodyComponents).toHaveBeenCalled()
    expect(setPostBodyComponents.mock.calls[0]).toMatchSnapshot()
  })

  it('adds the google analytic scripts with plugins and plugin options', () => {
    process.env.NODE_ENV = 'production'

    const setPostBodyComponents = jest.fn()
    const gaPlugins = {
      config: [
        {
          name: 'eventTracker',
          options: {
            events: [ 'click' ],
            hitFilter: [
              '@@/ga-function',
              [ 'model', 'element', 'event', `model.set('eventAction', event.type, true)` ],
            ],
          },
        },
      ],
      sources: [ 'js/autotrack.custom.js' ],
    }
    const options = createOptions({ gaPlugins })
    const actual = onRenderBody({ setPostBodyComponents }, options)

    process.env.NODE_ENV = 'test'

    expect(setPostBodyComponents).toHaveBeenCalled()
    expect(setPostBodyComponents.mock.calls[0]).toMatchSnapshot()
  })

  it('adds the google analytic scripts without anonymize', () => {
    process.env.NODE_ENV = 'production'

    const setPostBodyComponents = jest.fn()
    const options = createOptions({ anonymize: false })
    const actual = onRenderBody({ setPostBodyComponents }, options)

    process.env.NODE_ENV = 'test'

    expect(setPostBodyComponents).toHaveBeenCalled()
    expect(setPostBodyComponents.mock.calls[0]).toMatchSnapshot()
  })

  it('adds the google analytic scripts without respectDNT', () => {
    process.env.NODE_ENV = 'production'

    const setPostBodyComponents = jest.fn()
    const options = createOptions({ respectDNT: false })
    const actual = onRenderBody({ setPostBodyComponents }, options)

    process.env.NODE_ENV = 'test'

    expect(setPostBodyComponents).toHaveBeenCalled()
    expect(setPostBodyComponents.mock.calls[0]).toMatchSnapshot()
  })

  it('returns null if not in production', () => {
    const options = createOptions()
    const actual = onRenderBody({} as any, options as any)

    expect(actual).toBe(null)
  })

  describe('validate', () => {
    it('throws an error if no options supplied', () => {
      const actual = () => onRenderBody({} as any)

      expect(actual).toThrow('Must supply `trackingId` option as a string.')
    })

    it('throws an error if missing a trackingId', () => {
      const options = createOptions({ trackingId: null })
      const actual = () => onRenderBody({} as any, options)

      expect(actual).toThrow('Must supply `trackingId` option as a string.')
    })

    it('throws an error if anonymize is not a boolean', () => {
      const options = createOptions({ anonymize: null })
      const actual = () => onRenderBody({} as any, options)

      expect(actual).toThrow('Must supply `anonymize` option as a boolean.')
    })

    it('throws an error if gaPlugins is not an object', () => {
      const options = createOptions({ gaPlugins: null })
      const actual = () => onRenderBody({} as any, options)

      expect(actual).toThrow('Must supply `gaPlugins` option as an object.')
    })

    it('throws an error if gaPlugins.sources is not supplied', () => {
      const gaPlugins = {}
      const options = createOptions({ gaPlugins })
      const actual = () => onRenderBody({} as any, options)

      expect(actual).toThrow('Must supply `gaPlugins.sources` option with atleast one source.')
    })

    it('throws an error if gaPlugins.config is not supplied', () => {
      const gaPlugins = { sources: [ '' ] }
      const options = createOptions({ gaPlugins })
      const actual = () => onRenderBody({} as any, options)

      expect(actual).toThrow('Must supply `gaPlugins.config` option with atleast one config item.')
    })

    it('throws an error if gaPlugins.config[0] is not an object or string', () => {
      const gaPlugins = { config: [ null ], sources: [ '' ] }
      const options = createOptions({ gaPlugins })
      const actual = () => onRenderBody({} as any, options)

      expect(actual).toThrow('Must supply `gaPlugins.config[0]` option as a string.')
    })

    it('throws an error if gaPlugins.config[0].name is not supplied', () => {
      const gaPlugins = { config: [ {} ], sources: [ '' ] }
      const options = createOptions({ gaPlugins })
      const actual = () => onRenderBody({} as any, options)

      expect(actual).toThrow('Must supply `gaPlugins.config[0].name` option as a string.')
    })

    it('throws an error if gaPlugins.config[0].options is not supplied', () => {
      const gaPlugins = { config: [ { name: ' ' } ], sources: [ '' ] }
      const options = createOptions({ gaPlugins })
      const actual = () => onRenderBody({} as any, options)

      expect(actual).toThrow('Must supply `gaPlugins.config[0].options` option as an object.')
    })

    it('throws an error if respectDNT is not a boolean', () => {
      const options = createOptions({ respectDNT: null })
      const actual = () => onRenderBody({} as any, options)

      expect(actual).toThrow('Must supply `respectDNT` option as a boolean.')
    })
  })
})
