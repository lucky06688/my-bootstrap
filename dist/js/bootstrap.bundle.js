/*!
  * Bootstrap v1.0.0 (https://github.com/lucky06688/my-bootstrap#readme)
  * Copyright 2011-2018 ezreal
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery')) :
  typeof define === 'function' && define.amd ? define(['exports', 'jquery'], factory) :
  (factory((global.bootstrap = {}),global.jQuery));
}(this, (function (exports,$) { 'use strict';

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  /**
   * Private TransitionEnd Helpers
   */

  var TRANSITION_END = "transitionend";
  var MILLISECONDS_MULTIPLIER = 1000;

  function escapeId(selector) {
    // escape IDs in case of special selectors (selector = '#myId;#,.[]=@)
    // $.escapeSelector does not exist in jQuery < 3
    selector = typeof $.escapeSelector === "function" ? $.escapeSelector(selector).substr(1) : selector.replace(/(:|\.|\[|\]|,|=|@|#)/g, "\\$1").substr(1);
    return selector;
  }

  function gerSpecialTransitionEndEvent() {
    return {
      bindType: TRANSITION_END,
      delegateType: TRANSITION_END,
      handle: function handle(event) {
        if ($(event.target).is(this)) {
          return event.handleObj.handler.apply(this, arguments);
        }
      }
    };
  }

  function transitionEndEmulator(duration) {
    var _this = this;

    var called = false;
    $(this).one(Util.TRANSITION_END, function () {
      called = true;
    });
    setTimeout(function () {
      if (!called) {
        Util.triggerTransitionEnd(_this);
      }
    }, duration);
  }

  function setTransitionEndSupport() {
    $.fn.emulateTransitionEnd = transitionEndEmulator;
    $.event.special[Util.TRANSITION_END] = gerSpecialTransitionEndEvent();
  }
  /**
   *  Public Util Api
   */


  var Util = {
    TRANSITION_END: "bsTransitionEnd",
    getSelectorFromElement: function getSelectorFromElement(element) {
      var selector = element.getAttribute("data-target");

      if (!selector || selector === "#") {
        selector = element.getAttribute("href") || "";
      } // If it's an ID


      if (selector.charAt(0) === "#") {
        selector = escapeId(selector);
      }

      try {
        var $selector = $(document).find(selector);
        return $selector.length > 0 ? selector : null;
      } catch (err) {
        return null;
      }
    },
    getTransitionDurationFromElement: function getTransitionDurationFromElement(element) {
      if (!element) {
        return 0;
      }

      var transitionDuration = $(element).css("transition-duration");
      var transitionDelay = $(element).css("transition-delay");
      var floatTransitionDuration = parseFloat(transitionDuration);
      var floatTransitionDelay = parseFloat(transitionDelay);

      if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
      }

      transitionDuration = transitionDuration.split(",")[0];
      transitionDelay = transitionDelay.split(",")[0];
      return (parseFloat(transitionDuration) + parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
    },
    triggerTransitionEnd: function triggerTransitionEnd(element) {
      $(element).trigger(TRANSITION_END);
    }
  };
  setTransitionEndSupport();

  /**
   * alert.js
   */

  /**
   * Constants
   */

  var NAME = "alert";
  var VERSION = "1.0.0";
  var DATA_KEY = "bs.alert";
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = ".data-api";
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var Selector = {
    DISMISS: '[data-dismiss="alert"]' // eslint-disable-line quotes

  };
  var Event = {
    CLOSE: "close" + EVENT_KEY,
    CLOSED: "closed" + EVENT_KEY,
    CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
  };
  var ClassName = {
    ALERT: "alert",
    FADE: "fade",
    SHOW: "show"
  };
  /**
   *  Class Defination
   */

  var Alert =
  /*#__PURE__*/
  function () {
    function Alert(element) {
      this._element = element;
    } // Getters


    var _proto = Alert.prototype;

    // Public
    _proto.close = function close(element) {
      element = element || this._element;

      var rootElement = this._getRootElement(element);

      var customEvent = this._triggerCloseEvent(rootElement);

      if (customEvent.isDefaultPrevented()) {
        return;
      }

      this._removeElement(rootElement);
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY);
      this._element = null;
    }; // Private


    _proto._getRootElement = function _getRootElement(element) {
      var selector = Util.getSelectorFromElement(element);
      var parent = false;

      if (selector) {
        parent = $(selector)[0];
      }

      if (!parent) {
        parent = $(element).closest("." + ClassName.ALERT)[0];
      }

      return parent;
    };

    _proto._triggerCloseEvent = function _triggerCloseEvent(element) {
      var closeEvent = $.Event(Event.CLOSE);
      $(element).trigger(closeEvent); // console.log("closeEventTriggered");

      return closeEvent;
    };

    _proto._removeElement = function _removeElement(element) {
      var _this = this;

      $(element).removeClass(ClassName.SHOW);

      if (!$(element).hasClass(ClassName.FADE)) {
        this._destoryElement(element);

        return;
      }

      var transitionDuration = Util.getTransitionDurationFromElement(element);
      $(element).one(Util.TRANSITION_END, function (event) {
        return _this._destoryElement(element, event);
      }).emulateTransitionEnd(transitionDuration);
    };

    _proto._destoryElement = function _destoryElement(element) {
      $(element).detach().trigger(Event.CLOSED).remove();
    }; // Static


    Alert._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $element = $(this);
        var data = $element.data(DATA_KEY);

        if (!data) {
          data = new Alert(this);
          $element.data(DATA_KEY, data);
        }

        if (config === "close") {
          data[config](this);
        } else if (config === "dispose") {
          data[config]();
        }
      });
    };

    Alert._handleDismiss = function _handleDismiss(alertInstance) {
      return function (event) {
        if (event) {
          event.preventDefault();
        }

        alertInstance.close(this);
      };
    };

    _createClass(Alert, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }]);

    return Alert;
  }();

  $(document).on(Event.CLICK_DATA_API, Selector.DISMISS, Alert._handleDismiss(new Alert()));
  $.fn[NAME] = Alert._jQueryInterface;
  $.fn[NAME].Constructor = Alert;

  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Alert._jQueryInterface;
  };

  /**
   * index.js
   */

  (function ($$$1) {
    if (typeof $$$1 === "undefined") {
      throw new TypeError("Bootstrap's JavaScript requires jQuery. jQuery must be included before Bootstrap's JavaScript.");
    }

    var version = $$$1.fn.jquery.split(" ")[0].split(".");
    var minMajor = 1;
    var ltMajor = 2;
    var minMinor = 9;
    var minPatch = 1;
    var maxMajor = 4;

    if (version[0] < ltMajor && version[1] < minMinor || version[0] === minMajor && version[1] === minMinor && version[2] < minPatch || version[0] >= maxMajor) {
      throw new Error("Bootstrap\"s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0");
    }
  })($);

  exports.Alert = Alert;
  exports.Util = Util;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=bootstrap.bundle.js.map
