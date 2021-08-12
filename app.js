var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
app = express();
app.engine('html', require('ejs').renderFile);
app.set("view engine", "html");
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/cscDatabase",{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });


var userSchema = new mongoose.Schema({
    cons_no: Number,
    acc_no : Number,
    name: String,
    mobile: Number,
    address: String
});

var complaintSchema = new mongoose.Schema({
    acc_no: Number,
    comp_no: String,
    comp_type: String,
    complaint: String,
    record_status:Number,
});

var User = mongoose.model("user", userSchema);

var Complaint = mongoose.model("complaint",complaintSchema);

//home page
app.get("/", function(req, res) {
    res.sendFile('views/index.html', {
        root: path.join(__dirname, './')
    })
});

//new user registration
app.get("/newUserRegistration",function(req,res){
    res.sendFile('views/newUser.html', {
        root: path.join(__dirname, './')
    })
});

//new complaint registration
app.get("/newComplaintRegistration",function(req,res){
    res.sendFile('views/newComplaint.html', {
        root: path.join(__dirname, './')
    })
});

//get delete complaint
app.get('/deleteComplaint',function(req,res){
    res.sendFile('views/deleteComplaint.html', {
        root: path.join(__dirname, './')
    })
});

// get update complaint
app.get('/updateComplaint',function(req,res){
    res.sendFile('views/updateComplaint.html', {
        root: path.join(__dirname, './')
    })
});

//CREATE new user
app.post('/newUser',function(req,res){
    var user = {
        cons_no: req.body.cons_no,
        acc_no: req.body.acc_no,
        name: req.body.name,
        mobile: req.body.mobile,
        address: req.body.address
    }
    User.create(user, function(err, data) {
        try {
            console.log(user);
            res.redirect("/");
        } 
        catch (err){ 
            console.log(err); 
        }
    });
});

//CREATE new complaint
app.post('/newComplaint',function(req,res){
    const d=new Date();
    var day=d.getDate()<10?"0"+d.getDate():d.getDate();
    var month=d.getMonth()<=8?"0"+(d.getMonth()+1):d.getMonth()+1;
    var year=d.getFullYear();
    var acc=req.body.acc_no;
    var complaint={
        acc_no:req.body.acc_no,
        complaint: req.body.complaint,
        comp_type: req.body.comp_type,
        record_status:1,
        comp_no:acc+day+month+year
    };
    Complaint.create(complaint,function(err,data){
        try{
            console.log(complaint);
            res.redirect("/");
        }
        catch(err){
            console.log(err);
        }
    });
});

//RETRIEVE all users
app.get('/showAllUsers',function(req,res){
    User.find({},function(err,data){
        try{
            res.render(__dirname + "/views/showUsers.html", { data:data});
        }
        catch(err){
            console.log(err);
        }
    });
});

//RETRIEVE all complaints
app.get('/showAllComplaints',function(req,res){
    Complaint.find({},function(err,data){
        try{
            res.render(__dirname + "/views/showComplaints.html", { data:data});
        }
        catch(err){
            console.log(err);
        }
    });
});

//UPDATE complaint
app.post('/updateComplaint',function(req,res){
    Complaint.findOne({acc_no:req.body.acc_no,record_status:1},function(err,data){
        try{
            console.log(req.body.acc_no);
            console.log(data);
            data.comp_type=req.body.comp_type;
            data.complaint=req.body.complaint;
            
            data.save();
            res.redirect('/');
        }
        catch(err){
            console.log(err);
        }
    })
});

//DELETE complaint
app.post('/deleteComplaint',function(req,res){
    Complaint.findOne({acc_no:req.body.acc_no,record_status:1},function(err,data){
        try{

            console.log(req.body.acc_no);
            data.record_status=0;
            data.save();
            res.redirect("/");
        }
        catch(err){
            console.log(err);
        }
    })
});

//get all user account nos(for new complaint)
app.get('/getUserAccNo',function(req,res){
    var user_acc_no=[];
    User.find({},function(err,data){
        try{
            data.forEach(element => {
                user_acc_no.push(element.acc_no);
            });
            res.send(user_acc_no);
        }
        catch(err){
            console.log(err);
        }
    });
});

//get all complaint account nos(for new complaint)
app.get('/getCompAccNo',function(req,res){
    Complaint.find({},function(err,data){
        try{
            var comp_acc_no=[];
            data.forEach(element=>{
                if(element.record_status==1)
                    comp_acc_no.push(element.acc_no);
            });
            res.send(comp_acc_no);
        }
        catch(err){
            console.log(err);
        }
    });
});

//get all complaints
app.get('/getComplaints',function(req,res){
    Complaint.find({record_status:1},function(err,data){
        try{
            res.send(data);
        }
        catch(err){
            console.log(err);
        }
    })
});

//get all account nos and consumer nos
app.get('/getAccNoConsNo',function(req,res){
    User.find({},function(err,data){
        try{
            var acc_nos=[];
            var cons_nos=[];
            data.forEach(element => {
                acc_nos.push(element.acc_no);
            });
            data.forEach(element=>{
                cons_nos.push(element.cons_no);
            })
            var arr=[];
            arr.push(acc_nos);
            arr.push(cons_nos);
            res.send(arr);
        }
        catch(err){
            console.log(err);
        }
    })
});

//start server
var port = 8000;
app.listen(port, function() {
    console.log("Listening to CSC on port: " + port);
});