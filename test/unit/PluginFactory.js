/**
 * @file PluginFactory
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-finder
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

'use strict';
const tap = require('tap')
const mocks = require('@pomegranate/test-utils')
const PluginFinder = require('../../lib/PluginFactory')
const path = require('path')
const fs = require('fs')

tap.test('Finding Framework Plugins.', (t) => {
  let mockDir = mocks.findMockDir(__dirname, '../mocks/unit/PluginFinder/onlyFrameworkPlugin')
  let mockedDependencies = []
  let mockedApplication = mocks.registerMocks(mockDir, mockedDependencies)
  let frameworkInjector = mocks.mockFrameworkInjector(false, {}, mockDir)
  PluginFinder(mockedDependencies, frameworkInjector)
    .then((FoundPlugins) => {
      t.equal(FoundPlugins.length, 2, 'Should find correct number of framework plugins.')
      mockedApplication.reset()
      t.end()
    })

})