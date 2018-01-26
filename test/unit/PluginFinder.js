/**
 * @file PluginFinder
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project pom-plugin-builder
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

"use strict";

const tap = require('tap')
const mocks = require('pom-test-stubs')
const PluginFinder = require('../../lib/PluginFinder')
const path = require('path')
const fs = require('fs')

tap.test('Finding Framework Plugins.', (t) => {
  let mockDir = mocks.findMockDir(__dirname, '../mocks/unit/PluginFinder/onlyFrameworkPlugin')
  let mockedDependencies = []
  let mockedApplication = mocks.registerMocks(mockDir, mockedDependencies)
  let frameworkInjector = mocks.mockFrameworkInjector(false, {}, mockDir)
  let FoundPlugins = PluginFinder(mockedDependencies, frameworkInjector)
  t.equal(FoundPlugins.length, 1, 'Should find correct number of framework plugins.')

  FoundPlugins.forEach((v,k) => {
    let mn = v.moduleName
    t.notOk(v.external, `${mn} is not an external plugin.`)
    t.ok(v.systemPlugin, `${mn} is a system plugin.`)
  })

  mockedApplication.reset()
  t.end()
})

tap.test('Finding internal Plugins', (t) => {
  let mockDir = mocks.findMockDir(__dirname, '../mocks/unit/PluginFinder/onlyInternalPlugins')
  let mockedDependencies = []
  let mockedApplication = mocks.registerMocks(mockDir, mockedDependencies)
  let frameworkInjector = mocks.mockFrameworkInjector(false, {}, mockDir)
  let FoundPlugins = PluginFinder(mockedDependencies, frameworkInjector)
  t.equal(FoundPlugins.length, 2, 'Should find correct number of internal plugins.')

  FoundPlugins
    .filter((i) => {
      return i.moduleName !== 'ApplicationEnvironment'
    })
    .forEach((v,k) => {
      let mn = v.moduleName
        t.notOk(v.external, `${mn} is not an external plugin.`)
        t.notOk(v.systemPlugin, `${mn} is not system plugin.`)
        t.ok(v.internal, `${mn} is an internal plugin.`)
    })

  mockedApplication.reset()
  t.end()
})

tap.test('Finding internal Plugins inside directory', (t) => {
  let mockDir = mocks.findMockDir(__dirname, '../mocks/unit/PluginFinder/internalDirectoryPlugins')
  let mockedDependencies = []
  let mockedApplication = mocks.registerMocks(mockDir, mockedDependencies)
  let frameworkInjector = mocks.mockFrameworkInjector(false, {}, mockDir)
  let FoundPlugins = PluginFinder(mockedDependencies, frameworkInjector)

  t.equal(FoundPlugins.length, 3, 'Should find correct number of internal plugins.')

  FoundPlugins
    .filter((i) => {
      return i.moduleName !== 'ApplicationEnvironment'
    })
    .forEach((v,k) => {
      let mn = v.moduleName
      t.notOk(v.external, `${mn} is not an external plugin.`)
      t.notOk(v.systemPlugin, `${mn} is not system plugin.`)
      t.ok(v.internal, `${mn} is an internal plugin.`)
    })

  mockedApplication.reset()
  t.end()
})

tap.test('Ignoring Directories without an index.js file inside PluginDirectoryPath', (t) => {
  let mockDir = mocks.findMockDir(__dirname, '../mocks/unit/PluginFinder/internalDirectoryEmptyPlugins')
  let mockedDependencies = []
  let mockedApplication = mocks.registerMocks(mockDir, mockedDependencies)
  let frameworkInjector = mocks.mockFrameworkInjector(false, {}, mockDir)
  let FoundPlugins = PluginFinder(mockedDependencies, frameworkInjector)

  t.equal(FoundPlugins.length, 2, 'Should find correct number of internal plugins.')

  FoundPlugins
    .filter((i) => {
      return i.moduleName !== 'ApplicationEnvironment'
    })
    .forEach((v,k) => {
      let mn = v.moduleName
      t.notOk(v.external, `${mn} is not an external plugin.`)
      t.notOk(v.systemPlugin, `${mn} is not system plugin.`)
      t.ok(v.internal, `${mn} is an internal plugin.`)
    })

  mockedApplication.reset()
  t.end()
})

tap.test('Finding external Plugins', (t) => {
  let mockDir = mocks.findMockDir(__dirname, '../mocks/unit/PluginFinder/onlyExternalPlugins')
  let mockedDependencies = ['pomegranate-test-plugin']
  let mockedApplication = mocks.registerMocks(mockDir, mockedDependencies)
  let frameworkInjector = mocks.mockFrameworkInjector(false, {pluginDirectory: false}, mockDir)
  let FoundPlugins = PluginFinder(mockedDependencies, frameworkInjector)

  t.equal(FoundPlugins.length, 2, 'Should find correct number of internal plugins.')

  FoundPlugins
    .filter((i) => {
      return i.moduleName !== 'ApplicationEnvironment'
    })
    .forEach((v,k) => {
      let mn = v.moduleName
      t.ok(v.external, `${mn} is an external plugin.`)
      t.notOk(v.systemPlugin, `${mn} is not system plugin.`)
      t.notOk(v.internal, `${mn} is not an internal plugin.`)
    })

  mockedApplication.reset()
  t.end()
})


tap.test('Ignoring Directories with bad paths', (t) => {
  let mockDir = mocks.findMockDir(__dirname, '../mocks/unit/PluginFinder/internalDirectoryEmptyPlugins')
  let mockedDependencies = []
  let mockedApplication = mocks.registerMocks(mockDir, mockedDependencies)
  let frameworkInjector = mocks.mockFrameworkInjector(false, {}, mockDir)
  frameworkInjector.get('Options').pluginDirectory = '/derp'
  let FoundPlugins = PluginFinder(mockedDependencies, frameworkInjector)
  t.equal(FoundPlugins.length, 1, 'Should find correct number of internal plugins.')

  mockedApplication.reset()
  t.end()
})