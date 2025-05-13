const daysTag = document.querySelector(".days"),
currentDate = document.querySelector(".current-date"),
prevNextIcon = document.querySelectorAll(".icons span");
// getting new date, current year and month
let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();
// storing full name of all months in French
const months = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet",
    "Août", "Septembre", "Octobre", "Novembre", "Décembre"
];
// French day names for the calendar header
const weekDays = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];



// Elements for timetable modal
const timetableModal = document.getElementById('timetable-modal');
const closeTimetableBtn = document.querySelector('.close-timetable');
const selectedDateElement = document.getElementById('selected-date');
const timetable = document.querySelector('.timetable');

// Elements for edit course modal
const editCourseModal = document.getElementById('edit-course-modal');
const closeEditCourseBtn = document.querySelector('.close-edit-course');
const editCourseForm = document.getElementById('edit-course-form');
const courseIdInput = document.getElementById('course-id');
const courseTitleInput = document.getElementById('course-title');
const courseTrainerInput = document.getElementById('course-trainer');
const courseTimeInput = document.getElementById('course-time');
const courseTypeInput = document.getElementById('course-type');
const saveCourseBtn = document.getElementById('save-course');
const cancelEditBtn = document.getElementById('cancel-edit');

// Time slots for the day
const timeSlots = [
    "08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00",
    "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00"
];


// Function to fetch calendar courses
async function fetchCalendarCourses() {
    const token = localStorage.getItem("token");
    const response = await fetch("https://backend-m6sm.onrender.com/calendar", {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    if (!response.ok) {
        console.error("Erreur lors de la récupération du calendrier:", response.status);
        throw new Error("Erreur lors de la récupération du calendrier");
    }
    const data = await response.json();
    return data;
}

// Initialize course schedule as empty
let courseSchedule = {};

// Function to format time to match timeSlots format
function formatTime(time) {
    
    // Si déjà au bon format (ex: 09:00-10:00)
    if (/^\d{2}:\d{2}-\d{2}:\d{2}$/.test(time)) {
        return time;
    }
    // Si format "H:MM" ou "HH:MM"
    if (/^\d{1,2}:\d{2}$/.test(time)) {
        let [h, m] = time.split(":");
        h = h.padStart(2, '0');
        let nextH = (parseInt(h, 10) + 1).toString().padStart(2, '0');
        return `${h}:00-${nextH}:00`;
    }
    // Si format "H:MM-H:MM" ou "HH:MM-HH:MM"
    if (/^\d{1,2}:\d{2}-\d{1,2}:\d{2}$/.test(time)) {
        let [start, end] = time.split("-");
        let [h1, m1] = start.split(":");
        let [h2, m2] = end.split(":");
        h1 = h1.padStart(2, '0');
        h2 = h2.padStart(2, '0');
        return `${h1}:00-${h2}:00`;
    }

}

// Function to load calendar courses
async function loadCalendarCourses() {
    try {
        const conferences = await fetchCalendarCourses();
        
        // Reset the schedule
        courseSchedule = {};
        
        // Only process conferences that have valid data
        conferences.forEach(conf => {
            if (!conf.date || !conf.name) return;
            
            const dateObj = new Date(conf.date);
            if (isNaN(dateObj.getTime())) return;
            
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth();
            const day = dateObj.getDate();
            const key = `${year}-${month}`;
            
            if (!courseSchedule[key]) {
                courseSchedule[key] = [];
            }
            
            // Only add conferences with required data
            if (conf.name && conf.requested_by) {
                const courseData = {
                    day: day,
                    id: conf.id,
                    title: conf.name,
                    trainer: `${conf.requested_by.prenom} ${conf.requested_by.nom}`,
                    time: formatTime(conf.time),
                    type: conf.type,
                    date: conf.date,
                    department: conf.departement,
                };
                courseSchedule[key].push(courseData);
            }
        });
        
        console.log("Calendrier chargé:", courseSchedule);
        
        // Update the calendar with new data
        renderCalendar();
    } catch (error) {
        console.error("Erreur lors du chargement des cours du calendrier:", error);
        courseSchedule = {};
        renderCalendar();
    }
}


// --- Calendar state ---
let selectedDepartment = "Calendrier Général";

// --- Helper: get courses for a given month/year and department ---
function getCoursesForMonth(year, month, department) {
    const key = `${year}-${month}`;
    
    if (!courseSchedule[key]) {
        return [];
    }
    
    const filteredCourses = courseSchedule[key].filter(course => {
        const matchDep = (department === "Calendrier Général") ? true : course.department === department;
        const matchTime = timeSlots.includes(course.time);
        return matchDep && matchTime;
    });
    
    return filteredCourses;
}

// --- Render calendar dynamically ---
const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
        lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
        lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
        lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
    
    let liTag = "";
    for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }
    
    // Get all course days for this month and department
    const monthCourses = getCoursesForMonth(currYear, currMonth, selectedDepartment);
    const courseDays = monthCourses.map(c => new Date(c.date).getDate());
    
    for (let i = 1; i <= lastDateofMonth; i++) {
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? "active" : "";
        let isCourseDay = courseDays.includes(i) ? "courss" : "";
        liTag += `<li class="${isToday} ${isCourseDay}">${i}</li>`;
    }
    
    for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
    }
    
    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;
};

