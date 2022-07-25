/**
 * TODO
 * * Defining fetch requests
 * * Input validation?
 * * Define event listeners for pressing enter
 * * GUI functions
 */

/**
 * * TABLE OF CONTENTS
 * 0 - Global Variables
 * 1 - Utility Functions
 * 2 - GUI Functions
 * --- add slide
 * --- event handlers 
 *
 */

/* 0 - GLOBAL VARIABLES */
let selectedEnvelope; // ?
const url = `http://localhost:3000/`;
let totalBills = 0; // ?
/* END - 0 - GLOBAL VARIABLES */


/* 1 - UTILITY FUNCTIONS */

// getDay - returns a string of the current: day of the week, month / year.
const getDay = () => {
    const week = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' ');
    const today = new Date();
    const day = week[today.getDay()];
    const month = today.getMonth()+1;
    const date = today.getDate();
    return `${day} ${month}/${date}`;
};

// Display the date
$('.date-string').html(getDay());
// console.log(dateH3)

/* END - 1 - UTILITY FUNCTIONS */


/* 2 - GUI FUNCTIONS */
let $slide = $('.slide');
// addSlide - slides out an interface for adding a task
const addSlide = () => {
    // Move in element from off screen
    if ($slide.hasClass('active')) {
        // submit new task
        $slide.removeClass('active');
    }
    else $slide.addClass('active');
}

// Event Handler for Enter
$('#new-task-notes').on("keyup", function(event) {
    if (event.keyCode === 13 && $slide.hasClass('active')) {
        event.preventDefault();
        addSlide();
    }
});
$('.new-task-name-input').on("keyup", function(event) {
    if (event.keyCode === 13 && $slide.hasClass('active')) {
        event.preventDefault();
        addSlide();
    }
});


/* END - 2 - GUI FUNCTIONS */



/**
 * END OF INPUT - THIS SPACE INTENTIONALLY LEFT BLANK
 * 
 * 
 * OK
 */