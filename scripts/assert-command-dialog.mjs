#!/usr/bin/env node
/**
 * Regression guard for cmdk context crash:
 * CommandDialog must wrap children in <Command> or CommandInput throws
 * "can't access property subscribe, o is undefined".
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = readFileSync(resolve(root, "src/components/ui/command.tsx"), "utf8");

const start = src.indexOf("function CommandDialog");
const end = src.indexOf("function CommandInput");
if (start < 0 || end < 0 || end <= start) {
  console.error("FAIL: could not locate CommandDialog / CommandInput bounds");
  process.exit(1);
}

const dialogFn = src.slice(start, end);
const wrapsChildren = /<Command>\s*\{children\}\s*<\/Command>/.test(dialogFn);
const headerInsideContent =
  dialogFn.indexOf("DialogContent") >= 0 &&
  dialogFn.indexOf("DialogHeader") > dialogFn.indexOf("DialogContent");

if (!wrapsChildren) {
  console.error(
    "FAIL: CommandDialog must wrap {children} in <Command> (cmdk store context).",
  );
  process.exit(1);
}

if (!headerInsideContent) {
  console.error(
    "FAIL: DialogHeader should live inside DialogContent (a11y / portal).",
  );
  process.exit(1);
}

console.log("PASS: CommandDialog provides cmdk <Command> context.");
