/**
 * TODO
 * * GUI functions
 * * -- tighten notes click area to icon 
 * * -- edit notes?
 * * -- task window dropdown design
 * * Footer stuff
 * * -- task counter?
 * * -- statistics?
 */

/**
 * * TABLE OF CONTENTS
 * 0- Global Variables
 * 1 - Fetch functions
 * 1-1 - GET all
 * 1-2 - POST New Task
 * 1-3 - PUT Status Edit
 * 1-4 - DELETE Task
 * 2 - Utility Functions
 * 2-1 - Get Date
 * 2-2 - Handler Scout
 * 3 - GUI Functions
 * 3-1 - add slide
 * 3-2 - event handlers 
 * 3-3 - drop menu behavior
 * 3-4 - Status Display and Edit Button
 * 3-5 - Notes Popup
 * 3-6 - Close menu event listeners
 */

// ================================================= //
// START - 0 - GLOBAL VARIABLES
// ================================================= //
const log = console.log;
const url = `http://localhost:3000/`;

// import ()

// ------------------------------------------------- //
// END - 0 - GLOBAL VARIABLES
// ------------------------------------------------- //


// ================================================= //
// START - 1 - FETCH FUNCTIONS
// ================================================= //


/**
 * 1 - 1 - GET All Tasks
 */
//  Called when page loads and after any changes
const getAll = async() => {
    $('.app-body').empty();
    await fetch(url)
    .then(response => response.json())
    .then(data => {
        for (key in data) {
            let num = Object.keys(data).indexOf(key);

            // ADD DELETE BUTTON
            let deleteDivStr = ''
            +'<div class="delete-button" id="task-'+num+'-X">'
                +'<span class="X">X</span>'
            +'</div>';

            // ADD TASKS TO TASK AREA
            let taskDivStr = ''
            +'<div class="task" id="task-'+num+'">'
                +'<div class="task-text">'
                    +'<h3>'
                        +key
                    +'</h3>'
                    +'<div class="task-display-status-section">'
                        +'<h4>'
                            +'Status:'
                        +'</h4>'
                        +'<div class="dropbtn-live" id="task-'+num+'-status">'
                            // Content inserted here
                            +data[key]["status"]
                        +'</div>'
                    +'</div>'
                +'</div>'
            +'</div>';

            // ADD NOTES BUTTON 
            let notesDivStr = ''
            +'<div class="notes-button" id="task-'+num+'-notes">'
                // Font Awesome icon
                +'<i class="fa-solid fa-toilet-paper" onclick="notes('+num+')"></i>'
            +'</div>'
            
            // ADD NOTES SECTION
            let notesSectionStr = ''
            +'<div class="notes-section" id="notes-'+num+'">'
                +'<span class="notes-text" id="notes-'+num+'-text">'+data[key]["notes"]+'</span>'
            +'</div>'

            // Wrap all them up
            let wrapper = ''
            +'<div class="task-wrapper" id="task-'+key+'-wrapper">'
                +deleteDivStr
                +taskDivStr
                +notesDivStr
            +'</div>'
            +notesSectionStr;


            // Insert task into div
            $('.app-body').append(wrapper);

            // Notes Visibility
            let $notes = $("#task-"+num+"-notes");
            if (data[key]["notes"]) {
                $notes.css('visibility', 'visible');
            } else $notes.css('visibility', 'hidden');

            // Run handler gathering function
        };
    })
    .catch(err=>{
        console.error('Something went wrong getting the information!');
        console.error(err);
    })
    handlerScout();
}

/**
 * 1 - 2 - POST New Task
 */
