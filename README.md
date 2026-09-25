# Intro
This is quick and dirty page to show how much you spent on [damejidlo.cz](https://damejidlo.cz) - now [foodora.cz](https://www.foodora.cz).

# Roadmap
No improvements planned. Ping me if you feel something is missing. Or even better - create an issue or PR.

# JSON imports and WebMCP

Select one or more Foodora/DameJidlo JSON exports. Valid files replace the current
view together, in selection order; invalid or unreadable files are skipped with
an on-page error. If all files fail, the previous view remains. Exports must have
an object `profile` and an array `orders`; `addresses` is optional. Orders need a
valid `created_at`, `restaurant_name`, and `cart` with numeric `total` and an
`items` array containing string `name` and numeric `quantity` and `price`.
Combining exports concatenates orders; it does not deduplicate overlapping exports.

On browsers exposing `document.modelContext.registerTool`, the page registers
`import_foodora_json`. A compatible agent can supply:

```json
{"files":[{"name":"export.json","content":"{\"profile\":{},\"orders\":[]}"}]}
```

The tool uses the same importer and returns `status` (`success`, `partial`,
`error`, or `cancelled`), counts, date range, and per-file errors. A cancelled
superseded import returns only its status. It does not return profile data.
Importing processes data in page memory and makes no upload request. The agent
must already have the user's JSON content: this tool cannot read local paths.
The normal file picker works without WebMCP, including if registration fails.
Browser/agent support is required; see the
[WebMCP imperative API](https://developer.chrome.com/docs/ai/webmcp/imperative-api).

Run importer regression tests with Node.js: `node --test tests/import.test.cjs`.
