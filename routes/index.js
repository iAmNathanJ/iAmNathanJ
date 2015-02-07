var express = require('express');
var sendgrid = require('sendgrid')('iAmNathanJ', '56ddM!@#');
var validate = require('./validate.js');

var router = express.Router();


// ~ G E T ~   H O M E   P A G E

router.get('/', function(req, res, next) {
  res.render('index', { title: 'iAmNathanJ' });
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
      to: 'jacobs.123@gmail.com',
      from: req.body.email,
      fromname: req.body.name,
      subject: '*** I AM NATHAN J - FORM MAIL ***',
      text: req.body.message
    });
    
    // Send email
    sendgrid.send(email, function(err, json) {
      
      // Render failure template on sendgrid error
      if (err) {
        return res.render('message-failure', { formData: req.body, error: err });
      }
      // Render success template
      res.status(200); 
      res.render('message-success', { messenger: req.body.name });
    });
  });
});

module.exports = router;
