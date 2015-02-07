module.exports = function validate(formData, callback){
  
  var err,
  
  expressions = {
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
  },

  input = [
    {
      name: 'name',
      value: formData.name,
      valid: formData.name ? true : false
    },
    {
      name: 'email',
      value: formData.email,
      valid: expressions.email.test(formData.email)
    },
    {
      name: 'message',
      value: formData.message,
      valid: formData.message ? true : false
    }
  ];
    
  err = input.filter(function(elem){
    return !elem.valid;
  });

  err = err.length > 0 ? err : false;

  callback(err, input);
};

