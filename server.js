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

app.post('/regemailsend', urlencodedParser,function (req, res) {
  var username=req.query.reguser;
  var mobilenumber=req.query.regmobnew;
  var relation=req.query.regrel;
  var verificationcode=req.query.regverify;

var server  = email.server.connect({
   user:    "mlzssamsidh@yahoo.com",
   password:"bgl12345",
   host:    "smtp.mail.yahoo.com",
   ssl:     true

});
// send the message and get a callback with an error or details of the message that was sent
server.send({
   text:    "FEE RECEIPT/ACKNOWLEDGEMENT",
   from:    "mlzssamsidh@yahoo.com",
   to:      "ntamilselvimca@gmail.com",
   subject: "FEE RECEIPT/ACKNOWLEDGEMENT",
    attachment:

      [
        {data:"<html><body style='width:60%; margin:0 20%; font-family: sans-serif;'><table style='border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;'><tr><table align='center' border='0' cellpadding='0' cellspacing='0' style='max-width:100%; min-width:100%;' width='100%' class='mcnTextContentContainer'><tbody><tr><td valign='top' class='mcnTextContent' style='padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;'><a href='http://samsidhmlzs.com/'><img style='width:100%;' src='logo.jpg'></a></td></tr></tbody></table></tr><tr><table align='left' border='0' cellpadding='0' cellspacing='0' style='max-width:100%; min-width:100%; text-align:center;' width='100%' class='mcnTextContentContainer'><tbody><tr><td valign='top' class='mcnTextContent' style='padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;'><h1>Another User is Signed Up for tracking your kid.</h1><div style='margin:20px 120px 20px 75px;width:100%;'><div style='display:flex;'><p>Username</p><p> :"+username+"</p></div><div style='display:flex;'><p>Mobile Number</p><p>: "+mobilenumber+"</p></div><div style='display:flex;'><p>Relation</p><p>: "+relation+"</p></div><div style='display:flex;'><p>Verification Code:</p><p>"+verificationcode+"</p></div></div><p style='text-align:center;'>Please share this verification key to the above person, if you want them to track your kid.</p><p style='text-align:center;'>Otherwise ignore this mail.</p></td></tr></tbody></table></tr></table></body></html> Please <a href=\"http://localhost:8082/index.html\">http://localhost:8082/index.html</a>", alternative:true}

   ]
}, function(err, message) { console.log(err || message); });
res.status(200).json('mail sent');

});

app.post('/mobile',  urlencodedParser,function (req, res){
  var mobile={"mobile":req.query.mobile};
  connection.query('SELECT school_id,(Select name from md_school where id = school_id) as school_name ,student_id, (select student_name from student_details where id = student_id) as student_name from parent where ? ',[mobile],
  function(err, rows){
    if(!err){
      if(rows.length>0){
        res.status(200).json({'returnval': rows});
      } else {
        res.status(200).json({'returnval': 'no'});
      }
    } else{
      console.log(err)
    }
  });
});


app.post('/loginalter',  urlencodedParser,function (req, res){
  var mobile={"new_mobile":req.query.mobile};
  connection.query('SELECT school_id, (SELECT name FROM md_school WHERE id = school_id) AS school_name, student_id, (SELECT student_name FROM student_details WHERE id = student_id) AS student_name FROM parent WHERE mobile = (SELECT registered_no FROM alternate_no WHERE ? and activate_flag=1) ',[mobile],
  function(err, rows){
    if(!err){
      if(rows.length>0){
        res.status(200).json({'returnval': rows});
        //console.log(rows);
      } else {
        res.status(200).json({'returnval': 'no'});
      }
    }
    else{
      console.log(err);
    }
  });
});



