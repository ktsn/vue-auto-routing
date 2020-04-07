import { Compiler } from 'webpack';
interface Options {
    pages: string;
    pageName?: string;
    importPrefix?: string;
    dynamicImport?: boolean;
    chunkNamePrefix?: string;
    nested?: boolean;
}
declare namespace VueAutoRoutingPlugin {
    type AutoRoutingOptions = Options;
}
declare class VueAutoRoutingPlugin {
    private options;
    constructor(options: Options | Options[]);
    apply(compiler: Compiler): void;
}
export = VueAutoRoutingPlugin;
