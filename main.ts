// Entry for "Make the AI Judge Laugh: the Office Joke Open".
// Writes one single-line office joke to the output file.
//
// The output path comes from OUTPUT_PATH so local runs can point
// somewhere harmless; the grader runs with the default /output/entry.txt.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const JOKE =
  "Our daily standup runs 15 minutes on the invite and 45 minutes over, and somehow the only thing still standing is the Jira ticket nobody owns.";

const outputPath = process.env.OUTPUT_PATH ?? "/output/entry.txt";

// The gate only accepts UTF-8 text of 1 to 200 characters that is not
// only white space, so refuse to write anything that would fail it
// instead of silently producing an invalid entry.
const MAX_CHARS = 200;

function fail(message: string): never {
  console.error(`entry: ${message}`);
  process.exit(1);
}

if (!outputPath.trim()) {
  fail("OUTPUT_PATH is empty");
}

const charCount = [...JOKE].length;
if (charCount < 1 || charCount > MAX_CHARS) {
  fail(`joke is ${charCount} characters, must be 1 to ${MAX_CHARS}`);
}
if (JOKE.trim().length === 0) {
  fail("joke is only white space");
}
if (JOKE.includes("\n") || JOKE.includes("\r")) {
  fail("joke must be a single line");
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JOKE, "utf8");

// Read the file back and confirm it is byte-identical to the joke:
// a partial or mangled write must fail the run, not ship silently.
const written = readFileSync(outputPath, "utf8");
if (written !== JOKE) {
  fail(`wrote ${[...written].length} characters, expected ${charCount}`);
}

console.log(`wrote ${charCount} characters to ${outputPath}`);
