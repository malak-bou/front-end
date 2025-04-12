const daysTag = document.querySelector(".days"),
currentDate = document.querySelector(".current-date"),
prevNextIcon = document.querySelectorAll(".icons span");
// getting new date, current year and month
let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();
// storing full name of all months in array
const months = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];
const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear,currMonth, 1).getDay(), // getting first day of month
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // getting last date of month
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // getting last day of month
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // getting last date of previous month
    let liTag = "";
    for (let i = firstDayofMonth; i > 0; i--) { // creating li of previous month last days
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }
    for (let i = 1; i <= lastDateofMonth; i++) { // creating li of all days of current month
        // adding active class to li if the current day, month, and year matched
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() 
                     && currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }
    for (let i = lastDayofMonth; i < 6; i++) { // creating li of next month first days
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
    }
    currentDate.innerText = `${months[currMonth]} ${currYear}`; // passing current mon and yr as currentDate text
    daysTag.innerHTML = liTag;
}
renderCalendar();
prevNextIcon.forEach(icon => { // getting prev and next icons
    icon.addEventListener("click", () => { // adding click event on both icons
        // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;
        if(currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
            // creating a new date of current year & month and pass it as date value
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear(); // updating current year with new date year
            currMonth = date.getMonth(); // updating current month with new date month
        } else {
            date = new Date(); // pass the current date as date value
        }
        renderCalendar(); // calling renderCalendar function
    });
});









const daysTag2 = document.querySelector(".days2"),
currentDate2 = document.querySelector(".current-date2"),
prevNextIcon2 = document.querySelectorAll(".icons2 span");
// getting new date, current year and month
let date2 = new Date(),
currYear2 = date.getFullYear(),
currMonth2 = date.getMonth();
// storing full name of all months in array
const months2 = ["January", "February", "March", "April", "May", "June", "July",
              "August", "September", "October", "November", "December"];
const renderCalendar2 = () => {
    let firstDayofMonth = new Date(currYear,currMonth, 1).getDay(), // getting first day of month
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(), // getting last date of month
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(), // getting last day of month
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate(); // getting last date of previous month
    let liTag = "";
    for (let i = firstDayofMonth; i > 0; i--) { // creating li of previous month last days
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }
    for (let i = 1; i <= lastDateofMonth; i++) { // creating li of all days of current month
        // adding active class to li if the current day, month, and year matched
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() 
                     && currYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}">${i}</li>`;
    }
    for (let i = lastDayofMonth; i < 6; i++) { // creating li of next month first days
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
    }
    currentDate.innerText = `${months[currMonth]} ${currYear}`; // passing current mon and yr as currentDate text
    daysTag.innerHTML = liTag;
}
renderCalendar();
prevNextIcon2.forEach(icon => { // getting prev and next icons
    icon.addEventListener("click", () => { // adding click event on both icons
        // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;
        if(currMonth < 0 || currMonth > 11) { // if current month is less than 0 or greater than 11
            // creating a new date of current year & month and pass it as date value
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear(); // updating current year with new date year
            currMonth = date.getMonth(); // updating current month with new date month
        } else {
            date = new Date(); // pass the current date as date value
        }
        renderCalendar(); // calling renderCalendar function
    });
});



















// Function to open/close the sidebar
function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    // Check the current width of the sidebar and adjust it
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0"; // Close the sidebar
    } else {
        sidebar.style.width = "250px"; // Open the sidebar
    }
}














document.addEventListener("DOMContentLoaded", function () {
    const profileLink = document.getElementById("profile-link");
    const sidebar = document.getElementById("sidebar2");
    const closeSidebar = document.getElementById("close-sidebar2");
    const overlay = document.getElementById("overlay");

    // Open Sidebar
    profileLink.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default link behavior
        sidebar.classList.add("show");
        sidebar.classList.remove("hide");
        overlay.classList.add("show");
    });

    // Close Sidebar
    function closeMenu() {
        sidebar.classList.add("hide"); // Move it out completely
        sidebar.classList.remove("show");
        overlay.classList.remove("show");
    }

    closeSidebar.addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);
});





























// code for selection of the departements

const seeMoreButton = document.querySelector('.see-more');
const buttonContainer = document.querySelector('.button-container');

seeMoreButton.addEventListener('click', () => {
  // Toggle 'show-more' class to slide buttons in/out
  buttonContainer.classList.toggle('show-more');

  // Change button text based on state
  if (buttonContainer.classList.contains('show-more')) {
    seeMoreButton.textContent = "Retour"; // Change text when buttons are expanded
  } else {
    seeMoreButton.textContent = "Voir plus"; // Change text when buttons are collapsed
  }
});










// changing the dep text
const departmentButtons = document.querySelectorAll(".button"); // Fix variable name
const textChange = document.getElementById('text3'); // Ensure element exists

departmentButtons.forEach(button => { // Use the correct variable
  button.addEventListener('click', () => {
    const department = button.getAttribute('data-department'); // Get department name
    textChange.textContent = `le calendrier associé aux ${department} Departement`;
  });
});


  






