Type Ahead
=============

A very barebones, entirely javascript type ahead/auto-completer. Doesn't require jQuery.

You simply pass it a hidden field and an array. Add your own styles.

Demo: http://useallfive.github.io/type-ahead/demo/typeahead-usage.html

### Usage:
```HTML
<input id="test" type="hidden" />

<script src="ua5.typeahead.js"></script>

<script>
  var data = [
    {'name': 'dog', 'value':1},
    {'name': 'cat', 'value':2},
    {'name': 'cats', 'value':3}
  ];
  var opts = {
    //-- Prefix is a string added before
    //   all of the css selectors added to elements:
    'prefix': 'ua5_typeahead_',
    //-- HTML5 Placeholder text that shows up in the input
    'placeholder': 'Search Array',
    //-- Set to false by default. If true searching
    //   for 'cat' will not return 'Cat'
    'match_case': false
  }
  var t = TypeAhead(document.getElementById('test'), data, opts);
</script>
```
