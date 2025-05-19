// script.js

// --- DOM Element References ---
// Get references to the HTML elements we need to interact with.
const passwordInput = document.getElementById('passwordInput');
const submitButton = document.getElementById('submitButton');
const errorMessage = document.getElementById('errorMessage');
const formContainer = document.querySelector('.bg-white'); // The main white box for the shake animation

// --- Configuration ---
// The correct password. 
// IMPORTANT: In a real-world application, never store passwords directly in client-side JavaScript.
// This is just for this specific, personal project.
const CORRECT_PASSWORD = "1611"; 

// The URL of the page to redirect to upon successful login.
const SUCCESS_REDIRECT_URL = 'homepage/homepage.html'; // You will need to create this file.

// --- Event Listeners ---

/**
 * Attaches event listeners to the relevant DOM elements.
 */
function initializeEventListeners() {
    // Check password when the submit button is clicked.
    if (submitButton) {
        submitButton.addEventListener('click', handlePasswordCheck);
    }

    // Allow pressing 'Enter' in the password field to submit.
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(event) {
            // 'Enter' key has keyCode 13 or key "Enter"
            if (event.key === 'Enter' || event.keyCode === 13) {
                event.preventDefault(); // Prevent default form submission if it were in a <form>
                handlePasswordCheck();
            }
        });
    }
}

// --- Core Logic ---

/**
 * Handles the password check process.
 * Retrieves the entered password, validates it, and takes appropriate action.
 */
function handlePasswordCheck() {
    const enteredPassword = passwordInput.value.trim(); // Get and trim whitespace from input

    if (enteredPassword === CORRECT_PASSWORD) {
        // Password is correct
        displaySuccessAndRedirect();
    } else {
        // Password is incorrect
        displayErrorMessage();
        triggerShakeAnimation();
        clearPasswordFieldAndFocus();
    }
}

// --- UI Update Functions ---

/**
 * Displays a success message (optional) and redirects the user.
 */
function displaySuccessAndRedirect() {
    errorMessage.textContent = 'Password correct! Redirecting...'; // Optional feedback
    errorMessage.style.color = 'green'; // Optional success color

    // Redirect to the next page after a short delay (e.g., to show the success message)
    setTimeout(() => {
        window.location.href = SUCCESS_REDIRECT_URL;
    }, 500); // 0.5 second delay
}

/**
 * Displays an error message for incorrect password attempts.
 */
function displayErrorMessage() {
    if (errorMessage) {
        errorMessage.textContent = 'Incorrect Password, cutu ji. Please try again. ❤️';
        errorMessage.style.color = ''; // Reset to default error color (or Tailwind's custom-error)
    }
}

/**
 * Clears the password input field and sets focus back to it.
 */
function clearPasswordFieldAndFocus() {
    if (passwordInput) {
        passwordInput.value = ''; // Clear the input
        passwordInput.focus();    // Set focus for easy re-entry
    }
}

/**
 * Triggers a shake animation on the form container for visual feedback.
 */
function triggerShakeAnimation() {
    if (formContainer) {
        formContainer.classList.add('shake-animation');
        // Remove the animation class after it finishes so it can be re-triggered on subsequent errors.
        setTimeout(() => {
            formContainer.classList.remove('shake-animation');
        }, 500); // Duration should match the CSS animation duration (0.5s)
    }
}

// --- Initialization ---
// Call the function to set up event listeners when the script loads.
// Using DOMContentLoaded ensures the HTML is fully loaded before trying to access elements.
document.addEventListener('DOMContentLoaded', initializeEventListeners);
