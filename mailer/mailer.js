const nodemailer = require("nodemailer");
// require("dotenv").config();

// const USER_SENDER = process.env.USER_SENDER;
// const USER_PASSWORD = process.env.USER_PASSWORD;

function sendEmail(email,token){
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: "garnik0707enoqyan@gmail.com",
          pass: "extouxntpffsufee"
        },
        tls:{rejectUnauthorized:false}
      });
    
      const mailOptions = {
        from: "garnik0707enoqyan@gmail.com",
        to: email,
        subject: 'Confirmation email',
        text: `Click http://localhost:5001/user/verify?token=${token}`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

module.exports = {sendEmail}