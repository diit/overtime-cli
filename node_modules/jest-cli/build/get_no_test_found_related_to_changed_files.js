'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.default =

getNoTestFoundRelatedToChangedFiles;var _chalk;function _load_chalk() {return _chalk = _interopRequireDefault(require('chalk'));}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function getNoTestFoundRelatedToChangedFiles(globalConfig) {
  return (
    (_chalk || _load_chalk()).default.bold('No tests found related to files changed since last commit.\n') +
    (_chalk || _load_chalk()).default.dim(
    globalConfig.watch ?
    'Press `a` to run all tests, or run Jest with `--watchAll`.' :
    'Run Jest without `-o` or with `--all` to run all tests.'));


}