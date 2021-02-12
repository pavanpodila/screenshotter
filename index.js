const screenshot = require('screenshot-desktop');
const path = require('path');
const mkdir = require('util').promisify(require('fs').mkdir);

const options = getOptions();

console.log(`Using directory=${options.directory}, interval=${options.interval}`);

main();

async function main() {
  const interval = Number(options.interval) * 60 * 1000;
  await mkdir(options.directory, { recursive: true });

  takeScreenshot(); // kick off with the first one
  setInterval(takeScreenshot, interval);

  async function takeScreenshot() {
    try {
      const timestamp = getTimestamp();
      const filename = path.resolve(options.directory, `screenshot-${timestamp}.jpg`);
      await screenshot({ filename, format: 'jpg' });

      console.log(`[${new Date().toLocaleString()}] ${filename}`);
    } catch (e) {
      console.log('Failed to capture');
    }
  }
}

function getTimestamp() {
  const date = new Date();

  return `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
}

function getOptions() {
  const userOptions = require('minimist')(process.argv.slice(2));

  const defaults = { directory: './screenshots', interval: 5 };
  return { ...defaults, ...userOptions };
}
