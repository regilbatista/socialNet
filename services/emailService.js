const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    port: 587,
    auth: {
        user: "regil.batista.inpha@gmail.com",
        pass: "hxankdtrwfiwwyoc"
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = transporter;