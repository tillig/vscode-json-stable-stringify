# VSCode - Sort JSON (Stable)

The `vscode-json-stable-stringify` extension is used to sort a JSON object using the [`json-stable-stringify` sort mechanism](https://github.com/substack/json-stable-stringify") to create a standardized, sorted JSON object.

While it will use the editor's current settings for indentation, it otherwise uses default settings for the sort.

## Usage

This extension implements only a command accessible via the command palette (`Ctrl+Shift+P`) called `Sort JSON (Stable)`. If you have one or more selections in the editor, the selections will be parsed as JSON, sorted, and formatted. If you have no selection, the whole document will be sorted and formatted.

**Why use this instead of some other formatter/sorter?**

Some JSON sorters implement a document formatter for JSON so the `Format Document` command automatically sorts. Unfortunately, if you have _multiple_ document formatters for a given document type [only one will run and it's not configurable/clear which](https://github.com/Microsoft/vscode/issues/41882). By separating the option to sort out of a document formatter, you can use other formatters like Prettier or Beautify to handle things before/after the sort as a separate concern.

Some JSON sorters have too many options or try to do too much and can the results can be unpredictable/unreliable. This one goes for simple and standard using a tried and tested library that has been around for a while [(`json-stable-stringify`)](https://github.com/substack/json-stable-stringify).

Finally, some JSON sorters are hard-tied to the JSON document type. This ignores JSON that might be embedded in a JavaScript file, or even JSON that appears in an HTML file as part of an embedded script. There's no language tie here - highlight something JSON and sort it. No judgment.

## Release Notes

### 1.0.0

Initial release.