// code for the delete courses 


// Get references to the delete button, popup and confirm buttons
const deleteButtons = document.querySelectorAll('.trash-icon');
const popup = document.getElementById('popup');
const confirmDeleteButton = document.getElementById('confirm-delete');
const cancelDeleteButton = document.getElementById('cancel-delete');
let selectedCourse = null; // Track the selected course to delete

// Add event listeners for delete buttons
deleteButtons.forEach(button => {
  button.addEventListener('click', (event) => {
    // Get the div that contains the course
    selectedCourse = event.target.closest('.info');
    
    // Show the confirmation popup
    popup.style.display = 'flex';
  });
});

// Handle the confirmation to delete the course
confirmDeleteButton.addEventListener('click', () => {
  // Remove the selected course div
  selectedCourse.remove();
  
  // Close the popup
  popup.style.display = 'none';
  selectedCourse = null; // Reset selected course
});

// Handle cancel action
cancelDeleteButton.addEventListener('click', () => {
  // Just close the popup without doing anything
  popup.style.display = 'none';
  selectedCourse = null; // Reset selected course
});


// menu showing after clicking dot3
    const menuWrapper = document.querySelector('.menu-wrapper');
    const menuButtons = document.querySelectorAll('.dot3');

    menuButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const rect = button.getBoundingClientRect();
            menuWrapper.style.top = `${rect.bottom + 5}px`;
            menuWrapper.style.left = `${rect.left}px`;
            menuWrapper.classList.add('show');
            event.stopPropagation(); // Prevent closing when clicking the button
        });
    });

    document.body.addEventListener('click', () => {
        menuWrapper.classList.remove('show');
    });

    menuWrapper.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent closing when clicking inside the menu
    });
  
    document.addEventListener("DOMContentLoaded", function () {
        const menu = document.getElementById("target-div");
        const editButtons = document.querySelectorAll(".dot3");
        let currentEditableElement = null;
        let tempText = "";
    
        // Show menu when clicking the 3-dot icon
        editButtons.forEach(button => {
            button.addEventListener("click", (event) => {
                event.stopPropagation();
                const parent = button.closest(".edit-hover");
                currentEditableElement = parent.querySelector("p");
    
                // Position the menu
                menu.style.top = `${event.clientY}px`;
                menu.style.left = `${event.clientX}px`;
                menu.classList.add("show");
            });
        });
    
        // Hide menu when clicking outside
        document.addEventListener("click", () => {
            menu.classList.remove("show");
        });
    
        // Edit function
        document.querySelector(".edit").addEventListener("click", function () {
            if (currentEditableElement) {
                tempText = currentEditableElement.textContent;
                const input = document.createElement("input");
                input.type = "text";
                input.value = tempText;
                input.style.border = "2px solid gray";  
                input.style.padding = "5px";  
                input.style.borderRadius = "5px";  
                input.style.fontSize = "16px";  
                input.style.color = "#333";  
                input.style.backgroundColor = "#f9f9f9";  
                input.style.outline = "none";



                input.classList.add("editable");
                currentEditableElement.replaceWith(input);
                input.focus();
    
                // Handle Enter key
                input.addEventListener("keydown", function (event) {
                    if (event.key === "Enter") {
                        event.preventDefault(); // Prevent default form submission
                        showPopup(input);
                    }
                });
    
                // Cancel editing if user clicks outside
                input.addEventListener("blur", function () {
                    input.replaceWith(currentEditableElement);
                });
            }
        });
    
        // Copy function
        document.querySelector(".black:nth-child(3)").addEventListener("click", function () {
            if (currentEditableElement) {
                navigator.clipboard.writeText(currentEditableElement.textContent).then(() => {
                    alert("Text copied!");
                });
            }
        });
    
        // Prevent menu from closing when clicking inside
        menu.addEventListener("click", (event) => {
            event.stopPropagation();
        });
    
        // Show confirmation popup
        function showPopup(input) {
            let popup = document.getElementById("popup-container");
    
            // Create popup only if it doesn't exist
            if (!popup) {
                popup = document.createElement("div");
                popup.id = "popup-container";
                popup.classList.add("popup");
                popup.innerHTML = `
                    <div class="popup-content">
                        <p>Voulez-vous enregistrer les modifications ?</p>
                        <button class="save-btn">Sauvegarder</button>
                        <button class="cancel-btn">Annuler</button>
                    </div>
                `;
                document.body.appendChild(popup);
            }
    
            popup.style.display = "flex"; // Show the popup
    
            // Save changes
            popup.querySelector(".save-btn").addEventListener("click", function () {
                currentEditableElement.textContent = input.value;
                input.replaceWith(currentEditableElement);
                popup.style.display = "none"; // Hide popup after saving
            });
    
            // Cancel changes
            popup.querySelector(".cancel-btn").addEventListener("click", function () {
                input.value = tempText; // Revert to original text
                input.replaceWith(currentEditableElement);
                popup.style.display = "none"; // Hide popup after canceling
            });
        }
    });
    
    