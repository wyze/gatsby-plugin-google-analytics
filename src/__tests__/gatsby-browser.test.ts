import * as gatsbyBrowser from '../gatsby-browser'

describe('gatsby-browser', () => {
  it('exports functions', () => {
    expect(gatsbyBrowser).toEqual({
      __esModule: true,
      onRouteUpdate: expect.any(Function),
    })
  })
})
