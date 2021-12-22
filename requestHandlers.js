var querystring = require('querystring');
var url = require('url');

function genericResponse(res, successMsg) {
  return function (success, qryErr) {
    if (success) {
      res.send(successMsg + ': ' + success);
    }
    else {
      res.status(500)
        .send('Something broke on the server side');
      console.log(qryErr);
    }
  };
}

function login(dbLogin) {
	return function doLogin(req, res) {
		var _user = req.query.username;
		var _pass = req.query.password;

		console.log('Login request received');

		dbLogin(_user, _pass, function (err, rslt) {
			if(!err) {
				req.session.logged = true;
				req.session.username = _user;
				res.send('Successfully logged in');
			}
			else {
				var response = 'Error: ' + err.errMsg;
				console.log(response);
				res.status(401)
					 .send(response);
			}
		});
	}
}

function getUserInfo(getUserInfoFromDB) {
}

function generateSalesDoc(generateDoc) {
  return function (req, res, next) {
    var msg = 'Generated document number is';
    generateDoc(genericResponse(res, msg));

	  console.log('logged: ' + req.session.logged);
  };
}

function deleteSalesDoc(deleteDoc) {
  return function (req, res, next) {
    var docNo = parseInt(req.query.docNo, 10);
    if (isNaN(docNo)) {
      res.status(400)
         .send('Wrong document number format in request');
      return;
    }

    var msg = 'Successfully deleted document';
    deleteDoc(docNo, genericResponse(res, msg));
  };
}

function insertItem(insertItemDBHandler) {
  return function (req, res, next) {
    var docNo = parseInt(req.query.docNo, 10);
    if (isNaN(docNo)) {
      res.status(400)
        .send('Wrong document number format in request');
      return;
    }

    var unitPrice = parseInt(req.query.unitPrice, 10);
    if (isNaN(unitPrice)) {
      res.status(400)
         .send('Wrong unit price format in request');

      return;
    }

    var msg = 'Successfully inserted item';
    insertItemDBHandler(docNo, unitPrice, genericResponse(res, msg));
  }
}

function updateDocStatus(dbhandler) {
  return function (req, res, next) {
    var docNo = parseInt(req.query.docNo, 10);
    if (isNaN(docNo)) {
      res.status(400)
        .send('Wrong document number format in request');
      return;
    }

    var msg = 'Successfully updated document status';
    dbhandler(docNo, genericResponse(res, msg));
  }
}

exports.generateDoc = generateSalesDoc;
exports.deleteDoc = deleteSalesDoc;
exports.insertItem = insertItem;
exports.updateDoc = updateDocStatus;
exports.login = login;