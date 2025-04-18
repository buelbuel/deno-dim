# dim for Deno

[![jsr.io](https://jsr.io/badges/@buelbuel/dim)](https://jsr.io/@buelbuel/dim)
![GitHub License](https://img.shields.io/github/license/buelbuel/dim)

dim is an idiomatic web component helper library, designed as a sane alternative to the node madness of today's web. It focuses on simplicity and adherence to web standards only, offering quality-of-life features - but with zero dependencies.

This is the Deno version of dim, with full TypeScript support and JSR compatibility. Unlike the JavaScript version, it requires no build steps and leverages Deno's modern module system.

## Features

- Zero dependencies
- Web standards-based
- TypeScript-first
- Deno-native with no build steps
- Modular: use only what you need
- Abstracted HTML and Shadow Element components for less boilerplate
- Utility functions for HTML templating and styling
- Reactivity
- i18n
- Simple built-in router (optional - works well with Oak, Hono, or other Deno routers)

## Installation

### Using JSR (recommended)

```ts
import * as dim from 'jsr:@buelbuel/dim'
```

### Using deno.land

```ts
import * as dim from 'https://deno.land/x/dim/mod.ts'
```

### Using a CDN in a browser

```html
<script type="module">
	import * as dim from 'https://cdn.jsdelivr.net/gh/buelbuel/deno-dim@latest/mod.ts'
	window.dim = dim
</script>
```

## Usage

### BaseElement

```ts
import { BaseElement, html } from '@buelbuel/dim'

class MyComponent extends BaseElement {
	render(): string {
		return html`<div>My Component</div>`
	}
}

export default MyComponent.define('my-component')
```

### ShadowElement

```ts
import { html, ShadowElement } from '@buelbuel/dim'

class MyShadowComponent extends ShadowElement {
	render(): string {
		return html`<div>My Shadow DOM Component</div>`
	}
}

export default MyShadowComponent.define('my-shadow-component')
```

### HTML and Style Utilities

```ts
import { html, type StyleMap, styleMap } from '@buelbuel/dim'

const styles: StyleMap = {
	color: 'red',
	fontSize: '16px',
}

const template = html`<div style="${styleMap(styles)}">Styled content</div>`
```

### Reactive Properties

```ts
import { BaseElement, html } from '@buelbuel/dim'

class MyComponent extends BaseElement {
	constructor() {
		super()
		this.defineReactiveProperty('count', 0)
	}

	render(): string {
		return html`
      <div>My Component</div>
      <button id="increment">Increment ${this.count}</button>
    `
	}

	addEventListeners(): void {
		this.addEventListenerWithCleanup('#increment', 'click', () => {
			this.count++
		})
	}
}
```

### Router (Optional)

dim includes a simple client-side router, but you can also use it with Deno's excellent router solutions like Oak or Hono for more advanced use cases.

If you want to use the built-in router:

```ts
import { initRouter } from '@buelbuel/dim'

const routes = {
	'/': { component: () => import('./pages/Home.ts'), layout: 'default-layout' },
	'/about': { component: () => import('./pages/About.ts'), layout: 'default-layout' },
}

initRouter(routes)
```

Or integrate with a Deno server router like Oak:

```ts
import { Application } from 'https://deno.land/x/oak/mod.ts'
import { BaseElement, html } from '@buelbuel/dim'

// Use dim for components
class MyComponent extends BaseElement {
	render(): string {
		return html`<div>My Server-rendered Component</div>`
	}
}

// Use Oak for routing
const app = new Application()
app.use((ctx) => {
	ctx.response.body = `
    <!DOCTYPE html>
    <html>
      <body>
        <my-component></my-component>
        <script type="module">
          import { MyComponent } from './components.js';
          MyComponent.define('my-component');
        </script>
      </body>
    </html>
  `
})

await app.listen({ port: 8000 })
```

### Internationalization

```ts
import { i18n, t } from '@buelbuel/dim'

i18n.addTranslations('en', {
	hello: {
		world: 'World',
	},
})

const greeting = html`<p>${t('hello.world')}</p>`
```

## Development

To contribute to this project:

```bash
# Run tests
deno test

# Type check
deno check mod.ts

# Format code
deno fmt
```

No build step is required! With Deno, you can directly run and deploy your TypeScript code.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
