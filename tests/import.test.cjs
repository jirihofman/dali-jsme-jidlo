const { test } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
function setup() {
  const ui = { text() { return this; }, removeClass() { return this; } };
  const context = vm.createContext({ console, document: {}, $: () => ui });
  vm.runInContext(fs.readFileSync('dist/util.js', 'utf8') + '\nlet file=null, fileList=[], fileMetadata=[]; renderAll=()=>{}; renderProfileFiles=()=>{};', context);
  return { context, run: code => vm.runInContext(code, context) };
}
const valid = name => ({ name, content: JSON.stringify({ profile: { first_name: name }, orders: [] }) });
test('mixed batches load valid files in selection order and report failures', async () => {
  const { context, run } = setup();
  const result = await context.importJsonFiles([valid('first'), { name: 'bad', content: '{' }, valid('last')]);
  assert.equal(result.status, 'partial'); assert.equal(result.fileCount, 2);
  assert.equal(result.errors[0].name, 'bad'); assert.equal(run('file.profile.first_name'), 'first');
  assert.equal(run('fileMetadata[0].minDate'), null);
});
test('invalid batches preserve previous data and reject unsafe nested shapes', async () => {
  const { context, run } = setup(); await context.importJsonFiles([valid('keep')]);
  for (const data of [null, {profile:{},orders:[null]}, {profile:{},orders:[{created_at:'2026-02-30'}]}, {profile:{},orders:[],addresses:[null]}]) {
    assert.equal((await context.importJsonFiles([{content:JSON.stringify(data)}])).status, 'error');
    assert.equal(run('file.profile.first_name'), 'keep');
  }
  const demo = run('JSON.parse(JSON.stringify(demoData))');
  demo.orders[0].cart.items[0].quantity = '1';
  assert.equal((await context.importJsonFiles([{content:JSON.stringify(demo)}])).status, 'error');
});
test('read failures do not block valid files; stale batches cannot replace newer data', async () => {
  const { context, run } = setup();
  assert.equal((await context.importJsonFiles([{name:'unreadable',text:async()=>{throw Error('read failed')}},valid('ok')])).status,'partial');
  let resolve;
  const old = context.importJsonFiles([{text:()=>new Promise(r=>{resolve=r})}]);
  await context.importJsonFiles([valid('new')]); resolve(valid('old').content);
  assert.equal((await old).status,'cancelled'); assert.equal(run('file.profile.first_name'),'new');
  const pending = context.importJsonFiles([{text:()=>new Promise(r=>{resolve=r})}]);
  run('++importGeneration; file = null'); resolve(valid('old').content);
  assert.equal((await pending).status,'cancelled'); assert.equal(run('file'),null);
});
test('demo data validates, including wrapped Foodora dates', async () => {
  const { context, run } = setup(); const demo = run('JSON.parse(JSON.stringify(demoData))');
  demo.orders[0].created_at = 'date:"2026-02-10 13:24:56" timezone:"Europe/Prague"';
  const result = await context.importJsonFiles([{content:JSON.stringify(demo)}]);
  assert.equal(result.status,'success'); assert.equal(result.orderCount,4);
});
test('WebMCP is optional and registered tool uses shared importer', async () => {
  const { context } = setup(); await context.registerImportTool();
  let tool; context.document.modelContext = { registerTool: async t => {tool=t;} };
  await context.registerImportTool(); assert.equal(tool.name,'import_foodora_json');
  assert.equal((await tool.execute({files:[valid('agent')]})).status,'success');
  assert.equal((await tool.execute({})).status,'error');
  context.document.modelContext.registerTool = async () => {throw Error('unavailable');};
  await context.registerImportTool();
});
