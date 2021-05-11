import nodemailer from "nodemailer";
import config from "../config";

const {PASS, USER} = config;

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    tls: {
      secure: false,
      ignoreTLS: true,
      rejectUnauthorized: false
    },
    auth: {
        user: USER,
        pass: PASS,
    },

});

exports.sendConfirmationEmail = (name, email, confirmationCode) => {
    let mailOptions = {
        from: USER,
        to: email,
        subject: "Please confirm your account",
        html: `<h1>Email Confirmation</h1>
                <h2>Hello ${name}</h2>
                <h5>Thank you for subscribing. Please confirm your email by clicking on the following link</h5>
                <a href=http://localhost:8000/#/confirm/${confirmationCode}><h3> Click here</h3></a>
                </div>`
    };
    console.log("Check");
    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error', error);
        }
        else{
            console.log('Success', info);
        }
    });
  };