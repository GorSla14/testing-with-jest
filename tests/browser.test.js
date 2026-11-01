const { Builder, By, until } = require('selenium-webdriver');
require('geckodriver');

// Här anger vi var testfilen ska hämtas. De konstiga replaceAll-funktionerna ersätter
// mellanslag med URL-säkra '%20' och backslash (\) på Windows med slash (/).
const fileUnderTest = 'file://' + __dirname.replaceAll(/ /g, '%20').replaceAll(/\\/g, '/') + '/../dist/index.html';
const defaultTimeout = 10000;
let driver;
jest.setTimeout(1000 * 60 * 5); // 5 minuter

// Det här körs innan vi kör testerna för att säkerställa att Firefox är igång
beforeAll(async () => {
console.log(fileUnderTest);
    driver = await new Builder().forBrowser('firefox').build();
    await driver.get(fileUnderTest);
});

// Allra sist avslutar vi Firefox igen
afterAll(async() => {
    await driver.quit();
}, defaultTimeout);

test('The stack should be empty in the beginning', async () => {
    let stack = await driver.findElement(By.id('top_of_stack')).getText();
    expect(stack).toEqual("n/a");
});

describe('Clicking "Pusha till stacken"', () => {
    it('should open a prompt box', async () => {
        let push = await driver.findElement(By.id('push'));
        await push.click();
        let alert = await driver.switchTo().alert();
        await alert.sendKeys("Bananer");
        await alert.accept();
    });
});

test('Peek displays the top element', async () => {
    let peek = await driver.findElement(By.id('peek'));
    let push = await driver.findElement(By.id('push'));
        await push.click();
    let alert = await driver.switchTo().alert();
        await alert.sendKeys("Bananer");
        await alert.accept();
        await peek.click();
    let result = await driver.findElement(By.id('top_of_stack')).getText();
    expect(result).toBe("Bananer");
});

test('Pop removes the top element from the stack', async () => {
    let push = await driver.findElement(By.id('push'));
        await push.click();
    let alert = await driver.switchTo().alert();
        await alert.sendKeys("Äpplen");
        await alert.accept();
    await push.click();
        alert = await driver.switchTo().alert();
        await alert.sendKeys("Bananer");
        await alert.accept();
    let pop = await driver.findElement(By.id('pop'));
        await pop.click();
    let peek = await driver.findElement(By.id('peek'));
        await peek.click();
    let result = await driver.findElement(By.id('top_of_stack')).getText();
    expect(result).toBe("Äpplen");
});