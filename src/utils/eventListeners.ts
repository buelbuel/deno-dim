/**
 * Adds an event listener to an element that will be removed after its first invocation.
 * @param element - The element to add the event listener to.
 * @param event - The event to listen for.
 * @param handler - The event handler function.
 */
export function addEventListenerOnce(
	element: HTMLElement,
	event: string,
	handler: EventListenerOrEventListenerObject,
): void {
	const eventKey = `__${event}_handler__`
	const elementWithHandlers = element as HTMLElement & Record<string, EventListenerOrEventListenerObject>

	if (elementWithHandlers[eventKey]) {
		element.removeEventListener(event, elementWithHandlers[eventKey])
	}

	elementWithHandlers[eventKey] = handler
	element.addEventListener(event, handler)
}

/**
 * Removes an event listener from an element.
 * @param element - The element to remove the event listener from.
 * @param event - The event to stop listening for.
 * @param handler - The event handler function to remove.
 */
export function removeEventListener(
	element: HTMLElement,
	event: string,
	handler: EventListenerOrEventListenerObject,
): void {
	element.removeEventListener(event, handler)
}
