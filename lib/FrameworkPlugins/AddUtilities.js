/**
 * @file AddUtilities
 * @author Jim Bulkowski <jim.b@paperelectron.com>
 * @project plugin-finder
 * @license MIT {@link http://opensource.org/licenses/MIT}
 */

const _fp = require('lodash/fp')
const transform = _fp.transform.convert({cap: false})
/**
 *
 * @module AddUtilities
 */

function hasType(item){
  return ({}).toString.call(item).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

exports.options = {
  Utilities: {
    HelloPomegranate: () => {
      // These can be Objects, Funtions, Strings etc. that don' need any other Dependencies.
      console.log('Hello, I am a function that has been added to the injector.')
    }
  }
}

exports.metadata = {
  name: 'AddUtilities',
  type: 'dynamic'
}

exports.plugin = {
  load: function(inject, loaded) {
    let Utils = transform((acc, value, key) => {
      this.Logger.log(`Found property '${key}' with type: ${hasType(value)}`)
      acc.push({load: value, param: key })
    }, [])(this.options.Utilities)
    loaded(null, Utils)
  },
  start: function(done) {
    done()
  },
  stop: function(done) {
    done()
  }
}