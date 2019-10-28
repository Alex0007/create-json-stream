import * as fs from "fs";
import * as DepthStream from "json-depth-stream";
import * as stream from "stream";
import * as through2 from "through2";

export type JsonStreamOptions = {
    depth: number;

    /** Need to specify path to property where array is located (if root json is object) */
    path?: string;
};

export const createJsonStream = (
    filepath: string,
    opts: JsonStreamOptions,
    fileOpts?: any
): stream.Readable => {
    const json = new DepthStream(opts.depth);
    const positionsStream = new stream.Transform();

    const fd = fs.openSync(filepath, "r");

    json.on("visit", (path: any[], start: number, end: number) => {
        // object
        if (path[0] === opts.path && typeof path[1] === "number") {
            positionsStream.emit("data", [start, end]);
        }

        // array
        if (typeof path[0] === "number" && !opts.path) {
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