// --- Department button logic ---
document.querySelectorAll('.button-dep').forEach(btn => {
    btn.addEventListener('click', function() {
        // Remove style from all buttons
        document.querySelectorAll('.button-dep').forEach(b => {
            b.style.background = '';
            b.style.color = '';
            b.style.fontWeight = '';
        });
        // Style selected
        this.style.background = 'white';
        this.style.color = 'black';
        this.style.fontWeight = 'bold';
        selectedDepartment = this.getAttribute('data-department');
        // Update text above calendar
        const textChange = document.getElementById('text3');
        if (selectedDepartment === 'Calendrier Général') {
            textChange.textContent = 'Le calendrier général (tous les départements)';
        } else {
            textChange.textContent = `Le calendrier associé au département ${selectedDepartment}`;
        }
        renderCalendar();
        updateCalendarWithClickableCourseDays();
    });
});

// --- Update text above calendar on load ---
document.addEventListener('DOMContentLoaded', function() {
    // Load courses from backend
    loadCalendarCourses();
    
    // Style the default button
    const defaultBtn = document.querySelector('.button-dep[data-department="Calendrier Général"]');
    if (defaultBtn) {
        defaultBtn.style.background = 'white';
        defaultBtn.style.color = 'black';
        defaultBtn.style.fontWeight = 'bold';
    }
    // Set text
    const textChange = document.getElementById('text3');
    textChange.textContent = 'Le calendrier général (tous les départements)';
    
    // Render initial calendar
    renderCalendar();
    updateCalendarWithClickableCourseDays();
    
    // Add click event for calendar days
    document.querySelector('.calendar').addEventListener('click', function(e) {
        if (e.target.tagName === 'LI' && e.target.classList.contains('courss')) {
            const day = parseInt(e.target.textContent);
            showTimetableForDay(day);
        }
    });
    
    // Add event listeners for navigation
    prevNextIcon.forEach(icon => {
        icon.addEventListener("click", () => {
            currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;
            if(currMonth < 0 || currMonth > 11) {
                date = new Date(currYear, currMonth, new Date().getDate());
                currYear = date.getFullYear();
                currMonth = date.getMonth();
            } else {
                date = new Date();
            }
            renderCalendar();
            updateCalendarWithClickableCourseDays();
        });
    });
});

// --- Make course days clickable ---
function updateCalendarWithClickableCourseDays() {
    const dayElements = document.querySelectorAll('.calendar .days li');
    dayElements.forEach(day => {
        const dayNumber = parseInt(day.textContent);
        // If this day has courses
        const monthCourses = getCoursesForMonth(currYear, currMonth, selectedDepartment);
        const hasCourse = monthCourses.some(c => new Date(c.date).getDate() === dayNumber);
        if (hasCourse) {
            day.onclick = () => showTimetableForDay(dayNumber);
        } else {
            day.onclick = null;
        }
    });
}

// --- Show timetable for a specific day ---
function showTimetableForDay(day) {
    const currentMonth = months[currMonth];
    selectedDateElement.textContent = `${day} ${currentMonth} ${currYear}`;
    generateTimetableContent(day);
    timetableModal.style.display = 'block';
}