app.post('/query-post1',  urlencodedParser,function (req, res)
{
  var dv={"school_id":req.query.school_id,"query_id":req.query.query_id,"query_reply":"","student_id":req.query.student_id,"parent_name":req.query.name,"parent_email":req.query.email,"category":req.query.category,"query_message":req.query.complaint,"query_status":req.query.status,"updated_date":req.query.date,"time":req.query.time,"flag":req.query.flag,"subject":req.query.subject,"mobile":req.query.mob,"msg_status":req.query.msq_status,"priority":req.query.priority};

       connection.query('insert into query set ?',[dv],
        function(err, rows)
        {
    if(!err)
    {
      res.status(200).json({'returnval': 'success'});
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'invalid'});
    }
  
});
  });

app.post('/query-sequence',  urlencodedParser,function (req, res)
{
  var school_id={"school_id":req.query.school_id};

 // console.log(school_id);
       connection.query('select sequenceno from sequence where ?',[school_id],
        function(err, rows)
        {
    if(!err)
    {
    
      res.status(200).json({'returnval': rows});
    }
    else
    {

      res.status(200).json({'returnval': 'invalid'});
    }
  
});
  });
app.post('/upquery-sequence',  urlencodedParser,function (req, res)
{
  var school_id={"school_id":req.query.school_id};
  var seqno={"sequenceno":req.query.sequence};

  //console.log(school_id);
 // console.log(seqno);
       connection.query('update sequence set ? where ?',[seqno,school_id],
        function(err, rows)
        {
    if(!err)
    {
    
      res.status(200).json({'returnval': rows});
    }
    else
    {

      res.status(200).json({'returnval': 'invalid'});
    }
  
});
  });


app.post('/getmsg',  urlencodedParser,function (req, res)
{
  var school_id={"school_id":req.query.schol};
    var status={"query_status":"open"};
  var userid={"category":req.query.userid};

 //console.log(school_id+'  '+status+'  '+userid);
       connection.query('select *,(select student_name from student_details where id = student_id and school_id = school_id) as name from query where ? and ? and ?',[school_id,status,userid],

        function(err, rows)
        {
    if(!err)
    {
    if(rows.length>0){
        res.status(200).json({'returnval': rows});
        //console.log(rows);
        } else {
        console.log(err);
        res.status(200).json({'returnval': 'invalid'});
      }
    }
    else
    {

      res.status(200).json({'returnval': 'invalid'});
    }
  
});
  });


app.post('/getdetails',  urlencodedParser,function (req, res)
{
  var school_id={"school_id":req.query.schol};
  var stud={"student_id":req.query.id};
  //console.log(school_id+   +status);
       connection.query('select * from parent where ? and ?',[school_id,stud],
        function(err, rows)
        {
    if(!err)
    {
    if(rows.length>0){
        res.status(200).json({'returnval': rows});
        //console.log(rows);
        } else {
        console.log(err);
        res.status(200).json({'returnval': 'invalid'});
      }
    }
    else
    {

      res.status(200).json({'returnval': 'invalid'});
    }
  
});
  });

app.post('/parentinbox',  urlencodedParser,function (req, res)
{
  var school_id={"school_id":req.query.schol};
  var stud={"student_id":req.query.id};
  var user={"user":"parent"};
 // console.log(school_id+''+stud+''+status);
       connection.query('select *,(select student_name from student_details where id = student_id and school_id = school_id) as name from query where ? and ? and ? and query_reply!=""',[school_id,stud,user],
        function(err, rows)
        {
    if(!err)
    {
    if(rows.length>0){
        res.status(200).json({'returnval': rows});
        //console.log(rows);
        } else {
        console.log(err);
        res.status(200).json({'returnval': 'invalid'});
      }
    }
    else
    {

      res.status(200).json({'returnval': 'invalid'});
    }
  
});
  });

app.post('/studetails',  urlencodedParser,function (req, res)
{
  var school_id={"school_id":req.query.schol};
  var stud_id = {"id":req.query.studid};
  
  connection.query('select student_name,(select class from class_details where id=class_id and school_id=school_id)as std, (select section from class_details where id=class_id and school_id=school_id)as sec from student_details where ? and ?',[stud_id,school_id],
  function(err, rows)
  {
    if(!err)
    {
    if(rows.length>0){
        res.status(200).json({'returnval': rows});
        //console.log(rows);
        } else {
        console.log(err);
        res.status(200).json({'returnval': 'invalid'});
      }
    }
    else
    {

      res.status(200).json({'returnval': 'invalid'});
    }
  
});
  });

