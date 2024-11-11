import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import securityNodePlugin from "eslint-plugin-security-node";

/** @type {import('eslint').Linter.Config[]} */
export default [
    {files: ["**/*.{js,mjs,cjs,ts}"]},
    {languageOptions: {globals: globals.node}},
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        plugins: {
            "security-node": securityNodePlugin,
        },
    },
    {
        rules: {
            // Include all recommended rules from the plugin
            "security-node/detect-absence-of-name-option-in-exrpress-session": "error",
            "security-node/detect-buffer-unsafe-allocation": "error",
            "security-node/detect-child-process": "error",
            "security-node/detect-crlf": "error",
            "security-node/detect-eval-with-expr": "error",
            "security-node/detect-html-injection": "error",
            "security-node/detect-improper-exception-handling": "error",
            "security-node/detect-insecure-randomness": "error",
            "security-node/detect-non-literal-require-calls": "error",
            "security-node/detect-nosql-injection": "error",
            "security-node/detect-option-multiplestatements-in-mysql": "error",
            "security-node/detect-option-rejectunauthorized-in-nodejs-httpsrequest": "error",
            "security-node/detect-option-unsafe-in-serialize-javascript-npm-package": "error",
            "security-node/detect-possible-timing-attacks": "error",
            "security-node/detect-runinthiscontext-method-in-nodes-vm": "error",
            "security-node/detect-security-missconfiguration-cookie": "error",
            "security-node/detect-sql-injection": "error",
            "security-node/detect-unhandled-async-errors": "error",
            "security-node/detect-unhandled-event-errors": "error",
            "security-node/disable-ssl-across-node-server": "error",
            "security-node/non-literal-reg-expr": "error",
        }
    },
];