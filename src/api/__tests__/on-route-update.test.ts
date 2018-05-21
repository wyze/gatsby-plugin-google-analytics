import onRouteUpdate from '../on-route-update'

declare module window {
  export let ga: jest.Mock<Function>
}

describe('onRouteUpdate', () => {
  it('calls ga function with new page', () => {
    process.env.NODE_ENV = 'production'
    window.ga = jest.fn()

    const location = { hash: '', pathname: '/about', search: '' }
    const actual = onRouteUpdate({ location })

    expect(window.ga).toHaveBeenCalled()
    expect(window.ga.mock.calls[0]).toMatchSnapshot('setting the page')
    expect(window.ga.mock.calls[1]).toMatchSnapshot('sending the pageview')

    process.env.NODE_ENV = 'test'
  })

  it('handles when location is not supplied', () => {
    process.env.NODE_ENV = 'production'
    window.ga = jest.fn()

    // const location = { hash: '', pathname: '/about', search: '' }
    const actual = onRouteUpdate()

    expect(window.ga).toHaveBeenCalled()
    expect(window.ga.mock.calls[0]).toMatchSnapshot('setting the page')
    expect(window.ga.mock.calls[1]).toMatchSnapshot('sending the pageview')

    process.env.NODE_ENV = 'test'
  })

  it('does nothing when not in production', () => {
    window.ga = jest.fn()

    const location = { hash: '', pathname: '/about', search: '' }
    const actual = onRouteUpdate({ location })

    expect(window.ga).not.toHaveBeenCalled()
  })
})
