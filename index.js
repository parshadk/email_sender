const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');

const app = express();
const port = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 't42006532@gmail.com',
    pass: 'password',
  },
});

app.get('/', (req, res) => {
  res.send('Hello ');
});

app.post('/send-email', upload.single('attachment'), (req, res) => {
  if (!req.body.to || !req.body.subject || !req.body.text) {
    return res.status(400).send('Missing required fields in the request body.');
  }

  const { to, subject, text } = req.body;

  let mailOptions;

  if (req.file) {
    mailOptions = {
      from: 't42006532@gmail.com',
      to,
      subject,
      text,
      attachments: [
        {
          filename: req.file.originalname,
          content: req.file.buffer,
        },
      ],
    };
  } else {
    mailOptions = {
      from: 't42006532@gmail.com',
      to,
      subject,
      text,
    };
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.send('Email sent: ' + info.response);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port : ${port}`);
});
