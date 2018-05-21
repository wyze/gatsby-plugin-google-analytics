import * as React from 'react'
import stringify from '../utils/stringify'
import validate, { Options } from '../utils/validate'

const Script = ({ source }: { source: string }) => (
  <script async src={source} />
)

const onRenderBody = (
  { setPostBodyComponents },
  { anonymize = true, gaPlugins, respectDNT = true, trackingId }: Options = {}
) => {
  const error = validate({ anonymize, gaPlugins, respectDNT, trackingId })

  if ( error ) {
    throw error
  }

  if ( process.env.NODE_ENV !== 'production' ) {
    return null
  }

  const getName = ( config ) =>
    typeof config === 'string' ? config : config.name

  const getOptions = ( config ) =>
    typeof config === 'string'
      ? ''
      : `,${stringify(config.options)}`

  const pluginRequires = gaPlugins && gaPlugins.config
    .map(( config ) => `ga('require','${getName(config)}'${getOptions(config)});`)
    .join('')

  const pluginScripts = gaPlugins && gaPlugins.sources
    .map(( source ) => <Script source={source} />)

  const __html = `
window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
ga('create','${trackingId}','auto');
${pluginRequires || ''}
${respectDNT ? "ga('require','dnt');" : ''}
${anonymize ? "ga('set','anonymizeIp',1);" : ''}
`.replace(/\n/g, '')

  const scripts = [
    <script dangerouslySetInnerHTML={{ __html }}></script>,
    <Script source="//www.google-analytics.com/analytics.js" />,
    respectDNT && <Script source="//storage.googleapis.com/outfox/dnt_min.js" />,
    ...(pluginScripts || []),
  ]

  setPostBodyComponents(scripts)
}

export default onRenderBody
