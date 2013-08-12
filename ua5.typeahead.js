/**
 * Author: Jason Farrell
 * Author URI: http://useallfive.com/
 * 
 * Description: Turns a hidden field into a type-ahead list selector.
 * Package URL: https://github.com/UseAllFive/type-ahead
 *
 * @param  {[type]} _target_input
 * @param  {Array of objects {name:'string', value: 'string' } } _data
 * @param  {string, optional} _opts.prefix
 *
 * @requires: .filter shim to work in <IE9: http://ua5.co/QkAA
 */
var TypeAhead = function(_target_input, _data, _opts) {
  "use strict";

  var _display_el;
  var _group_el;
  var _input_el;
  var _labels = [];
  var _label_selection = -1;
  var _word_list_el;

  //-- Initializes this TypeAhead instance:
  (function _init() {

    _opts = ("object" === typeof(_opts)) ? _opts : {};

    if (
      !_opts.hasOwnProperty('prefix') ||
      "string" !== typeof(_opts.prefix)
    ) {
      //-- If the user doesn't set a prefix, make it empty:
      _opts.prefix = '';
    }

    if (
      !_opts.hasOwnProperty('onChoiceChange') ||
      "function" !== typeof(_opts.onChoiceChange)
    ) {
      _opts.onChoiceChange = function() {};
    }

    //-- Construct our DOM elements:
    _group_el = document.createElement("div");
    _display_el = document.createElement("div");
    _input_el = document.createElement("input");
    _word_list_el = document.createElement("ul");
    _group_el.appendChild(_display_el);
    _group_el.appendChild(_input_el);
    _group_el.appendChild(_word_list_el);

    //-- Add css selectors to our elements:
    _group_el.setAttribute('class', _opts.prefix + "group");
    _display_el.setAttribute('class', _opts.prefix + "display");
    _input_el.setAttribute('class', _opts.prefix + "input");
    _word_list_el.setAttribute('class', _opts.prefix + "word_list");

    _display_el.style.display = 'none';

    if (
      _opts.hasOwnProperty('placeholder') ||
      "string" === typeof(_opts.placeholder)
    ) {
      _input_el.setAttribute('placeholder', _opts.placeholder);
    }

    //-- Add our group after the target input (hidden field)
    if (_target_input.nextSibling) {
      _target_input.parentNode.insertBefore(_group_el, _target_input.nextSibling);
    } else {
      _target_input.parentNode.appendChild(_group_el);
    }

    //-- Event handlers
    _input_el.onkeyup = _keyupHandler;

    _word_list_el.onclick = function(event) {
      _setSelection(event.target);
      _clearResults();
    };

    _display_el.onclick = function(event) {
      _clearSelection();
      _clearResults();
    };
  })();

  /**
   * Clears all of the results
   */
  function _clearResults() {
    //-- Clear out our old labels array;
    _labels = [];

    //-- Clear out the wordlist
    _word_list_el.innerHTML = '';

    //-- Clear the text input:
    _input_el.value = '';
  }

  /**
   * Clears the selected word
   */
  function _clearSelection() {
    _target_input.value = '';
    _display_el.innerHTML = '';
    _input_el.style.display = 'block';
    _display_el.style.display = 'none';
    _input_el.focus();
    _opts.onChoiceChange();
  }

  /**
   * Builds a filter to search the names in the data array.
   *
   * @param  {array of objects: name is required} search
   * @return {filter}
   */
  function _nameFilterGenerator(search) {
    return function(val, i, data) {
      return -1 !== val.name.indexOf(search);
    };
  }

  /**
   * Handles any sort of keying on the search textfield.
   * @param  {key event} event
   */
  function _keyupHandler(event) {
    var DOWN = 40;
    var ENTER = 13;
    var ESCAPE = 27;
    var UP = 38;
    var filtered_results;
    var textfield = event.target;
    var search_term = textfield.value;
    var selected_result;

    //-- Conditions that clear the textbox:
    if (
        ESCAPE === event.keyCode ||
        '' === search_term ||
        ' ' === search_term
    ) {
      _clearResults();
    } else {
      switch(event.keyCode) {
        case DOWN:
          //-- select next result
          _selectLabel(_label_selection+1);
          //-- Restore the cursor position to the end of the text:
          textfield.setSelectionRange(search_term.length, search_term.length);
          break;
        case UP:
          //-- select previous result
          _selectLabel(_label_selection-1);
          //-- Restore the cursor position to the end of the text:
          textfield.setSelectionRange(search_term.length, search_term.length);
          break;
        case ENTER:
          _setSelection(_labels[_label_selection]);
          break;
        default:
          //-- Clear out anything that has been selected
          _clearSelection();
          //-- We have a real search tearm, let's filter the data:
          filtered_results = _data.filter(_nameFilterGenerator(search_term));
          //-- Update our list with the results:
          _showResults(filtered_results);
          break;
      }
    }
  }

  /**
   * This selects a label in the label list.
   * It updates _label_selection to the selected label
   * and also adds a selected class to the label.
   *
   * @param  {int} index
   */
  function _selectLabel(index) {
    var i = _labels.length;

    //-- Reset all of the labels’ display
    while(i) {
      i--;
      _labels[i].setAttribute('class', '');
    }

    //-- If index is too high, reset it
    if (index > _labels.length-1) {
      _label_selection = 0;
    //-- If index is too low, make it the last one
    } else if (index < 0) {
      _label_selection = _labels.length-1;
    } else {
      _label_selection = index;
    }

    if ("undefined" !== typeof(_labels[_label_selection])) {
      //-- select the current one:
      _labels[_label_selection].setAttribute('class', _opts.prefix + 'selected');
    }
  }

  /**
   * Takes an element with an attr called data-value
   * and sets the target input to this value.
   *
   * This also updates a display with the text content
   * of the element.
   * @param {dom element} el
   */
  function _setSelection(el) {
    var name;
    var value;

    if (
      "undefined" !== typeof(el) &&
      el.hasAttribute('data-value')
    ) {

      value = el.getAttribute('data-value');
      name = el.textContent;

      //-- Set our target input value
      _target_input.value = value;
      //-- Show the name in the display
      _display_el.innerHTML = name;
      //-- hide our text input
      _input_el.style.display = 'none';
      //-- show the clear button
      _display_el.style.display = 'block';
      //-- get rid of the results now that one is selected
      _clearResults();
      _opts.onChoiceChange();
    }
  }

  /**
   * Fills the word list ul element with
   * an array of result objects: {name:'string', value: 'string' }
   *
   * @param  {array} results
   */
  function _showResults(results) {
    var html = '';
    var i;
    var label;
    var length = results.length;

    //-- Clear out our old labels;
    _labels = [];
    _label_selection = -1;
    _word_list_el.innerHTML = '';

    for (i = 0; i < length; i++) {
      label = document.createElement('li');
      label.setAttribute('data-value', results[i].value);
      label.appendChild(document.createTextNode(results[i].name));
      _word_list_el.appendChild(label);
      _labels.push(label);
    }
  }

};
