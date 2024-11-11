// Example of simple interaction - a button that changes content when clicked

// function showMessage() {
//     alert("Remember to take care of your mental health!");
// }

function changeContent() {
    document.getElementById("dynamicContent").innerHTML = "You've unlocked a relaxation tip: Take a 5-minute break and breathe deeply.";
}
document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from actually submitting

    // Display success message
    alert('Your booking request has been received. A confirmation email will be sent to you.');

    // Hide the form
    document.getElementById('booking-form').style.display = 'none';
});