







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

// Course schedule data - this could be loaded from a database in a real application
const courseSchedule = {
    // Day 3 courses
    "3": [
        {
            id: 1,
            title: "Droit du travail et relations professionnelles",
            trainer: "Amani Amel",
            time: "09:00-10:00",
            type: "online"
        }
    ],
    // Day 22 courses
    "22": [
        {
            id: 2,
            title: "Recrutement et sélection des talents",
            trainer: "Hamadi Ali",
            time: "14:00-15:00",
            type: "in-person"
        }
    ]
};

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

// --- Dynamic courses data (simulate backend or fetch from API) ---
const courses = [
    { id: 1, title: "Droit du travail et relations professionnelles", trainer: "Amani Amel", time: "09:00-10:00", type: "online", department: "RH", date: "2025-03-03" },
    { id: 2, title: "Recrutement et sélection des talents", trainer: "Hamadi Ali", time: "14:00-15:00", type: "in-person", department: "RH", date: "2025-03-22" },
    { id: 3, title: "Mastering React & Next.js", trainer: "M.hacene", time: "10:00-11:00", type: "online", department: "Information Technology", date: "2025-03-10" },
    { id: 4, title: "Front-end Development", trainer: "M. Bazouzi", time: "13:00-14:00", type: "in-person", department: "Information Technology", date: "2025-03-15" },
    { id: 5, title: "Marketing Digital", trainer: "Mme Martin", time: "11:00-12:00", type: "online", department: "Marketing", date: "2025-03-10" },
    { id: 6, title: "Stratégie de Contenu", trainer: "M. Dupont", time: "15:00-16:00", type: "in-person", department: "Marketing", date: "2025-03-18" },
    { id: 7, title: "Cloud Networking", trainer: "M. Lefebvre", time: "09:00-10:00", type: "online", department: "Network", date: "2025-03-10" },
    { id: 8, title: "Sécurité des Réseaux", trainer: "Mme Benali", time: "16:00-17:00", type: "in-person", department: "Network", date: "2025-03-22" },
    { id: 9, title: "Comptabilité Avancée", trainer: "M. Mohamed", time: "10:00-11:00", type: "online", department: "Finance & Accounting", date: "2025-03-18" },
    { id: 10, title: "Audit Interne", trainer: "Mme Nessrin", time: "14:00-15:00", type: "in-person", department: "Quality & Internal Control", date: "2025-03-15" },
    // ... add more courses as needed
];

// --- Calendar state ---
let selectedDepartment = "Calendrier Général";

// --- Helper: get courses for a given month/year and department ---
function getCoursesForMonth(year, month, department) {
    // month: 0-based (0=Jan)
    return courses.filter(course => {
        const d = new Date(course.date);
        const matchMonth = d.getFullYear() === year && d.getMonth() === month;
        const matchDep = (department === "Calendrier Général") ? true : course.department === department;
        // Only include courses with a valid time slot
        return matchMonth && matchDep && timeSlots.includes(course.time);
    });
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
        this.style.background = 'gray';
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
    // Style the default button
    const defaultBtn = document.querySelector('.button-dep[data-department="Calendrier Général"]');
    if (defaultBtn) {
        defaultBtn.style.background = 'gray';
        defaultBtn.style.color = 'black';
        defaultBtn.style.fontWeight = 'bold';
    }
    // Set text
    const textChange = document.getElementById('text3');
    textChange.textContent = 'Le calendrier général (tous les départements)';
    renderCalendar();
    updateCalendarWithClickableCourseDays();
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
    let dayCourses;
    if (selectedDepartment === "Calendrier Général") {
        // All departments
        dayCourses = courses.filter(c => {
            const d = new Date(c.date);
            return d.getFullYear() === currYear && d.getMonth() === currMonth && d.getDate() === day;
        });
    } else {
        // Only selected department
        dayCourses = courses.filter(c => {
            const d = new Date(c.date);
            return d.getFullYear() === currYear && d.getMonth() === currMonth && d.getDate() === day && c.department === selectedDepartment;
        });
    }
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
function deleteCourse(courseId, day) {
    // Find the course index
    const courseIndex = courseSchedule[day].findIndex(course => course.id === courseId);
    
    if (courseIndex !== -1) {
        // Remove the course
        courseSchedule[day].splice(courseIndex, 1);
        
        // If this was the last course for the day, remove the day entry
        if (courseSchedule[day].length === 0) {
            delete courseSchedule[day];
        }
        
        // Refresh the timetable
        generateTimetableContent(day);
        
        // Re-render the calendar to update course days
        renderCalendar();
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

// Initialize clickable course days
document.addEventListener('DOMContentLoaded', function() {
    renderCalendar(); // First render the calendar
    updateCalendarWithClickableCourseDays(); // Then make course days clickable
    
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