// --- Generate timetable content for a specific day ---
function generateTimetableContent(day) {
    timetable.innerHTML = '';
    // Get all courses for this day
    const dayCourses = getCoursesForMonth(currYear, currMonth, selectedDepartment)
        .filter(c => new Date(c.date).getDate() === day);
    // Create time slots
    timeSlots.forEach(timeSlot => {
        const course = dayCourses.find(course => course.time === timeSlot);
        const timeSlotElement = document.createElement('div');
        timeSlotElement.className = 'time-slot';
        const timeElement = document.createElement('div');
        timeElement.className = 'time';
        timeElement.textContent = timeSlot.replace('-', ' - ');
        const slotContentElement = document.createElement('div');
        slotContentElement.className = 'slot-content';
        if (course) {
            slotContentElement.className += ' course-slot';
            slotContentElement.setAttribute('data-course-id', course.id);
            const courseInfo = document.createElement('div');
            courseInfo.className = 'course-info';
            const courseTitle = document.createElement('h4');
            courseTitle.textContent = course.title;
            const courseTrainer = document.createElement('p');
            courseTrainer.textContent = `Formateur: ${course.trainer}`;
            const courseType = document.createElement('p');
            courseType.textContent = `Type: ${course.type === 'online' ? 'En ligne' : 'Présentiel'}`;
            const courseDepartment = document.createElement('p');
            courseDepartment.textContent = `Département: ${course.department}`;
            courseInfo.appendChild(courseTitle);
            courseInfo.appendChild(courseTrainer);
            courseInfo.appendChild(courseType);
            courseInfo.appendChild(courseDepartment);
            // Add actions (edit/delete)
            const courseActions = document.createElement('div');
            courseActions.className = 'course-actions';
            const editButton = document.createElement('button');
            editButton.className = 'edit-course-btn';
            editButton.innerHTML = '<i class="fas fa-edit"></i> Modifier';
            editButton.addEventListener('click', () => openEditCourseModal(course, day));
            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-course-btn';
            deleteButton.innerHTML = '<i class="fas fa-trash"></i> Supprimer';
            deleteButton.addEventListener('click', () => confirmDeleteCourse(course.id, day));
            courseActions.appendChild(editButton);
            courseActions.appendChild(deleteButton);
            slotContentElement.appendChild(courseInfo);
            slotContentElement.appendChild(courseActions);
        } else {
            slotContentElement.className += ' empty-slot';
            slotContentElement.textContent = timeSlot === '12:00-13:00' ? 'Pause déjeuner' : 'Disponible';
        }
        timeSlotElement.appendChild(timeElement);
        timeSlotElement.appendChild(slotContentElement);
        timetable.appendChild(timeSlotElement);
    });
}

// Function to open edit course modal
function openEditCourseModal(course, day, isNew = false) {
    courseIdInput.value = course.id;
    courseTitleInput.value = course.title;
    courseTrainerInput.value = course.trainer;
    courseTimeInput.value = course.time;
    courseTypeInput.value = course.type;
    
    // Store the day and isNew flag as data attributes
    editCourseForm.setAttribute('data-day', day || course.day);
    editCourseForm.setAttribute('data-is-new', isNew);
    
    // Show the modal
    editCourseModal.style.display = 'block';
}

// Function to save course
function saveCourse(event) {
    event.preventDefault();

    const courseId = parseInt(courseIdInput.value);
    const courseTitle = courseTitleInput.value;
    const courseTrainer = courseTrainerInput.value;
    const courseTime = courseTimeInput.value;
    const courseType = courseTypeInput.value;
    // Get the day from the course's original date
    const courseIndex = courses.findIndex(c => c.id === courseId);
    if (courseIndex === -1) return;
    const courseDay = new Date(courses[courseIndex].date).getDate();

    // Validate inputs
    if (!courseTitle || !courseTrainer) {
        alert('Veuillez remplir tous les champs obligatoires.');
        return;
    }

    // Update only the editable fields
    courses[courseIndex].title = courseTitle;
    courses[courseIndex].trainer = courseTrainer;
    courses[courseIndex].time = courseTime;
    courses[courseIndex].type = courseType;

    // Close the edit modal
    editCourseModal.style.display = 'none';

    // Refresh the timetable for the current day
    generateTimetableContent(courseDay);
}

// Function to confirm delete course
function confirmDeleteCourse(courseId, day) {
    const popup = document.getElementById('popup');
    
    // Position the popup in the center of the screen
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.zIndex = '10000'; // Ensure it's above other elements
    
    // Add overlay
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.style.display = 'block';
        overlay.style.zIndex = '9999';
    }
    
    popup.style.display = 'flex';
    
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    
    // Remove any existing event listeners
    const newConfirmBtn = confirmDeleteBtn.cloneNode(true);
    const newCancelBtn = cancelDeleteBtn.cloneNode(true);
    confirmDeleteBtn.parentNode.replaceChild(newConfirmBtn, confirmDeleteBtn);
    cancelDeleteBtn.parentNode.replaceChild(newCancelBtn, cancelDeleteBtn);
    
    newConfirmBtn.onclick = function() {
        deleteCourse(courseId, day);
        popup.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
    };
    
    newCancelBtn.onclick = function() {
        popup.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
    };

    // Close popup when clicking outside
    window.onclick = function(event) {
        if (event.target === overlay) {
            popup.style.display = 'none';
            if (overlay) overlay.style.display = 'none';
        }
    };
}

