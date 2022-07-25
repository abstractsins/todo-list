// Create the Tasks object, to be populated by POST requests;
let Tasks = {};

/* Helper Functions */
// Function to get all Tasks 
const getAll = () => {
    return Tasks;
}

// Function to set a budget amount;
const setEnvelope = (category, amount=0) => {
    let returnObj = {};
    Tasks[category] = amount;
    return {[category]: amount};
};
// Function to get an envelope balance;
const getEnvelope = category => {
    if (typeof category!=='string' || !Tasks[category]) return false;
    let returnObj = {}
    returnObj[category] = Tasks[category];
    return returnObj;
}
// Function to delete an envelope;
const deleteEnvelope = category => {
    if (typeof category!=='string') return false;
    delete Tasks[category];
    return true;
}

// Function to debit/credit an envelope by an amount
const update = (action, category, amount) => {
    let current = getEnvelope(category)[category];
    if (action==='credit') return setEnvelope(category, (current+Number(amount)));
    else if (action==='debit') return setEnvelope(category, (current-Number(amount))); 
}

/* EXPORTS */
module.exports = {
    Tasks,
    getAll,
    setEnvelope,
    getEnvelope,
    deleteEnvelope,
    update
};

// SAMPLE ENVELOPES - comment or uncomment this section
// setEnvelope('rent', 500)
// setEnvelope('gas', 50)
// setEnvelope('electric', 40)
// setEnvelope('internet', 60)
// setEnvelope('phone', 55)
// setEnvelope('water', 35)
// setEnvelope('cable', 85)
// setEnvelope('groceries', 355)
// setEnvelope('beer', 55)

/**
 * END OF INPUT - THIS SPACE INTENTIONALLY LEFT BLANK
 * 
 * 
 * OK
 */