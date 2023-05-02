
const users = require("../models/users");
const Sequelize = require("sequelize");
const Publicacion = require("../models/publications")
const comentary = require("../models/comentaries");
const Reply = require("../models/replys");
const Usuarios = require("../models/users");
const Friends = require("../models/friends");

exports.gethome = (req, res, next) => {
const userId = req.session.userdata;
  Publicacion.findAll({include:[{model: comentary, include: Reply}], where: {usuarioId: userId.id} ,order: [["createdAt", "DESC"]]}).then((result) =>{
    const publicacion = result.map((result) => result.dataValues);
     Reply.findAll().then((result2) =>{
        const reply = result2.map((result2) => result2.dataValues);   
        Usuarios.findAll().then((result3) =>{
          const user = result3.map((result3) => result3.dataValues);   
          Friends.findAll({where: {FriendId: userId.id, estado: "0"}}).then((result4) =>{
            const friend = result4.map((result4) => result4.dataValues);   
                res.render("home/index", { 
                pageTitle: "Home",
                homeActive: true,            
                publicacion: publicacion,
                repuesta: reply,
                users: user,
                notofications: friend.length,
                hasPublicacion: publicacion.length > 0,
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
    }).catch(err=>{
      console.log(err);
      return res.redirect("/");
    });
};

  

exports.PostHome = (req, res, next) => {

  const description = req.body.Publicacion;
  const img = req.file;
  const userId = req.body.userId;
  const date = new Date().getTime();
  const fecha = new Date(date).toUTCString();
  
  if(!img && !description){
    req.flash("errors","Debe ingresar una descripción o una imagen");
    return res.redirect("/");   
  }

  const imagePath = img ? "/" + img.path :  "";

  Publicacion.create({description: description, img: imagePath, usuarioId: userId, date: fecha} ).then(result=>{
    
    return res.redirect("/");
   
 }).catch(err=>{
   console.log(err);
   return res.redirect("/");
 });
   
};

exports.PostComentarie = (req, res, next) => {

  const comentarie = req.body.coment;
  const publiId = req.body.publiId;
  const userId = req.body.userId;
 console.log(userId);

  if(!comentarie){
    
    return res.redirect("/");
  }

  comentary.create({comentarie: comentarie, publicacioneId: publiId, usuarioId: userId} ).then(result=>{
    
    return res.redirect("/");
   
 }).catch(err=>{
   console.log(err);
   return res.redirect("/");
 });
   
};

exports.PostReply = (req, res, next) => {

  const reply = req.body.reply;
  const userId = req.body.userId;
  let comentarieId = req.body.comentarieId;
  let replyId = req.body.replyId;


  if(!reply ){
    return res.redirect("/");
  }

  if(!comentarieId && !replyId){
    return res.redirect("/");
  }

  if(!comentarieId){
    Reply.create({reply: reply, repuestaId: replyId, usuarioId: userId} ).then(result=>{
    
      return res.redirect("/");
     
   }).catch(err=>{
     console.log(err);
     return res.redirect("/");
   });
  }

  if(!replyId){
    Reply.create({reply: reply, comentarioId: comentarieId, usuarioId: userId} ).then(result=>{
    
      return res.redirect("/");
     
   }).catch(err=>{
     console.log(err);
     return res.redirect("/");
   });
     
  }

  
};

exports.getEditPublication = (req, res, next) => {
    const edit = req.query.edit;
    const publiId = req.params.publiId;
    const userId = req.session.userdata;

  Publicacion.findAll({include:[{model: comentary, include: Reply}], where: {usuarioId: userId.id} ,order: [["createdAt", "DESC"]]}).then((result) =>{
    const publicacion = result.map((result) => result.dataValues);

    Publicacion.findOne({where: {id: publiId}}).then((result) => {
      const publi = result.dataValues;
        if(!publi){
            req.flash("errors","No se ha encontrado la publicación");
            return res.redirect("/");
        }
        Reply.findAll().then((result2) =>{
          const reply = result2.map((result2) => result2.dataValues);   
          Usuarios.findAll().then((result3) =>{
            const user = result3.map((result3) => result3.dataValues);   
            Friends.findAll({where: {FriendId: userId.id, estado: "0"}}).then((result4) =>{
              const friend = result4.map((result4) => result4.dataValues);  
                  res.render("home/index", { 
                    pageTitle: "Home",
                    homeActive: true,
                    publicacion: publicacion,
                    publi: publi,
                    editMode: edit,
                    repuesta: reply,
                    users: user,
                    notofications: friend.length,
                    hasPublicacion: publicacion.length > 0,
                    });   
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
          }).catch((err) => { 
            console.log(err);
         });

};

exports.postEditPublication = (req, res, next) => {

  const description = req.body.Publicacion;
  const img = req.file;
  const publiId = req.body.publiId;
  const elm = req.body.elmimg;
   

  Publicacion.findOne({where: {id: publiId}}).then((result) => {
    const publi = result.dataValues;
    if(!publi){
      req.flash("errors","No se ha encontrado la publicación");
      return res.redirect("/");
    }
    let imagePath = publi.img;

    if (!img && !imagePath) {
     
    } else {
      imagePath = img ? "/" + img.path : publi.img;
    } 
    
    
    if(elm){
      imagePath = "";
    }

    if(!imagePath && !description){
      req.flash("errors","Debe ingresar una descripción o una imagen");
      return res.redirect("/");   
    }
  
    Publicacion.update({description: description, img: imagePath}, {where: {id: publiId}})
    .then((result) => {
          return res.redirect("/");
        }).catch(err=>{
          console.log(err);
          return res.redirect("/");
        });
        
  }).catch(err=>{
    console.log(err);
    return res.redirect("/");
  });
   
};

exports.postDeletePublication = (req, res, next) => {
    
  const publiId = req.body.publiId;

  Publicacion.destroy({where: {id: publiId}}).then((result) => {
      res.redirect("/");
  }).catch((err) => {
      console.log(err);
  });
};