"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CubegenBundler = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const crypto_js_1 = require("crypto-js");
const core_1 = require("@parcel/core");
const MODULE_PATH_DIR = __dirname;
const MODULE_TEMP_PATH_DIR = path_1.default.resolve(MODULE_PATH_DIR, '.cubegen');
const MODULE_TEMP_DIST_PATH_DIR = path_1.default.resolve(MODULE_TEMP_PATH_DIR, '.bundler-cache');
/**
 *
 */
class CubegenBundler {
    constructor(options) {
        this.options = options;
        // Set default percel options.
        this.percelOptions = {
            entries: '',
            defaultConfig: '@parcel/config-default',
            mode: 'production',
            shouldDisableCache: true,
            targets: {
                default: {
                    distDir: MODULE_TEMP_DIST_PATH_DIR
                }
            },
            defaultTargetOptions: {
                shouldOptimize: true,
                sourceMaps: false
            }
        };
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            // initialization before run builder.
            const buildResponses = [];
            this.initialization();
            // run bundler each entry file.
            for (const entry of this.options.entries) {
                this.setPercelOptions(entry);
                const buildObject = yield this.bundingWithParcel();
                const bundleRaw = this.getBundleFileFormTemp();
                const outputPath = this.writeBundleToOutputPath(entry, bundleRaw);
                const bundleHash = (0, crypto_js_1.SHA256)(bundleRaw).toString();
                buildResponses.push({
                    hash: bundleHash,
                    buildTime: buildObject.buildTime,
                    sourcePath: this.percelOptions.entries,
                    ouputPath: outputPath
                });
            }
            // done
            return buildResponses;
        });
    }
    initialization() {
        // recreate temporary directory.
        if (fs_extra_1.default.existsSync(MODULE_TEMP_DIST_PATH_DIR)) {
            fs_extra_1.default.rmSync(MODULE_TEMP_DIST_PATH_DIR, { recursive: true });
        }
        fs_extra_1.default.mkdirSync(MODULE_TEMP_DIST_PATH_DIR, { recursive: true });
        // recreate out directory.
        if (fs_extra_1.default.existsSync(this.options.outDir)) {
            fs_extra_1.default.rmSync(this.options.outDir, { recursive: true });
        }
        fs_extra_1.default.mkdirSync(this.options.outDir, { recursive: true });
    }
    setPercelOptions(entry) {
        // set entry file path.
        this.percelOptions.entries = path_1.default.resolve(this.options.rootDir, entry);
    }
    bundingWithParcel() {
        return __awaiter(this, void 0, void 0, function* () {
            const bundler = new core_1.Parcel(this.percelOptions);
            try {
                const buildObject = yield bundler.run();
                return buildObject;
            }
            catch (error) {
                console.error(error);
                process.exit();
            }
        });
    }
    getBundleFileFormTemp() {
        var _a;
        const files = fs_extra_1.default.readdirSync(MODULE_TEMP_DIST_PATH_DIR);
        const filePath = path_1.default.resolve(MODULE_TEMP_DIST_PATH_DIR, (_a = files[0]) !== null && _a !== void 0 ? _a : 'unknow.file');
        if (!fs_extra_1.default.existsSync(filePath)) {
            console.error('Error when reading bundle file in temporary.');
            process.exit();
        }
        return fs_extra_1.default.readFileSync(filePath, 'utf8');
    }
    writeBundleToOutputPath(entry, bundleRaw) {
        // get full path entry and change ".ts" to ".js"
        const outputPath = path_1.default.resolve(this.options.outDir, entry).replace('.ts', '.js');
        // create entry directory.
        const directory = path_1.default.dirname(outputPath);
        if (!fs_extra_1.default.existsSync(directory)) {
            fs_extra_1.default.mkdirSync(directory, { recursive: true });
        }
        // write bundle file.
        fs_extra_1.default.writeFileSync(outputPath, bundleRaw, 'utf8');
        return outputPath;
    }
}
exports.CubegenBundler = CubegenBundler;
