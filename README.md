# VSCode - Sort JSON (Stable)

The `vscode-json-stable-stringify` extension is used to sort a JSON object using the [`json-stable-stringify` sort mechanism](https://github.com/substack/json-stable-stringify") to create a standardized, sorted JSON object.

While it will use the editor's current settings for indentation, it otherwise uses default settings for the sort.

## Features

This extension implements only a command accessible via the command palette (`Ctrl+Shift+P`) called `Sort JSON (Stable)`. If you have one or more selections in the editor, the selections will be parsed as JSON, sorted, and formatted. If you have no selection, the whole document will be sorted and formatted.

In an effort to avoid conflicting with other JSON beautifier plugins, sorting will not occur on `Format Document`. You must elect to run the stable sort command directly.

## Release Notes

### 1.0.0

Initial release.
