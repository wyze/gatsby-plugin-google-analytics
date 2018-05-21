declare module window {
  export const ga: Function
}

type OnRouteUpdateArgs = Partial<{
  location: {
    [ key: string ]: string,
  },
}>

const onRouteUpdate = ({ location }: OnRouteUpdateArgs = {}) => {
  if ( process.env.NODE_ENV === 'production' && typeof window.ga === 'function' ) {
    const { hash = '', pathname = '', search = '' } = location || {}
    const page = location ? `${pathname}${search}${hash}` : undefined

    window.ga('set', 'page', page)
    window.ga('send', 'pageview')
  }
}

export default onRouteUpdate
