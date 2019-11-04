const path = require("path");
const { createJsonStream } = require("../dist");

const sampleObjPath = path.resolve(__dirname, "sample-object.json");
const sampleArrPath = path.resolve(__dirname, "sample-array.json");

const getResult = stream => {
    return new Promise((resolve, reject) => {
        const result = [];

        stream.on("data", _ => result.push(_));
        stream.on("end", () => resolve(result));
        stream.on("error", reject);
    });
};

test("Select array", () => {
    const stream = createJsonStream(sampleObjPath, { depth: 1, path: ["arr"] });

    return getResult(stream).then(result => {
        expect(result.length).toBe(1);
        expect(result[0]).toEqual([1, "2", 3]);
    });
});

test("Select array 1 by 1", () => {
    const stream = createJsonStream(sampleObjPath, { depth: 2, path: ["arr"] });

    return getResult(stream).then(result => {
        expect(result.length).toBe(3);
        expect(result).toEqual([1, "2", 3]);
    });
});

test("Select second item in array", () => {
    const stream = createJsonStream(sampleObjPath, {
        depth: 2,
        path: ["arr", "1"]
    });

    return getResult(stream).then(result => {
        expect(result.length).toBe(1);
        expect(result[0]).toEqual("2");
    });
});

test("Select object", () => {
    const stream = createJsonStream(sampleObjPath, { depth: 1, path: ["obj"] });

    return getResult(stream).then(result => {
        expect(result.length).toBe(1);
        expect(result[0]).toEqual({ hello: "world" });
    });
});

test("Select nested object", () => {
    const stream = createJsonStream(sampleObjPath, {
        depth: 2,
        path: ["nested", "item"]
    });

    return getResult(stream).then(result => {
        expect(result.length).toBe(1);
        expect(result[0]).toEqual({ hello: "nested" });
    });
});

test("Select object property in array", () => {
    const stream = createJsonStream(sampleObjPath, {
        depth: 3,
        path: ["nestedPropInArray", 0, "a"]
    });

    return getResult(stream).then(result => {
        expect(result.length).toBe(1);
        expect(result[0]).toEqual("123");
    });
});

test("No path specified", () => {
    const stream = createJsonStream(sampleObjPath, { depth: 1 });

    return getResult(stream).then(result => {
        expect(result.length).toBe(4);
        expect(result[result.length - 1]).toEqual([{ a: "123" }]);
    });
});

test("Test Array without path", () => {
    const stream = createJsonStream(sampleArrPath, { depth: 2 });

    return getResult(stream).then(result => {
        expect(result.length).toBe(2);
        expect(result[0]).toEqual("world");
    });
});

test("Test Array with path", () => {
    const stream = createJsonStream(sampleArrPath, {
        depth: 2,
        path: [1, "hello"]
    });

    return getResult(stream).then(result => {
        expect(result.length).toBe(1);
        expect(result[0]).toEqual("world");
    });
});
