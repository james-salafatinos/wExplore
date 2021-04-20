// include nodemailer
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();
const fromMail = process.env.MAIL_USER;


const sendEmail(toMail){
    let toMail = toMail;

    // let toMail = 'gnbaviskar2@gmail.com,gnbaviskar3@gmail.com';

    let subject = "An email using nodejs app";
    let text =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.";

    // auth
    const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
        type: "login", // default
        user: fromMail,
        pass: process.env.MAIL_PASS,
    },
    });

    // email options
    let mailOptions = {
    from: fromMail,
    to: toMail,
    subject: subject,
    text: text,
    };

    // send email
    transporter.sendMail(mailOptions, (error, response) => {
    if (error) {
        console.log(error);
    }
    console.log(response);
    });

}

module.exports = {sendEmail}

