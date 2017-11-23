'use strict';var _fs;











function _load_fs() {return _fs = _interopRequireDefault(require('fs'));}var _generate_empty_coverage;
function _load_generate_empty_coverage() {return _generate_empty_coverage = _interopRequireDefault(require('../generate_empty_coverage'));}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} /**
                                                                                                                                                                                                                                          * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                                                                                                                                                                                                                          *
                                                                                                                                                                                                                                          * This source code is licensed under the MIT license found in the
                                                                                                                                                                                                                                          * LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                          *
                                                                                                                                                                                                                                          * 
                                                                                                                                                                                                                                          */


function formatCoverageError(error, filename) {
  const message = `
    Failed to collect coverage from ${filename}
    ERROR: ${error}
    STACK: ${error.stack}
  `;

  return {
    code: error.code || undefined,
    message,
    stack: error.stack,
    type: 'ERROR' };

}

// Make sure uncaught errors are logged before we exit.
process.on('uncaughtException', err => {
  console.error(err.stack);
  process.exit(1);
});

// Cannot use ESM export as worker-farm chokes
module.exports = (_ref,

callback) =>
{let config = _ref.config,globalConfig = _ref.globalConfig,path = _ref.path;
  try {
    const source = (_fs || _load_fs()).default.readFileSync(path, 'utf8');
    const result = (0, (_generate_empty_coverage || _load_generate_empty_coverage()).default)(source, path, globalConfig, config);
    callback(null, result);
  } catch (error) {
    callback(formatCoverageError(error, path), undefined);
  }
};