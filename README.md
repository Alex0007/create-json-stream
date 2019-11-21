# create-json-stream [![npm](https://img.shields.io/npm/v/create-json-stream)](https://www.npmjs.com/package/create-json-stream) ![](https://img.shields.io/david/alex0007/create-json-stream) [![](https://travis-ci.org/Alex0007/create-json-stream.svg?branch=master)](https://travis-ci.org/Alex0007/create-json-stream)


Wrapper around [indutny/json-depth-stream](https://github.com/indutny/json-depth-stream) for easier access to emitted JSON items. Not so low-level / no need to read data by offsets.


## Example

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
