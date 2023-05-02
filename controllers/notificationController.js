const Usuarios = require("../models/users");
const Friends = require("../models/friends");

exports.getNotification = (req, res, next) => {
  const userId = req.session.user; 
          Usuarios.findAll().then((result3) =>{
            const user = result3.map((result3) => result3.dataValues);   
            Friends.findAll({where: {FriendId: userId.id, estado: "0"}}).then((result4) =>{
              const friend = result4.map((result4) => result4.dataValues);   
              Friends.findAll().then((result5) =>{
                const friends = result5.map((result5) => result5.dataValues);
                  res.render("notification/notification", { 
                  pageTitle: "Notification",
                  homeActive: true,      
                  users: user,
                  friends: friends,
                  notofications: friend.length,
                  });
                }).catch(err=>{
                  console.log(err);
                  return res.redirect("/");
                });
              }).catch(err=>{
              console.log(err);
              return res.redirect("/");
            });
            }).catch(err=>{
            console.log(err);
           return res.redirect("/");
         });
};

exports.postAceptFriend = (req, res, next) => {
  const id = req.body.friendId;
  const userId = req.body.userId;
  const friendId = req.body.frId;
  Friends.update({estado: 1}, {where: {id: id}})
  .then((result) => {
    Friends.create({usuarioId: userId, FriendId: friendId, estado: 1} ).then(result=>{
      return res.redirect("/friends");
   }).catch(err=>{
     console.log(err);
     return res.redirect("/friends");
   });
  }).catch((err) => {
      console.log(err);
  });
};

exports.postDenyFriend = (req, res, next) => {
  const id = req.body.friendId;
  
  Friends.destroy({where: {id: id}})
  .then((result) => {
      return res.redirect("/friends");

  }).catch((err) => {
      console.log(err);
  });
};