// Function to delete course
async function deleteCourse(courseId) {
    try {
        // Find the course by ID to get its details
        const course = Object.values(courseSchedule).flat().find(c => c.id === courseId);
        if (!course) {
            console.error("Course not found");
            alert("Le cours spécifié est introuvable.");
            return;
        }

        const courseName = encodeURIComponent(course.title); // Ensure the course name is URL-safe

        // Make the API call to delete the course
        const token = localStorage.getItem("token");
        const response = await fetch(`https://backend-m6sm.onrender.com/conferences/${courseName}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            console.error(`Failed to delete course: ${response.status} - ${response.statusText}`);
            alert("Erreur lors de la suppression du cours. Veuillez réessayer.");
            return;
        }

        // Remove the course from the local schedule
        const key = `${currYear}-${currMonth}`;
        if (courseSchedule[key]) {
            courseSchedule[key] = courseSchedule[key].filter(c => c.id !== courseId);
        }

        // Refresh the timetable and calendars
        const day = new Date(course.date).getDate(); // Extract the day from the course date
        generateTimetableContent(day);
        updateCalendars();

        alert("Cours supprimé avec succès.");
    } catch (error) {
        console.error("Erreur lors de la suppression du cours:", error);
        alert("Une erreur s'est produite lors de la suppression du cours. Veuillez vérifier votre connexion ou réessayer plus tard.");
    }
}

// Function to generate a unique ID for new courses
function generateUniqueId() {
    return Math.floor(Math.random() * 100000);
}

// Event listeners
// Close timetable modal when clicking on the X
closeTimetableBtn.addEventListener('click', () => {
    timetableModal.style.display = 'none';
});

// Close timetable modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target === timetableModal) {
        timetableModal.style.display = 'none';
    }
});

// Close edit course modal when clicking on the X
closeEditCourseBtn.addEventListener('click', () => {
    editCourseModal.style.display = 'none';
});

// Close edit course modal when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target === editCourseModal) {
        editCourseModal.style.display = 'none';
    }
});

// Cancel edit
cancelEditBtn.addEventListener('click', () => {
    editCourseModal.style.display = 'none';
});

// Update the event listener for the edit course form
editCourseForm.removeEventListener('submit', saveCourse);
editCourseForm.addEventListener('submit', saveCourse);

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

// Update the renderCalendar2 function to handle course days
const renderCalendar2 = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
    let liTag = "";
    for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }
    for (let i = 1; i <= lastDateofMonth; i++) {
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() 
                     && currYear === new Date().getFullYear() ? "active" : "";
        let isCourseDay = courseSchedule[i] ? "cours" : "";
        liTag += `<li class="${isToday} ${isCourseDay}">${i}</li>`;
    }
    for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
    }
    document.querySelector(".current-date2").innerText = `${months[currMonth]} ${currYear}`;
    document.querySelector(".days2").innerHTML = liTag;

    // Update the courses shown in the sidebar
    updateSidebarCourses();
}

// Function to update the courses shown in the sidebar
function updateSidebarCourses() {
    const sidebarCoursesContainer = document.querySelector(".sidebar2");
    const existingCourses = sidebarCoursesContainer.querySelectorAll(".cours-sidebar");
    
    // Remove existing course elements except the first two divs (profile and calendar)
    existingCourses.forEach(course => course.remove());

    // Get all courses for the current month
    const coursesForMonth = [];
    for (let day in courseSchedule) {
        courseSchedule[day].forEach(course => {
            coursesForMonth.push({
                day: parseInt(day),
                ...course
            });
        });
    }

    // Sort courses by day
    coursesForMonth.sort((a, b) => a.day - b.day);

    // Add courses to sidebar
    coursesForMonth.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.className = 'cours-sidebar';
        courseElement.innerHTML = `
            <img src="../assets/images/${course.type === 'online' ? 'logiciel-rh.webp' : 'rh2.jpg'}" class="rh-commun">
            <div class="infooo">
                <p class="date-cour2">${course.day} ${months[currMonth]} ${currYear}</p>
                <p class="nom-cour">${course.title}</p>
            </div>
        `;
        sidebarCoursesContainer.appendChild(courseElement);
    });
}

// Remove the empty updateSidebarCalendarWithClickableCourseDays function since we don't need it
function updateSidebarCalendarWithClickableCourseDays() {
    return;
}

// Initialize calendars
renderCalendar();
renderCalendar2();

// Add event listeners for the main calendar navigation
prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;
        if(currMonth < 0 || currMonth > 11) {
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        } else {
            date = new Date();
        }
        renderCalendar();
        renderCalendar2();
        updateCalendarWithClickableCourseDays();
    });
});

// Add event listeners for the sidebar calendar navigation
document.querySelectorAll(".icons2 span").forEach(icon => {
    icon.addEventListener("click", () => {
        currMonth = icon.id === "prev2" ? currMonth - 1 : currMonth + 1;
        if(currMonth < 0 || currMonth > 11) {
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        } else {
            date = new Date();
        }
        renderCalendar();
        renderCalendar2();
        updateCalendarWithClickableCourseDays();
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

const departmentButtons = document.querySelectorAll(".button"); // Fix variable name
const textChange = document.getElementById('text3'); // Ensure element exists

departmentButtons.forEach(button => { // Use the correct variable
  button.addEventListener('click', () => {
    const department = button.getAttribute('data-department'); // Get department name
    textChange.textContent = `le calendrier associé aux ${department} Departement`;
  });
});

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

newConfirmBtn.onclick = function() {
    deleteCourse(courseId, day); // Call the updated deleteCourse function
    popup.style.display = 'none';
    if (overlay) overlay.style.display = 'none';
};

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
    
// Update both calendars when a course is added, edited, or deleted
function updateCalendars() {
    renderCalendar();
    renderCalendar2();
    updateCalendarWithClickableCourseDays();
}

// Modify the saveCourse function to update both calendars
const originalSaveCourse = saveCourse;
saveCourse = function(event) {
    originalSaveCourse.call(this, event);
    updateCalendars();
};

// Modify the deleteCourse function to update both calendars
const originalDeleteCourse = deleteCourse;
deleteCourse = function(courseId, day) {
    originalDeleteCourse.call(this, courseId, day);
    updateCalendars();
};

// Add event listener for DOM content loaded to initialize both calendars
document.addEventListener('DOMContentLoaded', function() {
    renderCalendar();
    renderCalendar2();
    updateCalendarWithClickableCourseDays();
});

// Add CSS styles for the popup
const style = document.createElement('style');
style.textContent = `
    #popup {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        display: none;
    }

    #popup .popup-content {
        text-align: center;
    }

    #popup .popup-content p {
        margin-bottom: 20px;
        font-size: 16px;
        color: #333;
    }

    #popup button {
        margin: 0 10px;
        padding: 8px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.3s;
    }

    #popup #confirm-delete {
        background-color: #dc3545;
        color: white;
    }

    #popup #confirm-delete:hover {
        background-color: #c82333;
    }

    #popup #cancel-delete {
        background-color: #6c757d;
        color: white;
    }

    #popup #cancel-delete:hover {
        background-color: #5a6268;
    }

    #overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        display: none;
    }
`;
document.head.appendChild(style);
    



document.addEventListener("DOMContentLoaded", function () {
    const icon = document.querySelector("i.fa-users");
    const dot = icon ? icon.querySelector(".notification-dot") : null;

    const hasPending = localStorage.getItem("hasPendingAccountRequests") === "true";

    if (dot) {
        dot.style.display = hasPending ? "block" : "none";
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour récupérer les demandes depuis localStorage
    function getRequestsFromStorage() {
        const stored = localStorage.getItem('formationRequests');
        return stored ? JSON.parse(stored) : {};
    }

    // Fonction pour vérifier s'il y a des demandes de formation
    function checkFormationRequests() {
        const notificationDot = document.getElementById('formationNotificationDot');
        const requests = getRequestsFromStorage();
        
        // Vérifie si au moins un département a des demandes
        const hasRequests = Object.values(requests).some(count => count > 0);
        
        // Affiche ou cache la notification en fonction des demandes
        if (notificationDot) {
            notificationDot.style.display = hasRequests ? 'block' : 'none';
        }
    }

    // Vérifie les demandes au chargement de la page
    checkFormationRequests();

    // Vérifie périodiquement les nouvelles demandes
    setInterval(checkFormationRequests, 1000);
});