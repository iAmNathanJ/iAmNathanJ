(function() {
  var scripts = ['scripts/main.js'];

  if (!this.Promise || !this.WeakMap) {
    scripts.unshift('scripts/polyfill.js');
  }

  scripts.forEach(function(script) {
    var s = document.createElement('script');
    s.src = script;
    s.async = false;
    document.getElementsByTagName('body')[0].appendChild(s);
  });

}).call(window);
