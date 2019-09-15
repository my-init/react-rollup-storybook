
describe('UI test: <Msg>', () => {
  it('visually looks correct', async () => {
    // APIs from jest-puppeteer
    await page.setViewport({ width: 1920, height: 945 });
    await page.goto('http://localhost:6006/iframe.html?id=demo-msg--with-tail&viewMode=story');
    await page.evaluate(async () => {
    })
    const image = await page.screenshot();

    // API from jest-image-snapshot
    expect(image).toMatchImageSnapshot();
  });
});