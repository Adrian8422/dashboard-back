import nodemailer from "nodemailer";
// myem ewkz bmmb nese

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: "adrian.tag.villegas@gmail.com",
    pass: "myemewkzbmmbnese",
  },
});

console.log(transporter);

export async function send(email: string, code: number) {
  console.log(email, code);
  try {
    await transporter.sendMail({
      from: "'Dashboard Tech' <manbassman1996@gmail.com>",
      to: email,

      subject: "Dashboard Tech",
      html: `
      <div>
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f0f0f0;
                    margin: 0;
                    padding: 0;
                }
              
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    border-radius: 5px;
                    text-align: center;
                }
              
                .header {
                    background-color: #007bff;
                    color: #fff;
                    padding: 20px 0;
                }
              
                h1 {
                    font-size: 24px;
                }
              
                p {
                    font-size: 18px;
                    line-height: 1.6;
                }
              
                .verification-code {
                    font-size: 24px;
                    font-weight: bold;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Email Verification</h1>
                </div>
                <p>Dear User,</p>
                <p>Thank you for registering with our service. To complete your registration, please use the following verification code:</p>
                <p class="verification-code">${code}</p> <!-- Reemplaza "12345" con el código generado por tu backend -->
                <p>If you didn't register on our platform, please ignore this email.</p>
                <p>Best regards,<br>Your Company Name</p>
            </div>
        </body>
        </html>
              
      </div>
              
    `,
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}
