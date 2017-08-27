(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("domain");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var aspnet_prerendering_1 = __webpack_require__(2);
exports.default = aspnet_prerendering_1.createServerRenderer(function (params) {
    return new Promise(function (resolve, reject) {
        var result = "<h1>hello</h1>";
        resolve({ html: result });
    });
});


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(3));


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var url = __webpack_require__(4);
var domain = __webpack_require__(0);
var main_1 = __webpack_require__(5);
var defaultTimeoutMilliseconds = 30 * 1000;
function createServerRenderer(bootFunc) {
    var resultFunc = function (callback, applicationBasePath, bootModule, absoluteRequestUrl, requestPathAndQuery, customDataParameter, overrideTimeoutMilliseconds, requestPathBase) {
        // Prepare a promise that will represent the completion of all domain tasks in this execution context.
        // The boot code will wait for this before performing its final render.
        var domainTaskCompletionPromiseResolve;
        var domainTaskCompletionPromise = new Promise(function (resolve, reject) {
            domainTaskCompletionPromiseResolve = resolve;
        });
        var parsedAbsoluteRequestUrl = url.parse(absoluteRequestUrl);
        var params = {
            // It's helpful for boot funcs to receive the query as a key-value object, so parse it here
            // e.g., react-redux-router requires location.query to be a key-value object for consistency with client-side behaviour
            location: url.parse(requestPathAndQuery, /* parseQueryString */ true),
            origin: parsedAbsoluteRequestUrl.protocol + '//' + parsedAbsoluteRequestUrl.host,
            url: requestPathAndQuery,
            baseUrl: (requestPathBase || '') + '/',
            absoluteUrl: absoluteRequestUrl,
            domainTasks: domainTaskCompletionPromise,
            data: customDataParameter
        };
        var absoluteBaseUrl = params.origin + params.baseUrl; // Should be same value as page's <base href>
        // Open a new domain that can track all the async tasks involved in the app's execution
        main_1.run(/* code to run */ function () {
            // Workaround for Node bug where native Promise continuations lose their domain context
            // (https://github.com/nodejs/node-v0.x-archive/issues/8648)
            // The domain.active property is set by the domain-context module
            bindPromiseContinuationsToDomain(domainTaskCompletionPromise, domain['active']);
            // Make the base URL available to the 'domain-tasks/fetch' helper within this execution context
            main_1.baseUrl(absoluteBaseUrl);
            // Begin rendering, and apply a timeout
            var bootFuncPromise = bootFunc(params);
            if (!bootFuncPromise || typeof bootFuncPromise.then !== 'function') {
                callback("Prerendering failed because the boot function in " + bootModule.moduleName + " did not return a promise.", null);
                return;
            }
            var timeoutMilliseconds = overrideTimeoutMilliseconds || defaultTimeoutMilliseconds; // e.g., pass -1 to override as 'never time out'
            var bootFuncPromiseWithTimeout = timeoutMilliseconds > 0
                ? wrapWithTimeout(bootFuncPromise, timeoutMilliseconds, "Prerendering timed out after " + timeoutMilliseconds + "ms because the boot function in '" + bootModule.moduleName + "' "
                    + 'returned a promise that did not resolve or reject. Make sure that your boot function always resolves or '
                    + 'rejects its promise. You can change the timeout value using the \'asp-prerender-timeout\' tag helper.')
                : bootFuncPromise;
            // Actually perform the rendering
            bootFuncPromiseWithTimeout.then(function (successResult) {
                callback(null, successResult);
            }, function (error) {
                callback(error, null);
            });
        }, /* completion callback */ function (/* completion callback */ errorOrNothing) {
            if (errorOrNothing) {
                callback(errorOrNothing, null);
            }
            else {
                // There are no more ongoing domain tasks (typically data access operations), so we can resolve
                // the domain tasks promise which notifies the boot code that it can do its final render.
                domainTaskCompletionPromiseResolve();
            }
        });
    };
    // Indicate to the prerendering code bundled into Microsoft.AspNetCore.SpaServices that this is a serverside rendering
    // function, so it can be invoked directly. This flag exists only so that, in its absence, we can run some different
    // backward-compatibility logic.
    resultFunc['isServerRenderer'] = true;
    return resultFunc;
}
exports.createServerRenderer = createServerRenderer;
function wrapWithTimeout(promise, timeoutMilliseconds, timeoutRejectionValue) {
    return new Promise(function (resolve, reject) {
        var timeoutTimer = setTimeout(function () {
            reject(timeoutRejectionValue);
        }, timeoutMilliseconds);
        promise.then(function (resolvedValue) {
            clearTimeout(timeoutTimer);
            resolve(resolvedValue);
        }, function (rejectedValue) {
            clearTimeout(timeoutTimer);
            reject(rejectedValue);
        });
    });
}
function bindPromiseContinuationsToDomain(promise, domainInstance) {
    var originalThen = promise.then;
    promise.then = (function then(resolve, reject) {
        if (typeof resolve === 'function') {
            resolve = domainInstance.bind(resolve);
        }
        if (typeof reject === 'function') {
            reject = domainInstance.bind(reject);
        }
        return originalThen.call(this, resolve, reject);
    });
}


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var domain = __webpack_require__(0);
var domainContext = __webpack_require__(6);
// Not using symbols, because this may need to run in a version of Node.js that doesn't support them
var domainTasksStateKey = '__DOMAIN_TASKS';
var domainTaskBaseUrlStateKey = '__DOMAIN_TASK_INTERNAL_FETCH_BASEURL__DO_NOT_REFERENCE_THIS__';
var noDomainBaseUrl;
function addTask(task) {
    if (task && domain.active) {
        var state_1 = domainContext.get(domainTasksStateKey);
        if (state_1) {
            state_1.numRemainingTasks++;
            task.then(function () {
                // The application may have other listeners chained to this promise *after*
                // this listener, which may in turn register further tasks. Since we don't 
                // want the combined task to complete until all the handlers for child tasks
                // have finished, delay the response to give time for more tasks to be added
                // synchronously.
                setTimeout(function () {
                    state_1.numRemainingTasks--;
                    if (state_1.numRemainingTasks === 0 && !state_1.hasIssuedSuccessCallback) {
                        state_1.hasIssuedSuccessCallback = true;
                        setTimeout(function () {
                            state_1.completionCallback(/* error */ null);
                        }, 0);
                    }
                }, 0);
            }, function (error) {
                state_1.completionCallback(error);
            });
        }
    }
}
exports.addTask = addTask;
function run(codeToRun, completionCallback) {
    var synchronousResult;
    domainContext.runInNewDomain(function () {
        var state = {
            numRemainingTasks: 0,
            hasIssuedSuccessCallback: false,
            completionCallback: domain.active.bind(completionCallback)
        };
        try {
            domainContext.set(domainTasksStateKey, state);
            synchronousResult = codeToRun();
            // If no tasks were registered synchronously, then we're done already
            if (state.numRemainingTasks === 0 && !state.hasIssuedSuccessCallback) {
                state.hasIssuedSuccessCallback = true;
                setTimeout(function () {
                    state.completionCallback(/* error */ null);
                }, 0);
            }
        }
        catch (ex) {
            state.completionCallback(ex);
        }
    });
    return synchronousResult;
}
exports.run = run;
function baseUrl(url) {
    if (url) {
        if (domain.active) {
            // There's an active domain (e.g., in Node.js), so associate the base URL with it
            domainContext.set(domainTaskBaseUrlStateKey, url);
        }
        else {
            // There's no active domain (e.g., in browser), so there's just one shared base URL
            noDomainBaseUrl = url;
        }
    }
    return domain.active ? domainContext.get(domainTaskBaseUrlStateKey) : noDomainBaseUrl;
}
exports.baseUrl = baseUrl;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// Generated by CoffeeScript 1.6.2
var domain;

