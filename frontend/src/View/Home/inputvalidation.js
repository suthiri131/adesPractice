/**
 * 
 * 
    
Author             : Thet Htar San
Admission no        : P2235077



 */
function validateInput(input, regex, errorElement, invalidElement) {
	if (regex.test(input.value)) {
		// Clear error message if the input is valid
		errorElement.textContent = "";
	} else {
		// Display error message if the input is invalid
		errorElement.textContent = invalidElement;
	}
}

// Function to validate the username
function validateUsername() {
	var username = document.getElementById("username");
	var usernameError = document.getElementById("username-error");
	var regex = /^[a-zA-Z0-9]+$/;
	var invalidElement = "Invalid username. Username must contain letters and numbers without space.";
	validateInput(username, regex, usernameError, invalidElement);
}

// Function to validate the email
function validateEmail() {
	var email = document.getElementById("email");
	var emailError = document.getElementById("email-error");
	var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
	var invalidElement = "Invalid email. Email must be in this format :example@mail.com";


	validateInput(email, regex, emailError, invalidElement);
}

// Function to validate the phone number
function validatePhone() {
	var phone = document.getElementById("phone");
	var phoneError = document.getElementById("phone-error");
	// Add your phone number validation regex or logic here
	var regex = /^[6,8,9][0-9]{7}$/;
	var invalidElement = "Invalid phone number. Phone number must start with 6,8,9 and have 8 numbers."
	validateInput(phone, regex, phoneError, invalidElement);
}

// Function to validate the password
function validatePassword() {
	var password = document.getElementById("password1");
	var passwordError = document.getElementById("password-error");
	var regex   = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=]).{8,}$/;
	var invalidElement = "Invalid password. Password must contain at least 8 characters containing at least 1 uppercase,1 lowercase,1 number and 1 special character."
	validateInput(password, regex, passwordError, invalidElement);
}


