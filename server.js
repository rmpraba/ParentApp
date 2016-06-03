var express    = require("express");
 var mysql      = require('mysql');
 var email   = require("emailjs/email");
 var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : 'admin',
   database : 'helpdesk'
 });
var bodyParser = require('body-parser');
 var app = express();

app.use(express.static('app'));
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/', function (req, res) {
   res.sendFile("app/index.html" );
})

app.post('/mailsend', urlencodedParser,function (req, res) {
var receiptno=req.query.receiptno;
var today=req.query.today;
var studname=req.query.studname;
var classname=req.query.classname;
var parentname=req.query.parentname;
var session=req.query.session;
var installtype=req.query.installtype;
var installfee=req.query.installfee;
var parentemail=req.query.parentemail;
  var mode=req.query.paymode;
  var words=req.query.word;
  var receipttitle=req.query.title;
  var chequedate=req.query.chequedate;
  var chequeno=req.query.chequeno;
  var bank=req.query.bank;
//console.log(parentemail);
var server  = email.server.connect({
   user:    "samsidhgroup@yahoo.com",
   password:"mlzsinstitutions",
   host:    "smtp.mail.yahoo.com",
   ssl:     true

});
// send the message and get a callback with an error or details of the message that was sent
server.send({
   text:    "FEE RECEIPT/ACKNOWLEDGEMENT",
   from:    "samsidhgroup@yahoo.com",
   to:      parentemail,
   subject: "FEE RECEIPT/ACKNOWLEDGEMENT",
    attachment:

      [
        {data:"<html><body class='receipt'><table><caption style='text-align: center;'><strong>FEE "+receipttitle+"</strong></caption></caption>" +
        "<tr><td class='left1' style='width: 230px;'><strong>Receipt No : </strong>"+receiptno+"</td><td style='width: 42px;' class='center1'></td><td style='width: 170px;' class='right1'><strong>Receipt Date : </strong>"+today+"</td></tr>" +
        "<tr><td class='left1'><strong>Student Name : </strong>"+studname+"</td><td class='center1'></td><td class='right1'><strong>Class : </strong>"+classname+"</td></tr>" +
        "<tr><td class='left1'><strong>Parent Name : </strong>"+parentname+"</td><td class='center1'></td><td class='right1'><strong>Session : </strong>"+session+"</td></tr></table>" +
        "<table><tr><td style='width: 75px; text-align: center;' class='left2'><strong>SL.No</strong></td><td style='width: 276px; text-align: center;' class='center2'><strong>Particulars</strong></td><td style='text-align: right;' class='right2'><strong>Amount</strong></td></tr>" +
        "<tr><td class='left2' style='text-align: center;'>1.</td><td class='center2' style='text-align: center;'><strong>Transportfee : </strong>"+installtype+"</td><td class='right2'style='text-align: center;'>"+installfee+"</td></tr></table>" +
        "<table><tr><td class='left3' style='width: 323px;'><strong>In Words : </strong>"+words+"</td><td class='right3'><strong>Total :</strong>"+installfee+"</td></tr>" +
        "<tr><td class='left3'><strong>Mode of Payments : </strong>"+mode+"</td><td class='right3'></td></tr></table>" +
        "<table><tr><td class='left3'><strong>Chequeno : </strong>"+chequeno+"</td><td class='right3'><strong>Chequedate :</strong>"+chequedate+"</td><td class='rytls'><strong>Bank name : </strong>"+bank+"</td><td class='right3'></td></tr></table>" +
        "<div class='terms'><div style='text-align: center;' class='head'><strong><U>TERMS AND CONDITIONS</U></strong></div>" +
        "<div class='body'><p>1.  In Case the cheque is not honoured by the bank, service charge of Rs.250/- <br>will be levied and the amount has to be paid by Cash / DD.</p>" +
        "<p>2.  Fees once paid will not be refunded at any given circumstances.</p>" +
        "<p>3.  Cheque Subject to realization.</p>" +
        "<p>4.  Please retain this receipt for future correspondence.</p></div>" +
        "<div class='foot'><strong>THIS IS SYSTEM GENERATED RECEIPT, NO SIGNATURE IS REQUIRED.</strong></div></div></body></html>", alternative:true}

   ]
}, function(err, message) { console.log(err || message); });
res.status(200).json('mail sent');

});

app.post('/mobile',  urlencodedParser,function (req, res){
  var mobile={"mobile":req.query.mobile};
  connection.query('SELECT school_id,student_id, (select student_name from student_details where id = student_id) as student_name from parent where ? ',[mobile],
  function(err, rows){
    if(!err){
      if(rows.length>0){
        res.status(200).json({'returnval': rows});
      } else {
        res.status(200).json({'returnval': 'invalid'});
      }
    }
  });
});

function setvalue(){
	console.log("calling setvalue.....");
}
var server = app.listen(8082, function () {
var host = server.address().address
var port = server.address().port
console.log("Example app listening at http://%s:%s", host, port)
});
