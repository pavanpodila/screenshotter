const screenshot = require('screenshot-desktop');
const path = require('path');
const mkdir = require('util').promisify(require('fs').mkdir);

const options = getOptions();

console.log(`Using directory=${options.directory}, interval=${options.interval}, startCounter=${options.startCounter}`);

main();

async function main() {
  const interval = Number(options.interval) * 60 * 1000;
  let counter = Number(options.startCounter);
  await mkdir(options.directory, { recursive: true });

  takeScreenshot(); // kick off with the first one
  setInterval(takeScreenshot, interval);

  async function takeScreenshot() {
    try {
      const filename = path.resolve(options.directory, `screenshot-${counter}.jpg`);
      await screenshot({ filename, format: 'jpg' });
      counter++;

      console.log(`[${new Date().toLocaleString()}] ${filename}`);
    } catch (e) {
      console.log('Failed to capture');
    }
  }
}

function getOptions() {
  const userOptions = require('minimist')(process.argv.slice(2));

  const defaults = { directory: './screenshots', interval: 5, startCounter: 1 };
  return { ...defaults, ...userOptions };
}
