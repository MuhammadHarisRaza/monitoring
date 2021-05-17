var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser")
var expressValidator = require("express-validator")
var mongoose = require('mongoose')
var cookieParser = require('cookie-parser')
const fs = require('fs')
var cors = require('cors')
var dotenv = require('dotenv')

dotenv.config()

const authRouter = require("./routes/auth")
const adminRouter = require("./routes/admin")
const employeeRouter = require("./routes/employee")
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.get('/',(req,res)=>{
  fs.readFile('docs/apiDocs.json', (err, data)=>{
    if(err){
      res.status(400).json({
        error:err
      })
    }
    const docs = JSON.parse(data)
    res.json(docs)
  })
})

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(cookieParser())
app.use(cors())
app.use(expressValidator())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/',authRouter)
app.use('/',adminRouter)
app.use('/',employeeRouter)

app.use(function(err, req, res, next){
  if(err.name === "UnauthorizedError"){
    res.status(401).json({
      error:"Unauthorized!!"
    })
  }
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//db

mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true, useUnifiedTopology:true, useFindAndModify: false, useCreateIndex:true}).then(()=>console.log("DB connected"))

mongoose.connection.on("error",err =>{
  console.log(`DB connection error : ${err.message}`)
})


const port = process.env.PORT || 8080;
app.listen(port, ()=>{
  console.log(`A node js API is listening on port : ${port}`)
})

module.exports = app;
