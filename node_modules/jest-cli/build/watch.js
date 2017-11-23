'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.default =
































watch;var _ansiEscapes;function _load_ansiEscapes() {return _ansiEscapes = _interopRequireDefault(require('ansi-escapes'));}var _chalk;function _load_chalk() {return _chalk = _interopRequireDefault(require('chalk'));}var _get_changed_files_promise;function _load_get_changed_files_promise() {return _get_changed_files_promise = _interopRequireDefault(require('./get_changed_files_promise'));}var _jestRegexUtil;function _load_jestRegexUtil() {return _jestRegexUtil = require('jest-regex-util');}var _jestHasteMap;function _load_jestHasteMap() {return _jestHasteMap = _interopRequireDefault(require('jest-haste-map'));}var _isCi;function _load_isCi() {return _isCi = _interopRequireDefault(require('is-ci'));}var _is_valid_path;function _load_is_valid_path() {return _is_valid_path = _interopRequireDefault(require('./lib/is_valid_path'));}var _pre_run_message;function _load_pre_run_message() {return _pre_run_message = require('./pre_run_message');}var _create_context;function _load_create_context() {return _create_context = _interopRequireDefault(require('./lib/create_context'));}var _run_jest;function _load_run_jest() {return _run_jest = _interopRequireDefault(require('./run_jest'));}var _update_global_config;function _load_update_global_config() {return _update_global_config = _interopRequireDefault(require('./lib/update_global_config'));}var _search_source;function _load_search_source() {return _search_source = _interopRequireDefault(require('./search_source'));}var _test_watcher;function _load_test_watcher() {return _test_watcher = _interopRequireDefault(require('./test_watcher'));}var _Prompt;function _load_Prompt() {return _Prompt = _interopRequireDefault(require('./lib/Prompt'));}var _test_path_pattern_prompt;function _load_test_path_pattern_prompt() {return _test_path_pattern_prompt = _interopRequireDefault(require('./test_path_pattern_prompt'));}var _test_name_pattern_prompt;function _load_test_name_pattern_prompt() {return _test_name_pattern_prompt = _interopRequireDefault(require('./test_name_pattern_prompt'));}var _constants;function _load_constants() {return _constants = require('./constants');}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}const isInteractive = process.stdout.isTTY && !(_isCi || _load_isCi()).default; /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * This source code is licensed under the MIT license found in the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * LICENSE file in the root directory of this source tree.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   */let hasExitListener = false;function watch(initialGlobalConfig, contexts, outputStream, hasteMapInstances) {let stdin = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : process.stdin; // `globalConfig` will be consantly updated and reassigned as a result of
  // watch mode interactions.
  let globalConfig = initialGlobalConfig;

  globalConfig = (0, (_update_global_config || _load_update_global_config()).default)(globalConfig, {
    mode: globalConfig.watch ? 'watch' : 'watchAll' });


  const prompt = new (_Prompt || _load_Prompt()).default();
  const testPathPatternPrompt = new (_test_path_pattern_prompt || _load_test_path_pattern_prompt()).default(outputStream, prompt);
  const testNamePatternPrompt = new (_test_name_pattern_prompt || _load_test_name_pattern_prompt()).default(outputStream, prompt);
  let searchSources = contexts.map(context => ({
    context,
    searchSource: new (_search_source || _load_search_source()).default(context) }));

  let hasSnapshotFailure = false;
  let isRunning = false;
  let testWatcher;
  let shouldDisplayWatchUsage = true;
  let isWatchUsageDisplayed = false;

  testPathPatternPrompt.updateSearchSources(searchSources);

  hasteMapInstances.forEach((hasteMapInstance, index) => {
    hasteMapInstance.on('change', (_ref) => {let eventsQueue = _ref.eventsQueue,hasteFS = _ref.hasteFS,moduleMap = _ref.moduleMap;
      const validPaths = eventsQueue.filter((_ref2) => {let filePath = _ref2.filePath;
        return (0, (_is_valid_path || _load_is_valid_path()).default)(globalConfig, contexts[index].config, filePath);
      });

      if (validPaths.length) {
        const context = contexts[index] = (0, (_create_context || _load_create_context()).default)(
        contexts[index].config,
        {
          hasteFS,
          moduleMap });


        prompt.abort();
        searchSources = searchSources.slice();
        searchSources[index] = {
          context,
          searchSource: new (_search_source || _load_search_source()).default(context) };

        testPathPatternPrompt.updateSearchSources(searchSources);
        startRun(globalConfig);
      }
    });
  });

  if (!hasExitListener) {
    hasExitListener = true;
    process.on('exit', () => {
      if (prompt.isEntering()) {
        outputStream.write((_ansiEscapes || _load_ansiEscapes()).default.cursorDown());
        outputStream.write((_ansiEscapes || _load_ansiEscapes()).default.eraseDown);
      }
    });
  }

  const startRun = globalConfig => {
    if (isRunning) {
      return null;
    }

    testWatcher = new (_test_watcher || _load_test_watcher()).default({ isWatchMode: true });
    isInteractive && outputStream.write((_constants || _load_constants()).CLEAR);
    (0, (_pre_run_message || _load_pre_run_message()).print)(outputStream);
    isRunning = true;
    const configs = contexts.map(context => context.config);
    const changedFilesPromise = (0, (_get_changed_files_promise || _load_get_changed_files_promise()).default)(globalConfig, configs);
    return (0, (_run_jest || _load_run_jest()).default)({
      changedFilesPromise,
      contexts,
      globalConfig,
      onComplete: results => {
        isRunning = false;
        hasSnapshotFailure = !!results.snapshot.failure;
        // Create a new testWatcher instance so that re-runs won't be blocked.
        // The old instance that was passed to Jest will still be interrupted
        // and prevent test runs from the previous run.
        testWatcher = new (_test_watcher || _load_test_watcher()).default({ isWatchMode: true });
        if (shouldDisplayWatchUsage) {
          outputStream.write(usage(globalConfig, hasSnapshotFailure));
          shouldDisplayWatchUsage = false; // hide Watch Usage after first run
          isWatchUsageDisplayed = true;
        } else {
          outputStream.write(showToggleUsagePrompt());
          shouldDisplayWatchUsage = false;
          isWatchUsageDisplayed = false;
        }

        testNamePatternPrompt.updateCachedTestResults(results.testResults);
      },
      outputStream,
      startRun,
      testWatcher }).
    catch(error => console.error((_chalk || _load_chalk()).default.red(error.stack)));
  };

  const onKeypress = key => {
    if (key === (_constants || _load_constants()).KEYS.CONTROL_C || key === (_constants || _load_constants()).KEYS.CONTROL_D) {
      process.exit(0);
      return;
    }

    if (prompt.isEntering()) {
      prompt.put(key);
      return;
    }

    // Abort test run
    if (
    isRunning &&
    testWatcher &&
    [(_constants || _load_constants()).KEYS.Q, (_constants || _load_constants()).KEYS.ENTER, (_constants || _load_constants()).KEYS.A, (_constants || _load_constants()).KEYS.O, (_constants || _load_constants()).KEYS.P, (_constants || _load_constants()).KEYS.T].indexOf(key) !== -1)
    {
      testWatcher.setState({ interrupted: true });
      return;
    }

    switch (key) {
      case (_constants || _load_constants()).KEYS.Q:
        process.exit(0);
        return;
      case (_constants || _load_constants()).KEYS.ENTER:
        startRun(globalConfig);
        break;
      case (_constants || _load_constants()).KEYS.U:
        globalConfig = (0, (_update_global_config || _load_update_global_config()).default)(globalConfig, {
          updateSnapshot: 'all' });

        startRun(globalConfig);
        globalConfig = (0, (_update_global_config || _load_update_global_config()).default)(globalConfig, {
          // updateSnapshot is not sticky after a run.
          updateSnapshot: 'none' });

        break;
      case (_constants || _load_constants()).KEYS.A:
        globalConfig = (0, (_update_global_config || _load_update_global_config()).default)(globalConfig, {
          mode: 'watchAll',
          testNamePattern: '',
          testPathPattern: '' });

        startRun(globalConfig);
        break;
      case (_constants || _load_constants()).KEYS.C:
        globalConfig = (0, (_update_global_config || _load_update_global_config()).default)(globalConfig, {
          mode: 'watch',
          testNamePattern: '',
          testPathPattern: '' });

        startRun(globalConfig);
        break;
      case (_constants || _load_constants()).KEYS.O:
        globalConfig = (0, (_update_global_config || _load_update_global_config()).default)(globalConfig, {
          mode: 'watch',
          testNamePattern: '',
          testPathPattern: '' });

        startRun(globalConfig);
        break;
      case (_constants || _load_constants()).KEYS.P:
        testPathPatternPrompt.run(
        testPathPattern => {
          globalConfig = (0, (_update_global_config || _load_update_global_config()).default)(globalConfig, {
            mode: 'watch',
            testNamePattern: '',
            testPathPattern: (0, (_jestRegexUtil || _load_jestRegexUtil()).replacePathSepForRegex)(testPathPattern) });


          startRun(globalConfig);
        },
        onCancelPatternPrompt,
        { header: activeFilters(globalConfig) });

        break;
      case (_constants || _load_constants()).KEYS.T:
        testNamePatternPrompt.run(
        testNamePattern => {
          globalConfig = (0, (_update_global_config || _load_update_global_config()).default)(globalConfig, {
            mode: 'watch',
            testNamePattern,
            testPathPattern: globalConfig.testPathPattern });


          startRun(globalConfig);
        },
        onCancelPatternPrompt,
        { header: activeFilters(globalConfig) });

        break;
      case (_constants || _load_constants()).KEYS.QUESTION_MARK:
        break;
      case (_constants || _load_constants()).KEYS.W:
        if (!shouldDisplayWatchUsage && !isWatchUsageDisplayed) {
          outputStream.write((_ansiEscapes || _load_ansiEscapes()).default.cursorUp());
          outputStream.write((_ansiEscapes || _load_ansiEscapes()).default.eraseDown);
          outputStream.write(usage(globalConfig, hasSnapshotFailure));
          isWatchUsageDisplayed = true;
          shouldDisplayWatchUsage = false;
        }
        break;}

  };

  const onCancelPatternPrompt = () => {
    outputStream.write((_ansiEscapes || _load_ansiEscapes()).default.cursorHide);
    outputStream.write((_ansiEscapes || _load_ansiEscapes()).default.clearScreen);
    outputStream.write(usage(globalConfig, hasSnapshotFailure));
    outputStream.write((_ansiEscapes || _load_ansiEscapes()).default.cursorShow);
  };

  if (typeof stdin.setRawMode === 'function') {
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('hex');
    stdin.on('data', onKeypress);
  }

  startRun(globalConfig);
  return Promise.resolve();
}

