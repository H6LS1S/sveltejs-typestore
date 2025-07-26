# Svelte5 TypeStore
[![npm](https://img.shields.io/npm/v/sveltejs-typestore)](https://www.npmjs.com/package/sveltejs-typestore)
[![gzip size](https://img.shields.io/bundlephobia/minzip/sveltejs-typestore)](https://bundlephobia.com/package/sveltejs-typestore)

Minimal class-based wrapper over native Svelte stores with decorator support.

- 🪶 Tiny: <500 byte gzipped
- 🧱 Built on: native Svelte Store
- 🧩 Decorators - simple API via @Prop() and @Derived
- 🎯 Typed - full TypeScript support for reactive state & computed values

## Installation

```bash
npm install sveltejs-typestore
```

## Usage

```ts
// src/store.ts
import { SvelteStore, Prop, Derived } from 'sveltejs-typestore';

export class Counter extends SvelteStore {
  @Prop({ default: 0 })
  public count: number;

  @Derived()
  public double(): number {
    return this.count * 2;
  }
}
```

```svelte
<!-- src/App.svelte -->
<script lang=ts>
  import { Counter } from './store.ts';
  const counter = new Counter();
</script>

<p>Count: {$counter.count}</p>
<p>Double: {$counter.double()}</p>

<button onclick={() => counter.update((v) => ({ ...v, count: v.density + 1 }))}>+</button>
<button onclick={() => $counter.count--}>+</button>

<input bind:value={$counter.count} />
```

## License
MIT

---
Inspired by Svelte's Stores and TypeORM.  
Built with ❤️ for cleaner and more scalable store logic.