domain = __webpack_require__(0);

exports.context = function(context, currentDomain) {
  if (currentDomain == null) {
    currentDomain = domain.active;
  }
  if (currentDomain == null) {
    throw new Error('no active domain');
  }
  return currentDomain.__context__ = context != null ? context() : {};
};

exports.cleanup = function(cleanup, context, currentDomain) {
  if (context == null) {
    context = null;
  }
  if (currentDomain == null) {
    currentDomain = domain.active;
  }
  context = context || currentDomain.__context__;
  if ((cleanup != null) && (context != null)) {
    cleanup(context);
  }
  if (currentDomain != null) {
    return currentDomain.__context__ = null;
  }
};

exports.onError = function(err, onError, context, currentDomain) {
  if (context == null) {
    context = null;
  }
  if (currentDomain == null) {
    currentDomain = domain.active;
  }
  context = context || currentDomain.__context__;
  if (onError != null) {
    onError(err, context);
  }
  return currentDomain.__context__ = null;
};

exports.get = function(key, currentDomain) {
  if (currentDomain == null) {
    currentDomain = domain.active;
  }
  if (currentDomain == null) {
    throw new Error('no active domain');
  }
  return currentDomain.__context__[key];
};

exports.set = function(key, value, currentDomain) {
  if (currentDomain == null) {
    currentDomain = domain.active;
  }
  if (currentDomain == null) {
    throw new Error('no active domain');
  }
  return currentDomain.__context__[key] = value;
};

exports.run = function(options, func) {
  var cleanup, context, currentDomain, err, onError;

  if (!func) {
    func = options;
    options = {};
  }
  context = options.context, cleanup = options.cleanup, onError = options.onError;
  currentDomain = options.domain || domain.active;
  if (!currentDomain) {
    throw new Error('no active domain');
  }
  currentDomain.on('dispose', function() {
    return exports.cleanup(cleanup, null, currentDomain);
  });
  currentDomain.on('error', function(err) {
    if (onError != null) {
      return exports.onError(err, onError, null, currentDomain);
    } else {
      return exports.cleanup(cleanup, null, currentDomain);
    }
  });
  exports.context(context, currentDomain);
  try {
    currentDomain.bind(func, true)();
  } catch (_error) {
    err = _error;
    currentDomain.emit('error', err);
  }
  return currentDomain;
};

exports.runInNewDomain = function(options, func) {
  var currentDomain;

  if (!func) {
    func = options;
    options = {};
  }
  currentDomain = domain.active;
  options.domain = domain.create();
  if (!options.detach && currentDomain) {
    currentDomain.add(options.domain);
    options.domain.on('error', function(err) {
      return currentDomain.emit('error', err);
    });
    currentDomain.on('dispose', function() {
      return options.domain.dispose();
    });
  }
  return exports.run(options, func);
};

exports.middleware = function(context, cleanup) {
  return function(req, res, next) {
    var currentDomain, _ref;

    if (typeof context !== 'function') {
      _ref = context, context = _ref.context, cleanup = _ref.cleanup;
    }
    currentDomain = domain.active;
    exports.context(context, currentDomain);
    res.on('finish', function() {
      return exports.cleanup(cleanup, null, currentDomain);
    });
    req.__context__ = currentDomain.__context__;
    return next();
  };
};

exports.middlewareOnError = function(onError) {
  return function(err, req, res, next) {
    if (typeof onError !== 'function') {
      onError = onError.onError;
    }
    if (onError != null) {
      exports.onError(err, onError, req.__context__);
    } else {
      exports.cleanup(onError, req.__context__);
    }
    req.__context__ = null;
    return next(err);
  };
};


