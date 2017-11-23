'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.default =































runTest;var _fs;function _load_fs() {return _fs = _interopRequireDefault(require('fs'));}var _jestUtil;function _load_jestUtil() {return _jestUtil = require('jest-util');}var _jestJasmine;function _load_jestJasmine() {return _jestJasmine = _interopRequireDefault(require('jest-jasmine2'));}var _jestConfig;function _load_jestConfig() {return _jestConfig = require('jest-config');}var _jestDocblock;function _load_jestDocblock() {return _jestDocblock = _interopRequireDefault(require('jest-docblock'));}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };} // The default jest-runner is required because it is the default test runner
// and required implicitly through the `testRunner` ProjectConfig option.
(_jestJasmine || _load_jestJasmine()).default; /**
                                                * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                                *
                                                * This source code is licensed under the MIT license found in the
                                                * LICENSE file in the root directory of this source tree.
                                                *
                                                * 
                                                */function runTest(path, globalConfig, config, resolver) {let testSource;try {testSource = (_fs || _load_fs()).default.readFileSync(path, 'utf8');
  } catch (e) {
    return Promise.reject(e);
  }

  const parsedDocblock = (_jestDocblock || _load_jestDocblock()).default.parse((_jestDocblock || _load_jestDocblock()).default.extract(testSource));
  const customEnvironment = parsedDocblock['jest-environment'];
  let testEnvironment = config.testEnvironment;

  if (customEnvironment) {
    testEnvironment = (0, (_jestConfig || _load_jestConfig()).getTestEnvironment)(
    Object.assign({}, config, {
      testEnvironment: customEnvironment }));


  }

  /* $FlowFixMe */
  const TestEnvironment = require(testEnvironment);
  /* $FlowFixMe */
  const testFramework = require(config.testRunner);
  /* $FlowFixMe */
  const Runtime = require(config.moduleLoader || 'jest-runtime');



  const environment = new TestEnvironment(config);
  const consoleOut = globalConfig.useStderr ? process.stderr : process.stdout;
  const consoleFormatter = (type, message) =>
  (0, (_jestUtil || _load_jestUtil()).getConsoleOutput)(
  config.cwd,
  !!globalConfig.verbose,
  // 4 = the console call is buried 4 stack frames deep
  (_jestUtil || _load_jestUtil()).BufferedConsole.write([], type, message, 4));


  let testConsole;
  if (globalConfig.silent) {
    testConsole = new (_jestUtil || _load_jestUtil()).NullConsole(consoleOut, process.stderr, consoleFormatter);
  } else {
    if (globalConfig.verbose) {
      testConsole = new (_jestUtil || _load_jestUtil()).Console(consoleOut, process.stderr, consoleFormatter);
    } else {
      testConsole = new (_jestUtil || _load_jestUtil()).BufferedConsole();
    }
  }

  const cacheFS = { [path]: testSource };
  (0, (_jestUtil || _load_jestUtil()).setGlobal)(environment.global, 'console', testConsole);
  const runtime = new Runtime(config, environment, resolver, cacheFS, {
    collectCoverage: globalConfig.collectCoverage,
    collectCoverageFrom: globalConfig.collectCoverageFrom,
    collectCoverageOnlyFrom: globalConfig.collectCoverageOnlyFrom,
    mapCoverage: globalConfig.mapCoverage });

  const start = Date.now();
  return testFramework(globalConfig, config, environment, runtime, path).
  then(result => {
    const testCount =
    result.numPassingTests +
    result.numFailingTests +
    result.numPendingTests;
    result.perfStats = { end: Date.now(), start };
    result.testFilePath = path;
    result.coverage = runtime.getAllCoverageInfo();
    result.sourceMaps = runtime.getSourceMapInfo();
    result.console = testConsole.getBuffer();
    result.skipped = testCount === result.numPendingTests;
    result.displayName = config.displayName;
    return result;
  }).
  then(
  result =>
  Promise.resolve().then(() => {
    environment.dispose();
    if (globalConfig.logHeapUsage) {
      if (global.gc) {
        global.gc();
      }
      result.memoryUsage = process.memoryUsage().heapUsed;
    }

    // Delay the resolution to allow log messages to be output.
    return new Promise(resolve => setImmediate(() => resolve(result)));
  }),
  err =>
  Promise.resolve().then(() => {
    environment.dispose();
    throw err;
  }));

}