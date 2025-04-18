import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts'
import { html, styleMap } from '../src/utils/html.ts'
import { i18n, t } from '../src/utils/i18n.ts'

Deno.test('html template literal function works correctly', () => {
	const name = 'World'
	const result = html`<h1>Hello, ${name}!</h1>`
	assertEquals(result, '<h1>Hello, World!</h1>')
})

Deno.test('styleMap generates correct CSS string', () => {
	const styles = {
		color: 'red',
		fontSize: '16px',
	}
	const result = styleMap(styles)
	assertEquals(result, 'color: red; fontSize: 16px')
})

Deno.test('i18n translation functionality', () => {
	i18n.addTranslations('en', {
		test: {
			hello: 'Hello',
			world: 'World',
		},
	})

	const hello = t('test.hello')
	assertEquals(hello, 'Hello')

	const world = t('test.world')
	assertEquals(world, 'World')

	const missing = t('test.missing')
	assertEquals(missing, 'test.missing')
})

if (typeof globalThis.document === 'undefined') {
	globalThis.customElements = {
		define: () => {},
	} as unknown as typeof customElements

	globalThis.HTMLElement = class HTMLElement {} as unknown as typeof HTMLElement
}
