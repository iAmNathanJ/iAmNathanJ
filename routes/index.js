var fs = require('fs')
  , http = require('http')
  , request = require('request')
  , nconf = require('nconf')
  , parseString = require('xml2js').parseString
  , express = require('express')
  , router = express.Router();

nconf.file('./.app-variables.json');

var sendgrid = require('sendgrid')(nconf.get('sendgrid:user'), nconf.get('sendgrid:key'));
var validate = require('./validate.js');
var gameOfLife = require('./game-of-life.js');

// ~ G E T

router.get('/', function(req, res, next) {

  request('http://blog.iamnathanj.com/feed.xml', function(err, head, body) {
    if(!err) {
      var posts = [];
      parseString(body, function(err, result) {
        var entries = result.rss.channel[0].item;
        var postLimit = entries.length > 5 ? 5 : entries.length;
        for(var i = 0; i < postLimit; i++) {
          posts.push({
            title: entries[i].title,
            subtitle: entries[i].subtitle,
            excerpt: entries[i].excerpt,
            month: entries[i].dateMonth,
            day: entries[i].dateDay,
            link: entries[i].link
          });
        }
      });
      res.render('index', { title: 'iAmNathanJ', posts: posts });
    }
  });
});

router.get('/blog', function(req, res, next) {
  res.redirect('http://blog.iamnathanj.com');
});

router.get('/feed', function(req, res, next) {
  res.redirect('http://blog.iamnathanj.com/feed.xml');
});

router.get('/game-of-life', function(req, res, next) {
  res.render('game-of-life', { title: 'iAmNathanJ::Game of Life' });
});

router.get('/game-of-life/api', function(req, res, next) {
  var state = req.query.state || null;
  var life = gameOfLife();
  if(state) {
    res.json(life.generate(state));
  } else {
    life.seed();
    res.json(life.generate());
  }
});

// handle webpagetest pings
router.get('/test-results', function(req, res, next) {
  var id = req.query.id || res.end();
  request.get('http://www.webpagetest.org/jsonResult.php?test=' + id, function(err, head, body) {
    if(err) console.log(err);
    var data = JSON.parse(body).data;

    var firstView = data.runs['1'].firstView;
    var model = [
      'loadTime',       // load time
      'TTFB',           // ttfb
      'render',         // start render
      'SpeedIndex',     // speed index

      'docTime',        // document complete
      'fullyLoaded',    // fully loaded
      'visualComplete', // visually complete

      'score_cache',    // cache score
      'score_gzip',     // gzip score
      'image_total',    // image total

      'requestsFull',   // request count
      'bytesIn',        // page weight
      'requests'        // all requests
    ];

    var simplifiedData = model.reduce(function(obj, property) {
      if(property === 'requests') {
        obj[property] = firstView[property].map(function(request) {
          return {
            url: request['url'],                   // url
            contentType: request['contentType'],   // content type
            load_start: +request['load_start'],    // request start
            ttfb_ms: +request['ttfb_ms'],          // ttfb
            load_ms: +request['load_ms'],          // loaded duration
            load_end: +request['load_end'],        // loaded
            bytesIn: +request['bytesIn']           // request weight
          };
        });
      } else {
        obj[property] = firstView[property];
      }
      return obj;
    }, {});

    simplifiedData['testID'] = id;

    var fileName = './webpagetest/' + data.label + '.json';
    var fileData = JSON.stringify(simplifiedData, null, 2) + '\n';
    fs.writeFile(fileName, fileData);
    res.json(req.query);
  });

  // First View: data.runs['1'].firstView

    // load time: loadTime
    // ttfb: TTFB
    // start render: render
    // speed index: SpeedIndex

    // document complete: docTime
    // fully loaded: fullyLoaded
    // visually complete: visualComplete

    // cache score: score_cache
    // gzip score: score_gzip
    // image total: image_total

    // request count: requestsFull
    // weight: bytesIn
    // requests: requests
      // content type: contentType
      // content ID: type
      // request start: load_start
      // ttfb: ttfb_ms
      // loaded duration: load_ms
      // loaded: load_end
      // weight: bytesIn

  // Repeat View: data.runs['1'].repeatView


});

router.get(/.*/, function(req, res, next) {
  res.redirect('/');
});

// ~ P O S T ~   M A I L   F O R M

router.post('/mail', function(req, res) {

  // Call Validation
  validate(req.body, function(err, data) {

    // Handle invalid form data
    if (err) {
      res.status(206);
      return res.render('message-helpers.jade', { errors: err });
    }

    // If form is valid, set up email
    var email = new sendgrid.Email({
      to: nconf.get('contact:email'),
      from: req.body.email,
      fromname: req.body.name,
      subject: nconf.get('contact:subject'),
      text: req.body.message
    });

    // Send email
    sendgrid.send(email, function(err, json) {

      // Render failure template on sendgrid error
      if (err) {
        res.status(206);
        console.log('Sendgrid Error', err);
        console.log(nconf.get('sendgrid:user'), nconf.get('sendgrid:key'));
        return res.render('sendgrid-failure', { error: err });
      }
      // Render success template
      res.status(200);
      res.render('message-success', { messenger: req.body.name });
    });
  });
});

module.exports = router;
