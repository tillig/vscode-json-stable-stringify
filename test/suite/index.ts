import * as path from 'path';
import * as glob from 'glob';
import { default as Mocha } from 'mocha';

/**
 * Runs the tests in the suite.
 * @return {Promise<void>} A promise to await completion.
 */
export async function run() {
  const runner = new Mocha({
    ui: 'tdd',
    color: true,
  });

  const testsRoot = path.resolve(__dirname, '..');
  const testGlob = new glob.Glob('**/**.test.js', { cwd: testsRoot });
  for await (const file of testGlob) {
    runner.addFile(path.resolve(testsRoot, file));
  }

  runner.run((failures: number) => {
    if (failures > 0) {
      console.error(`${failures} tests failed.`);
    } else {
      console.log('All tests passed.');
    }
  });
}