const activeFilters = function (globalConfig) {let delimiter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '\n';const
  testNamePattern = globalConfig.testNamePattern,testPathPattern = globalConfig.testPathPattern;
  if (testNamePattern || testPathPattern) {
    const filters = [
    testPathPattern ?
    (_chalk || _load_chalk()).default.dim('filename ') + (_chalk || _load_chalk()).default.yellow('/' + testPathPattern + '/') :
    null,
    testNamePattern ?
    (_chalk || _load_chalk()).default.dim('test name ') + (_chalk || _load_chalk()).default.yellow('/' + testNamePattern + '/') :
    null].

    filter(f => !!f).
    join(', ');

    const messages = ['\n' + (_chalk || _load_chalk()).default.bold('Active Filters: ') + filters];

    return messages.filter(message => !!message).join(delimiter);
  }

  return '';
};

const usage = function (globalConfig, snapshotFailure) {let delimiter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '\n';
  const messages = [
  activeFilters(globalConfig),

  globalConfig.testPathPattern || globalConfig.testNamePattern ?
  (_chalk || _load_chalk()).default.dim(' \u203A Press ') + 'c' + (_chalk || _load_chalk()).default.dim(' to clear filters.') :
  null,
  '\n' + (_chalk || _load_chalk()).default.bold('Watch Usage'),

  globalConfig.watch ?
  (_chalk || _load_chalk()).default.dim(' \u203A Press ') + 'a' + (_chalk || _load_chalk()).default.dim(' to run all tests.') :
  null,

  (globalConfig.watchAll ||
  globalConfig.testPathPattern ||
  globalConfig.testNamePattern) &&
  !globalConfig.noSCM ?
  (_chalk || _load_chalk()).default.dim(' \u203A Press ') +
  'o' +
  (_chalk || _load_chalk()).default.dim(' to only run tests related to changed files.') :
  null,

  snapshotFailure ?
  (_chalk || _load_chalk()).default.dim(' \u203A Press ') +
  'u' +
  (_chalk || _load_chalk()).default.dim(' to update failing snapshots.') :
  null,

  (_chalk || _load_chalk()).default.dim(' \u203A Press ') +
  'p' +
  (_chalk || _load_chalk()).default.dim(' to filter by a filename regex pattern.'),

  (_chalk || _load_chalk()).default.dim(' \u203A Press ') +
  't' +
  (_chalk || _load_chalk()).default.dim(' to filter by a test name regex pattern.'),

  (_chalk || _load_chalk()).default.dim(' \u203A Press ') + 'q' + (_chalk || _load_chalk()).default.dim(' to quit watch mode.'),

  (_chalk || _load_chalk()).default.dim(' \u203A Press ') +
  'Enter' +
  (_chalk || _load_chalk()).default.dim(' to trigger a test run.')];


  return messages.filter(message => !!message).join(delimiter) + '\n';
};

const showToggleUsagePrompt = () =>
'\n' +
(_chalk || _load_chalk()).default.bold('Watch Usage: ') +
(_chalk || _load_chalk()).default.dim('Press ') +
'w' +
(_chalk || _load_chalk()).default.dim(' to show more.');