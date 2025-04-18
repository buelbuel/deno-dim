/**
 * Interface for objects that can be updated
 */
export interface Updatable {
	requestUpdate(): void
}

/**
 * A generic type for any object that can have properties
 */
export type AnyObject = Record<string, unknown>

/**
 * Defines a reactive property on a target object.
 * @param target - The target object on which to define the reactive property.
 * @param propertyKey - The name of the property to be defined.
 * @param initialValue - The initial value of the property.
 */
export function defineReactiveProperty<T>(target: Updatable & AnyObject, propertyKey: string, initialValue: T): void {
	let value = initialValue

	Object.defineProperty(target, propertyKey, {
		get(): T {
			return value
		},
		set(newValue: T): void {
			value = newValue
			target.requestUpdate()
		},
		configurable: true,
		enumerable: true,
	})
}
