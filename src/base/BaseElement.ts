import { defineReactiveProperty, type Updatable } from '../utils/reactive.ts'
import { t } from '../utils/i18n.ts'

/**
 * Interface for the event listener entry
 */
interface EventListenerEntry {
	element: Element
	event: string
	handler: EventListenerOrEventListenerObject
}

/**
 * BaseElement is a base class for custom elements that provides reactive properties and lifecycle methods.
 * @extends HTMLElement
 */
export class BaseElement extends HTMLElement implements Updatable {
	/**
	 * Add index signature to allow dynamic properties
	 */
	[key: string]: unknown

	/**
	 * Flag to track if an update has been requested
	 * @private
	 */
	private _updateRequested: boolean = false

	/**
	 * Array to track event listeners for cleanup
	 * @private
	 */
	private _eventListeners: EventListenerEntry[] = []

	/** Creates an instance of BaseElement. */
	constructor() {
		super()
	}

	/** Invoked when the element is added to the DOM. */
	connectedCallback(): void {
		this.update()
		this.addEventListeners()
		document.addEventListener('language-changed', () => this.update())
	}

	/** Invoked when the element is removed from the DOM. */
	disconnectedCallback(): void {
		this.removeEventListeners()
	}

	/** Updates the element's content. */
	update(): void {
		const oldContent = this.innerHTML
		const newContent = this.render()

		if (oldContent !== newContent) {
			this.innerHTML = newContent
			this.addEventListeners()
		}
	}

	/** Requests an update to be performed on the next animation frame. */
	requestUpdate(): void {
		if (!this._updateRequested) {
			this._updateRequested = true
			Promise.resolve().then(() => {
				this._updateRequested = false
				this.update()
			})
		}
	}

	/**
	 * Defines a reactive property on the element.
	 * @param propertyKey - The name of the property.
	 * @param initialValue - The initial value of the property.
	 */
	defineReactiveProperty<T>(propertyKey: string, initialValue: T): void {
		defineReactiveProperty(this, propertyKey, initialValue)
	}

	/**
	 * Adds an event listener with cleanup.
	 * @param selector - The CSS selector for the target element.
	 * @param event - The name of the event.
	 * @param handler - The event handler function.
	 */
	addEventListenerWithCleanup(selector: string, event: string, handler: EventListenerOrEventListenerObject): void {
		const element = this.querySelector(selector)
		if (element) {
			const existingListener = this._eventListeners.find(
				(listener) => listener.element === element && listener.event === event,
			)

			if (existingListener) {
				element.removeEventListener(event, existingListener.handler)
				this._eventListeners = this._eventListeners.filter((listener) => listener !== existingListener)
			}

			element.addEventListener(event, handler)
			this._eventListeners.push({ element, event, handler })
		}
	}

	/** Adds event listeners to the element. Override in subclasses. */
	addEventListeners(): void {}

	/** Removes all event listeners from the element. */
	removeEventListeners(): void {
		this._eventListeners.forEach(({ element, event, handler }) => {
			element.removeEventListener(event, handler)
		})
		this._eventListeners = []
	}

	/**
	 * Translates a key to the current language.
	 * @param key - The translation key.
	 * @returns The translated string.
	 */
	t(key: string): string {
		return t(key)
	}

	/**
	 * Renders the element's content.
	 * @returns The HTML content to be rendered.
	 */
	render(): string {
		return ''
	}

	/**
	 * Defines the custom element.
	 * @param name - The name for the custom element.
	 * @returns The class constructor.
	 */
	static define(name: string): typeof BaseElement {
		customElements.define(name, this)
		return this
	}
}
