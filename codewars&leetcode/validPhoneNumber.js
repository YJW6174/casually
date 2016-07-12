function validPhoneNumber(phoneNumber){
  //TODO: Return whether phoneNumber is in the proper form
  var reg = /^\(\d{3}\) \d{3}-\d{4}$/;
  return reg.test(phoneNumber);
}