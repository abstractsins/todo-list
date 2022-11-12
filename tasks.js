/**
 * These functions are the core utility operations of the app. These functions are called by server.js via the GUI.
 */

// Create the Tasks object, to be populated by POST requests;
let Tasks = {};

/* Helper Functions */
// Get all Tasks 
const getAll = () => {

    let taskKeys = Object.keys(Tasks);
    let taskValues = Object.values(Tasks);      
    let tasksArr = taskKeys.map((key,i)=>[key, taskValues[i]]);
    tasksArr.sort((a,b)=>{
        if (a[1]['status'].charCodeAt(0) > b[1]['status'].charCodeAt(0)) return 1;
        else return -1;
    });
    Tasks = {};
    tasksArr.forEach(task=> Tasks[task[0]] = task[1])
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
const updateTask = (task, newStatus) => {
    Tasks[task].status = newStatus;
    return Tasks[task];
}

// Remove Task
const removeTask = (name) => {
    delete Tasks[name];
    return name;
}

/* EXPORTS */
module.exports = {
    Tasks,
    getAll,
    newTask,
    updateTask,
    removeTask
};


/**
 * END OF INPUT - THIS SPACE INTENTIONALLY LEFT BLANK
 * 
 * 
 * OK
 */