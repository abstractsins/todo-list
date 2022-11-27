/**
 * These functions are the core utility operations of the app. These functions are called by server.js via the GUI.
 */

// Create the Tasks object, to be populated by POST requests;
let Tasks = {};

/* Helper Functions */
// Get all Tasks 
const getAll = () => {
    return Tasks;
}

// Create a new task
const newTask = (name, status, notes) => {
    Tasks[name] = {
        "name": name,
        "status": status,
        "notes": notes 
    };
    return Tasks[name];
};

// Update task status 
const updateTask = (number, newStatus) => {
    Tasks[number].status = newStatus;
    return Tasks[number];
}

// Remove Task
const removeTask = (name) => {
    delete Tasks[name];
    return name;
}

/* EXPORTS */
module.exports = {
    Tasks,
    getAllTasks,
    newTask,
    updateTask,
    removeTask
};

// SAMPLE TASKS - comment or uncomment this section
// newTask('Do Dishes', 'Not Started')
// newTask('Prep Lunches', 'Planned', 'Got the groceries. Chicken is marinating. Just cook and mix everything.')
//removeTask(1)
/**
 * END OF INPUT - THIS SPACE INTENTIONALLY LEFT BLANK
 * 
 * 
 * OK
 */