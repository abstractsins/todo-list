/**
 * This script handles server routing with functions supplied by tasks.js
 */

console.log('server.js is running.')

const express = require('express');
const app = express();
const morgan = require('morgan');
const taskRouter = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser')

const {    
    Tasks,
    getAllTasks,
    newTask,
    updateTask,
    removeTask,
} = require('./tasks');

const PORT = process.env.PORT || 3000;

// MIDDLEWARE
// Cors
app.use(cors());
// Morgan logging
app.use(morgan('tiny'))
// json body parsing //* not sure i need this
const jsonParser = bodyParser.json()
app.use(jsonParser)
// Router
app.use('/', taskRouter)

// Listen in on server
app.listen(PORT, function(err){
    if (err) console.log("Error in server setup");    
    console.log(`psssst, I'm listening on port ${PORT}, speak up...`);
});

// GET
// Get all
taskRouter.get('/', (req, res, next)=>{
    res.status(200).send(getAllTasks())
    console.log('\n***** Getting all tasks >>>>> ' + JSON.stringify(Tasks))
})

// PUT 
taskRouter.put('/', (req,res,next)=>{
    console.log(req.body.name)
    let task = req.body.name;
    let newStatus = req.body.status;
    let updated = updateTask(task, newStatus);
    if (updated) {
        res.send(updated);
        console.log(`\n***** Task status updated >>>>> ${JSON.stringify(updated)}`)
    } else {
        console.log('something went wrong, Chief...')
        res.status(404).send();
    }
})

// POST
taskRouter.post('/', (req,res,next)=>{
    let name = req.body['name']; 
    let status = req.body['status']; 
    let notes = req.body['notes']; 
    let task = newTask(name, status, notes);
    if (task) {
        res.status(201).send(task)
        console.log('\n***** Created the task >>>>> ' + JSON.stringify(task));
    } else {
        res.status(404).send();
    }
});

// DELETE 
taskRouter.delete('/:task', (req,res,next)=>{
    const name = req.params.task;
    const deleted = removeTask(name);
    if (deleted) {
        res.status(204)
        console.log('\n***** Deleted task >>>>> ' + JSON.stringify(deleted));
    } else {
        res.status(500);
    }
    res.send();    
})


/**
 * END OF INPUT - THIS SPACE INTENTIONALLY LEFT BLANK
 * 
 * 
 * OK
 */