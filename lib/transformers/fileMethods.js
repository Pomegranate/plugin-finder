/**
 * @file fileMethods
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin-builder
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const fs = require('pom-framework-utils').fsExtra;
const _fp = require('lodash/fp')
const debug = require('pom-framework-utils').debug('pom:pluginFinder')
const path = require('path')
const util = require('./utilities')

/**
 * File Handling Transformers
 * @module fileMethods
 */

/**
 * joinPaths
 *
 * returns a partially applied function accepting a further path argument.
 *
 * @param {string[]} basePath
 * @returns {function}
 */
exports.joinPaths = (paths) => _fp.partial(path.join, paths)


/**
 * safeIsDirectory
 *
 * returns false on Error vs throwing.
 *
 * @param {string} fullPath
 * @returns {boolean}
 */
exports.safeIsDirectory = (fullPath) => {

  try {return fs.statSync(fullPath).isDirectory()}
  catch(e){return false}
}

/**
 * safeReadSync
 *
 * returns empty array on Error vs throwing.
 *
 * @param {string} fullPath
 * @returns {*}
 */
exports.safeReadSync = (fullPath) => {
  try { return fs.readdirSync(fullPath) }
  catch(e) { return [] }
}

/**
 * safeExtname
 *
 * returns empty string on Error vs throwing.
 *
 * @param {string} filePath
 * @returns {*}
 */
exports.safeExtname = (filePath) => {
  try {return path.extname(filePath) }
  catch(e){return ''}
}

/**
 * isJsFile
 * @param filePath {string} Full path to a file.
 * @returns {boolean}
 */
exports.isJsFile = filePath => exports.safeExtname(filePath) === '.js',

/**
 * hasIndexFile
 * @param {string} Path to a directory
 * @returns {boolean}
 */
exports.hasIndexFile = _fp.compose(_fp.some(f => f === 'index.js'), exports.safeReadSync, util.valueOnPredicate(exports.safeIsDirectory))
