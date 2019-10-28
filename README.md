# create-json-stream

```ts
import { createJsonStream } from 'create-json-stream';

// Stream emits geojson features 1 by 1
const stream = createJsonStream(
    'tools/food-dominance.geojson',
    {
        path: 'features',
        depth: 2
    }, { encoding: null }
)
```