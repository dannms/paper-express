var express = require('express');
var bodyParser = require('body-parser')
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var nodemailer = require('nodemailer')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/node_modules/jquery'));
app.use(express.static(__dirname + '/node_modules/@popperjs/core/dist'));
app.use(express.static(__dirname + '/node_modules/@fortawesome/fontawesome-free'));
app.use(express.static(__dirname + '/node_modules/boxicons'));
app.use(express.static(__dirname + '/node_modules/aos/dist'));

app.use('/', indexRouter);
app.post('/send', (req, res) => {
  const output = `
  <p>Contato enviado pelo formulário</p>
  <h3><strong>Detalhes da mensagem</strong>
  <ul>
    <li>Nome: ${req.body.name}</li>
    <li>E-mail: ${req.body.email}</li>
    <li>Assunto: ${req.body.subject}</li>
  </ul>
    <h3>Mensagem: </h3>
    <p>${req.body.message}</p>
  `;

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.umbler.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'contato@studiopaper.com.br', // generated ethereal user
      pass: '@Contato407131', // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  let mailOptions = {
    from: '"Formulário de Contato" <contato@studiopaper.com.br>',
    to: 'contato@studiopaper.com.br',
    subject: 'Pedido de Contato',
    text: 'Test',
    html: output
  }

  transporter.sendMail(mailOptions, (err, info) => {
    if(err){
      return console.log(err);
    }

    console.log('Mensagem enviada: %s', info.messageId);
    res.render('index', { alerta: 'Mensagem enviada com sucesso!'})
  })

})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
