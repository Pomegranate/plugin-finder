/**
 * @file testPlugin
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project Pomegranate-loader
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

/**
 *
 * @module testMultiplePlugin
 */
const mockPlugin = require('pom-test-stubs').mockPlugin

module.exports = [
  mockPlugin('Test_1'),
  mockPlugin('Test_2'),
  [
    'test_parent',
    mockPlugin('Test_parent_1'),
    mockPlugin('Test_parent_2'),
    [
      'test_parent_2',
      mockPlugin('Test_parent_2_1'),
      mockPlugin('Test_parent_2_2'),
    ]
  ]
]
