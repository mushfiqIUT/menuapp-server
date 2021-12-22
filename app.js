
var requestHandlers = require('./requestHandlers');
var database = require('./database.js');
var express = require('express');
var http = require('http');
var app = express();

// configure express
app.configure(function () {
  app.set('port', process.env.PORT || 3000);
	app.use(express.bodyParser());
  app.use(express.cookieParser('impulse'));
  app.use(express.session());
});

app.get('/', function (req, res) {
	if(req.session.logged) {
		res.send('Welcome back ' + req.session.username + '!');
	}
	else {
		req.session.logged = true;
		res.send('Welcome to my site!');
	}
});
app.get('/login', requestHandlers.login(database.login));
app.get('/generate', requestHandlers.generateDoc(database.generateDoc));
app.get('/delete', requestHandlers.deleteDoc(database.deleteDoc));
app.get('/insert', requestHandlers.insertItem(database.insertItem));
app.get('/update', requestHandlers.updateDoc(database.updateDocStatus));
app.get('/logout', function (req, res) {
	req.session.destroy();
	console.log('Session destroyed');
	res.send();
});

// Error Handler
app.use(function (err, req, res, next) {
	console.log('Error occured: ' + sys.inspect(err));
	res.status(500).send('something blew up. authentication missmatch.');
});

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express serverssss listening on port ' + app.get('port'));
  //console.log('DB Name: ' + config.DBNAME);
});