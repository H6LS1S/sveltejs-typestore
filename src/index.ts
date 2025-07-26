import type { Subscriber, Unsubscriber, Updater, Writable, Readable } from 'svelte/store';
import { writable, derived } from 'svelte/store';

/**
 * Symbol used to store metadata about derived properties
 */
const DERIVED_KEY = Symbol('svelte-store-derived');

/**
 * Decorator for defining derived (computed) properties.
 * @constructor
 */
export function Derived() {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		if (!target.constructor[DERIVED_KEY]) target.constructor[DERIVED_KEY] = {};
		target.constructor[DERIVED_KEY][propertyKey] = descriptor.value!;
	};
}

/**
 * Symbol used to store metadata about default props
 */
const PROP_KEY = Symbol('svelte-store-props');

/**
 * Decorator for defining a reactive property with options.
 * @param options
 * @constructor
 */
export function Prop<T>(options?: { default?: T }) {
	return function (target: any, propertyKey: string) {
		if (!target.constructor[PROP_KEY]) target.constructor[PROP_KEY] = {};
		target.constructor[PROP_KEY][propertyKey] = options?.default ?? undefined;
	};
}

/**
 * Base class for building reactive stores with support for:
 * - Decorated properties with default values (@Prop)
 * - Derived/computed values (@Derived)
 */
export abstract class SvelteStore {
	/**
	 * Internal writable store that holds the base state defined by @Prop decorators.
	 * Used for setting and updating values internally.
	 * @private
	 */
	private readonly state: Writable<any>;

	/**
	 * Public readable store that merges base state and computed @Derived values.
	 * Exposed via `.subscribe()` for external components to react to changes.
	 * @private
	 */
	private readonly store: Readable<any>;

	/**
	 *
	 */
	constructor() {
		const props = (this.constructor as any)[PROP_KEY] ?? [];
		const getters = (this.constructor as any)[DERIVED_KEY] ?? {};

		this.state = writable(props);
		this.store = derived(this.state, (state) => ({ ...state, ...getters }));
	}

	/**
	 * Set value and inform subscribers.
	 * @param value to set
	 */
	public set<T extends this>(value: T): void {
		this.state.set(value);
	}

	/**
	 * Update value using callback and inform subscribers.
	 * @param updater callback
	 */
	public update<T extends this>(updater: Updater<T>): void {
		this.state.update(updater);
	}

	/**
	 * Subscribe on value changes.
	 * @param run subscription callback
	 * @param invalidate cleanup callback
	 */
	public subscribe<T extends this>(run: Subscriber<T>, invalidate?: () => void): Unsubscriber {
		return this.store.subscribe(run, invalidate);
	}
}
