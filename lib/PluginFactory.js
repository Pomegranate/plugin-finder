/**
 * @file PluginFactory
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-finder
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const Promise = require('bluebird')
const _fp = require('lodash/fp')
// const Plugin = require('@pomegranate/plugin-facade')
// const FacadeVersion = require('@pomegranate/plugin-facade/package.json').version
// const FinderVersion = require('../package.json').version
const FindPlugins = require('./PluginFinder')


/**
 *
 * @module PluginFactory
 */

module.exports = function(PackageDependencies, FrameworkInjector){

  let Plugin = FrameworkInjector.get('PomModules').PluginFacade.module
  const instantiatePlugins = _fp.map((pluginData) => {
    return new Plugin(pluginData)
  })

  // FrameworkInjector.get('InternalVersions').log('@pomegranate/plugin-finder', FinderVersion)
  // FrameworkInjector.get('InternalVersions').log('@pomegranate/plugin-facade', FacadeVersion)
  return Promise.try(() => {
    let dependencyArr = []
    if(_fp.has('dependencies',PackageDependencies)){
      dependencyArr = Object.keys(PackageDependencies.dependencies)
    }

    let foundPlugins = FindPlugins(dependencyArr, FrameworkInjector)

    return _fp.flattenDeep(instantiatePlugins(foundPlugins))
  })



}