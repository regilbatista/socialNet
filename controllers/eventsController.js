
const Friends = require("../models/friends");
const Events = require("../models/events");
const DEvents = require("../models/detailsEvents");
const Usuarios = require("../models/users");
const { Op } = require("sequelize");

exports.getEvents = (req, res, next) => {

  const userId = req.session.userdata;
  Friends.findAll({where: {FriendId: userId.id, estado: "0"}}).then((result) =>{
    const friend = result.map((result) => result.dataValues);  
      Events.findAll({include:[{model: DEvents}],where: { usuarioId : userId.id}}).then((result1) =>{
        const event = result1.map((result1) => result1.dataValues); 
          Events.findAll({include: [{ model: DEvents, 
            where: { FriendId: userId.id, },
            order: [["createdAt", "DESC"]],
            }]}).then((result2) =>{
            const invitedevent = result2.map((result2) => result2.dataValues); 
            DEvents.findAll().then((result3) =>{
              const DEvents = result3.map((result3) => result3.dataValues); 
                res.render("events/events", { 
                pageTitle: "Eventos",
                eventActive: true,  
                events: event,
                invitedevents: invitedevent,
                DEvents: DEvents,
                notofications: friend.length,
                });
              }).catch(err=>{
                console.log(err);
                return res.redirect("/events");
              });
            }).catch(err=>{
              console.log(err);
              return res.redirect("/events");
            }); 
        }).catch(err=>{
          console.log(err);
          return res.redirect("/events");
        }); 

    }).catch(err=>{
      console.log(err);
      return res.redirect("/events");
    });
              
};

exports.getAddEvent = (req, res, next) => {

  const userId = req.session.userdata;
  Friends.findAll({where: {FriendId: userId.id, estado: "0"}}).then((result) =>{
    const friend = result.map((result) => result.dataValues);
      res.render("events/add-events",
      {pageTitle: "Agregar-Evento",
      dateTime: new Date(new Date().getTime() + 86409000).toISOString().slice(0, 16),  
      eventActive: true,
      notofications: friend.length,
      });
  }).catch(err=>{
    console.log(err);
    return res.redirect("/events");
  });

};

exports.postAddEvent = (req, res, next) => {
  const name = req.body.name;
  const date = req.body.date;
  const place = req.body.place;
  const userId = req.body.userId;
  if (name == "" || date == "" || place == "") {
    req.flash("errors","Todos los campos son obligatorios");
    return res.redirect("/add-events");
  }
    Events.create({name: name, date: date, place:place, usuarioId: userId }).then((result) => {
       res.redirect("/events");
      }).catch((err) => { 
          console.log(err);
      } );
};

exports.postDeleteEvent = (req, res, next) => {
    
  const eventId = req.body.eventId;

  Events.destroy({where: {id: eventId}}).then((result) => {
      res.redirect("/events");
  }).catch((err) => {
      console.log(err);
  });
};

exports.getAddGuests = (req, res, next) => {

  const eventId = req.params.eventId;
  const userId = req.session.userdata;
  Friends.findAll({where: {FriendId: userId.id, estado: "0"}}).then((result) =>{
    const friend = result.map((result) => result.dataValues);
      Events.findOne({where: {id: eventId}})
        .then(result1 =>{
          const event = result1.dataValues;
            res.render("events/add-guests",
            {pageTitle: "Agregar-Invitados",
            eventActive: true,
            event: event,
            notofications: friend.length,
        });
      }).catch(err=>{
        console.log(err);
        return res.redirect("/events");
      });
  }).catch(err=>{
    console.log(err);
    return res.redirect("/events");
  });
};

exports.postAddGuests = (req, res, next) => {
  const user = req.body.user;
  const eventId = req.body.eventId;
  const userId = req.session.userdata;

  if (!eventId ) {
    return res.redirect("/add-guests/"+ eventId);
  }
  if (!user) {
    req.flash("errors","Debe poner el nombre de usuario del invitado");
    return res.redirect("/add-guests/"+ eventId);
  }
      Usuarios.findOne({where: {usuario: user}})
        .then(user =>{
        if(!user){
          req.flash("errors","Usuario incorrecto");
          return res.redirect("/add-guests/"+ eventId);
        }
          const FriendId = user.id;

          Friends.findOne({where: {usuarioId: userId.id, FriendId: FriendId  }}).then((friends) =>{

            if(!friends){
              req.flash("errors","No es tu amigo");
              return res.redirect("/add-guests/"+ eventId);
            }
            DEvents.findOne({where: {[Op.and]: [{ eventId: eventId }, {  FriendId: FriendId }]}})
                .then(async (result) => {
                  if (result) {
                    req.flash("errors", "Este usuario ya ha sido invitado");
                    return res.redirect("/add-guests/" + eventId);
                  }

                    DEvents.create({eventId: eventId, FriendId: FriendId, response: 0 }).then((result) => {
                      res.redirect("/view-guests/" + eventId);
                    }).catch((err) => { 
                        console.log(err);
                    } );
                    
              }).catch(err=>{
                console.log(err);
                return res.redirect("/add-guests/"+ eventId);
              });  

          }).catch(err=>{
            console.log(err);
            return res.redirect("/add-guests/"+ eventId);
          });  
              

      }).catch(err=>{
       console.log(err);
        return res.redirect("/add-guests/"+ eventId);
      });  
          
};

exports.getViewGuests = (req, res, next) => {

  const eventId = req.params.eventId;
  const userId = req.session.userdata;

  Usuarios.findAll({where: { [Op.not]: { id: userId.id } },
    include: [{model: DEvents, where: {eventId: eventId }}]})
    .then((result) => {
      if (result.length < 1) {
        req.flash("errors", "Aún no has invitado a nadie a este evento");
        return res.redirect("/events");
      }

      const guestsUsers = result.map((result) => result.dataValues);

      Events.findOne({ where: { id: eventId }})
        .then(async (result1) => {
          const event = result1.dataValues;
          Friends.findAll({where: {FriendId: userId.id, estado: "0"}}).then((result2) =>{
            const friend = result2.map((result2) => result2.dataValues); 
              Usuarios.findOne({where: { id: userId.id }}).then((result3) =>{
                const user = result3.dataValues;    
                  res.render("events/view-guests", {
                    pageTitle: "Invitados",
                    eventActive: true,
                    user: user,
                    event: event,
                    guestsUsers: guestsUsers,
                    notofications: friend.length,
  
                  });
              }).catch((err) => {
                console.log(err);
              });
            }).catch((err) => {
              console.log(err);
            });
        }).catch((err) => {
          console.log(err);
        });
    }).catch((err) => {
      console.log(err);
    });
};

exports.postDeleteGuests = (req, res, next) => {
    
  const eventId = req.body.eventId;
  const deventId = req.body.deventId;
  
  DEvents.destroy({where: {id: deventId}}).then((result) => {
      res.redirect("/view-guests/" + eventId);
  }).catch((err) => {
      console.log(err);
  });
};

exports.postResponseGuests = (req, res, next) => {
    
  const eventId = req.body.eventId;
  const userId = req.body.userId;
  const response = req.body.response;

 if(response === " "|| response === undefined|| response === null){
  req.flash("errors", "Debe seleccionar una opción");
  res.redirect("/events");
  }
  DEvents.update({response: response}, {where: {FriendId: userId, eventId: eventId}}).then((result) => {
      res.redirect("/events");
  }).catch((err) => {
      console.log(err);
  });
};
