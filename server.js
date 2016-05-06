/// SETUP ======================================
var
  express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override')

/// MONGODB SETUP ==============================
mongoose.connect('mongodb://localhost/todo_list')

/// CONFIG
app.use(express.static(__dirname + '/public'))
app.use(morgan('dev')),
app.use(bodyParser.urlencoded({'extended': 'true'}))
app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/vnd.api+json'}))
app.use(methodOverride())

/// MODEL ======================================
var Todo = mongoose.model('Todo', {
  text : String
})

/// ROUTES =====================================
///   Get all todos
app.get('/api/todos', function(req, res) {

    // use mongoose to get all todos in the database
    Todo.find(function(err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(todos); // return all todos in JSON format
    });
});

///   Create todo & send back all todos after creation
app.post('/api/todos', function(req, res) {

    // create a todo, information comes from AJAX request from Angular
    Todo.create({
        text : req.body.text,
        done : false
    }, function(err, todo) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        Todo.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });

});


///   Delete a todo
app.delete('/api/todos/:todo_id', function(req, res) {
    Todo.remove({
        _id : req.params.todo_id
    }, function(err, todo) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        Todo.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });
});
/// Application
app.get('*', function(req, res){
  res.sendfile('./public/index.html');
})
/// LISTENING PORT =============================
app.listen(7000)
console.log("todo_list app singing on port 7000!!!!!!!!!!!!!!")