/***/ })
/******/ ])));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZjgzNGEyMDFlYWI3NmMxODEzNTMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZG9tYWluXCIiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2Jvb3Qtc2VydmVyLnRzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hc3BuZXQtcHJlcmVuZGVyaW5nL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9hc3BuZXQtcHJlcmVuZGVyaW5nL1ByZXJlbmRlcmluZy5qcyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1cmxcIiIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZG9tYWluLXRhc2svbWFpbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvZG9tYWluLWNvbnRleHQvbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7OztBQzdEQSxtQzs7Ozs7Ozs7O0FDQUEsbURBQTJEO0FBRTNELGtCQUFlLDBDQUFvQixDQUFDLGdCQUFNO0lBQ3RDLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxVQUFTLE9BQU8sRUFBQyxNQUFNO1FBQ3RDLElBQUksTUFBTSxHQUFDLGdCQUFnQixDQUFDO1FBRTVCLE9BQU8sQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO0lBQzVCLENBQUMsQ0FBQztBQUNOLENBQUMsQ0FBQyxDQUFDOzs7Ozs7OztBQ1JIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLGNBQWM7QUFDNUQ7Ozs7Ozs7O0FDTEE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZEQUE2RDtBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0dBQWdHO0FBQ2hHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOzs7Ozs7O0FDaEdBLGdDOzs7Ozs7O0FDQUE7QUFDQSw4Q0FBOEMsY0FBYztBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0EsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4tc2VydmVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgZjgzNGEyMDFlYWI3NmMxODEzNTMiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJkb21haW5cIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJkb21haW5cIlxuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBjcmVhdGVTZXJ2ZXJSZW5kZXJlciB9IGZyb20gXCJhc3BuZXQtcHJlcmVuZGVyaW5nXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVTZXJ2ZXJSZW5kZXJlcihwYXJhbXMgPT57XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSxyZWplY3Qpe1xyXG4gICAgICAgIHZhciByZXN1bHQ9XCI8aDE+aGVsbG88L2gxPlwiO1xyXG5cclxuICAgICAgICByZXNvbHZlKHtodG1sOiByZXN1bHR9KTtcclxuICAgIH0pXHJcbn0pO1xyXG5cclxuXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NsaWVudEFwcC9ib290LXNlcnZlci50cyIsIlwidXNlIHN0cmljdFwiO1xyXG5mdW5jdGlvbiBfX2V4cG9ydChtKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmICghZXhwb3J0cy5oYXNPd25Qcm9wZXJ0eShwKSkgZXhwb3J0c1twXSA9IG1bcF07XHJcbn1cclxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xyXG5fX2V4cG9ydChyZXF1aXJlKFwiLi9QcmVyZW5kZXJpbmdcIikpO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9hc3BuZXQtcHJlcmVuZGVyaW5nL2luZGV4LmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciB1cmwgPSByZXF1aXJlKFwidXJsXCIpO1xyXG52YXIgZG9tYWluID0gcmVxdWlyZShcImRvbWFpblwiKTtcclxudmFyIG1haW5fMSA9IHJlcXVpcmUoXCJkb21haW4tdGFzay9tYWluXCIpO1xyXG52YXIgZGVmYXVsdFRpbWVvdXRNaWxsaXNlY29uZHMgPSAzMCAqIDEwMDA7XHJcbmZ1bmN0aW9uIGNyZWF0ZVNlcnZlclJlbmRlcmVyKGJvb3RGdW5jKSB7XHJcbiAgICB2YXIgcmVzdWx0RnVuYyA9IGZ1bmN0aW9uIChjYWxsYmFjaywgYXBwbGljYXRpb25CYXNlUGF0aCwgYm9vdE1vZHVsZSwgYWJzb2x1dGVSZXF1ZXN0VXJsLCByZXF1ZXN0UGF0aEFuZFF1ZXJ5LCBjdXN0b21EYXRhUGFyYW1ldGVyLCBvdmVycmlkZVRpbWVvdXRNaWxsaXNlY29uZHMsIHJlcXVlc3RQYXRoQmFzZSkge1xyXG4gICAgICAgIC8vIFByZXBhcmUgYSBwcm9taXNlIHRoYXQgd2lsbCByZXByZXNlbnQgdGhlIGNvbXBsZXRpb24gb2YgYWxsIGRvbWFpbiB0YXNrcyBpbiB0aGlzIGV4ZWN1dGlvbiBjb250ZXh0LlxyXG4gICAgICAgIC8vIFRoZSBib290IGNvZGUgd2lsbCB3YWl0IGZvciB0aGlzIGJlZm9yZSBwZXJmb3JtaW5nIGl0cyBmaW5hbCByZW5kZXIuXHJcbiAgICAgICAgdmFyIGRvbWFpblRhc2tDb21wbGV0aW9uUHJvbWlzZVJlc29sdmU7XHJcbiAgICAgICAgdmFyIGRvbWFpblRhc2tDb21wbGV0aW9uUHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICAgICAgZG9tYWluVGFza0NvbXBsZXRpb25Qcm9taXNlUmVzb2x2ZSA9IHJlc29sdmU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdmFyIHBhcnNlZEFic29sdXRlUmVxdWVzdFVybCA9IHVybC5wYXJzZShhYnNvbHV0ZVJlcXVlc3RVcmwpO1xyXG4gICAgICAgIHZhciBwYXJhbXMgPSB7XHJcbiAgICAgICAgICAgIC8vIEl0J3MgaGVscGZ1bCBmb3IgYm9vdCBmdW5jcyB0byByZWNlaXZlIHRoZSBxdWVyeSBhcyBhIGtleS12YWx1ZSBvYmplY3QsIHNvIHBhcnNlIGl0IGhlcmVcclxuICAgICAgICAgICAgLy8gZS5nLiwgcmVhY3QtcmVkdXgtcm91dGVyIHJlcXVpcmVzIGxvY2F0aW9uLnF1ZXJ5IHRvIGJlIGEga2V5LXZhbHVlIG9iamVjdCBmb3IgY29uc2lzdGVuY3kgd2l0aCBjbGllbnQtc2lkZSBiZWhhdmlvdXJcclxuICAgICAgICAgICAgbG9jYXRpb246IHVybC5wYXJzZShyZXF1ZXN0UGF0aEFuZFF1ZXJ5LCAvKiBwYXJzZVF1ZXJ5U3RyaW5nICovIHRydWUpLFxyXG4gICAgICAgICAgICBvcmlnaW46IHBhcnNlZEFic29sdXRlUmVxdWVzdFVybC5wcm90b2NvbCArICcvLycgKyBwYXJzZWRBYnNvbHV0ZVJlcXVlc3RVcmwuaG9zdCxcclxuICAgICAgICAgICAgdXJsOiByZXF1ZXN0UGF0aEFuZFF1ZXJ5LFxyXG4gICAgICAgICAgICBiYXNlVXJsOiAocmVxdWVzdFBhdGhCYXNlIHx8ICcnKSArICcvJyxcclxuICAgICAgICAgICAgYWJzb2x1dGVVcmw6IGFic29sdXRlUmVxdWVzdFVybCxcclxuICAgICAgICAgICAgZG9tYWluVGFza3M6IGRvbWFpblRhc2tDb21wbGV0aW9uUHJvbWlzZSxcclxuICAgICAgICAgICAgZGF0YTogY3VzdG9tRGF0YVBhcmFtZXRlclxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFyIGFic29sdXRlQmFzZVVybCA9IHBhcmFtcy5vcmlnaW4gKyBwYXJhbXMuYmFzZVVybDsgLy8gU2hvdWxkIGJlIHNhbWUgdmFsdWUgYXMgcGFnZSdzIDxiYXNlIGhyZWY+XHJcbiAgICAgICAgLy8gT3BlbiBhIG5ldyBkb21haW4gdGhhdCBjYW4gdHJhY2sgYWxsIHRoZSBhc3luYyB0YXNrcyBpbnZvbHZlZCBpbiB0aGUgYXBwJ3MgZXhlY3V0aW9uXHJcbiAgICAgICAgbWFpbl8xLnJ1bigvKiBjb2RlIHRvIHJ1biAqLyBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vIFdvcmthcm91bmQgZm9yIE5vZGUgYnVnIHdoZXJlIG5hdGl2ZSBQcm9taXNlIGNvbnRpbnVhdGlvbnMgbG9zZSB0aGVpciBkb21haW4gY29udGV4dFxyXG4gICAgICAgICAgICAvLyAoaHR0cHM6Ly9naXRodWIuY29tL25vZGVqcy9ub2RlLXYwLngtYXJjaGl2ZS9pc3N1ZXMvODY0OClcclxuICAgICAgICAgICAgLy8gVGhlIGRvbWFpbi5hY3RpdmUgcHJvcGVydHkgaXMgc2V0IGJ5IHRoZSBkb21haW4tY29udGV4dCBtb2R1bGVcclxuICAgICAgICAgICAgYmluZFByb21pc2VDb250aW51YXRpb25zVG9Eb21haW4oZG9tYWluVGFza0NvbXBsZXRpb25Qcm9taXNlLCBkb21haW5bJ2FjdGl2ZSddKTtcclxuICAgICAgICAgICAgLy8gTWFrZSB0aGUgYmFzZSBVUkwgYXZhaWxhYmxlIHRvIHRoZSAnZG9tYWluLXRhc2tzL2ZldGNoJyBoZWxwZXIgd2l0aGluIHRoaXMgZXhlY3V0aW9uIGNvbnRleHRcclxuICAgICAgICAgICAgbWFpbl8xLmJhc2VVcmwoYWJzb2x1dGVCYXNlVXJsKTtcclxuICAgICAgICAgICAgLy8gQmVnaW4gcmVuZGVyaW5nLCBhbmQgYXBwbHkgYSB0aW1lb3V0XHJcbiAgICAgICAgICAgIHZhciBib290RnVuY1Byb21pc2UgPSBib290RnVuYyhwYXJhbXMpO1xyXG4gICAgICAgICAgICBpZiAoIWJvb3RGdW5jUHJvbWlzZSB8fCB0eXBlb2YgYm9vdEZ1bmNQcm9taXNlLnRoZW4gIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKFwiUHJlcmVuZGVyaW5nIGZhaWxlZCBiZWNhdXNlIHRoZSBib290IGZ1bmN0aW9uIGluIFwiICsgYm9vdE1vZHVsZS5tb2R1bGVOYW1lICsgXCIgZGlkIG5vdCByZXR1cm4gYSBwcm9taXNlLlwiLCBudWxsKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgdGltZW91dE1pbGxpc2Vjb25kcyA9IG92ZXJyaWRlVGltZW91dE1pbGxpc2Vjb25kcyB8fCBkZWZhdWx0VGltZW91dE1pbGxpc2Vjb25kczsgLy8gZS5nLiwgcGFzcyAtMSB0byBvdmVycmlkZSBhcyAnbmV2ZXIgdGltZSBvdXQnXHJcbiAgICAgICAgICAgIHZhciBib290RnVuY1Byb21pc2VXaXRoVGltZW91dCA9IHRpbWVvdXRNaWxsaXNlY29uZHMgPiAwXHJcbiAgICAgICAgICAgICAgICA/IHdyYXBXaXRoVGltZW91dChib290RnVuY1Byb21pc2UsIHRpbWVvdXRNaWxsaXNlY29uZHMsIFwiUHJlcmVuZGVyaW5nIHRpbWVkIG91dCBhZnRlciBcIiArIHRpbWVvdXRNaWxsaXNlY29uZHMgKyBcIm1zIGJlY2F1c2UgdGhlIGJvb3QgZnVuY3Rpb24gaW4gJ1wiICsgYm9vdE1vZHVsZS5tb2R1bGVOYW1lICsgXCInIFwiXHJcbiAgICAgICAgICAgICAgICAgICAgKyAncmV0dXJuZWQgYSBwcm9taXNlIHRoYXQgZGlkIG5vdCByZXNvbHZlIG9yIHJlamVjdC4gTWFrZSBzdXJlIHRoYXQgeW91ciBib290IGZ1bmN0aW9uIGFsd2F5cyByZXNvbHZlcyBvciAnXHJcbiAgICAgICAgICAgICAgICAgICAgKyAncmVqZWN0cyBpdHMgcHJvbWlzZS4gWW91IGNhbiBjaGFuZ2UgdGhlIHRpbWVvdXQgdmFsdWUgdXNpbmcgdGhlIFxcJ2FzcC1wcmVyZW5kZXItdGltZW91dFxcJyB0YWcgaGVscGVyLicpXHJcbiAgICAgICAgICAgICAgICA6IGJvb3RGdW5jUHJvbWlzZTtcclxuICAgICAgICAgICAgLy8gQWN0dWFsbHkgcGVyZm9ybSB0aGUgcmVuZGVyaW5nXHJcbiAgICAgICAgICAgIGJvb3RGdW5jUHJvbWlzZVdpdGhUaW1lb3V0LnRoZW4oZnVuY3Rpb24gKHN1Y2Nlc3NSZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsIHN1Y2Nlc3NSZXN1bHQpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yLCBudWxsKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSwgLyogY29tcGxldGlvbiBjYWxsYmFjayAqLyBmdW5jdGlvbiAoLyogY29tcGxldGlvbiBjYWxsYmFjayAqLyBlcnJvck9yTm90aGluZykge1xyXG4gICAgICAgICAgICBpZiAoZXJyb3JPck5vdGhpbmcpIHtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycm9yT3JOb3RoaW5nLCBudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vIFRoZXJlIGFyZSBubyBtb3JlIG9uZ29pbmcgZG9tYWluIHRhc2tzICh0eXBpY2FsbHkgZGF0YSBhY2Nlc3Mgb3BlcmF0aW9ucyksIHNvIHdlIGNhbiByZXNvbHZlXHJcbiAgICAgICAgICAgICAgICAvLyB0aGUgZG9tYWluIHRhc2tzIHByb21pc2Ugd2hpY2ggbm90aWZpZXMgdGhlIGJvb3QgY29kZSB0aGF0IGl0IGNhbiBkbyBpdHMgZmluYWwgcmVuZGVyLlxyXG4gICAgICAgICAgICAgICAgZG9tYWluVGFza0NvbXBsZXRpb25Qcm9taXNlUmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgLy8gSW5kaWNhdGUgdG8gdGhlIHByZXJlbmRlcmluZyBjb2RlIGJ1bmRsZWQgaW50byBNaWNyb3NvZnQuQXNwTmV0Q29yZS5TcGFTZXJ2aWNlcyB0aGF0IHRoaXMgaXMgYSBzZXJ2ZXJzaWRlIHJlbmRlcmluZ1xyXG4gICAgLy8gZnVuY3Rpb24sIHNvIGl0IGNhbiBiZSBpbnZva2VkIGRpcmVjdGx5LiBUaGlzIGZsYWcgZXhpc3RzIG9ubHkgc28gdGhhdCwgaW4gaXRzIGFic2VuY2UsIHdlIGNhbiBydW4gc29tZSBkaWZmZXJlbnRcclxuICAgIC8vIGJhY2t3YXJkLWNvbXBhdGliaWxpdHkgbG9naWMuXHJcbiAgICByZXN1bHRGdW5jWydpc1NlcnZlclJlbmRlcmVyJ10gPSB0cnVlO1xyXG4gICAgcmV0dXJuIHJlc3VsdEZ1bmM7XHJcbn1cclxuZXhwb3J0cy5jcmVhdGVTZXJ2ZXJSZW5kZXJlciA9IGNyZWF0ZVNlcnZlclJlbmRlcmVyO1xyXG5mdW5jdGlvbiB3cmFwV2l0aFRpbWVvdXQocHJvbWlzZSwgdGltZW91dE1pbGxpc2Vjb25kcywgdGltZW91dFJlamVjdGlvblZhbHVlKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIHZhciB0aW1lb3V0VGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmVqZWN0KHRpbWVvdXRSZWplY3Rpb25WYWx1ZSk7XHJcbiAgICAgICAgfSwgdGltZW91dE1pbGxpc2Vjb25kcyk7XHJcbiAgICAgICAgcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXNvbHZlZFZhbHVlKSB7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0VGltZXIpO1xyXG4gICAgICAgICAgICByZXNvbHZlKHJlc29sdmVkVmFsdWUpO1xyXG4gICAgICAgIH0sIGZ1bmN0aW9uIChyZWplY3RlZFZhbHVlKSB7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0VGltZXIpO1xyXG4gICAgICAgICAgICByZWplY3QocmVqZWN0ZWRWYWx1ZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufVxyXG5mdW5jdGlvbiBiaW5kUHJvbWlzZUNvbnRpbnVhdGlvbnNUb0RvbWFpbihwcm9taXNlLCBkb21haW5JbnN0YW5jZSkge1xyXG4gICAgdmFyIG9yaWdpbmFsVGhlbiA9IHByb21pc2UudGhlbjtcclxuICAgIHByb21pc2UudGhlbiA9IChmdW5jdGlvbiB0aGVuKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgcmVzb2x2ZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICByZXNvbHZlID0gZG9tYWluSW5zdGFuY2UuYmluZChyZXNvbHZlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHR5cGVvZiByZWplY3QgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgcmVqZWN0ID0gZG9tYWluSW5zdGFuY2UuYmluZChyZWplY3QpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gb3JpZ2luYWxUaGVuLmNhbGwodGhpcywgcmVzb2x2ZSwgcmVqZWN0KTtcclxuICAgIH0pO1xyXG59XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2FzcG5ldC1wcmVyZW5kZXJpbmcvUHJlcmVuZGVyaW5nLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInVybFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInVybFwiXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIlwidXNlIHN0cmljdFwiO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XHJcbnZhciBkb21haW4gPSByZXF1aXJlKFwiZG9tYWluXCIpO1xyXG52YXIgZG9tYWluQ29udGV4dCA9IHJlcXVpcmUoXCJkb21haW4tY29udGV4dFwiKTtcclxuLy8gTm90IHVzaW5nIHN5bWJvbHMsIGJlY2F1c2UgdGhpcyBtYXkgbmVlZCB0byBydW4gaW4gYSB2ZXJzaW9uIG9mIE5vZGUuanMgdGhhdCBkb2Vzbid0IHN1cHBvcnQgdGhlbVxyXG52YXIgZG9tYWluVGFza3NTdGF0ZUtleSA9ICdfX0RPTUFJTl9UQVNLUyc7XHJcbnZhciBkb21haW5UYXNrQmFzZVVybFN0YXRlS2V5ID0gJ19fRE9NQUlOX1RBU0tfSU5URVJOQUxfRkVUQ0hfQkFTRVVSTF9fRE9fTk9UX1JFRkVSRU5DRV9USElTX18nO1xyXG52YXIgbm9Eb21haW5CYXNlVXJsO1xyXG5mdW5jdGlvbiBhZGRUYXNrKHRhc2spIHtcclxuICAgIGlmICh0YXNrICYmIGRvbWFpbi5hY3RpdmUpIHtcclxuICAgICAgICB2YXIgc3RhdGVfMSA9IGRvbWFpbkNvbnRleHQuZ2V0KGRvbWFpblRhc2tzU3RhdGVLZXkpO1xyXG4gICAgICAgIGlmIChzdGF0ZV8xKSB7XHJcbiAgICAgICAgICAgIHN0YXRlXzEubnVtUmVtYWluaW5nVGFza3MrKztcclxuICAgICAgICAgICAgdGFzay50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIC8vIFRoZSBhcHBsaWNhdGlvbiBtYXkgaGF2ZSBvdGhlciBsaXN0ZW5lcnMgY2hhaW5lZCB0byB0aGlzIHByb21pc2UgKmFmdGVyKlxyXG4gICAgICAgICAgICAgICAgLy8gdGhpcyBsaXN0ZW5lciwgd2hpY2ggbWF5IGluIHR1cm4gcmVnaXN0ZXIgZnVydGhlciB0YXNrcy4gU2luY2Ugd2UgZG9uJ3QgXHJcbiAgICAgICAgICAgICAgICAvLyB3YW50IHRoZSBjb21iaW5lZCB0YXNrIHRvIGNvbXBsZXRlIHVudGlsIGFsbCB0aGUgaGFuZGxlcnMgZm9yIGNoaWxkIHRhc2tzXHJcbiAgICAgICAgICAgICAgICAvLyBoYXZlIGZpbmlzaGVkLCBkZWxheSB0aGUgcmVzcG9uc2UgdG8gZ2l2ZSB0aW1lIGZvciBtb3JlIHRhc2tzIHRvIGJlIGFkZGVkXHJcbiAgICAgICAgICAgICAgICAvLyBzeW5jaHJvbm91c2x5LlxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdGVfMS5udW1SZW1haW5pbmdUYXNrcy0tO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdGF0ZV8xLm51bVJlbWFpbmluZ1Rhc2tzID09PSAwICYmICFzdGF0ZV8xLmhhc0lzc3VlZFN1Y2Nlc3NDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0ZV8xLmhhc0lzc3VlZFN1Y2Nlc3NDYWxsYmFjayA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVfMS5jb21wbGV0aW9uQ2FsbGJhY2soLyogZXJyb3IgKi8gbnVsbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHN0YXRlXzEuY29tcGxldGlvbkNhbGxiYWNrKGVycm9yKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbmV4cG9ydHMuYWRkVGFzayA9IGFkZFRhc2s7XHJcbmZ1bmN0aW9uIHJ1bihjb2RlVG9SdW4sIGNvbXBsZXRpb25DYWxsYmFjaykge1xyXG4gICAgdmFyIHN5bmNocm9ub3VzUmVzdWx0O1xyXG4gICAgZG9tYWluQ29udGV4dC5ydW5Jbk5ld0RvbWFpbihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHN0YXRlID0ge1xyXG4gICAgICAgICAgICBudW1SZW1haW5pbmdUYXNrczogMCxcclxuICAgICAgICAgICAgaGFzSXNzdWVkU3VjY2Vzc0NhbGxiYWNrOiBmYWxzZSxcclxuICAgICAgICAgICAgY29tcGxldGlvbkNhbGxiYWNrOiBkb21haW4uYWN0aXZlLmJpbmQoY29tcGxldGlvbkNhbGxiYWNrKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgZG9tYWluQ29udGV4dC5zZXQoZG9tYWluVGFza3NTdGF0ZUtleSwgc3RhdGUpO1xyXG4gICAgICAgICAgICBzeW5jaHJvbm91c1Jlc3VsdCA9IGNvZGVUb1J1bigpO1xyXG4gICAgICAgICAgICAvLyBJZiBubyB0YXNrcyB3ZXJlIHJlZ2lzdGVyZWQgc3luY2hyb25vdXNseSwgdGhlbiB3ZSdyZSBkb25lIGFscmVhZHlcclxuICAgICAgICAgICAgaWYgKHN0YXRlLm51bVJlbWFpbmluZ1Rhc2tzID09PSAwICYmICFzdGF0ZS5oYXNJc3N1ZWRTdWNjZXNzQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIHN0YXRlLmhhc0lzc3VlZFN1Y2Nlc3NDYWxsYmFjayA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5jb21wbGV0aW9uQ2FsbGJhY2soLyogZXJyb3IgKi8gbnVsbCk7XHJcbiAgICAgICAgICAgICAgICB9LCAwKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgc3RhdGUuY29tcGxldGlvbkNhbGxiYWNrKGV4KTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBzeW5jaHJvbm91c1Jlc3VsdDtcclxufVxyXG5leHBvcnRzLnJ1biA9IHJ1bjtcclxuZnVuY3Rpb24gYmFzZVVybCh1cmwpIHtcclxuICAgIGlmICh1cmwpIHtcclxuICAgICAgICBpZiAoZG9tYWluLmFjdGl2ZSkge1xyXG4gICAgICAgICAgICAvLyBUaGVyZSdzIGFuIGFjdGl2ZSBkb21haW4gKGUuZy4sIGluIE5vZGUuanMpLCBzbyBhc3NvY2lhdGUgdGhlIGJhc2UgVVJMIHdpdGggaXRcclxuICAgICAgICAgICAgZG9tYWluQ29udGV4dC5zZXQoZG9tYWluVGFza0Jhc2VVcmxTdGF0ZUtleSwgdXJsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIFRoZXJlJ3Mgbm8gYWN0aXZlIGRvbWFpbiAoZS5nLiwgaW4gYnJvd3NlciksIHNvIHRoZXJlJ3MganVzdCBvbmUgc2hhcmVkIGJhc2UgVVJMXHJcbiAgICAgICAgICAgIG5vRG9tYWluQmFzZVVybCA9IHVybDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZG9tYWluLmFjdGl2ZSA/IGRvbWFpbkNvbnRleHQuZ2V0KGRvbWFpblRhc2tCYXNlVXJsU3RhdGVLZXkpIDogbm9Eb21haW5CYXNlVXJsO1xyXG59XHJcbmV4cG9ydHMuYmFzZVVybCA9IGJhc2VVcmw7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2RvbWFpbi10YXNrL21haW4uanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjYuMlxudmFyIGRvbWFpbjtcblxuZG9tYWluID0gcmVxdWlyZSgnZG9tYWluJyk7XG5cbmV4cG9ydHMuY29udGV4dCA9IGZ1bmN0aW9uKGNvbnRleHQsIGN1cnJlbnREb21haW4pIHtcbiAgaWYgKGN1cnJlbnREb21haW4gPT0gbnVsbCkge1xuICAgIGN1cnJlbnREb21haW4gPSBkb21haW4uYWN0aXZlO1xuICB9XG4gIGlmIChjdXJyZW50RG9tYWluID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGFjdGl2ZSBkb21haW4nKTtcbiAgfVxuICByZXR1cm4gY3VycmVudERvbWFpbi5fX2NvbnRleHRfXyA9IGNvbnRleHQgIT0gbnVsbCA/IGNvbnRleHQoKSA6IHt9O1xufTtcblxuZXhwb3J0cy5jbGVhbnVwID0gZnVuY3Rpb24oY2xlYW51cCwgY29udGV4dCwgY3VycmVudERvbWFpbikge1xuICBpZiAoY29udGV4dCA9PSBudWxsKSB7XG4gICAgY29udGV4dCA9IG51bGw7XG4gIH1cbiAgaWYgKGN1cnJlbnREb21haW4gPT0gbnVsbCkge1xuICAgIGN1cnJlbnREb21haW4gPSBkb21haW4uYWN0aXZlO1xuICB9XG4gIGNvbnRleHQgPSBjb250ZXh0IHx8IGN1cnJlbnREb21haW4uX19jb250ZXh0X187XG4gIGlmICgoY2xlYW51cCAhPSBudWxsKSAmJiAoY29udGV4dCAhPSBudWxsKSkge1xuICAgIGNsZWFudXAoY29udGV4dCk7XG4gIH1cbiAgaWYgKGN1cnJlbnREb21haW4gIT0gbnVsbCkge1xuICAgIHJldHVybiBjdXJyZW50RG9tYWluLl9fY29udGV4dF9fID0gbnVsbDtcbiAgfVxufTtcblxuZXhwb3J0cy5vbkVycm9yID0gZnVuY3Rpb24oZXJyLCBvbkVycm9yLCBjb250ZXh0LCBjdXJyZW50RG9tYWluKSB7XG4gIGlmIChjb250ZXh0ID09IG51bGwpIHtcbiAgICBjb250ZXh0ID0gbnVsbDtcbiAgfVxuICBpZiAoY3VycmVudERvbWFpbiA9PSBudWxsKSB7XG4gICAgY3VycmVudERvbWFpbiA9IGRvbWFpbi5hY3RpdmU7XG4gIH1cbiAgY29udGV4dCA9IGNvbnRleHQgfHwgY3VycmVudERvbWFpbi5fX2NvbnRleHRfXztcbiAgaWYgKG9uRXJyb3IgIT0gbnVsbCkge1xuICAgIG9uRXJyb3IoZXJyLCBjb250ZXh0KTtcbiAgfVxuICByZXR1cm4gY3VycmVudERvbWFpbi5fX2NvbnRleHRfXyA9IG51bGw7XG59O1xuXG5leHBvcnRzLmdldCA9IGZ1bmN0aW9uKGtleSwgY3VycmVudERvbWFpbikge1xuICBpZiAoY3VycmVudERvbWFpbiA9PSBudWxsKSB7XG4gICAgY3VycmVudERvbWFpbiA9IGRvbWFpbi5hY3RpdmU7XG4gIH1cbiAgaWYgKGN1cnJlbnREb21haW4gPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBFcnJvcignbm8gYWN0aXZlIGRvbWFpbicpO1xuICB9XG4gIHJldHVybiBjdXJyZW50RG9tYWluLl9fY29udGV4dF9fW2tleV07XG59O1xuXG5leHBvcnRzLnNldCA9IGZ1bmN0aW9uKGtleSwgdmFsdWUsIGN1cnJlbnREb21haW4pIHtcbiAgaWYgKGN1cnJlbnREb21haW4gPT0gbnVsbCkge1xuICAgIGN1cnJlbnREb21haW4gPSBkb21haW4uYWN0aXZlO1xuICB9XG4gIGlmIChjdXJyZW50RG9tYWluID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIGFjdGl2ZSBkb21haW4nKTtcbiAgfVxuICByZXR1cm4gY3VycmVudERvbWFpbi5fX2NvbnRleHRfX1trZXldID0gdmFsdWU7XG59O1xuXG5leHBvcnRzLnJ1biA9IGZ1bmN0aW9uKG9wdGlvbnMsIGZ1bmMpIHtcbiAgdmFyIGNsZWFudXAsIGNvbnRleHQsIGN1cnJlbnREb21haW4sIGVyciwgb25FcnJvcjtcblxuICBpZiAoIWZ1bmMpIHtcbiAgICBmdW5jID0gb3B0aW9ucztcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgY29udGV4dCA9IG9wdGlvbnMuY29udGV4dCwgY2xlYW51cCA9IG9wdGlvbnMuY2xlYW51cCwgb25FcnJvciA9IG9wdGlvbnMub25FcnJvcjtcbiAgY3VycmVudERvbWFpbiA9IG9wdGlvbnMuZG9tYWluIHx8IGRvbWFpbi5hY3RpdmU7XG4gIGlmICghY3VycmVudERvbWFpbikge1xuICAgIHRocm93IG5ldyBFcnJvcignbm8gYWN0aXZlIGRvbWFpbicpO1xuICB9XG4gIGN1cnJlbnREb21haW4ub24oJ2Rpc3Bvc2UnLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZXhwb3J0cy5jbGVhbnVwKGNsZWFudXAsIG51bGwsIGN1cnJlbnREb21haW4pO1xuICB9KTtcbiAgY3VycmVudERvbWFpbi5vbignZXJyb3InLCBmdW5jdGlvbihlcnIpIHtcbiAgICBpZiAob25FcnJvciAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gZXhwb3J0cy5vbkVycm9yKGVyciwgb25FcnJvciwgbnVsbCwgY3VycmVudERvbWFpbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmNsZWFudXAoY2xlYW51cCwgbnVsbCwgY3VycmVudERvbWFpbik7XG4gICAgfVxuICB9KTtcbiAgZXhwb3J0cy5jb250ZXh0KGNvbnRleHQsIGN1cnJlbnREb21haW4pO1xuICB0cnkge1xuICAgIGN1cnJlbnREb21haW4uYmluZChmdW5jLCB0cnVlKSgpO1xuICB9IGNhdGNoIChfZXJyb3IpIHtcbiAgICBlcnIgPSBfZXJyb3I7XG4gICAgY3VycmVudERvbWFpbi5lbWl0KCdlcnJvcicsIGVycik7XG4gIH1cbiAgcmV0dXJuIGN1cnJlbnREb21haW47XG59O1xuXG5leHBvcnRzLnJ1bkluTmV3RG9tYWluID0gZnVuY3Rpb24ob3B0aW9ucywgZnVuYykge1xuICB2YXIgY3VycmVudERvbWFpbjtcblxuICBpZiAoIWZ1bmMpIHtcbiAgICBmdW5jID0gb3B0aW9ucztcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgY3VycmVudERvbWFpbiA9IGRvbWFpbi5hY3RpdmU7XG4gIG9wdGlvbnMuZG9tYWluID0gZG9tYWluLmNyZWF0ZSgpO1xuICBpZiAoIW9wdGlvbnMuZGV0YWNoICYmIGN1cnJlbnREb21haW4pIHtcbiAgICBjdXJyZW50RG9tYWluLmFkZChvcHRpb25zLmRvbWFpbik7XG4gICAgb3B0aW9ucy5kb21haW4ub24oJ2Vycm9yJywgZnVuY3Rpb24oZXJyKSB7XG4gICAgICByZXR1cm4gY3VycmVudERvbWFpbi5lbWl0KCdlcnJvcicsIGVycik7XG4gICAgfSk7XG4gICAgY3VycmVudERvbWFpbi5vbignZGlzcG9zZScsIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuZG9tYWluLmRpc3Bvc2UoKTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gZXhwb3J0cy5ydW4ob3B0aW9ucywgZnVuYyk7XG59O1xuXG5leHBvcnRzLm1pZGRsZXdhcmUgPSBmdW5jdGlvbihjb250ZXh0LCBjbGVhbnVwKSB7XG4gIHJldHVybiBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgIHZhciBjdXJyZW50RG9tYWluLCBfcmVmO1xuXG4gICAgaWYgKHR5cGVvZiBjb250ZXh0ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBfcmVmID0gY29udGV4dCwgY29udGV4dCA9IF9yZWYuY29udGV4dCwgY2xlYW51cCA9IF9yZWYuY2xlYW51cDtcbiAgICB9XG4gICAgY3VycmVudERvbWFpbiA9IGRvbWFpbi5hY3RpdmU7XG4gICAgZXhwb3J0cy5jb250ZXh0KGNvbnRleHQsIGN1cnJlbnREb21haW4pO1xuICAgIHJlcy5vbignZmluaXNoJywgZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZXhwb3J0cy5jbGVhbnVwKGNsZWFudXAsIG51bGwsIGN1cnJlbnREb21haW4pO1xuICAgIH0pO1xuICAgIHJlcS5fX2NvbnRleHRfXyA9IGN1cnJlbnREb21haW4uX19jb250ZXh0X187XG4gICAgcmV0dXJuIG5leHQoKTtcbiAgfTtcbn07XG5cbmV4cG9ydHMubWlkZGxld2FyZU9uRXJyb3IgPSBmdW5jdGlvbihvbkVycm9yKSB7XG4gIHJldHVybiBmdW5jdGlvbihlcnIsIHJlcSwgcmVzLCBuZXh0KSB7XG4gICAgaWYgKHR5cGVvZiBvbkVycm9yICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICBvbkVycm9yID0gb25FcnJvci5vbkVycm9yO1xuICAgIH1cbiAgICBpZiAob25FcnJvciAhPSBudWxsKSB7XG4gICAgICBleHBvcnRzLm9uRXJyb3IoZXJyLCBvbkVycm9yLCByZXEuX19jb250ZXh0X18pO1xuICAgIH0gZWxzZSB7XG4gICAgICBleHBvcnRzLmNsZWFudXAob25FcnJvciwgcmVxLl9fY29udGV4dF9fKTtcbiAgICB9XG4gICAgcmVxLl9fY29udGV4dF9fID0gbnVsbDtcbiAgICByZXR1cm4gbmV4dChlcnIpO1xuICB9O1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2RvbWFpbi1jb250ZXh0L2xpYi9pbmRleC5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9