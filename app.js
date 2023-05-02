const path = require('path');
const express = require('express');
const HANDLEBARS = require('handlebars');
const {engine} = require("express-handlebars");
const sequelize = require("./util/database");
const Usuario = require("./models/users");
const Publication = require("./models/publications");
const Comentary = require("./models/comentaries");
const Reply = require("./models/replys");
const session = require("express-session");
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const multer = require("multer");
const {v4: uuidv4} = require("uuid");
const flash = require("connect-flash");
const Friends =require("./models/friends");
const Events =require("./models/events");
const DEvents =require("./models/detailsEvents");

const compareHelpers = require("./util/helpers/hbs/compare");
const queriesHelpers = require("./util/helpers/hbs/queries");
const errorController = require("./controllers/errorController");


const app = express();
app.engine("hbs", engine({
    layoutDir: "views/layouts/", 
    defaultLayout: "main-layout", 
    extname: "hbs",
    helpers:{
        equals: compareHelpers.equals,
        findUser: compareHelpers.FindUser,
        findImageProfile: compareHelpers.FindImageProfile,
        eventDate: compareHelpers.eventDate,
        guests: compareHelpers.Guests,
        findAnswer: compareHelpers.FindAnswer,
       },
    handlebars: allowInsecurePrototypeAccess(HANDLEBARS),
    }, 
    ));
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname,"public")));
app.use("/images",express.static(path.join(__dirname,"images")));


app.use(session({secret:"anything", resave: false, saveUninitialized: false}));
app.use(flash());

app.use((req,res,next)=>{
    const errors = req.flash("errors");

    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.userd = req.session.userdata;
    res.locals.errorMessages = errors;
    res.locals.hasErrorMessages = errors.length > 0;
    next();
})

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}-${file.originalname}`);
    },
});

app.use(multer({storage: imageStorage}).single("image"));


const loginRouter = require("./routes/login");
const publicationRouter = require("./routes/publications");
const friendsRouter = require("./routes/friends");
const notificationsRouter = require("./routes/notification");
const eventsRouter = require("./routes/events");
const { truncate } = require('fs');

app.use(publicationRouter);
app.use(loginRouter);
app.use(friendsRouter);
app.use(notificationsRouter);
app.use(eventsRouter);

app.use(errorController.Get404);


Publication.belongsTo(Usuario, {constraints: true, onDelete: "CASCADE"});
Usuario.hasMany(Publication);
Comentary.belongsTo(Publication, {constraints: true, onDelete: "CASCADE"});
Publication.hasMany(Comentary);
Comentary.belongsTo(Usuario, {constraints: true, onDelete: "CASCADE"});
Usuario.hasMany(Comentary);
Reply.belongsTo(Comentary, {constraints: true, onDelete: "CASCADE"});
Comentary.hasMany(Reply);
Reply.belongsTo(Reply, {constraints: false, onDelete: "CASCADE"});
Reply.hasMany(Reply);
Reply.belongsTo(Usuario, {constraints: true, onDelete: "CASCADE"});
Usuario.hasMany(Reply);
Friends.belongsTo(Usuario, {constraints: true, onDelete: "CASCADE"});
Usuario.hasMany(Friends);
Friends.belongsTo(Usuario, {constraints: true, onDelete: "CASCADE"});
Usuario.hasMany(Friends, { foreignKey: 'FriendId' });
Events.belongsTo(Usuario, {constraints: true, onDelete: "CASCADE"});
Usuario.hasMany(Events);
DEvents.belongsTo(Events, {constraints: true, onDelete: "CASCADE"});
Events.hasMany(DEvents);
DEvents.belongsTo(Usuario, {constraints: true, onDelete: "CASCADE"});
Usuario.hasMany(DEvents, { foreignKey: 'FriendId' });

sequelize.sync().then(result => {
    
    app.listen(3000);
    
}).catch(err => {
    console.log(err);
});

