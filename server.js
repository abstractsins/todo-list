/**
 * This script handles server routing with functions supplied by tasks.js
 */

const express = require('express');
const app = express();
const morgan = require('morgan');
const envelopeRouter = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser')

const {    
    Envelopes,
    getAll,
    setEnvelope,
    getEnvelope,
    deleteEnvelope,
    update,
} = require('./tasks');

const PORT = process.env.PORT || 3000;

// MIDDLEWARE
// Cors
app.use(cors());
// Morgan logging
app.use(morgan('tiny'))
// json body parsing //*not sure i need this
const jsonParser = bodyParser.json()
app.use(jsonParser)
// Router
app.use('/', envelopeRouter)
// Param
envelopeRouter.param('category', (req,res,next,cat)=>{
    const envelope = getEnvelope(cat);
    if (envelope){
        req.envelope = envelope;
        req.category = cat;
        next();
    }else{
        res.status(404).send('Category not found!');
        console.log('\n*****Invalid Category')
    }
});
envelopeRouter.param('action', (req,res,next,action)=>{
    req.action = action;
    next();
})

// Listen in on server
app.listen(PORT, function(err){
    if (err) console.log("Error in server setup");    
    console.log(`psssst, I'm listening on port ${PORT}, speak up...`);
});

// GET
// Get all
envelopeRouter.get('/', (req, res, next)=>{
    res.status(200).send(getAll())
    console.log('\n*****Getting all envelopes')
})
// Get individual
envelopeRouter.get('/:category', (req, res, next) => {
    res.status(200).send(req.envelope);
    console.log('\n*****Got envelope - ' + req.category + ': ' + (req.envelope[req.category]));
});

// PUT 
envelopeRouter.put('/:category/:action/', (req,res,next)=>{
    let category = req.category;
    let action = req.action;
    let amount = req.query.amount;
    let updated = update(action, category, amount);
    if (updated) {
        res.send(updated);
        console.log(`\n*****Envelope updated - ${action} ${req.category}: ${req.query.amount}`)
    } else {
        res.status(404).send('something went wrong, Chief...')
    }
})

// POST
envelopeRouter.post('/', (req,res,next)=>{
    // let category = req.body.envelope;
    // let amount = req.body.amount;
    let category = req.body['envelope'];
    let amount = req.body['amount'];    
    let newEnvelope = setEnvelope(category, amount);
    if (newEnvelope) {
        res.status(201).send(newEnvelope)
        console.log('\n*****Created the envelope - ' + category + ': ' + amount);
    } else {
        res.status(404).send();
    }
})
// TRANSFER
envelopeRouter.post('/transfer/:from/:to', (req,res,next)=>{
    let from = req.params.from;
    let to = req.params.to;
    let amount = req.query.amount;
    let updatedFrom = update('debit', from, amount);
    let updatedTo = update('credit', to, amount);
    let returnArr = [updatedFrom, updatedTo]
    console.log(`\n*****Transfered ${amount} from ${from} to ${to}`);
    res.status(200).send(returnArr)
})

// DELETE 
envelopeRouter.delete('/:category', (req,res,next)=>{
    const category = req.category;
    const deleted = deleteEnvelope(category);
    if (deleted) {
        res.status(204)
        console.log('\n*****Deleted envelope: ' + category)
    } else {
        res.status(500);
    }
    res.send();    
})

// TEST CALLS
// setEnvelope('rent', 1000);
// setEnvelope('electric', 50);
// setEnvelope('internet', 60);
// setEnvelope('groceries', 300);
// setEnvelope('gasoline', 100);

/* THIS SPACE INTENTIONALLY LEFT BLANK
*
*
*
*
*
*
*
OK */