app.post('/upmsgstat',  urlencodedParser,function (req, res)
{
    var id={"query_id":req.query.sid};
    var date={"updated_date":req.query.date};
    var time={"time":req.query.time};
    var status={"msg_status":req.query.msg_status};
    var school_id={"school_id":req.query.schol};
       connection.query('update query set ? WHERE ? and ? and ? and ?',[status,id,school_id,date,time],
        function(err, rows)
        {
    if(!err)
    {
          res.status(200).json({'returnval': 'success'});
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'invalid'});
    }
  
});
  });


app.post('/unreadmsg',  urlencodedParser,function (req, res)
{
  var school_id={"school_id":req.query.schol};
  var status = {"admin_read":req.query.status};
  var id={"student_id":req.query.sid};
  
  connection.query('SELECT COUNT( * ) as total FROM  `query` WHERE ? AND ? AND ?',[status,school_id,id],
  function(err, rows)
  {
    if(!err)
    {
    if(rows.length>0){
        res.status(200).json({'returnval': rows});
        //console.log(rows);
        } else {
        console.log(err);
        res.status(200).json({'returnval': 'invalid'});
      }
    }
    else
    {

      res.status(200).json({'returnval': 'invalid'});
    }
  
});
  });

app.post('/unopenmsg',  urlencodedParser,function (req, res)
{
  var school_id={"school_id":req.query.schol};
  var status = {"msg_status":req.query.status};
  var userid={"category":req.query.userid};
  
  connection.query('SELECT COUNT( * ) as total FROM  `query` WHERE ? AND ? and ?',[status,school_id,userid],
  function(err, rows)
  {
    if(!err)
    {
    if(rows.length>0){
        res.status(200).json({'returnval': rows});
        //console.log(rows);
        } else {
        console.log(err);
        res.status(200).json({'returnval': 'invalid'});
      }
    }
    else
    {

      res.status(200).json({'returnval': 'invalid'});
    }
  
});
  });


app.post('/upmsgstatpr',  urlencodedParser,function (req, res)
{
    var id={"query_id":req.query.sid};
    var date={"reply_date":req.query.date};
    var time={"reply_time":req.query.time};
    var status={"admin_read":req.query.msgstatus};
    var school_id={"school_id":req.query.schol};

  //console.log('update  '+);
       connection.query('update query set ? WHERE ? and ? and ? and ?',[status,id,school_id,date,time],
        function(err, rows)
        {
    if(!err)
    {
          res.status(200).json({'returnval': 'success'});
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'invalid'});
    }
  
});
  });



app.post('/verifymob',  urlencodedParser,function (req, res)
{
  var flag={"mobile":req.query.exmob};
  connection.query('select * from parent where ?',[flag],
  function(err, rows)
  {
    if(!err)
    {
    if(rows.length>0){
        res.status(200).json({'returnval': rows});
        //console.log(rows);
        } else {
        console.log(err);
        res.status(200).json({'returnval': '0'});
        //console.log('empty');
      }
    }
    else
    {
      res.status(200).json({'returnval': 'invalid'});
    }
});
  });


app.post('/regmob',  urlencodedParser,function (req, res)
{
  var dv={"registered_no":req.query.regmob,"user_name":req.query.username,"relationship":req.query.relation,"new_mobile":req.query.newmob,"email":req.query.email,"verify_key":req.query.verifykey,"activate_flag":req.query.activate};
       connection.query('insert into alternate_no set ?',[dv],
        function(err, rows)
        {
    if(!err)
    {
      res.status(200).json({'returnval': 'success'});
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'invalid'});
    }
  
});
  });



