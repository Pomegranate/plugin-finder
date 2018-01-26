/**
 * @file utilities
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin-builder
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const tap = require('tap')
const util = require('../../../lib/transformers/utilities')

/**
 *
 * @module utilities
 */

tap.test('#valueOnPredicate', (t) => {
  t.throws(() => {
    util.valueOnPredicate('throw')
  }, 'Throws when not given an array.')

  let vop = util.valueOnPredicate((arg) => {
    return arg === 'Hello'
  })

  t.type(vop, 'function', 'Returns a new function when given a function argument.')
  t.notOk(vop('Goodbye'), 'Returns false when the predicate function returns false given a value.')
  t.equal(vop('Hello'), 'Hello', 'Returns value, when predicate function returns true, given value.')

  t.end()
})