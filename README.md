# create-json-stream

```ts
// Stream emits geojson features items 1 by 1
const stream = await createJsonStream(
    'tools/food-dominance.geojson',
    {
        path: 'features',
        depth: 2
    }, { encoding: null }
)
```