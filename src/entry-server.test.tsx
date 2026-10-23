// @vitest-environment node
// Checks the build-time render (what Google receives) without a browser.
import { render } from './entry-server'
import site from './site.config.json'

test('pre-rendered page contains its content and SEO tags', async () => {
  const { html, head } = await render('/carousels')

  expect(html).toContain('selectCarouselType')          // real page content, not the loading spinner
  expect(html).not.toMatch(/page not found/i)
  expect(head).toContain('<title data-rh="true">Carousels | ')
  expect(head).toContain(`href="${site.siteUrl}/carousels/"`) // canonical
  expect(head).toContain('property="og:title"')
})

test('unknown URL renders the not-found page with noindex', async () => {
  const { html, head } = await render('/__page-not-found__')

  expect(html).toMatch(/page not found/i)
  expect(head).toContain('noindex')
})
