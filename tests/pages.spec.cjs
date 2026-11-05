const { test, expect } = require('@playwright/test');

test('built template pages, charts, tables and gesture bridge work', async ({ page }) => {
  await page.addInitScript(() => { window.Apex = {chart: {animations: {enabled: false}}}; });
  const errors = [];
  const missing = [];
  page.on('pageerror', error => { errors.push(error.message); console.error(error.message); });
  page.on('response', response => {
    if (response.url().startsWith('http://127.0.0.1:4324/') && response.status() >= 400) {
      missing.push(new URL(response.url()).pathname);
    }
  });
  for (const name of ['index','charts','tables','typography','icons','notifications','login','register']) {
    await page.goto('/dist/' + name + '.html');
    await expect(page.locator('body')).not.toBeEmpty();
    if (name === 'charts') {
      await expect(page.locator('#morris1 .apexcharts-canvas')).toBeVisible();
      await expect(page.locator('#morris3 .apexcharts-canvas')).toBeVisible();
      await expect(page.locator('#morris1 .apexcharts-series')).toHaveCount(2);
      await expect(page.locator('#morris3 .apexcharts-datalabel-label')).toHaveText('In-Store Sales');
      await expect(page.locator('#morris3 .apexcharts-datalabel-value')).toHaveText('30');
      const slices = page.locator('#morris3 path[class*="apexcharts-donut-slice"]');
      await expect(slices).toHaveCount(2);
      await slices.nth(1).dispatchEvent('mouseenter');
      await expect(page.locator('#morris3 .apexcharts-datalabel-label')).toHaveText('Mail-Order Sales');
      await expect(page.locator('#morris3 .apexcharts-datalabel-value')).toHaveText('20');
      await slices.nth(1).dispatchEvent('mouseleave');
      await page.screenshot({path:'test-results/charts.png',fullPage:true});
    }
    if (name === 'tables') await expect(page.locator('table').first()).toBeVisible();
    if (name === 'index') {
      expect(await page.evaluate(() => {
        let received = false;
        const element = $('<div>').appendTo('body').hammer().on('swipeleft', () => { received = true; });
        element.data('hammer').emit('swipeleft', {target:element[0],preventDefault(){}});
        element.data('hammer').destroy();
        element.remove();
        return received;
      })).toBe(true);
    }
  }
  await page.goto('/dist/index.html');
  await page.locator('#sidebar a[href="#sidebar-ui"]').click();
  await page.locator('#sidebar a[href="charts.html"]').click();
  await expect(page.locator('#morris1 .apexcharts-canvas')).toBeVisible();
  await page.locator('#sidebar a[href="tables.html"]').click();
  await expect(page.locator('table').first()).toBeVisible();
  expect(missing).toEqual([]);
  expect(errors).toEqual([]);
});
