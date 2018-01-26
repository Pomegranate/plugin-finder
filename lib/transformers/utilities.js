/**
 * @file utilities
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin-builder
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const _fp = require('lodash/fp')
/**
 *
 * @module utilities
 */

/**
 * valueOnPredicate
 *
 * Returns a function that evaluates predicate with value, returning value if true, false otherwise.
 *
 * @param {function} predicate - function to run with value.
 * @returns {function}
 */
exports.valueOnPredicate = (predicate) => {
  if(!_fp.isFunction(predicate)) throw new TypeError('Predicate argument must be a function.')

  return _fp.partial((p, value) => {
    if(p(value)) {
      return value
    }
    return false
  }, [predicate])
}