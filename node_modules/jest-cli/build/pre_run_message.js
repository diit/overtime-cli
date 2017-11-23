'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.remove = exports.print = undefined;var _jestUtil;








function _load_jestUtil() {return _jestUtil = require('jest-util');}var _chalk;

function _load_chalk() {return _chalk = _interopRequireDefault(require('chalk'));}var _isCi;
function _load_isCi() {return _isCi = _interopRequireDefault(require('is-ci'));}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

const print = exports.print = stream => {
  if (process.stdout.isTTY && !(_isCi || _load_isCi()).default) {
    stream.write((_chalk || _load_chalk()).default.bold.dim('Determining test suites to run...'));
  }
}; /**
    * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
    *
    * This source code is licensed under the MIT license found in the
    * LICENSE file in the root directory of this source tree.
    *
    * 
    */const remove = exports.remove = stream => {if (stream.isTTY && !(_isCi || _load_isCi()).default) {(0, (_jestUtil || _load_jestUtil()).clearLine)(stream);}};