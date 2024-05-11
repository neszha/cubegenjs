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
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const child_process_1 = require("child_process");
const bundler_1 = require("../bundler");
const MODULE_PATH_DIR = path_1.default.resolve(__dirname, '../');
const MODULE_TEMP_PATH_DIR = path_1.default.resolve(MODULE_PATH_DIR, '.cubegen');
describe('Test Bundler Module: test-source-code-01', () => {
    const bundler = new bundler_1.CubegenBundler({
        rootDir: path_1.default.resolve(MODULE_PATH_DIR, 'tests/test-source-code-01'),
        outDir: path_1.default.resolve(MODULE_TEMP_PATH_DIR, 'test-dist-01'),
        entries: [
            'main.ts',
            'nested/main.ts',
            'worker/index.js'
        ]
    });
    it('Success bundling typescript and javascript source code', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield bundler.build();
        // check response data.
        expect(Array.isArray(result)).toEqual(true);
        expect(result[0]).toHaveProperty('hash');
        expect(result[0]).toHaveProperty('buildTime');
        expect(result[0]).toHaveProperty('sourcePath');
        expect(result[0]).toHaveProperty('ouputPath');
        // check result file exits.
        expect(fs_extra_1.default.existsSync(result[0].ouputPath)).toEqual(true);
        expect(fs_extra_1.default.existsSync(result[1].ouputPath)).toEqual(true);
        expect(fs_extra_1.default.existsSync(result[2].ouputPath)).toEqual(true);
    }));
    it('Bundling successful to comment string', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield bundler.build();
        // check main.ts entry.
        const rawBundle1 = fs_extra_1.default.readFileSync(result[0].ouputPath, 'utf8');
        expect(rawBundle1).not.toContain('Main program');
        // check nested/main.ts entry.
        const rawBundle2 = fs_extra_1.default.readFileSync(result[1].ouputPath, 'utf8');
        expect(rawBundle2).not.toContain('Nested program');
        // check worker/index.js entry.
        const rawBundle3 = fs_extra_1.default.readFileSync(result[2].ouputPath, 'utf8');
        expect(rawBundle3).not.toContain('Worker program');
    }));
    it('Bundling proses does not change the functionality of the code program', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield bundler.build();
        // check main.ts entry.
        const outputSourceCodeEntry1 = (0, child_process_1.execSync)(`ts-node ${result[0].sourcePath}`, { encoding: 'utf-8' });
        const outputBundleCodeEntry1 = (0, child_process_1.execSync)(`node ${result[0].ouputPath}`, { encoding: 'utf-8' });
        expect(outputSourceCodeEntry1).toEqual(outputBundleCodeEntry1);
        // check nested/main.ts entry.
        const outputSourceCodeEntry2 = (0, child_process_1.execSync)(`ts-node ${result[1].sourcePath}`, { encoding: 'utf-8' });
        const outputBundleCodeEntry2 = (0, child_process_1.execSync)(`node ${result[1].ouputPath}`, { encoding: 'utf-8' });
        expect(outputSourceCodeEntry2).toEqual(outputBundleCodeEntry2);
        // check worker/index.js entry.
        const sourceDir3 = path_1.default.dirname(result[2].sourcePath);
        const outputSourceCodeEntry3 = (0, child_process_1.execSync)(`cd ${sourceDir3} && node ${result[2].sourcePath}`, { encoding: 'utf-8' });
        const outputBundleCodeEntry3 = (0, child_process_1.execSync)(`node ${result[2].ouputPath}`, { encoding: 'utf-8' });
        expect(outputSourceCodeEntry3).toEqual(outputBundleCodeEntry3);
    }));
});
