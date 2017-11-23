'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.default =
















getJest;var _path;function _load_path() {return _path = _interopRequireDefault(require('path'));}var _chalk;function _load_chalk() {return _chalk = _interopRequireDefault(require('chalk'));}var _gracefulFs;function _load_gracefulFs() {return _gracefulFs = _interopRequireDefault(require('graceful-fs'));}var _jest;function _load_jest() {return _jest = _interopRequireDefault(require('../jest'));}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function getJest(packageRoot) {
  const packageJSONPath = (_path || _load_path()).default.join(packageRoot, 'package.json');
  const binPath = (_path || _load_path()).default.join(packageRoot, 'node_modules/jest-cli');
  if ((_gracefulFs || _load_gracefulFs()).default.existsSync(binPath)) {
    /* $FlowFixMe */
    return require(binPath);
  } else {
    // Check if Jest is specified in `package.json` but not installed.
    if ((_gracefulFs || _load_gracefulFs()).default.existsSync(packageJSONPath)) {
      /* $FlowFixMe */
      const packageJSON = require(packageJSONPath);
      const dependencies = packageJSON.dependencies;
      const devDependencies = packageJSON.devDependencies;
      if (
      dependencies && dependencies['jest-cli'] ||
      devDependencies && devDependencies['jest-cli'])
      {
        process.on('exit', () =>
        console.log(
        (_chalk || _load_chalk()).default.red(
        'Please run `npm install` to use the version of Jest intended ' +
        'for this project.')));



      }
    }
    return (_jest || _load_jest()).default;
  }
} // eslint-disable-next-line import/default
/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */