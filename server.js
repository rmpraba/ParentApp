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


app.post('/query-post1',  urlencodedParser,function (req, res)
{
  var dv={"school_id":req.query.school_id,"query_id":req.query.query_id,"query_reply":"","student_id":req.query.student_id,"parent_name":req.query.name,"parent_email":req.query.email,"category":req.query.category,"query_message":req.query.complaint,"query_status":req.query.status,"updated_date":req.query.date,"time":req.query.time};

  //console.log(school_id);
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

  console.log(school_id);
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

  console.log(school_id);
  console.log(seqno);
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
  //console.log(school_id+   +status);
       connection.query('select * from query where ? and ?',[school_id,status],
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


app.post('/adminlogin',  urlencodedParser,function (req, res)
{
  var user={"id":req.query.user};
  var pass={"password":req.query.pass};
       connection.query('select * from employee where ?',[user,pass],
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



app.post('/querypost',  urlencodedParser,function (req, res)
{
    var id={"query_id":req.query.id};
    var msg={"query_reply":req.query.msg,"query_status":"closed","reply_date":req.query.replydate,"reply_time":req.query.replytime};
    var school_id={"school_id":req.query.schol};

  //console.log(school_id);
       connection.query('update query set ? WHERE ? and ?',[msg,id,school_id],
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
  var status={"query_status":req.query.status};
  //console.log(school_id+   +stud);
       connection.query('select * from query where ? and ? and ?',[school_id,stud,status],
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