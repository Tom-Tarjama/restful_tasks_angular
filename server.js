//require express:
var express = require("express");

// create the express app:
var app = express();

// path module -- try to figure out where and why we use this
var path = require("path");

//require bodyParser (to receve post data from clients)
var bodyParser = require('body-parser');

//integrate body-parser into our app:
app.use(bodyParser.json());

//setting up static route for angular
app.use(express.static( __dirname + '/RestfulTasks/dist' ));

//-----DB stuff

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/Restful_Task');

var Schema = mongoose.Schema;

var TaskSchema = new mongoose.Schema({
	title: {type:String,minlength:1,maxlength:255}, 
	description: {type:String,default: ""},
	completed: {type:Boolean,default: false},
	},{ timestamps: true });

mongoose.model("Task", TaskSchema);

var Task = mongoose.model('Task');

//----- routing stuff
app.get("/tasks", function(req, res){
	Task.find({}, function(err, tasks){
		console.log(Task)
		if(err){
			console.log("Error locating data:", err)
			res.json({message: "Error", errors: err})
		}
		else{
			console.log("Tasks located successfully")
			res.json({message: "Success", data: tasks})
		}
	})
})

app.post("/tasks/new", function(req, res){
	let task = new Task(req.body)
	task.save(function(err, task){
		if(err){
			console.log("Error creating new task", err)
			res.json({message: "Error", errors: err})
		}
		else{
			console.log("Task created successfully")
			res.json({message: "Success", data: task})
		}
	})
})

app.get("/tasks/:id", function(req, res){
	Task.findOne({_id: req.params.id}, function(err, task){
		if(err || task ===null){
			console.log("Error locating that task:", err)
			res.json({message: "Error locating that task", errors: err})
		}
		else{
			console.log("Task located successfully")
			console.log(typeof task._id)
			res.json({message: "Success", data: task})
		}
	})
})

app.put("/tasks/:id", function(req, res){
	Task.findOne({_id: req.params.id}, function(err, task){
		if(err || task ===null){
			console.log("Error locating that task:", err)
			res.json({message: "Error locating that task", errors: err})
		}
		else{
			console.log("Task located successfully")
			console.log("before", task)
			task.title = req.body.title
			task.description = req.body.description
			task.completed = req.body.completed
			// task = req.body
			console.log("after", task)
			task.save(function(err){
				if(err){
					console.log("Error updating  task", err)
					res.json({message: "Error updating task", errors: err})
				}
				else{
					console.log("Task updated successfully")
					res.json({message: "Success", data: task})
				}
			})
			
		}
	})
})

app.delete("/tasks/:id", function(req,res){
	//new
	Task.findOne({_id: req.params.id}, function(err, task){
		if(err || task ===null){
			console.log("Error locating that task:", err)
			res.json({message: "Error locating that task", errors: err})
		}
		else{
			Task.remove({_id: req.params.id}, function(err){
				if(err){
					console.log("Error removing this task")
					res.json({message: "Error", errors: err})
				}
				else{
					console.log("Task removed successfully")
					res.json({message: "Success"})
				}
			})
		}
	})
})


//----- setting port
app.listen(8000, function() {
 console.log("listening on port 8000");
});

