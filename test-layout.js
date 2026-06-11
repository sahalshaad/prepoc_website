import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000');
  
  // wait for gsap to initialize
  await new Promise(r => setTimeout(r, 2000));
  
  const layout = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const cyclingContainer = h1.querySelector('span[style*="relative"]');
    const ghost = cyclingContainer.children[0];
    const absoluteContainer = cyclingContainer.children[1];
    
    return {
      h1Text: h1.innerText,
      h1Rect: h1.getBoundingClientRect(),
      cyclingContainerRect: cyclingContainer.getBoundingClientRect(),
      ghostRect: ghost.getBoundingClientRect(),
      absoluteContainerRect: absoluteContainer.getBoundingClientRect()
    };
  });
  
  console.log(JSON.stringify(layout, null, 2));
  await browser.close();
})();
