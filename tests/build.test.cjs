const fs = require('node:fs');
const assert = require('node:assert/strict');
const test = require('node:test');
const {createRequire} = require('node:module');

test('builds every template and copies binary assets unchanged', () => {
  for (const file of fs.readdirSync('src/pages')) {
    if (file.endsWith('.hbs')) assert.ok(fs.statSync('dist/' + file.replace('.hbs','.html')).size > 0);
  }
  for (const file of ['Flaticon.ttf','Flaticon.woff','Flaticon.eot']) {
    assert.deepEqual(fs.readFileSync('dist/fonts/flaticon/'+file),fs.readFileSync('src/fonts/flaticon/'+file));
  }
  const map = JSON.parse(fs.readFileSync('dist/css/maps/application.min.css.map','utf8'));
  assert.ok(map.sources.some(source => source.endsWith('application.scss')));
});

test('date picker scoped Moment update preserves date parsing and formatting', () => {
  const parentRequire = createRequire(require.resolve('tempusdominus-core'));
  const moment = parentRequire('moment');
  assert.equal(moment('2026-11-05','YYYY-MM-DD',true).format('DD/MM/YYYY'), '05/11/2026');
  assert.equal(moment('2026-02-30','YYYY-MM-DD',true).isValid(), false);
});
