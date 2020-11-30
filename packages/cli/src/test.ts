const execa = require('execa');

try {
  (async () => {
    await execa('abc', ['-v'], {});
  })();
} catch (error) {
  console.error('tag', error);
}
