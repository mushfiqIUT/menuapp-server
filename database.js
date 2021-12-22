var pg = require('pg');
var util = require('util');

//pg.defaults.user = 'ERP';
pg.defaults.database = 'MA_DEV_01';
//pg.defaults.password = 'ERP123';
pg.defaults.host = 'imp-dv03';
pg.defaults.port = 5432;
pg.defaults.poolSize = 1;   // effectively this disables pooling at this level

function returnGenericDBResponse (returnResponse) {
  return function (qryErr, rslt) {
    if (qryErr) {
      returnResponse(false, util.inspect(qryErr));
    }
    else {
      returnResponse(true);
    }
  };
}

function genMSDoc(returnDocNo) {
  /*var processResult = function (qryErr, rslt) {
    if (qryErr) {
      returnDocNo(false, util.inspect(qryErr));
    }
    else {
      returnDocNo(rslt.rows[0].document_no);
    }
  }
  
  pg.connect(function (conErr, conClient) {
    if (!conErr) {
      var query = 'SELECT document.generate($1, $2, $3) AS document_no';
      conClient.query(query, [1, 'MS', 0], processResult);
    }
    else {
      console.log('Error occured: ' + util.inspect(conErr));
    }
  });
  
  pg.on('error', function (err) {
    console.log('A devastating error occured');
  });*/
	returnDocNo(10050);
}

function deleteMSDoc(docNo, retResult) {
  pg.connect(function (conErr, conClient) {
    var query = 'SELECT document.delete_single_document($1, $2, $3)';
    conClient.query(query, [1, 'MS', docNo], returnGenericDBResponse(retResult));
  });
}

function insertItem(docNo, unitPrice, retResult) {
  pg.connect(function (conErr, conClient) {
    var query = 'INSERT INTO	use_doc_material ';
    query += '(org_id, document_code, document_no, pt_id, ms_id, ';
    query += 'qty_out_sold, unit_price) '
    query += "VALUES	(1, 'MS', $1, 1, 1, 1, $2)";

    conClient.query(query, [docNo, unitPrice], returnGenericDBResponse(retResult));
  });
}

function updateDocStatus(docNo, retResult) {
  pg.connect(function (conErr, conClient) {
    var query = 'UPDATE	use_doc ';
    query += 'SET	locked = 0 ';
    query += 'WHERE	document_no = $1';

    conClient.query(query, [docNo], returnGenericDBResponse(retResult));
  });
}

function login(_user, _pass, retRslt) {
  var config = {user: _user, password: _pass};
  pg.connect(config, function (conErr, conClient) {
    if (conErr) {
	    var err = {errMsg: conErr.message};
      retRslt(err, null);
    }
    else {
	    pg.defaults.user = _user;
	    pg.defaults.password = _pass;
	    retRslt(null, {org_id: 1, user_id: 1});
    }
  });
}

function getUserInfo() {
	var userInfo = {};
	pg.connect(function (conErr, conClient) {
		if(!conErr) {
			var query = "SELECT org_id, user_id FROM v_current_user";
			conClient.query(query, [], function (qryErr, rslt) {
				if(!qryErr) {
					userInfo.org_id = rslt.rows[0].org_id;
					userInfo.user_id = rslt.rows[0].user_id;
				}
			});
		}
	});
}

exports.generateDoc = genMSDoc;
exports.deleteDoc = deleteMSDoc;
exports.insertItem = insertItem;
exports.updateDocStatus = updateDocStatus;
exports.login = login;