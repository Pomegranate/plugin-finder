/**
 * @file ApplicationEnvironment
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate-loader
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const _ = require('lodash')
/**
 *
 * @module ApplicationEnvironment
 */

exports.options = {
  checkExistence: []
}

exports.metadata = {
  frameworkVersion: 6,
  name: 'Environment',
  type: 'action'
}

exports.plugin = {
  load: function(Options) {
    var missing = _.filter(Options.checkExistence, function(key){
      return _.isUndefined(process.env[key])
    })
    if(missing.length){
      throw new Error('Missing Environment variables ' + missing.join(', '))
    }
  },
  start: function(done) {
  },
  stop: function(done) {
  }
}