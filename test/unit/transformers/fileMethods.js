/**
 * @file fileMethods
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin-builder
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const tap = require('tap')
const fileMethods = require('../../../lib/transformers/fileMethods')

tap.test('#joinPaths', (t) => {
  t.throws(() => {
    fileMethods.joinPaths('./path')
  }, 'Throws when not given an array.')

  let joinP = fileMethods.joinPaths(['./path'])

  t.type(joinP, 'function', 'Returns a function.')
  t.equal(joinP(), 'path', 'Returns the joined, partial arguments only when given no arguments.')
  t.equal(joinP('home'), 'path/home', 'Returns the given argument joined to the partial arguments.')
  t.equal(joinP('home'), 'path/home', 'It is idempotent.')
  t.equal(joinP('other'), 'path/other', 'Can be called with different arguments.')
  t.end()
})

tap.test('#safeIsDirectory', (t) => {
  t.notOk(fileMethods.safeIsDirectory(), 'Returns false when given no argument.')
  t.notOk(fileMethods.safeIsDirectory(__dirname + '/fileMethods'), 'Returns false when given a file path.')
  t.ok(fileMethods.safeIsDirectory(__dirname ), 'Returns true when given a directory path.')
  t.end()
})

tap.test('#safeReadSync', (t) => {
  t.equal(fileMethods.safeReadSync().length, 0, 'Returns an empty array when given no argument.')
  t.equal(fileMethods.safeReadSync(__dirname + '/fileMethods').length, 0,'Returns an empty array when given a file path.')
  t.ok(fileMethods.safeReadSync(__dirname ).length > 0, 'Returns a non empty array when given a directory.')
  t.end()
})

tap.test('#safeExtname', (t) => {
  t.equal(fileMethods.safeExtname(), '','Returns empty string when given no argument.')
  t.equal(fileMethods.safeExtname(__dirname ), '','Returns empty string when given a directory path.')
  t.equals(fileMethods.safeExtname('file.js'), '.js', 'Returns file extension when given a file path.')
  t.end()
})


tap.test('#isJsFile', (t) => {
  t.notOk(fileMethods.isJsFile(), 'Returns false when given no argument.')
  t.notOk(fileMethods.isJsFile('file.txt'), 'Returns false when given a non .js file.')
  t.notOk(fileMethods.isJsFile('file'), 'Returns false when given nothing to compare.')
  t.notOk(fileMethods.isJsFile('file.ts'), 'Returns false when given a .ts file.')
  t.ok(fileMethods.isJsFile('file.js'), 'Returns true when given a .js file.')
  t.end()
})

tap.test('#hasIndexFile', (t) => {
  let joinMockBase = fileMethods.joinPaths([__dirname, '../../mocks/unit/transformers/fileMethods'])
  t.notOk(fileMethods.hasIndexFile(), 'Returns false when given no argument.')
  t.notOk(fileMethods.hasIndexFile(joinMockBase('hasNoIndexFile')), 'Returns false when given no argument.')
  t.ok(fileMethods.hasIndexFile(joinMockBase('hasIndexFile')), 'Returns true when given a directory path containing an index.js file.')
  t.end()
})