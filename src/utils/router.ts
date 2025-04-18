import { i18n } from './i18n.ts'

/**
 * Type definition for the route configuration
 */
export interface RouteConfig {
	component: () => Promise<{ default: new () => HTMLElement }>
	layout: string
	titleKey?: string
	descriptionKey?: string
}

/**
 * Type definition for the routes object
 */
export interface Routes {
	[path: string]: RouteConfig
}

/**
 * Type definition for the navigate event detail
 */
export interface NavigateEventDetail {
	path: string
}

/**
 * Type for the custom navigate event
 */
interface NavigateEvent extends CustomEvent<NavigateEventDetail> {}

/**
 * Type for the global space with added APP_TITLE
 */
interface GlobalWithAppTitle {
	APP_TITLE?: string
	addEventListener(type: string, listener: EventListenerOrEventListenerObject): void
	history: History
	location: Location
	customElements: CustomElementRegistry
}

/**
 * The main application container element.
 */
const app = document.querySelector('#app') as HTMLElement

/**
 * Reference to global object with the right type
 */
const global = globalThis as unknown as GlobalWithAppTitle

/**
 * Initializes the router of the application.
 *
 * @param routes - The routes configuration object.
 * @listens globalThis#navigate
 * @listens globalThis#popstate
 */
export function initRouter(routes: Routes): void {
	global.addEventListener(
		'navigate',
		((event: Event) => {
			const customEvent = event as NavigateEvent
			const { path } = customEvent.detail
			navigate(path, routes)
		}) as EventListener,
	)

	global.addEventListener('popstate', () => {
		renderContent(global.location.pathname, routes)
	})

	renderContent(global.location.pathname, routes)
}

/**
 * Renders the content of the application based on the current route.
 * @param route - The current route path.
 * @param routes - The routes configuration object.
 * @throws {Error} Throws an error if the module fails to load.
 */
async function renderContent(route: string, routes: Routes): Promise<void> {
	const routeInfo = routes[route]

	if (routeInfo) {
		try {
			const module = await routeInfo.component()
			const Component = module.default
			const layoutTemplate = document.getElementById(routeInfo.layout) as HTMLTemplateElement | null

			if (Component && Component.prototype instanceof HTMLElement && layoutTemplate) {
				const layoutContent = layoutTemplate.content.cloneNode(true)
				const componentInstance = new Component()

				app.innerHTML = ''
				app.appendChild(layoutContent)
				const appContent = app.querySelector('#app-content')
				if (appContent) {
					appContent.appendChild(componentInstance)
				}
				app.className = routeInfo.layout

				const title = i18n.t(routeInfo.titleKey || componentInstance.constructor.name)
				const description = i18n.t(routeInfo.descriptionKey || '')

				setTitle(title)
				setDescription(description)
			} else {
				console.error('Invalid component or layout:', Component, layoutTemplate)
				app.innerHTML = i18n.t('error_invalid_component_or_layout')
				setTitle(i18n.t('error'))
				setDescription(i18n.t('error_invalid_component_or_layout'))
			}
		} catch (error) {
			console.error('Error loading module:', error)
			app.innerHTML = i18n.t('error_loading_page')
			setTitle(i18n.t('error'))
			setDescription(i18n.t('error_loading_page'))
		}
	} else {
		app.innerHTML = i18n.t('page_not_found')
		setTitle(i18n.t('page_not_found'))
		setDescription(i18n.t('page_not_found_description'))
	}
}

/**
 * Navigates to the specified path and updates the browser history.
 * @param path - The path to navigate to.
 * @param routes - The routes configuration object.
 */
function navigate(path: string, routes: Routes): void {
	global.history.pushState({}, '', path)
	renderContent(path, routes)
}

/**
 * Sets the title of the page.
 * @param pageTitle - The title of the page.
 */
function setTitle(pageTitle: string): void {
	const baseTitle = global.APP_TITLE || ''
	document.title = `${pageTitle} | ${baseTitle}`
}

/**
 * Sets the description of the page.
 * @param description - The description of the page.
 * @returns The meta description element.
 */
function setDescription(description: string): HTMLMetaElement {
	let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement | null

	if (metaDescription) {
		metaDescription.setAttribute('content', description)
	} else {
		metaDescription = document.createElement('meta')
		metaDescription.name = 'description'
		metaDescription.content = description
		document.head.appendChild(metaDescription)
	}

	return metaDescription
}
