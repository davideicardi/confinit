"use strict";

const assert = require("assert");
const { setDeepProperty } = require("../index");

describe("setDeepProperty – prototype pollution regression tests", () => {

    afterEach(() => {
        // cleanup in case a test ever fails
        delete Object.prototype.polluted;
    });

    it("should block prototype pollution via overridden toString / split", () => {
        const obj = {};

        const arg = ["__proto__"];
        let flag1 = true;

        arg.toString = function () {
            if (flag1) {
                flag1 = false;
                return "foo";
            } else {
                return "__proto__";
            }
        };

        const originalSplit = String.prototype.split;
        String.prototype.split = function () {
            return [arg, "polluted"];
        };

        assert.strictEqual({}.polluted, undefined);

        assert.throws(() =>
            setDeepProperty(obj, "constructor.prototype.polluted", "yes")
        );

        assert.strictEqual({}.polluted, undefined);

        // restore global state
        String.prototype.split = originalSplit;
    });

    it("should block prototype pollution when hasOwnProperty is overridden", () => {
        const originalHasOwn = Object.prototype.hasOwnProperty;
        Object.prototype.hasOwnProperty = () => true;

        assert.strictEqual({}.polluted, undefined);

        assert.throws(() =>
            setDeepProperty({}, "constructor.prototype.polluted", "yes")
        );

        assert.strictEqual({}.polluted, undefined);

        Object.prototype.hasOwnProperty = originalHasOwn;
    });

    it("should block pollution via writable constructor property", () => {
        const obj = {};
        obj.constructor.prototype.polluted = undefined;

        Object.defineProperty(obj, "constructor", {
            value: obj.constructor,
            writable: true,
            enumerable: true,
            configurable: true
        });

        assert.strictEqual({}.polluted, undefined);

        assert.throws(() =>
            setDeepProperty(obj, "constructor.prototype.polluted", "yes")
        );

        assert.strictEqual({}.polluted, undefined);
    });
});
