import type { Subscriber, Unsubscriber, Updater } from 'svelte/store';
export declare function Derived(): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function Prop<T>(options?: {
    default?: T;
}): (target: any, propertyKey: string) => void;
export declare abstract class SvelteStore {
    private readonly state;
    private readonly store;
    constructor();
    set<T extends this>(value: T): void;
    update<T extends this>(updater: Updater<T>): void;
    subscribe<T extends this>(run: Subscriber<T>, invalidate?: () => void): Unsubscriber;
}
