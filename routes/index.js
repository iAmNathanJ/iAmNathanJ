var fs = require('fs')
  , http = require('http')
  , nconf = require('nconf')
  , express = require('express')
  , router = express.Router();

nconf.file('./.app-variables.json');

var sendgrid = require('sendgrid')(nconf.get('sendgrid:user'), nconf.get('sendgrid:key'));
var validate = require('./validate.js');


// ~ G E T

router.get('/', function(req, res, next) {
  var request = require('request')
    , parseString = require('xml2js').parseString;

  request('http://blog.iamnathanj.com/feed.xml', function(err, head, body) {
    if(!err) {
      var posts = [];
      parseString(body, function(err, result) {
        var entries = result.rss.channel[0].item;
        for(var i = 0; i < entries.length; i++) {
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

router.get(/[\w\W\s]/, function(req, res, next) {
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
