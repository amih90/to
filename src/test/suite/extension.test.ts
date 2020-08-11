import * as assert from 'assert';

import * as vscode from 'vscode';

import * as transformer from '../../transformers/transformers';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Base32 test', () => {
        const base32Transformer = new transformer.Base32Transformer();

        assert.equal(false, base32Transformer.match(""));
        assert.equal(false, base32Transformer.match(" "));
        assert.equal(false, base32Transformer.match(" a"));
        assert.equal(false, base32Transformer.match("a "));

        assert.equal(false, base32Transformer.match("AAAAA3A="), "Check empty string");

        assert.equal(true, base32Transformer.match("GE======"), "Check integer - `1`");
        assert.equal(true, base32Transformer.match("JBSWY3DP"), "Check string - `Hello`");
    });

    test('Base64 test', () => {
        const base64Transformer = new transformer.Base64Transformer();

        assert.equal(false, base64Transformer.match(""));
        assert.equal(false, base64Transformer.match(" "));
        assert.equal(false, base64Transformer.match(" a"));
        assert.equal(false, base64Transformer.match("a "));

        assert.equal(false, base64Transformer.match("AAAAA3A="), "Check empty string");

        assert.equal(true, base64Transformer.match("MQ=="), "Check integer - `1`");
        assert.equal(true, base64Transformer.match("SGVsbG8="), "Check string - `Hello`");
	});
});
