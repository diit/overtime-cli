'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _jestUtil;




















function _load_jestUtil() {return _jestUtil = require('jest-util');}var _istanbulApi;
function _load_istanbulApi() {return _istanbulApi = require('istanbul-api');}var _chalk;
function _load_chalk() {return _chalk = _interopRequireDefault(require('chalk'));}var _isCi;
function _load_isCi() {return _isCi = _interopRequireDefault(require('is-ci'));}var _istanbulLibCoverage;
function _load_istanbulLibCoverage() {return _istanbulLibCoverage = _interopRequireDefault(require('istanbul-lib-coverage'));}var _istanbulLibSourceMaps;
function _load_istanbulLibSourceMaps() {return _istanbulLibSourceMaps = _interopRequireDefault(require('istanbul-lib-source-maps'));}var _pify;
function _load_pify() {return _pify = _interopRequireDefault(require('pify'));}var _workerFarm;
function _load_workerFarm() {return _workerFarm = _interopRequireDefault(require('worker-farm'));}var _base_reporter;
function _load_base_reporter() {return _base_reporter = _interopRequireDefault(require('./base_reporter'));}var _coverage_worker;

function _load_coverage_worker() {return _coverage_worker = _interopRequireDefault(require('./coverage_worker'));}var _path;
function _load_path() {return _path = _interopRequireDefault(require('path'));}var _glob;
function _load_glob() {return _glob = _interopRequireDefault(require('glob'));}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * This source code is licensed under the MIT license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               */ // eslint-disable-next-line import/default
const FAIL_COLOR = (_chalk || _load_chalk()).default.bold.red;const RUNNING_TEST_COLOR = (_chalk || _load_chalk()).default.bold.dim;const isInteractive = process.stdout.isTTY && !(_isCi || _load_isCi()).default;class CoverageReporter extends (_base_reporter || _load_base_reporter()).default {



  constructor(globalConfig) {
    super();
    this._coverageMap = (_istanbulLibCoverage || _load_istanbulLibCoverage()).default.createCoverageMap({});
    this._globalConfig = globalConfig;
    this._sourceMapStore = (_istanbulLibSourceMaps || _load_istanbulLibSourceMaps()).default.createSourceMapStore();
  }

  onTestResult(
  test,
  testResult,
  aggregatedResults)
  {
    if (testResult.coverage) {
      this._coverageMap.merge(testResult.coverage);
      // Remove coverage data to free up some memory.
      delete testResult.coverage;

      Object.keys(testResult.sourceMaps).forEach(sourcePath => {
        let coverage, inputSourceMap;
        try {
          coverage = this._coverageMap.fileCoverageFor(sourcePath);var _coverage$toJSON =
          coverage.toJSON();inputSourceMap = _coverage$toJSON.inputSourceMap;
        } finally {
          if (inputSourceMap) {
            this._sourceMapStore.registerMap(sourcePath, inputSourceMap);
          } else {
            this._sourceMapStore.registerURL(
            sourcePath,
            testResult.sourceMaps[sourcePath]);

          }
        }
      });
    }
  }

  onRunComplete(
  contexts,
  aggregatedResults)
  {var _this = this;return _asyncToGenerator(function* () {
      yield _this._addUntestedFiles(_this._globalConfig, contexts);
      let map = _this._coverageMap;
      let sourceFinder;
      if (_this._globalConfig.mapCoverage) {var _sourceMapStore$trans =
        _this._sourceMapStore.transformCoverage(map);map = _sourceMapStore$trans.map;sourceFinder = _sourceMapStore$trans.sourceFinder;
      }

      const reporter = (0, (_istanbulApi || _load_istanbulApi()).createReporter)();
      try {
        if (_this._globalConfig.coverageDirectory) {
          reporter.dir = _this._globalConfig.coverageDirectory;
        }

        let coverageReporters = _this._globalConfig.coverageReporters || [];
        if (
        !_this._globalConfig.useStderr &&
        coverageReporters.length &&
        coverageReporters.indexOf('text') === -1)
        {
          coverageReporters = coverageReporters.concat(['text-summary']);
        }

        reporter.addAll(coverageReporters);
        reporter.write(map, sourceFinder && { sourceFinder });
        aggregatedResults.coverageMap = map;
      } catch (e) {
        console.error(
        (_chalk || _load_chalk()).default.red(`
        Failed to write coverage reports:
        ERROR: ${e.toString()}
        STACK: ${e.stack}
      `));

      }

      _this._checkThreshold(_this._globalConfig, map);})();
  }

  _addUntestedFiles(globalConfig, contexts) {
    const files = [];
    contexts.forEach(context => {
      const config = context.config;
      if (
      globalConfig.collectCoverageFrom &&
      globalConfig.collectCoverageFrom.length)
      {
        context.hasteFS.
        matchFilesWithGlob(globalConfig.collectCoverageFrom, config.rootDir).
        forEach(filePath =>
        files.push({
          config,
          path: filePath }));


      }
    });
    if (!files.length) {
      return Promise.resolve();
    }

    if (isInteractive) {
      process.stderr.write(
      RUNNING_TEST_COLOR('Running coverage on untested files...'));

    }

    let worker;
    let farm;
    if (this._globalConfig.maxWorkers <= 1) {
      worker = (0, (_pify || _load_pify()).default)((_coverage_worker || _load_coverage_worker()).default);
    } else {
      farm = (0, (_workerFarm || _load_workerFarm()).default)(
      {
        autoStart: true,
        maxConcurrentCallsPerWorker: 1,
        maxConcurrentWorkers: this._globalConfig.maxWorkers,
        maxRetries: 2 },

      require.resolve('./coverage_worker'));

      worker = (0, (_pify || _load_pify()).default)(farm);
    }
    const instrumentation = [];
    files.forEach(fileObj => {
      const filename = fileObj.path;
      const config = fileObj.config;
      if (!this._coverageMap.data[filename]) {
        const promise = worker({
          config,
          globalConfig,
          path: filename }).

        then(result => {
          if (result) {
            this._coverageMap.addFileCoverage(result.coverage);
            if (result.sourceMapPath) {
              this._sourceMapStore.registerURL(
              filename,
              result.sourceMapPath);

            }
          }
        }).
        catch(error => {
          console.error((_chalk || _load_chalk()).default.red(error.message));
        });
        instrumentation.push(promise);
      }
    });

    const cleanup = () => {
      if (isInteractive) {
        (0, (_jestUtil || _load_jestUtil()).clearLine)(process.stderr);
      }
      if (farm) {
        (_workerFarm || _load_workerFarm()).default.end(farm);
      }
    };

    return Promise.all(instrumentation).
    then(cleanup).
    catch(cleanup);
  }

  _checkThreshold(globalConfig, map) {
    if (globalConfig.coverageThreshold) {
      function check(name, thresholds, actuals) {
        return [
        'statements',
        'branches',
        'lines',
        'functions'].
        reduce((errors, key) => {
          const actual = actuals[key].pct;
          const actualUncovered = actuals[key].total - actuals[key].covered;
          const threshold = thresholds[key];

          if (threshold != null) {
            if (threshold < 0) {
              if (threshold * -1 < actualUncovered) {
                errors.push(
                `Jest: Uncovered count for ${key} (${actualUncovered})` +
                `exceeds ${name} threshold (${-1 * threshold})`);

              }
            } else if (actual < threshold) {
              errors.push(
              `Jest: Coverage for ${key} (${actual}` +
              `%) does not meet ${name} threshold (${threshold}%)`);

            }
          }
          return errors;
        }, []);
      }

      const expandedThresholds = {};
      Object.keys(globalConfig.coverageThreshold).forEach(filePathOrGlob => {
        if (filePathOrGlob !== 'global') {
          const pathArray = (_glob || _load_glob()).default.sync(filePathOrGlob);
          pathArray.forEach(filePath => {
            expandedThresholds[(_path || _load_path()).default.resolve(filePath)] =
            globalConfig.coverageThreshold[filePathOrGlob];
          });
        } else {
          expandedThresholds.global = globalConfig.coverageThreshold.global;
        }
      });

      const filteredCoverageSummary = map.
      files().
      filter(
      filePath => Object.keys(expandedThresholds).indexOf(filePath) === -1).

      map(filePath => map.fileCoverageFor(filePath)).
      reduce((summary, fileCov) => {
        return summary === undefined || summary === null ?
        summary = fileCov.toSummary() :
        summary.merge(fileCov.toSummary());
      }, undefined);

      const errors = [].concat.apply(
      [],
      Object.keys(expandedThresholds).
      map(thresholdKey => {
        if (thresholdKey === 'global') {
          if (filteredCoverageSummary !== undefined) {
            return check(
            'global',
            expandedThresholds.global,
            filteredCoverageSummary);

          } else {
            return [];
          }
        } else {
          if (map.files().indexOf(thresholdKey) !== -1) {
            return check(
            thresholdKey,
            expandedThresholds[thresholdKey],
            map.fileCoverageFor(thresholdKey).toSummary());

          } else {
            return [
            `Jest: Coverage data for ${thresholdKey} was not found.`];

          }
        }
      }).
      filter(errorArray => {
        return (
          errorArray !== undefined &&
          errorArray !== null &&
          errorArray.length > 0);

      }));


      if (errors.length > 0) {
        this.log(`${FAIL_COLOR(errors.join('\n'))}`);
        this._setError(new Error(errors.join('\n')));
      }
    }
  }

  // Only exposed for the internal runner. Should not be used
  getCoverageMap() {
    return this._coverageMap;
  }}exports.default = CoverageReporter;