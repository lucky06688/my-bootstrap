import $ from 'jquery';

/**
 * ------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------
 */

const NAME = 'button';
const VERSION = '1.0.0';
const DATA_KEY = 'bs.button';
const EVENT_KEY = `.${DATA_KEY}`;
const DATA_API_KEY = '.data-api';
const JQUERY_NO_CONFLICT = $.fn[NAME];

const ClassName = {
  ACTIVE : 'active',
  BUTTON : 'btn',
  FOCUS : 'focus'
};

const Selector = {
  DATA_TOGGLE_CARROT : '[data-toggle^="button"]',
  DATA_TOGGLE : '[data-toggle="buttons"]',
  ACTIVE : '.active',
  BUTTON : '.btn',
  INPUT: 'input:not([type="hidden"])',
  INPUT_CHECKBOX_RADIO: 'input[type="checkbox"], input[type="radio"]'
};

const Event = {
  CLICK_DATA_API : `click${EVENT_KEY}${DATA_API_KEY}`,
  FOCUS_BLUR_DATA_API: `focus${EVENT_KEY}${DATA_API_KEY} ` + 
                         `blur${EVENT_KEY}${DATA_API_KEY}`
};


/**
 * ------------------------------------------------------------------------
 * Class Definition
 * ------------------------------------------------------------------------
 */

class Button {
  constructor(element) {
    this._element = element;
  }

  //  Getters
  static get VERSION() {
    return VERSION;
  }

  // Public
  toggle() {
    let triggerChangeEvent = true;
    let addAriaPressed = true;
    const rootElement = $(this._element).closest(Selector.DATA_TOGGLE)[0];

    if (rootElement) {
      const input = this._element.querySelector(Selector.INPUT);

      if (input) {
        if (input.type === 'radio') {
          if (input.checked && this._element.classList.contains(ClassName.ACTIVE)) {
            triggerChangeEvent = false;
          } else {
            const activeElement = rootElement.querySelector(Selector.ACTIVE);

            if (activeElement) {
              $(activeElement).removeClass(ClassName.ACTIVE);
            }
          }
        }

        if (triggerChangeEvent) {
          if (input.hasAttribute('disabled') ||
              rootElement.hasAttribute('disabled') ||
              input.classList.contains('disabled') ||
              rootElement.classList.contains('disabled')) {
            return; 
          }
          input.checked = !this._element.classList.contains(ClassName.ACTIVE);
          $(input).trigger('change');
        }

        input.focus();
        addAriaPressed = false;
      }
    }

    if (addAriaPressed) {
      this._element.setAttribute('aria-pressed',
        !this._element.classList.contains(ClassName.ACTIVE));
    }

    if (triggerChangeEvent) {
      $(this._element).toggleClass(ClassName.ACTIVE);
    }
  }

  dispose() {
    $.removeData(this._element, DATA_KEY);
    this._element = null;
  }

  static _jQueryInterface(config) {
    return this.each(function () {
      let data = $(this).data(DATA_KEY);

      if (!data) {
        data = new Button(this);
        $(this).data(DATA_KEY, data);
      }

      if (config === 'toggle' || config === 'dispose') {
        data[config]();
      }
    });
  }
}

$(document)
  .on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE_CARROT, (event) => {
    if (!$(event.target).is(Selector.INPUT_CHECKBOX_RADIO)) {
      event.preventDefault();
    }

    const button = $(event.target).closest(Selector.BUTTON)[0];
    Button._jQueryInterface.call($(button), 'toggle');
  }).on(Event.FOCUS_BLUR_DATA_API, Selector.DATA_TOGGLE_CARROT, (event) => {
    const button = $(event.target).closest(Selector.BUTTON)[0];
    $(button).toggleClass(ClassName.FOCUS, /^focus(in)?$/.test(event.type));
  });

$.fn[NAME] = Button._jQueryInterface;
$.fn[NAME].Constructor = Button;
$.fn[NAME].noConflict = () => {
  $.fn[NAME] = JQUERY_NO_CONFLICT;
  return Button._jQueryInterface;
};

export default Button;