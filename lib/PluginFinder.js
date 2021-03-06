/**
 * @file PluginFinder
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-finder
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const _fp = require('lodash/fp')
const debug = require('debug')('pom:pluginFinder');
const fileMethods = require('./transformers/fileMethods')
const path = require('path');


const foundLength = length => `Found ${length}`
const logType = (fl, type) => `${fl} ${type} ${fl === 1 ? 'plugin': 'plugins'}.`
const setFoundLogger = logger => _fp.compose(logger, foundLength, logType)


/*
  Filters
 */
const joinInternalPath = base => fileMethods.joinPaths([base])

const joinFrameworkDirectory = fileMethods.joinPaths([__dirname, './FrameworkPlugins'])

// const isjsfile = file => path.extname(file) === '.js'
// const hasIndexfile = _fp.compose(_fp.some(f => f === 'index.js'), safeReadSync, safeIsDirectory)
const byPrefix = (prefixes)=>{
  return plugin => _fp.some((p) => {
    return plugin.indexOf(`${p}-`) === 0
  }, prefixes)
}

const getModulenameSpace = (modulename) => {

  return {
    moduleName: _fp.startsWith('@',modulename) ? _fp.split('/', modulename)[1] : modulename,
    namespace:  _fp.startsWith('@',modulename) ? _fp.split('/', modulename)[0] : null
  }
}

const byNamespace = prefixes => {
  let startsWithAt = _fp.startsWith('@')
  let namespaces = _fp.filter(prefix => startsWithAt(prefix),prefixes)
  return (plugin) => {
    return startsWithAt(plugin)
  }
}

const byInternalPath = base => (file)=>{
  debug(file)
  //Short circut on the obvious and common case of a standalone plugin file.
  if(fileMethods.isJsFile(file)) return true
  let possibleDirectoryPath = joinInternalPath(base)
  return fileMethods.hasIndexFile(possibleDirectoryPath(file))
}


/*
  Object Mappers
 */

// Build Framework Plugins
const bfp = file => ({
  require: joinFrameworkDirectory(file),
  namespace: null,
  external: false,
  internal: false,
  systemPlugin: true,
  moduleName: path.basename(file, '.js')
})

//Build Namespace Plugins
const bnp = dep => {
  let mod = getModulenameSpace(dep)
  return {
    require: dep,
    namespace: mod.namespace,
    external: true,
    internal: false,
    systemPlugin: false,
    moduleName: mod.moduleName
  }
}

//Build External Plugins
const bep = dep => ({
  require: dep,
  namespace: null,
  external: true,
  internal: false,
  systemPlugin: false,
  moduleName: dep
})

//Build Internal Plugins
const bip = _fp.curry((pluginDirPath, file)=>{
  return {
    require: path.join(pluginDirPath, file),
    namespace: null,
    external: false,
    internal: true,
    systemPlugin: false,
    moduleName: path.basename(file, '.js')
  }
})

const findFrameworkPlugins = _fp.compose(_fp.map(bfp),_fp.filter(fileMethods.isJsFile), fileMethods.safeReadSync, joinFrameworkDirectory)
const findExternalFromPrefix = prefixes => _fp.compose(_fp.map(bep), _fp.filter(byPrefix(prefixes)))
const findExternalFromNamespace = prefixes => _fp.compose(_fp.map(bnp),_fp.filter(byNamespace(prefixes)))
const findInternalFromBase = base => _fp.compose(_fp.map(bip(base)), _fp.filter(byInternalPath(base)), fileMethods.safeReadSync)


/**
 *
 * @module PluginFinder
 */

module.exports = function(PackageDependencies, FrameworkInjector){

  let Options = FrameworkInjector.get('Options')
  let FrameworkLogger = FrameworkInjector.get('FrameworkLogger')
  let logFound = setFoundLogger(FrameworkLogger.log.bind(FrameworkLogger))
  FrameworkLogger.log('Discovering plugins.')

  /*
   * Create the list of prefixes to search for in the available dependencies.
   * Options.prefix is the primary, Options.additionalPrefix are secondary.
   */
  let prefixes = FrameworkInjector.get('Prefixes')//[Options.prefix]

  FrameworkLogger.log(`${prefixes.join(', ')} prefixed plugins will load from ./node_modules`)

  /*
   * Internal plugins included with the framework.
   */
  let FrameworkPlugins = findFrameworkPlugins()

  /*
   * External plugins derived from package.json dependencies with prefix names.
   */

  let findExternalPlugins = findExternalFromPrefix(prefixes)
  let ExternalPlugins = findExternalPlugins(PackageDependencies)

  /*
   * Plugins residing in a namespace.
   */
  let findNamespacePlugins = findExternalFromNamespace(prefixes)
  let NamespacePlugins = findNamespacePlugins(PackageDependencies)
  /*
   * Internal pluigns found in the pomegranate settings pluginDirectory
   */

  let findInternalPlugins = findInternalFromBase(Options.pluginDirectory)
  let InternalPlugins = findInternalPlugins(Options.pluginDirectory)

  debug(FrameworkPlugins)
  debug(NamespacePlugins)
  debug(ExternalPlugins)
  debug(InternalPlugins)
  logFound(FrameworkPlugins.length, 'framework')
  logFound(NamespacePlugins.length, 'namespaced')
  logFound(ExternalPlugins.length, 'external')
  logFound(InternalPlugins.length, 'internal')

  return _fp.concat(FrameworkPlugins,
    _fp.concat(ExternalPlugins,
      _fp.concat(NamespacePlugins,InternalPlugins)
    )
  )
}