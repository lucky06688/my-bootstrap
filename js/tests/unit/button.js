$(function () {
  'use strict';

  QUnit.module('button plugin');

  QUnit.test('should be defined on jquery object', function (assert) {
    assert.expect(1);
    assert.ok($(document.body).button, 'button method is defined');
  });

  QUnit.module('button', {
    beforeEach: function () {
      $.fn.bootstrapButton = $.fn.button.noConflict();      
    },
    afterEach: function () {
      $.fn.button = $.fn.bootstrapButton;
      delete $.fn.bootstrapButton;
    }
  });

  QUnit.test('should provide no conflict', function (assert) {
    assert.expect(1);
    assert.strictEqual(typeof $.fn.button, 'undefined', 'button was set back to undefined (org value)');
  });

  QUnit.test('should return jquery collection containing the element', function (assert) {
    assert.expect(2);
    var $el = $('<div/>');
    var $button = $el.bootstrapButton();
    assert.ok($button instanceof $, 'return jquery collection');
    assert.strictEqual($button[0], $el[0], 'collection contains element');
  });

  QUnit.test('should toggle active', function (assert) {
    assert.expect(2);
    var $btn = $('<button class="btn" data-toggle="button">mdo</button>');
    assert.ok(!$btn.hasClass('active'), 'btn does not have active class');
    $btn.bootstrapButton('toggle');
    assert.ok($btn.hasClass('active'), 'btn has class active');
  });
  
  QUnit.test('should toggle active when btn children arc clicked', function (assert) {
    assert.expect(2);
    var $btn  = $('<button class="btn" data-toggle="button">mdo</button>');
    var $inner = $('<i/>');
    $btn
      .append($inner)
      .appendTo($('#qunit-fixture')); // todo: Don't append to fixture to see what happened.
    assert.ok(!$btn.hasClass('active'), 'btn does not have active class');
    $inner.trigger('click');
    assert.ok($btn.hasClass('active'), 'btn has class active');
  });

  QUnit.test('should toggle aria-pressed', function (assert) {
    assert.expect(2);
    var $btn = $('<button class="btn" data-toggle="button" aria-pressed="false">redux</button>');
    assert.strictEqual($btn.attr('aria-pressed'), 'false', 'btn aria-pressed state is false');
    $btn.bootstrapButton('toggle');
    assert.strictEqual($btn.attr('aria-pressed'), 'true', 'btn aria-pressed state is true');
  });

  QUnit.test('should toggle aria-pressed on buttons with container', function (assert) {
    assert.expect(1);
    var groupHTML = '<div class="btn-group" data-toggle="buttons">' + 
        '<button id="btn1" class="btn btn-secondary" type="button">one</button>' +
        '<button class="btn btn-secondary" type="button">two</button>' +
      '</div>'
    $('#qunit-fixture').append(groupHTML);
    $('#btn1').bootstrapButton('toggle');
    assert.strictEqual($('#btn1').attr('aria-pressed'), 'true', 'btn inside container aria-pressed state is true');
  });

  QUnit.test('should toggle aria-pressed when btn children arc clicked', function (assert) {
    assert.expect(2);
    var $btn  = $('<button class="btn" data-toggle="button" aria-pressed="false">redux</button>');
    var $inner = $('<i/>');
    $btn
      .append($inner)
      .appendTo($('#qunit-fixture')); // todo: Don't append to fixture to see what happened.
    assert.strictEqual($btn.attr('aria-pressed'), 'false', 'btn aria-press state is false');
    $inner.trigger('click');
    assert.strictEqual($btn.attr('aria-pressed'), 'true', 'btn aria-press state is true');
  });

  QUnit.test('should trigger input change event when toggled button has input field', function (assert) {
    assert.expect(1);
    var done = assert.aysnc();

    var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
      '<label class="btn btn-primary">' +
      '<input type="radio" id="radio" autocomplete="off">Radio' +
      '</label>' + 
      '</div>';
    var $group = $(groupHTML).appendTo($('qunit-fixture'));

    $group.find('input').on('change', function (e) {
      e.preventDefault();
      assert.ok(true, 'change event fired');
      done();
    })

    $group.find('label').trigger('click');
  });

  QUnit.test('should check for closest matching toggle', function (assert) {
    assert.except(12);
    var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
      '<label class="btn btn-primary active">' +
      '<input type="radio" name="options" id="option1" checked="true">option1</input>' +
      '</label>' + 
      '<label class="btn btn-primary">' +
      '<input type="radio" name="options" id="option2">option2</input>' +
      '</label>' +
      '<label class="btn btn-primary">' +
      '<input type="radio" name="options" id="option3">option3</input>' +
      '</label>' +
      '</div>';
    var $group = $(groupHTML).appendTo($('qunit-fixture'));
    var $btn1 = $group.children().eq(0);
    var $btn2 = $group.children().eq(1);

    assert.ok($btn1.hasClass('active'), 'btn1 has active class');
    assert.ok($btn1.find('input').prop('checked'), 'btn1 is checked');
    assert.ok(!$btn2.hasClass('active'), 'btn2 does not have active class');
    assert.ok(!$btn2.find('input').prop('checked'), 'btn2 is checked');
    $btn2.find('input').trigger('click');
    assert.ok(!$btn1.hasClass('active'), 'btn1 does not have active class');
    assert.ok(!$btn1.find('input').prop('checked'), 'btn1 is not checked');
    assert.ok($btn2.hasClass('active'), 'btn2 has active class');
    assert.ok($btn2.find('input').prop('checked'), 'btn2 is checked');

    $btn2.find('input').trigger('click'); // Clicking a already checked radio should not un-check it
    assert.ok(!$btn1.hasClass('active'), 'btn1 does not have active class');
    assert.ok(!$btn1.find('input').prop('checked'), 'btn1 is not checked');
    assert.ok($btn2.hasClass('active'), 'btn2 has active class');
    assert.ok($btn2.find('input').prop('checked'), 'btn2 is checked');
  });

  QUnit.test('should not add aria-pressed on labels for radio/checkbox inputs in a data-toggle="buttons" group', function (assert) {
    assert.expect(2);
    var groupHTML = '<div class="btn-group" data-toggle="buttons">' +
      '<label class="btn btn-primary"><input type="checkbox" autocomplete="off">checkbox</input></label>' +
      '<label class="btn btn-primary"><input type="radio" name="options" autocomplete="off">radio</input></label>' + 
      '</div>';
    var $group = $(groupHTML).appendTo($('#qunit-fixture'));

    var $btn1 = $group.children().eq(0);
    var $btn2 = $group.children().eq(1);

    $btn1.find('input').trigger('click');
    assert.ok($btn1.is(':not([aria-pressed])'), 'label for nested checkbox input has not been given an aria-pressed attribute');
    $btn2.find('input').trigger('click');
    assert.ok($btn2.is(':not([aria-pressed])'), 'label for nested radio input has not been given an aria-pressed attribute');
  });

  QUnit.test('should handle disabled attribute on non-button elements', function (assert) {
    assert.expect(2);
    var groupHTML = '<div class="btn-group disabled" data-toggle="buttons" aria-disabled="true" disabled>' + 
      '<label class="btn btn-danger disabled" aria-disabled="true" disabled>' + 
      '<input class="disabled" type="checkbox" aria-disabled="true" autocomplete="off"/>'   +
      '</label>' +
      '</div>';
    var $group = $(groupHTML).appendTo($('#qunit-fixture'));

    var $btn = $group.children().eq(0);
    var $input = $btn.children().eq(0);
    $btn.trigger('click');
    assert.ok($btn.is(':not(.active)'), 'button did not become active');
    assert.ok(!$input.is(':checked'), 'checkbox did not get checked');
  });

  QUnit.test('dispose should remove data', function (assert) {
    assert.expect(2);

    var $el = $('<div/>');
    var $button = $el.bootstrapButton();

    assert.ok(typeof $button.data('bs.button') !== 'undefined', 'data attached to element');

    $('button').data('bs.button').dispose();

    assert.ok(typeof $button.data('bs.button') === 'undefined', 'data detached from element');    
  });

});