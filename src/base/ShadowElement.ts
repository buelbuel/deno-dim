import { BaseElement } from './BaseElement.ts'

/**
 * ShadowElement is the base class for elements with shadow DOM.
 * @extends BaseElement
 */
export class ShadowElement extends BaseElement {
	/**
	 * The shadow root or fallback to the element itself.
	 * @private
	 */
	private _shadowEl: ShadowRoot | Element

	/** Creates an instance of ShadowElement and attaches a shadow root. */
	constructor() {
		super()
		this._shadowEl = this.attachShadow?.({ mode: 'open' }) ?? this

		if (this._shadowEl instanceof ShadowRoot === false) {
			console.warn('ShadowDOM is not supported in this environment. Falling back to light DOM.')
		}
	}

	/**
	 * Gets the shadow root or the element itself if Shadow DOM is not supported.
	 */
	getShadowEl(): ShadowRoot | Element {
		return this._shadowEl
	}

	/**
	 * Updates the element's shadow DOM content.
	 * @override
	 */
	override update(): void {
		this._shadowEl.innerHTML = this.render()
	}

	/**
	 * Renders the element's shadow DOM content.
	 * @returns The HTML content to be rendered in the shadow DOM.
	 * @override
	 */
	override render(): string {
		return ''
	}
}
