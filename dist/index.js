import { writable, derived } from 'svelte/store';
const DERIVED_KEY = Symbol('svelte-store-derived');
export function Derived() {
    return function (target, propertyKey, descriptor) {
        if (!target.constructor[DERIVED_KEY])
            target.constructor[DERIVED_KEY] = {};
        target.constructor[DERIVED_KEY][propertyKey] = descriptor.value;
    };
}
const PROP_KEY = Symbol('svelte-store-props');
export function Prop(options) {
    return function (target, propertyKey) {
        if (!target.constructor[PROP_KEY])
            target.constructor[PROP_KEY] = {};
        target.constructor[PROP_KEY][propertyKey] = options?.default ?? undefined;
    };
}
export class SvelteStore {
    constructor() {
        const props = this.constructor[PROP_KEY] ?? [];
        const getters = this.constructor[DERIVED_KEY] ?? {};
        this.state = writable(props);
        this.store = derived(this.state, (state) => ({ ...state, ...getters }));
    }
    set(value) {
        this.state.set(value);
    }
    update(updater) {
        this.state.update(updater);
    }
    subscribe(run, invalidate) {
        return this.store.subscribe(run, invalidate);
    }
}
