const util = require('util');
const screenshot = util.promisify(require('desktop-screenshot'));
const path = require('path');

const userOptions = require('minimist')(process.argv.slice(2));

const defaults = { directory: './screenshots', interval: 5 };
const options = { ...defaults, ...userOptions };

console.log(options);
console.log(`Using directory=${options.directory}, interval=${options.interval}`);

main();

async function main() {
  const interval = Number(options.interval) * 60 * 1000;
  let counter = 1;

  setInterval(async () => {
    try {
      const filename = path.resolve(options.directory, `screenshot-${counter}.jpg`);
      await screenshot(filename, { width: 1280, quality: 100 });
      counter++;

      console.log(`Saved ${filename}`);
    } catch (e) {
      console.log('Failed to capture');
    }
  }, interval);
}
