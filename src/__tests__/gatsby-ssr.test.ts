import * as gatsbySsr from '../gatsby-ssr'

describe('gatsby-ssr', () => {
  it('exports functions', () => {
    expect(gatsbySsr).toEqual({
      __esModule: true,
      onRenderBody: expect.any(Function),
    })
  })
})
