/**
 * Type definition for style object
 */
export type StyleMap = {
	[key: string]: string | number
}

/**
 * A tagged template literal function for creating HTML templates.
 * @param strings - The static parts of the template.
 * @param values - The dynamic values to be interpolated into the template.
 * @returns The final HTML string with interpolated values.
 * @example
 * const name = 'World'
 * const greeting = html`<h1>Hello, ${name}!</h1>`
 * // Returns: "<h1>Hello, World!</h1>"
 */
export const html = (strings: TemplateStringsArray, ...values: unknown[]): string => {
	return strings.reduce((result, string, i) => {
		const value = values[i - 1]
		return result + (value !== undefined ? String(value) : '') + string
	})
}

/**
 * Converts a JavaScript object of styles into a CSS string.
 * @param styles - An object where keys are CSS property names and values are CSS values.
 * @returns A semicolon-separated string of CSS property-value pairs.
 * @example
 * const styles = { color: 'red', fontSize: '14px' }
 * const cssString = styleMap(styles)
 * // Returns: "color: red; fontSize: 14px"
 */
export const styleMap = (styles: StyleMap): string => {
	return Object.entries(styles)
		.map(([key, value]) => `${key}: ${value}`)
		.join('; ')
}
