import * as assert from 'assert';

import * as vscode from 'vscode';

import * as transformer from '../../transformers/transformers';
import { StringUtils } from '../../utilities/stringUtility';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Base32 test', () => {
        const base32Transformer = new transformer.Base32Transformer();

        assert.equal(false, base32Transformer.match(""));
        assert.equal(false, base32Transformer.match(" "));
        assert.equal(false, base32Transformer.match(" a"));
        assert.equal(false, base32Transformer.match("a "));

        assert.equal(false, base32Transformer.match("AAAAA3A="), "Check empty string");

        assert.equal(true, base32Transformer.match("JBSWY3DPEBLW64TMMQQQ===="), "Check string - `Hello World!`");
    });

    test('Base64 test', () => {
        const base64Transformer = new transformer.Base64Transformer();

        assert.equal(false, base64Transformer.match(""));
        assert.equal(false, base64Transformer.match(" "));
        assert.equal(false, base64Transformer.match(" a"));
        assert.equal(false, base64Transformer.match("a "));

        assert.equal(false, base64Transformer.match("AAAAA3A="), "Check empty string");

        assert.equal(true, base64Transformer.match("SGVsbG8gV29ybGQh"), "Check string - `Hello World!`");
	});

    test('dot.case test', () => {
        const utils = new StringUtils();

        assert.equal("dot", utils.dotCase("Dot"));
        assert.equal("dot", utils.dotCase("dot"));
        assert.equal("dot.case", utils.dotCase("DotCase"));
        assert.equal("angle_uint32_t", utils.snakeCase("angleUint32_t"));
        assert.equal("hello.world", utils.dotCase("Hello World!"));
        assert.equal("dot.case.string", utils.dotCase("DotCaseString"));
	});
    test('white__space test', () => {
        const utils = new StringUtils();

        assert.equal("dot", utils.whiteSpace("Space"));
        assert.equal("dot", utils.whiteSpace("space"));
        assert.equal("dot case", utils.whiteSpace("WhiteSpace"));
        assert.equal("hello world", utils.whiteSpace("Hello World!"));
        assert.equal("dot case string", utils.whiteSpace("WhiteSpaceString"));
	});
});
