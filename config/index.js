var rootConfig = require('../../../config');

rootConfig.add('X3-bot', {type: 'file', file: __dirname + '/dev.private.json'});
var config = rootConfig;

module.exports = config;