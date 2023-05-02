const moment = require("moment");
moment.locale("es-do");

exports.equals = (a,b) => {
    return a === b;
};

exports.FindUser = (userId, users) => {
    const user = users.find((user) => user.id == userId);
    return user.usuario;
  };

exports.FindImageProfile = (userId, users) => {
    const user = users.find((user) => user.id == userId);
    return user.img;
  };

  exports.FindImageProfile = (userId, users) => {
    const user = users.find((user) => user.id == userId);
    return user.img;
  };

  exports.eventDate = (date) => {
    const Cdate = moment(date).format("LLLL");
  
    if (Date.parse(date) < Date.parse(moment().toDate())) {
      return false;
    } else {
      return Cdate.charAt(0).toUpperCase() + Cdate.slice(1);
    }
  };

  exports.Guests = (array) => {
    if (array.length >= 1) return "   " + array.length + " personas";
    else return false;
  };

