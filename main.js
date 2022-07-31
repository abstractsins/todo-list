/**
 * TODO
 * * Input validation?
 * * Fine tune event listeners for pressing enter
 * * GUI functions
 * * -- separating dropdown behavior between task area and add task
 * * -- status colors
 * * -- task window dropdown design
 * * -- make dorpsdowns go away when clicking anywhere?
 */

/**
 * * TABLE OF CONTENTS
 * 0 - Global Variables
 * 1 - Fetch functions
 * 1 - 1 - GET all
 * 1 - 2 - POST New Task
 * 1 - 3 - PUT Status Edit
 * 1 - 4 - DELETE Task
 * 2 - Utility Functions
 * 2 - 1 - Get Date
 * 2 - 2 - Handler Scout
 * 3 - GUI Functions
 * 3 - 1 - add slide
 * 3 - 2 - event handlers 
 * 3 - 3 - drop menu behavior
 */

// ================================================= //
// START - 0 - GLOBAL VARIABLES
// ================================================= //

const log = console.log;
const url = `http://localhost:3000/`;

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
            // ADD DELETE BUTTON
            let deleteDiv = ''
            +'<div class="delete-button" id="task-'+Object.keys(data).indexOf(key)+'-X">'
                +'<span class="X">X</span>'
            +'</div>';

            // ADD TASKS TO TASK AREA
            let taskStr = ''
            +'<div class="task" id="task-'+Object.keys(data).indexOf(key)+'">'
                +'<div class="task-text">'
                +'<h3>'
                    +key
                +'</h3>'
                +'<div class="task-display-status-section">'
                    +'<h4>'
                        +'Status:'
                    +'</h4>'
                    +'<div class="task-display-status-text" id="task-'+Object.keys(data).indexOf(key)+'-status">'
                        // Content inserted here
                        +data[key]["status"]
                    +'</div>'
                +'</div>'
            +'</div>';

            // Wrap both up
            let wrapper = ''
            +'<div class="task-wrapper" id="task-'+key+'-wrapper">'
                +deleteDiv
                +taskStr
            +'</div>';

            // Insert task into div
            $('.app-body').append(wrapper);
            // Run handler gathering function
        };
    })
    .catch(err=>{
        console.error('Something went wrong getting the information!');
        console.error(err)
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
const statusChange = async() => {

    let status = Number($('#credit-amount').val().split('$').join(''))
    await fetch(url+selectedEnvelope+'/credit/?amount='+amount, {
        method: 'PUT',
    })
    .then(res => res.json())
    .then(res => console.log(res))
    $('#credit-amount').val('');
    
    updateTask(number, newStatus);
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
    log('>>>>> handlerScout function has been called <<<<<')
    // Gather Status buttons
    let $buttons = $('.task-display-status-text');
    // Gather Delete Buttons
    let $Xs = $('.delete-button');
    // Clear arrays of id's
    let statusBtnIds = [];
    let statusXs = [];
    // Populate the arrays
    $buttons.each(function(){statusBtnIds.push(this.id)});
    $Xs.each(function(){statusXs.push(this.id)});
                                        // !>>>>> CONSOLE TESTING                                
                                        log('>>>>> Delete Button Id\'s', statusXs)
                                        log('>>>>> Status Button Id\'s', statusBtnIds)
    // Clone drop down menu
    let menuOptions = document.getElementById('status-dropdown').cloneNode(true);
    // Assign handlers to status buttons
    statusBtnIds.forEach((el,i)=>{
        // When clicking the status
        let $el = $('#'+el);
        $el.on('click', function(){
                                        // !>>>>> CONSOLE TESTING                                
                                        log('clicky!', i);
            $el.prepend(menuOptions);
            let $menuOptions = menuOptions;
            if ($menuOptions.classList.contains('active')) {
                $menuOptions.classList.remove('active');
                $menuOptions.style.display = 'none'
            } else {
                $menuOptions.classList.add('active');
                $menuOptions.style.display = 'block'
            }
        });
    })
    // Assign handlers to delete buttons
    statusXs.forEach((el,i)=>{
        // When clicking the button
        let $el = $('#'+el);
        $el.on('click', function(){
                                        // !>>>>> CONSOLE TESTING                                
                                        log('DELET!', i);
            // Determine what json key the task is
            let $name = $('#task-'+i+'> div > h3').html();
                                        // !>>>>> CONSOLE TESTING                                
                                        log($name)
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
// Notes field
$('#new-task-notes').on("keyup", function(event) {
    if (event.keyCode === 13 && $slide.hasClass('active')) {
        event.preventDefault();
        addSlide();
    }
});
// Name Field
$('.new-task-name-input').on("keyup", function(event) {
    if (event.keyCode === 13 && $slide.hasClass('active')) {
        event.preventDefault();
        addSlide();
    }
});

/**
 * 3 - 3 - Drop Down Behavior
 */
// Click on an item and move it to top
$('#new-task-status-dropbtn').on('click', function(){
    let $dropContent = $('.dropdown-content')
    if ($dropContent.hasClass('active')) {
        $dropContent.removeClass('active');
    }
    else {
        $dropContent.addClass('active');
    }
})

const selectStatus = idNum => {
    let $selected = $(`#status-${idNum}`).html();
    let $btnText = $('#new-task-status-dropbtn');
    $btnText.html($selected);
    $('.dropdown-content').removeClass('active');
}

/**
 * 3 - 4 - Status Display and Edit Button
 */

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