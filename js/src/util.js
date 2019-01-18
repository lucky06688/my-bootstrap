import $ from 'jquery';

/**
 * Private TransitionEnd Helpers
 */

const TRANSITION_END = 'transitionend';
const MILLISECONDS_MULTIPLIER = 1000;

function escapeId(selector) {
  // escape IDs in case of special selectors (selector = '#myId;#,.[]=@)
  // $.escapeSelector does not exist in jQuery < 3
  selector = typeof $.escapeSelector === 'function' ? $.escapeSelector(selector).substr(1)
    : selector.replace(/(:|\.|\[|\]|,|=|@|#)/g, '\\$1').substr(1);
  
  return selector;
}

function gerSpecialTransitionEndEvent() {
  return {
    bindType: TRANSITION_END,
    delegateType: TRANSITION_END,
    handle(event) {
      if($(event.target).is(this)) {
        return event.handleObj.handler.apply(this, arguments);
      }
    }
  };
}

function transitionEndEmulator(duration) {
  let called = false;

  $(this).one(Util.TRANSITION_END, () => {
    called = true;
  });

  setTimeout(() => {
    if(!called) {
      Util.triggerTransitionEnd(this);
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

const Util = {

  TRANSITION_END: 'bsTransitionEnd',
  
  getSelectorFromElement(element) {
    let selector = element.getAttribute('data-target');
    if (!selector || selector === '#') {
      selector = element.getAttribute('href') || '';
    }
    // If it's an ID
    if (selector.charAt(0) === '#') {
      selector = escapeId(selector);
    }
    try {
      const $selector = $(document).find(selector);
      return $selector.length > 0 ? selector : null;
    } catch (err) {
      return null;
    }
  },

  getTransitionDurationFromElement(element) {
    if(!element) {
      return 0;
    }
    let transitionDuration = $(element).css('transition-duration');
    let transitionDelay = $(element).css('transition-delay');
    const floatTransitionDuration = parseFloat(transitionDuration);
    const floatTransitionDelay = parseFloat(transitionDelay);
    if(!floatTransitionDuration && !floatTransitionDelay) {
      return 0;
    }
    transitionDuration = transitionDuration.split(',')[0];
    transitionDelay = transitionDelay.split(',')[0];
    return (parseFloat(transitionDuration) + parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
  },

  triggerTransitionEnd(element) {
    $(element).trigger(TRANSITION_END);
  }
};

setTransitionEndSupport();

export default Util;