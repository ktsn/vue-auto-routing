"use strict";
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const vue_route_generator_1 = require("vue-route-generator");
const pluginName = 'VueAutoRoutingPlugin';
class VueAutoRoutingPlugin {
    constructor(options) {
        this.options = options;
        if (Array.isArray(options)) {
            options.forEach(option => {
                assert(option.pages, '`pages` is required');
            });
        }
        else {
            assert(options.pages, '`pages` is required');
        }
    }
    apply(compiler) {
        const generate = (option) => {
            const code = vue_route_generator_1.generateRoutes(option);
            let to;
            if (option.pageName) {
                to = path.resolve(__dirname, `../${option.pageName}.js`);
            }
            else {
                to = path.resolve(__dirname, '../index.js');
            }
            if (fs.existsSync(to) &&
                fs.readFileSync(to, 'utf8').trim() === code.trim()) {
                return;
            }
            fs.writeFileSync(to, code);
        };
        const generateIndex = (options) => {
            let importCode = '', exportCode = '';
            options.forEach(option => {
                importCode += `import ${option.pageName} from './${option.pageName}';\n`;
                exportCode += `${option.pageName},`;
            });
            return `${importCode}export{${exportCode}}`;
        };
        compiler.hooks.thisCompilation.tap(pluginName, compilation => {
            try {
                if (Object.prototype.toString.call(this.options) === '[object Object]') {
                    generate(this.options);
                }
                else if (Array.isArray(this.options)) {
                    this.options.forEach(option => {
                        generate(option);
                    });
                    const indexPath = path.resolve(__dirname, '../index.js');
                    const code = generateIndex(this.options);
                    if (fs.existsSync(indexPath) &&
                        fs.readFileSync(indexPath, 'utf8').trim() === code.trim()) {
                        return;
                    }
                    fs.writeFileSync(indexPath, code);
                }
                else {
                    throw new Error('options type need object or array');
                }
            }
            catch (error) {
                compilation.errors.push(error);
            }
        });
    }
}
module.exports = VueAutoRoutingPlugin;
