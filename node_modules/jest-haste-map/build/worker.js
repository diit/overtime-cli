'use strict';var _path;











function _load_path() {return _path = _interopRequireDefault(require('path'));}var _jestDocblock;
function _load_jestDocblock() {return _jestDocblock = _interopRequireDefault(require('jest-docblock'));}var _gracefulFs;
function _load_gracefulFs() {return _gracefulFs = _interopRequireDefault(require('graceful-fs'));}var _constants;
function _load_constants() {return _constants = _interopRequireDefault(require('./constants'));}var _extract_requires;
function _load_extract_requires() {return _extract_requires = _interopRequireDefault(require('./lib/extract_requires'));}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const JSON_EXTENSION = '.json'; /**
                                 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                 *
                                 * This source code is licensed under the MIT license found in the
                                 * LICENSE file in the root directory of this source tree.
                                 *
                                 * 
                                 */const PACKAGE_JSON = (_path || _load_path()).default.sep + 'package' + JSON_EXTENSION;let hasteImpl = null;let hasteImplModulePath = null;const formatError = error => {if (typeof error === 'string') {
    return {
      message: error,
      stack: null,
      type: 'Error' };

  }

  return {
    code: error.code || undefined,
    message: error.message,
    stack: error.stack,
    type: 'Error' };

};

// Cannot be ESM export or worker-farm is confused
module.exports = (data, callback) => {
  if (
  data.hasteImplModulePath &&
  data.hasteImplModulePath !== hasteImplModulePath)
  {
    if (hasteImpl) {
      throw new Error('jest-haste-map: hasteImplModulePath changed');
    }
    hasteImplModulePath = data.hasteImplModulePath;
    hasteImpl =
    // $FlowFixMe: dynamic require
    require(hasteImplModulePath);
  }

  try {
    const filePath = data.filePath;
    const content = (_gracefulFs || _load_gracefulFs()).default.readFileSync(filePath, 'utf8');
    let module;
    let id;
    let dependencies;

    if (filePath.endsWith(PACKAGE_JSON)) {
      const fileData = JSON.parse(content);
      if (fileData.name) {
        id = fileData.name;
        module = [filePath, (_constants || _load_constants()).default.PACKAGE];
      }
    } else if (!filePath.endsWith(JSON_EXTENSION)) {
      if (hasteImpl) {
        id = hasteImpl.getHasteName(filePath);
      } else {
        const doc = (_jestDocblock || _load_jestDocblock()).default.parse((_jestDocblock || _load_jestDocblock()).default.extract(content));
        id = doc.providesModule || doc.provides;
      }
      dependencies = (0, (_extract_requires || _load_extract_requires()).default)(content);
      if (id) {
        module = [filePath, (_constants || _load_constants()).default.MODULE];
      }
    }

    callback(null, { dependencies, id, module });
  } catch (error) {
    callback(formatError(error));
  }
};