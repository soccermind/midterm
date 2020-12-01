const md5 = require('md5')
const nodemailer = require('nodemailer');

// Create values
const createValues = (req) => {
  const isAnonymous = req.body.anonymousCheck ? true : false;
  const values = {
    inputNewQuestion: req.body.inputNewQuestion,
    inputEmail: req.body.inputEmail,
    anonymousCheck: isAnonymous,
    inputOpt1: req.body.inputOpt1,
    inputOpt1Descript: req.body.inputOpt1Descript,
    inputOpt2: req.body.inputOpt2,
    inputOpt2Descript: req.body.inputOpt2Descript,
    inputOpt3: req.body.inputOpt3,
    inputOpt3Descript: req.body.inputOpt3Descript,
    inputOpt4: req.body.inputOpt4,
    inputOpt4Descript: req.body.inputOpt4Descript,
    inputOpt5: req.body.inputOpt5,
    inputOpt5Descript: req.body.inputOpt5Descript
  };
  return values;
}

//Create random url
const urlCreator = () => {
  const string = 'where should we go for lunch?'
  const starter = Math.random().toString(36).substring(7);
  return md5(starter+string)
}

//Send email to creator
const sendlinks = (senderEmail, password, recipient, pollQuestion, adminLink, userLink) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: senderEmail,
      pass: password
    }
  });

  const mail = {
    from: 'superfunpolls@gmail.com',
    to: recipient,
    subject: 'Hey, manage your poll here',
    text: `Poll question: ${pollQuestion}\nAsk your friends to vote: http://localhost:8080/${userLink}\nCheck the poll result: http://localhost:8080/${adminLink}`
  };

  transporter.sendMail(mail, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info)
    }
  });
}

//Write queries to database
const createQueries = (res, db, values, adminLink, userLink) => {
  let newPollId;

  return db.query(`
      INSERT INTO polls(question, email, admin_link, user_link, anonymous)
      VALUES($1, $2, $3, $4, $5)
      RETURNING *;
      `, [values.inputNewQuestion, values.inputEmail, adminLink, userLink, values.anonymousCheck])
      .then(result => {
        newPollId = result.rows[0].id;
        if (!values.inputOpt1) {
          res.redirect('/new');
          return;
        };
        db.query(`
        INSERT INTO options(poll_id, title, description)
        VALUES($1, $2, $3);
        `, [newPollId, values.inputOpt1, values.inputOpt1Descript]);

        if (!values.inputOpt2) {
          res.redirect('/new');
          return;
        }

        db.query(`
        INSERT INTO options(poll_id, title, description)
        VALUES($1, $2, $3);
        `, [newPollId, values.inputOpt2, values.inputOpt2Descript]);

        if (!values.inputOpt3) {
          res.redirect('/');
          return;
        }

        db.query(`
        INSERT INTO options(poll_id, title, description)
        VALUES($1, $2, $3);
        `, [newPollId, values.inputOpt3, values.inputOpt3Descript]);

        if (!values.inputOpt4) {
          res.redirect('/');
          return;
        }

        db.query(`
        INSERT INTO options(poll_id, title, description)
        VALUES($1, $2, $3);
        `, [newPollId, values.inputOpt4, values.inputOpt4Descript]);

        if (!values.inputOpt5) {
          res.redirect('/');
          return;
        }

        db.query(`
        INSERT INTO options(poll_id, title, description)
        VALUES($1, $2, $3);
        `, [newPollId, values.inputOpt5, values.inputOpt5Descript]);

        res.redirect('/')
      })
      .catch(e => {
        console.error(e);
        res.send(e)
      });
};

module.exports = { urlCreator, sendlinks, createQueries, createValues };