// Click on plus sign after entering info POST new task
const create = async() => {
    // Define task name from input field
    let $name = $('#new-task-name-input').val();
    // Do not submit without name
    if (!$name) return
    else {
        // Define status from drop menu
        let $status = $('#new-task-status-dropbtn').html();
        // Default status is "Not Started"
        if ($status === 'Select Status...') $status = 'Not Started';
        // Define notes from input field
        let $notes = $('#new-task-notes').val();
        // Define request body
        let task = {};
        task['name']=$name.trim();
        task['status']=$status;
        task['notes']=$notes;
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(task)
        });
        const content = await response.json();
        // Clear the input fields after submitting
        $('input#new-task-name-input').val('');
        $('#new-task-notes').val('');
        $('#new-task-status-dropbtn').html('Select Status...');
        // Clear existing tasks and repopulate with the new one;
        getAll();
        return content;
    }
}

/**
 * 1 - 3 - PUT Status Edit 
 */
const statusChange = async(statusText, task) => {
    let update = {"name":task, "status":statusText};
    await fetch(url, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(update)
    })
    .then(res => res.json())
    getAll();
}

/**
 * 1 - 4 - DELETE Task
 */
const deleteTask = async(name) => {
    const response = await fetch(url+name, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
    })
    const returnVal = await response;
    // Clear existing tasks and repopulate with the new one;
    getAll();
    return returnVal;
}

// ------------------------------------------------- //
// END - 1 - FETCH FUNCTIONS
// ------------------------------------------------- //


// ================================================= //
// START - 2 - UTILITY FUNCTIONS
// ================================================= //

/**
 * 2 - 1 - getDay - returns a string of the current: day of the week, month / year.
 */
const getDay = () => {
    const week = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' ');
    const today = new Date();
    const day = week[today.getDay()];
    const month = today.getMonth()+1;
    const date = today.getDate();
    return `${day} ${month}/${date}`;
};
$('.date-string').html(getDay());

/**
 * 2 - 2 - handlerScout - looks for buttons on the updated page to assign handlers
 */
function handlerScout(){
    // Gather Status buttons
    let $buttons = $('.dropbtn-live');
    // Gather Delete Buttons
    let $Xs = $('.delete-button');
    // Clear arrays of id's
    let statusBtnIds = [];
    let statusXs = [];
    // Populate the arrays
    $buttons.each(function(){statusBtnIds.push(this.id)});
    $Xs.each(function(){statusXs.push(this.id)});
    // Clone drop down menu
    let menuOptions = document.getElementById('status-dropdown').cloneNode(true);
    
    // Assign handlers to status buttons
    statusBtnIds.forEach((el,i)=>{
        // get live status button
        let $el = $('#'+el);
        $el.css({'color': 'black', 'font-weight': 'bold'})

        
        
        const colorObj = {
            'Not Started': 'rgb(128, 213, 165)',
            'Started': 'rgb(72, 247, 204)',
            'Planning': 'rgb(152, 152, 211)',
            'Planned': 'rgb(152, 83, 211)',
            'Scheduling': 'rgb(211, 152, 193)',
            'Scheduled': 'rgb(211, 76, 173)',
            'Complete': 'rgb(68, 237, 107)'
        };
        // get new status button
        // let $newTaskStatusDropbtn = $('#new-task-status-dropbtn');
        const colorObjKeys = Object.keys(colorObj);
        const colorObjVals = Object.values(colorObj);
        
        // Make sure all statuses are the right color
        switch ($el.text()) {
            case colorObjKeys[0]: $el.css('background-color', colorObjVals[0]); break;
            case colorObjKeys[1]: $el.css('background-color', colorObjVals[1]); break;
            case colorObjKeys[2]: $el.css('background-color', colorObjVals[2]); break;
            case colorObjKeys[3]: $el.css('background-color', colorObjVals[3]); break;
            case colorObjKeys[4]: $el.css('background-color', colorObjVals[4]); break;
            case colorObjKeys[5]: $el.css('background-color', colorObjVals[5]); break;
            case colorObjKeys[6]: $el.css('background-color', colorObjVals[6]); break;
        }

        // When clicking the status
        $el.on('click', function(){
            let $menuOptions = menuOptions;
            $el.after($menuOptions);
            if ($menuOptions.classList.contains('active')) {
                $menuOptions.classList.remove('active');
            } else {
                $menuOptions.classList.add('active');
                // $menuOptions.style.display = 'block'
            }
        });
    })
    
    // Assign handlers to delete buttons
    statusXs.forEach((el,i)=>{
        // When clicking the button
        let $el = $('#'+el);
        $el.on('click', function(){
            // Determine what json key the task is
            let $name = $('#task-'+i+'> div > h3').html();
            // Call the fetch function
            deleteTask($name);
        })
    })
}

