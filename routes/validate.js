module.exports = function validate(formData, cb){
  
  var invalid = false,
  
  expressions = {
    email: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
  },

  input = {
    name: formData.name,
    email: expressions.email.test(formData.email),
    message: formData.message
  };

  for(var valid in input){
    if(!valid){
      invalid = true;
      break;
    }
  }
  cb(invalid, formData);
};

