/**
 * This script handles server routing with functions supplied by tasks.js
 */

const express = require('express');
const app = express();
const morgan = require('morgan');
const taskRouter = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');

const { 
    Tasks, 
    getAllTasks, 
    newTask, 
    updateTask, 
    removeTask 
} = require('./tasks');

const PORT = process.env.PORT || 3000;

// MIDDLEWARE
// Cors
app.use(cors());
// Morgan logging
app.use(morgan('tiny'));
// json body parsing //* not sure i need this
const jsonParser = bodyParser.json();
app.use(jsonParser);
// Router
app.use('/', taskRouter);

// // Param
// taskRouter.param('category', (req,res,next,cat)=>{
//     const task = getEnvelope(cat);
//     if (task){
//         req.task = task;
//         req.category = cat;
//         next();
//     }else{
//         res.status(404).send('Category not found!');
//         console.log('\n*****Invalid Category')
//     }
// });
// taskRouter.param('action', (req,res,next,action)=>{
//     req.action = action;
//     next();
// })

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
taskRouter.put('/:task/:status', (req,res,next)=>{
    let number = req.params.task;
    let newStatus = req.params.status;
    let updated = updateTask(number, newStatus);
    if (updated) {
        res.send(updated);
        console.log(`\n***** Task status updated >>>>> ${JSON.stringify(updated)}`)
    } else {
        res.status(404).send('something went wrong, Chief...')
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