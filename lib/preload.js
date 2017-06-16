window.__blond = {};
__blond.ipc = require('electron').ipcRenderer;
__blond.sliced = require('sliced');

// Listen for error events
window.addEventListener('error', function(e) {
  __blond.ipc.send('page', 'error', e.message, e.error && e.error.stack);
});

(function(){
  // prevent 'unload' and 'beforeunload' from being bound
  var defaultAddEventListener = window.addEventListener;
  window.addEventListener = function (type) {
    if (type === 'unload' || type === 'beforeunload') {
      return;
    }
    defaultAddEventListener.apply(window, arguments);
  };

  // prevent 'onunload' and 'onbeforeunload' from being set
  Object.defineProperties(window, {
    onunload: {
      enumerable: true,
      writable: false,
      value: null
    },
    onbeforeunload: {
      enumerable: true,
      writable: false,
      value: null
    }
  });

  // listen for console.log
  var defaultLog = console.log;
  console.log = function() {
    __blond.ipc.send('console', 'log', __blond.sliced(arguments));
    return defaultLog.apply(this, arguments);
  };

  // listen for console.warn
  var defaultWarn = console.warn;
  console.warn = function() {
    __blond.ipc.send('console', 'warn', __blond.sliced(arguments));
    return defaultWarn.apply(this, arguments);
  };

  // listen for console.error
  var defaultError = console.error;
  console.error = function() {
    __blond.ipc.send('console', 'error', __blond.sliced(arguments));
    return defaultError.apply(this, arguments);
  };

  // overwrite the default alert
  window.alert = function(message){
    __blond.ipc.send('page', 'alert', message);
  };

  // overwrite the default prompt
  window.prompt = function(message, defaultResponse){
    __blond.ipc.send('page', 'prompt', message, defaultResponse);
  }

  // overwrite the default confirm
  window.confirm = function(message, defaultResponse){
    __blond.ipc.send('page', 'confirm', message, defaultResponse);
  }
})()
