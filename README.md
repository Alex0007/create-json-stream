# create-json-stream

Wrapper around [indutny/json-depth-stream](https://github.com/indutny/json-depth-stream) for easier access to emitted JSON items. Not so low-level / no need to read data by offsets.

```ts
import { createJsonStream } from "create-json-stream";

// Stream emits geojson features 1 by 1
const stream = createJsonStream(
    "food-dominance.geojson",
    {
        path: ["features"],
        depth: 2
    },
    { encoding: null }
);
```