app.post('/activate',  urlencodedParser,function (req, res)
{
    var mob={"new_mobile":req.query.reg};
    var key={"verify_key":req.query.key};
    var flag={"activate_flag":req.query.acti};
       connection.query('update alternate_no set ? WHERE ? and ?',[flag,key,mob],
        function(err, rows)
        {
    if(!err)
    {
      res.status(200).json({'returnval': 'success'});
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'invalid'});
    }
});
  });

app.post('/sentmsg',  urlencodedParser,function (req, res)
{
  
  connection.query('select * from query where school_id="'+req.query.schol+'" and student_id="'+req.query.studid+'" and query_status="open"',
  function(err, rows)
  {
    if(!err)
    {
    if(rows.length>0){
        res.status(200).json({'returnval': rows});
        //console.log(rows);
        } else {
        console.log(err);
        res.status(200).json({'returnval': '0'});
        //console.log('empty');
      }
    }
    else
    {
      res.status(200).json({'returnval': 'invalid'});
    }
});
  });
app.post('/checkstatus',  urlencodedParser,function (req, res)
{
    var id={"student_id":req.query.stid};
    var school={"school_id":req.query.schol};
    var status={"query_status":'open'};
    connection.query('SELECT count(*) as total from query where ? and ? and ?',[id,school,status],
    function(err, rows)
    {
    if(!err){
    if(rows.length>0){
        res.status(200).json({'returnval': rows});
        } else {
        console.log(err);
        res.status(200).json({'returnval': 0});
        //console.log('empty');
      }
    }
    else
    {
      res.status(200).json({'returnval': 'invalid'});
    }
});
  });

app.post('/feedcheck',  urlencodedParser,function (req, res)
{
    var id={"student_id":req.query.studid};
    var school={"school_id":req.query.schol};
    var status={"query_status":req.query.status};
    var feedback={"feedback_rating":req.query.feedback};
    connection.query('SELECT distinct query_id from query where ? and ? and ? and ?',[id,school,status,feedback],
    function(err, rows)
    {
    if(!err){
    if(rows.length>0){
        res.status(200).json({'returnval': rows});
        } else {
        console.log(err);
        res.status(200).json({'returnval': 0});
        //console.log('empty');
      }
    }
    else
    {
      res.status(200).json({'returnval': 'invalid'});
    }
});
  });


app.post('/rating',  urlencodedParser,function (req, res)
{
  var queryid={"query_id":req.query.queryid};
  var rating = {"feedback_rating":req.query.rating};
  var school={"school_id":req.query.schol};
       connection.query('UPDATE query SET ? where ? and ?',[rating,queryid,school],
        function(err, rows)
        {
    if(!err)
    {
      res.status(200).json({'returnval': 'success'});
    }
    else
    {
      console.log(err);
      res.status(200).json({'returnval': 'invalid'});
    }
  
});
  });


app.post('/studinfo',  urlencodedParser,function (req, res)
{
    connection.query('SELECT d.student_name, (select class from transport.class_details WHERE id=d.class_id) as class,(select section from transport.class_details WHERE id=d.class_id) as section, d.dob, e.mobile, (SELECT route_name from transport.route where id=f.pickup_route_id) as pickroute,(SELECT route_name from transport.route where id=f.drop_route_id) as droproute, (SELECT point_name from transport.point where id=f.pickup_point) as pickpoint, (SELECT point_name from transport.point where id=f.drop_point) as droppoint FROM helpdesk.student_details d JOIN transport.parent e JOIN transport.student_point f WHERE e.student_id = f.student_id AND d.id = "'+req.query.id+'" and d.school_id="'+req.query.schol+'"',
    function(err, rows)
    {
    if(!err){
    if(rows.length>0){
        res.status(200).json({'returnval': rows});
        console.log(rows);
        } else {
        console.log(err);
        res.status(200).json({'returnval': 0});
        //console.log('empty');
      }
    }
    else
    {
      res.status(200).json({'returnval': 'invalid'});
    }
});
  });



function setvalue(){
  console.log("calling setvalue.....");
}
var server = app.listen(8086, function () {
var host = server.address().address
var port = server.address().port
console.log("Example app listening at http://%s:%s", host, port)
});