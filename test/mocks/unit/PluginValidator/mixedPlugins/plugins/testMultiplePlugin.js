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

module.exports = [
  {
    options: {
      workDir: 'testPlugin_workdir'
    },

    metadata: {
      name: 'Test-plugin-one',
      type: 'service',
      param: 'Test1'
    },

    plugin: {
      load: function(inject, loaded) {
        loaded(null, {name: 'Test1'});
      },
      start: function(done) {
        done()
      },
      stop: function(done) {
        done()
      }
    }
  },
  {
    options: {
      workDir: 'testPlugin_workdir'
    },

    metadata: {
      name: 'Test-plugin-two',
      type: 'service',
      param: 'Test2'
    },

    plugin: {
      load: function(inject, loaded) {
        loaded(null, {name: 'Test2'});
      },
      start: function(done) {
        done()
      },
      stop: function(done) {
        done()
      }
    }
  }
]
