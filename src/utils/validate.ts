type Plugin = {
  name: string,
  options: object,
}

type Options = Partial<{
  anonymize: boolean,
  gaPlugins: {
    config: Array<string | Plugin>,
    sources: string[]
  },
  respectDNT: boolean,
  trackingId: string,
}>

const isObject = <T>( value: any ): value is T =>
  typeof value === 'object'
    && Array.isArray(value) === false
    && value !== null
    // && Object.keys(value).length > 0

const isString = <T>( value: T ) =>
  typeof value === 'string' && value.length > 0

const validate = ({ anonymize, gaPlugins, respectDNT, trackingId }: Options) => {
  if ( typeof anonymize !== 'boolean' ) {
    return new Error('Must supply `anonymize` option as a boolean.')
  }

  if ( isObject(gaPlugins) ) {
    const { config, sources } = gaPlugins

    if ( !(Array.isArray(sources) && sources.length > 0) ) {
      return new Error('Must supply `gaPlugins.sources` option with atleast one source.')
    }

    if ( !(Array.isArray(config) && config.length > 0) ) {
      return new Error('Must supply `gaPlugins.config` option with atleast one config item.')
    }

    const configs = config
      .map(( item, index ) => {
        if ( isObject<Plugin>(item) ) {
          if ( !isString(item.name) ) {
            return new Error(`Must supply \`gaPlugins.config[${index}].name\` option as a string.`)
          }

          if ( !isObject(item.options) ) {
            return new Error(`Must supply \`gaPlugins.config[${index}].options\` option as an object.`)
          }
        }

        if ( !isString(item) && !isObject(item) ) {
          return new Error(`Must supply \`gaPlugins.config[${index}]\` option as a string.`)
        }
      })
      .filter(( item ) => item instanceof Error)

    if ( typeof configs[0] !== 'undefined' ) {
      return configs[0]
    }
  } else if ( typeof gaPlugins !== 'undefined' ) {
    return new Error('Must supply `gaPlugins` option as an object.')
  }

  if ( typeof respectDNT !== 'boolean' ) {
    return new Error('Must supply `respectDNT` option as a boolean.')
  }

  if ( !isString(trackingId) ) {
    return new Error('Must supply `trackingId` option as a string.')
  }
}

export { Options }
export default validate
