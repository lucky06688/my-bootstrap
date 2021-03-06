/**
 * Private TransitionEnd Helpers
 */
var TRANSITION_END = 'transitionend';
var MILLISECONDS_MULTIPLIER = 1000;

function escapeId(selector) {
  // escape IDs in case of special selectors (selector = '#myId;#,.[]=@)
  // $.escapeSelector does not exist in jQuery < 3
  selector = typeof $.escapeSelector === 'function' ? $.escapeSelector(selector).substr(1) : selector.replace(/(:|\.|\[|\]|,|=|@|#)/g, '\\$1').substr(1);
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
  TRANSITION_END: 'bsTransitionEnd',
  getSelectorFromElement: function getSelectorFromElement(element) {
    var selector = element.getAttribute('data-target');

    if (!selector || selector === '#') {
      selector = element.getAttribute('href') || '';
    } // If it's an ID


    if (selector.charAt(0) === '#') {
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

    var transitionDuration = $(element).css('transition-duration');
    var transitionDelay = $(element).css('transition-delay');
    var floatTransitionDuration = parseFloat(transitionDuration);
    var floatTransitionDelay = parseFloat(transitionDelay);

    if (!floatTransitionDuration && !floatTransitionDelay) {
      return 0;
    }

    transitionDuration = transitionDuration.split(',')[0];
    transitionDelay = transitionDelay.split(',')[0];
    return (parseFloat(transitionDuration) + parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
  },
  triggerTransitionEnd: function triggerTransitionEnd(element) {
    $(element).trigger(TRANSITION_END);
  }
};
setTransitionEndSupport();
//# sourceMappingURL=util.js.map