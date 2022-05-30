export declare enum Mode {
    front = 0,
    end = 1
}
export interface Inject {
    content: string;
    mode?: Mode;
    skip?: RegExp[]
}
interface Options {
    inject: Inject[];
    include?: (string | RegExp)[];
    exclude?: (string | RegExp)[];
}
export default function rollupPluginAutoAdd(options: Options): {};
export {};
