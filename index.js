const express= require('express');

const TodoTask = require('./models/TodoTask');

//DB Connection
const mongoose= require('mongoose');
mongoose.set('useFindAndModify', false);

const port= process.env.port || 3000;


const app= express();

mongoose.connect('mongodb+srv://alekya:helloyou@cluster0-gcuxr.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true},() =>{
    console.log('Connected to db');
    app.listen(port,()=>{
        console.log('Server listening on the port 3000');
    });
});



// get

app.get('/',(req,res)=>{
    TodoTask.find({},(err,tasks)=>{
        res.render('todo.ejs', {todoTasks: tasks});
    });
});

app.set("view engine", "ejs");

app.use('/static', express.static('public'));

app.use(express.urlencoded({extended: true}));

//post

app.post('/', (req,res)=> {
    const todoTask= new TodoTask({
        content: req.body.content
    });

    todoTask.save();
    res.redirect('/');
});


// update

app
.route("/edit/:id")
.get((req, res) => {
const id = req.params.id;
TodoTask.find({}, (err, tasks) => {
res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
});
})
.post((req, res) => {
const id = req.params.id;
TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
if (err) return res.send(500, err);
res.redirect("/");
});
});

// delete

app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
    if (err) return res.send(500, err);
    res.redirect("/");
    });
    });