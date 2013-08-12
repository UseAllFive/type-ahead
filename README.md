Type Ahead
=============

A very barebones, entirely javascript type ahead/auto-completer. Doesn't require jQuery.

You simply pass it a hidden field and an array. Add your own styles.

Demo: http://useallfive.github.io/type-ahead/demo

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
    'prefix': 'ua5_typeahead_',
    'placeholder': 'Search Array'
  }
  var t = TypeAhead(document.getElementById('test'), data, opts);
</script>
```