// ------------------------------------------------- //
// END - 2 - UTILITY FUNCTIONS
// ------------------------------------------------- //


// ================================================= //
// START - 3 - GUI FUNCTIONS
// ================================================= //

let $slide = $('.slide');

/**
 * 3 - 1 - addSlide - slides out an interface for adding a task
 */
const addSlide = () => {
    // Move in element from off screen
    if ($slide.hasClass('active')) {
        // POST new task
        create();
        // Hide slide
        $slide.removeClass('active');
    }
    // Show slide 
    else $slide.addClass('active');
}


/**
 * 3 - 2 - Event Handler for Enter
 */ 
// keyup event handler for task name field
$('.new-task-name-input').on("keyup", function(event) {
    // if enter was pressed and slide is open...
    if (event.keyCode === 13 && $slide.hasClass('active')) {
        event.preventDefault();
        // call slide function to add task
        addSlide();
    }
});


/**
 * 3 - 3 - Updating status text
 */

function selectStatus(statusText, buttonTextNode, color){
    // Update text of button
    let $btn = $('#'+buttonTextNode);
    $btn.html(statusText);
    // Update color of status button
    $btn.css('background-color', color);
    // Update active status
    $('.dropdown-content').removeClass('active');
}


/**
 * 3 - 4 - Notes Popup
 */
//  Click on notes icon to pop open notes div
function notes(num){
    // Grab the hidden notes element
    let $notes = $('#notes-'+num);
    // if it is currently active...
    if ($notes.hasClass('active')) {
        // remove active class
        $notes.removeClass('active');
        // turn off display
        $notes.css('display', 'none');
    } else {
        // set display to flex
        $notes.css('display', 'flex');
        // add class active
        $notes.addClass('active');
    }
}

/**
 * 3 - 6 - Click event listeners
 */
// Click outside of a dropdown to close it
// Click status to apply to button
// default id for undefined
let lastId = 'fake-id';
// add event listener to window for clicks
window.addEventListener('click', function(e){
    // get id and class of what was clicked on
    let id = $(e.target).attr('id');
    let $class = $(e.target).attr('class');
    // if id is undefined, give it default id
    if (!id) id = 'fake-id';
    // if previous click was a status, and current click is not...
    if (lastId.includes('status') && lastId !== id) {
        // get the menu element 
        let $menu = $('#'+lastId);
        // deactivate the next element (menu content)
        $menu.next().removeClass('active')
    }
    // When clicking for a new status
    if (id==='new-task-status-dropbtn') {
        let el = $('#'+id).next();
        el.hasClass('active') ? el.removeClass('active') : el.addClass('active');
    }
    // If clicking status menu text
    if ($class && $class.includes('status-text')) {
        let statusText = e.target.innerText;
        // call the status selection function
        selectStatus(statusText, lastId);
        // call the status PUT fetch
        // let num = $('#'+lastId).attr('id').split('-')[1];
        let task = $('#'+lastId).parent().prev().text();
        // Call Fetch
        statusChange(statusText, task);
    }
    // update the id of last clicked
    lastId = id;
})

// ------------------------------------------------- //
// END - 3 - GUI FUNCTIONS
// ------------------------------------------------- //


/**
 * Function Calls
 */
getAll();

/**
 * END OF INPUT - THIS SPACE INTENTIONALLY LEFT BLANK
 * 
 * 
 * OK
 */