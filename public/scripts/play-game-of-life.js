(function() {

  'use strict';

  // SERIALIZE HELPER
  function serialize(data) {

    let queryString = [];
    let dataKeys = Object.keys(data);

    let add = (key, val) => {
      queryString.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    };

    let addArray = (key, arr) => {
      arr.forEach((val) => {
        queryString.push(`${encodeURIComponent(key)}[]=${encodeURIComponent(val)}`);
      });
    };

    dataKeys.forEach((key, i) => {
      if(Array.isArray(data[key])) {
        addArray(key, data[key])
      } else {
        add(key, data[key]);
      }
    });
    return queryString.join('&');
  }

  (function generateLife(data) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', `/game-of-life/api?${data}`);
    xhr.send();
    xhr.addEventListener('load', (e) => {

      let msg = JSON.parse(e.target.response);
      console.log(msg);

      let newData = { state: msg };
      setTimeout(() => {
        generateLife(serialize(newData));
      }, 2000);
    });
  })();

})();
