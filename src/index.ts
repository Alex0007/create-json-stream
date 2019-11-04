import * as fs from "fs";
import * as DepthStream from "json-depth-stream";
import * as stream from "stream";
import * as through2 from "through2";

export type JsonStreamOptions = {
    depth: number;

    path?: string[];
};

const _isArrayItem = (pathArr: unknown[]) => {
    return typeof pathArr[pathArr.length - 1] === "number";
};

const _pathMatchDetect = (
    currentPath: unknown[],
    sourcePath: unknown[]
): boolean => {
    if (currentPath.join(".") === sourcePath.join(".")) {
        return true;
    }

    if (
        _isArrayItem(currentPath) &&
        currentPath.slice(0, -1).join(".") === sourcePath.join(".")
    ) {
        return true;
    }

    return false;
};

export const createJsonStream = (
    filepath: string,
    opts: JsonStreamOptions,
    fileOpts?: any
): stream.Readable => {
    const json = new DepthStream(opts.depth);
    const positionsStream = new stream.Transform();

    if (opts.depth < 1) {
        throw new Error("Depth should be gte 1");
    }

    const fd = fs.openSync(filepath, "r");

    json.on("visit", (path: any[], start: number, end: number) => {
        const pathMatched =
            opts.path && opts.path.length
                ? _pathMatchDetect(path, opts.path)
                : true;

        const depthMatched = opts.depth === path.length;

        if (pathMatched && depthMatched) {
            positionsStream.emit("data", [start, end]);
        }
    });

    fs.createReadStream(filepath, fileOpts)
        .on("end", () => {
            positionsStream.emit("end");
            positionsStream.destroy();
        })
        .pipe(json);

    return positionsStream
        .pipe(
            through2.obj(([start, end], enc, callback) => {
                fs.read(
                    fd,
                    Buffer.alloc(end - start),
                    0,
                    end - start,
                    start,
                    (err, bytesRead, buffer) => {
                        callback(err, JSON.parse(buffer.toString()));
                    }
                );
            })
        )
        .on("end", () => {
            fs.close(fd, () => {});
        });
};
