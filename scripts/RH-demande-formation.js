function toggleNav() {
  document.getElementById("sidebar").classList.toggle("active"); // Ajouter ou supprimer la classe active
}

// Code de débogage pour vérifier le chargement des éléments
console.log("Script RH-demande-formation.js chargé");

window.addEventListener('load', function() {
  console.log("Page entièrement chargée, y compris toutes les ressources");
  console.log("Bouton Traiter :", document.getElementById('traiterBtn'));
  console.log("Container texte :", document.querySelector('.text-container'));
  console.log("Section calendrier :", document.querySelector('.calendar-section'));
});

// calendar


// fin calendar

// demande swips

const allDemandes = {
  "IT": [
    {
      title: "Demande 1",
      department: "Département IT",
      professor: "Azouzi Alaa",
      course: "Dev web using python",
      date: "17/02/2025",
      type: "Enligne",
      hour: "14:00-15:00",
      description: "Formation sur le développement web avec Python, couvrant les frameworks Django et Flask, ainsi que les principes de base du développement back-end.",
      meetingLink: "https://meet.google.com/abc-defg-hij",
      image: "../assets/images/python.png"
    },
    {
      title: "Demande 2",
      department: "Département IT",
      professor: "Houda G.",
      course: "Cybersécurité",
      date: "21/03/2025",
      type: "Présentiel",
      hour: "10:00-11:00",
      description: "Formation approfondie sur les principes de la cybersécurité, incluant la détection des menaces, la protection des données et les meilleures pratiques de sécurité.",
      meetingLink: "",
      image: "../assets/images/auth.png"
    }
  ],
  "Marketing": [
    {
      title: "Demande 1",
      department: "Département Marketing",
      professor: "Sana Khelifi",
      course: "Stratégie digitale",
      date: "22/03/2025",
      type: "Présentiel",
      hour: "09:00-10:00",
      description: "Formation sur les stratégies marketing digitales, incluant les réseaux sociaux, le SEO/SEM, et l'analyse de données marketing.",
      meetingLink: "",
      image: "../assets/images/uxui.png"
    }
  ],
  "RH": [
    {
      title: "Demande 1",
      department: "Département RH",
      professor: "Mohamed Ali",
      course: "Gestion des talents",
      date: "10/03/2025",
      type: "Enligne",
      hour: "13:00-14:00",
      description: "Formation sur les techniques modernes de gestion des talents, incluant le recrutement, la rétention et le développement professionnel.",
      meetingLink: "https://meet.google.com/xyz-abcd-efg",
      image: "../assets/images/rh2.jpg"
    }
  ]
  
  // Add other departments as needed
};





// number of demande
 // Ensure badges are updated on page load
 // Updated variables for tracking the current department and index
let selectedDepartment = "IT"; // Initial department
let selectedDemandeIndex = 0; // Initial demande index

// This object counts the number of demandes for each department


// Update the badge for each department button
function updateBadges() {
  const departmentRequestCount = {};

  // Dynamically count demandes for each department in the allDemandes object
  Object.keys(allDemandes).forEach(department => {
    departmentRequestCount[department] = allDemandes[department].length;
  });

  const buttons = document.querySelectorAll('.dept-btn');
  buttons.forEach(button => {
    const dept = button.getAttribute('data-dept');
    const badge = button.querySelector('.badge');
    const count = departmentRequestCount[dept];
    badge.textContent = count > 0 ? count : '';
    badge.style.display = count > 0 ? 'inline' : 'none';
  });
}

// Update the displayed demande based on the selected department and index
function updateDemande() {
  const demandes = allDemandes[selectedDepartment];
  if (demandes && demandes.length > 0) {
    const demande = demandes[selectedDemandeIndex];
    document.getElementById("demandeTitle").innerText = demande.title;
    document.getElementById("department").innerText = demande.department;
    document.getElementById("prof").innerText = demande.professor;
    document.getElementById("course").innerText = demande.course;
    document.getElementById("date").innerText = demande.date;
    document.getElementById("type").innerText = demande.type;
    
    // Added for hour field
    document.getElementById("hour").innerText = demande.hour || "N/A";
    
    // Added for description field
    document.getElementById("description").innerText = demande.description || "Aucune description disponible";
    
    // Added for image
    const imageElement = document.getElementById("formationImage");
    if (demande.image) {
      imageElement.src = demande.image;
      imageElement.alt = `Image ${demande.course}`;
      imageElement.style.opacity = "1"; // Full opacity
      imageElement.style.filter = "none"; // No filters
    } else {
      imageElement.src = "../assets/images/placeholder.png";
      imageElement.alt = "Image placeholder";
      imageElement.style.opacity = "0.8"; // Slightly reduced opacity
      imageElement.style.filter = "none"; // No filters
    }
    
    // Added for meeting link
    const meetingLinkContainer = document.getElementById("meetingLinkContainer");
    const meetingLinkElement = document.getElementById("meetingLink");
    
    if (demande.type === "Enligne" && demande.meetingLink) {
      meetingLinkElement.innerHTML = `<a href="${demande.meetingLink}" target="_blank">${demande.meetingLink}</a>`;
      meetingLinkContainer.style.display = "block";
    } else {
      meetingLinkElement.innerText = "N/A";
      meetingLinkContainer.style.display = demande.type === "Enligne" ? "block" : "none";
    }
  } else {
    // If there are no demandes for the selected department
    document.getElementById("demandeTitle").innerText = "Aucune demande";
    document.getElementById("department").innerText = selectedDepartment;
    document.getElementById("prof").innerText = "-";
    document.getElementById("course").innerText = "-";
    document.getElementById("date").innerText = "-";
    document.getElementById("type").innerText = "-";
    document.getElementById("hour").innerText = "-";
    document.getElementById("description").innerText = "-";
    document.getElementById("meetingLink").innerText = "-";
    document.getElementById("meetingLinkContainer").style.display = "none";
    
    // Better handling for empty image
    const imageElement = document.getElementById("formationImage");
    imageElement.src = "../assets/images/no-demands.png"; // Use a specific "no demands" image
    imageElement.alt = "Pas de demande";
    imageElement.style.opacity = "0.5"; // Make it slightly transparent
    imageElement.style.filter = "grayscale(100%)"; // Make it grayscale
  }
}

// Handle the next and previous buttons for demande navigation
document.getElementById("nextBtn").addEventListener("click", () => {
  const demandes = allDemandes[selectedDepartment];
  selectedDemandeIndex = (selectedDemandeIndex + 1) % demandes.length;
  updateDemande();
});

document.getElementById("prevBtn").addEventListener("click", () => {
  const demandes = allDemandes[selectedDepartment];
  selectedDemandeIndex = (selectedDemandeIndex - 1 + demandes.length) % demandes.length;
  updateDemande();
});

// Handle department button clicks
document.querySelectorAll(".departments button").forEach(btn => {
  btn.addEventListener("click", () => {
    const selectedDept = btn.getAttribute('data-dept');
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    const traiterBtn = document.getElementById("traiterBtn");
    
    if (allDemandes[selectedDept] && allDemandes[selectedDept].length > 0) {
      selectedDepartment = selectedDept;
      selectedDemandeIndex = 0; // Reset to first demande
      
      // Restore navigation buttons when demands exist
      if (nextBtn) nextBtn.style.opacity = "1";
      if (prevBtn) prevBtn.style.opacity = "1";
      
      // Show Traiter button for departments with demands
      if (traiterBtn) {
        traiterBtn.style.display = "block";
        traiterBtn.disabled = false;
      }
      
      updateDemande(); // Update the demande display
    } else {
      // If no demandes exist for the selected department
      selectedDepartment = selectedDept; // Still update the selected department
      document.getElementById("demandeTitle").innerText = "Aucune demande";
      document.getElementById("department").innerText = selectedDept;
      document.getElementById("prof").innerText = "-";
      document.getElementById("course").innerText = "-";
      document.getElementById("date").innerText = "-";
      document.getElementById("type").innerText = "-";
      document.getElementById("hour").innerText = "-";
      document.getElementById("description").innerText = "-";
      document.getElementById("meetingLink").innerText = "-";
      document.getElementById("meetingLinkContainer").style.display = "none";
      
      // Better handling for empty image display
      const imageElement = document.getElementById("formationImage");
      imageElement.src = "../assets/images/no-demands.png"; // Use a specific "no demands" image if available
      imageElement.alt = "Pas de demande";
      imageElement.style.opacity = "0.5"; // Make it slightly transparent
      imageElement.style.filter = "grayscale(100%)"; // Make it grayscale
      
      // Disable navigation buttons when no demands
      if (nextBtn) nextBtn.style.opacity = "0.5";
      if (prevBtn) prevBtn.style.opacity = "0.5";
      
      // Hide Traiter button for departments without demands
      if (traiterBtn) {
        traiterBtn.style.display = "none";
        traiterBtn.disabled = true;
      }
      
      // Hide calendar sections if they're visible
      const textContainer = document.querySelector('.text-container');
      const calendarSection = document.querySelector('.calendar-section');
      if (textContainer) textContainer.classList.add('hidden-section');
      if (calendarSection) calendarSection.classList.add('hidden-section');
    }
  });
});

// Initial render
updateDemande();
updateBadges(); // Ensure badges are updated when the page loads

// Initial Traiter button state
const initialTraiterBtn = document.getElementById("traiterBtn");
if (initialTraiterBtn) {
  if (allDemandes[selectedDepartment] && allDemandes[selectedDepartment].length > 0) {
    initialTraiterBtn.style.display = "block";
    initialTraiterBtn.disabled = false;
  } else {
    initialTraiterBtn.style.display = "none";
    initialTraiterBtn.disabled = true;
  }
}

// Add event listener for the "Traiter" button
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM content loaded, setting up event listeners...");
  
  // Traiter button setup
  const traiterBtn = document.getElementById('traiterBtn');
  if (traiterBtn) {
    console.log("Found Traiter button by ID, adding event listener");
    traiterBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log("Traiter button clicked!");
      
      // Get current demande information
      const currentDemande = allDemandes[selectedDepartment][selectedDemandeIndex];
      const { date } = currentDemande;
      
      // Parse the date (format: DD/MM/YYYY)
      const [day, month, year] = date.split('/').map(Number);
      
      // Show the sections
      const textContainer = document.querySelector('.text-container');
      const calendarSection = document.querySelector('.calendar-section');
      
      if (textContainer && calendarSection) {
        textContainer.classList.remove('hidden-section');
        calendarSection.classList.remove('hidden-section');
        textContainer.style.display = 'block';
        calendarSection.style.display = 'flex';
        
        // Update calendar to show the correct month/year
        currMonth = month - 1; // Months are 0-based in JavaScript
        currYear = year;
        
        // Render calendar
        renderCalendar();
        
        // Find and select the specific day
        setTimeout(() => {
          const dayElements = document.querySelectorAll('.days li:not(.inactive)');
          dayElements.forEach(dayElement => {
            const dayNum = parseInt(dayElement.textContent);
            if (dayNum === day) {
              // Clear previous selections
              document.querySelectorAll('.days li').forEach(d => d.classList.remove('selected'));
              
              // Select this day
              dayElement.classList.add('selected');
              selectedDay = dayElement;
              
              // Show schedule for this day
              showScheduleForDay(day, month, year);
              
              // Scroll the day into view
              dayElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          });
        }, 100);
        
        // Scroll calendar section into view
        calendarSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  } else {
    console.error("Traiter button with ID 'traiterBtn' not found!");
  }
});

// Function to toggle the visibility of calendar and text sections
function toggleSections() {
  console.log("toggleSections called");
  const textContainer = document.querySelector('.text-container');
  const calendarSection = document.querySelector('.calendar-section');
  
  if (!textContainer || !calendarSection) {
    console.error("Cannot find sections to toggle");
    return;
  }

  // Update data and display sections
  try {
    // Update the data for the current demand
    updateDemande();
    console.log("Demand data updated");

    // Use the new showSections function if it exists
    if (typeof showSections === 'function') {
      console.log("Using showSections function");
      showSections();
    } else {
      console.log("No showSections function found - using fallback method");
      // Fallback - manually show sections
      textContainer.classList.remove('hidden-section');
      calendarSection.classList.remove('hidden-section');
      
      // Ensure proper display properties
      textContainer.style.display = 'block';
      calendarSection.style.display = 'flex';
      textContainer.style.visibility = 'visible';
      calendarSection.style.visibility = 'visible';
      
      // Scroll to the text container
      textContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Update calendar information if the function exists
    if (typeof updateCalendarInfo === 'function') {
      console.log("Updating calendar information");
      updateCalendarInfo();
    } else {
      console.log("No updateCalendarInfo function found");
    }
  } catch (error) {
    console.error("Error in toggleSections:", error);
  }
}

// Function to get courses for a specific day from all departments
function getCoursesForDay(day, month, year) {
  let allCourses = [];
  
  // Iterate through all departments
  Object.keys(departmentCalendars).forEach(dept => {
    const departmentData = departmentCalendars[dept] || [];
    const dateData = departmentData.find(data => 
      data.day === day && 
      data.month === month && 
      data.year === year
    );
    
    if (dateData && dateData.courses) {
      // Add department info to each course
      const coursesWithDept = dateData.courses.map(course => ({
        ...course,
        department: dept
      }));
      allCourses = allCourses.concat(coursesWithDept);
    }
  });
  
  return allCourses;
}

// Function to show course schedule for a specific day
function showScheduleForDay(day, month, year) {
  let scheduleDisplay = document.getElementById('daySchedule');
  if (!scheduleDisplay) {
    scheduleDisplay = document.createElement('div');
    scheduleDisplay.id = 'daySchedule';
    scheduleDisplay.className = 'day-schedule';
    document.querySelector('.calendar-S').appendChild(scheduleDisplay);
  }
  
  // Show loading indicator
  scheduleDisplay.innerHTML = `
    <div class="schedule-header">
      <h4>Chargement des cours pour le ${day}/${month}/${year}...</h4>
      <div class="loading-spinner"></div>
    </div>
  `;
  scheduleDisplay.style.display = 'block';
  
  // Get all courses from all departments
  const allCourses = getCoursesForDay(day, month, year);
  
  // Get the current demande
  const currentDemande = allDemandes[selectedDepartment][selectedDemandeIndex];
  const requestedTime = currentDemande.hour;
  
  // Build the HTML for the schedule
  let scheduleHTML = `
    <div class="schedule-header">
      <h4>Cours programmés le ${day}/${month}/${year} - Tous les départements</h4>
      <p>Heure demandée: <strong>${requestedTime}</strong> (${selectedDepartment})</p>
    </div>
    <div class="schedule-content">
  `;
  
  if (allCourses.length === 0) {
    scheduleHTML += '<p>Aucun cours programmé pour cette journée.</p>';
  } else {
    scheduleHTML += '<ul class="schedule-list">';
    let conflict = false;
    
    // Sort courses by time
    allCourses.sort((a, b) => {
      const timeA = a.time.split('-')[0];
      const timeB = b.time.split('-')[0];
      return timeA.localeCompare(timeB);
    });
    
    allCourses.forEach(course => {
      const isConflict = isTimeConflict(requestedTime, course.time);
      if (isConflict) conflict = true;
      
      scheduleHTML += `
        <li class="${isConflict ? 'time-conflict' : ''}">
          <span class="course-time">${course.time}</span>
          <span class="course-title">${course.title}</span>
          <span class="course-dept">${course.department}</span>
          ${isConflict ? '<span class="conflict-icon">⚠️</span>' : ''}
        </li>
      `;
    });
    
    scheduleHTML += '</ul>';
    
    if (conflict) {
      scheduleHTML += `
        <div class="conflict-warning">
          <p>⚠️ Il y a un conflit d'horaire avec la demande actuelle.</p>
          <p>L'horaire demandé (${requestedTime}) est en conflit avec un ou plusieurs cours existants.</p>
        </div>
      `;
    } else {
      scheduleHTML += `
        <div class="no-conflict">
          <p>✅ L'horaire demandé est disponible dans tous les départements.</p>
          <p>Aucun conflit détecté pour ${requestedTime}.</p>
        </div>
      `;
    }
  }
  
  scheduleHTML += '</div>';
  scheduleDisplay.innerHTML = scheduleHTML;
}

// Function to check if two time ranges overlap
function isTimeConflict(time1, time2) {
  // Parse times in format "HH:MM-HH:MM"
  const [start1, end1] = time1.split('-').map(t => {
    const [hours, minutes] = t.split(':').map(num => parseInt(num, 10));
    return hours * 60 + minutes; // Convert to minutes for easier comparison
  });
  
  const [start2, end2] = time2.split('-').map(t => {
    const [hours, minutes] = t.split(':').map(num => parseInt(num, 10));
    return hours * 60 + minutes;
  });
  
  // Check for overlap
  return (start1 < end2 && start2 < end1);
}

// to show the message section
const messageBtn = document.getElementById('messageBtn');
const messageSection = document.querySelector('.message-section');

// When the Message button is clicked, toggle the visibility of the message section
if (messageBtn) {
messageBtn.addEventListener('click', () => {
  // Toggle the display of the message section
  if (messageSection.style.display === 'none' || messageSection.style.display === '') {
    messageSection.style.display = 'block';
  } else {
    messageSection.style.display = 'none';
  }
});
}

// to show the message section from calendar view
const messageBtn2 = document.getElementById('messagebtn2');

if (messageBtn2) {
messageBtn2.addEventListener('click', () => {
  if (messageSection.style.display === 'none' || messageSection.style.display === '') {
    messageSection.style.display = 'block';
  } else {
    messageSection.style.display = 'none';
  }
});
}

// Keep the departmentCalendars data structure
const departmentCalendars = {
  "IT": [
    { day: 10, month: 2, year: 2025, courses: [
      { title: "Introduction à JavaScript", time: "09:00-10:00" },
      { title: "Cloud Computing Basics", time: "14:00-15:00" }
    ]},
    { day: 15, month: 2, year: 2025, courses: [
      { title: "Développement Web", time: "10:00-11:00" }
    ]},
    { day: 22, month: 3, year: 2025, courses: [
      { title: "Sécurité des Applications", time: "11:00-12:00" }
    ]}
  ],
  "Marketing": [
    { day: 18, month: 2, year: 2025, courses: [
      { title: "Stratégies de Contenu", time: "09:00-10:00" }
    ]},
    { day: 5, month: 3, year: 2025, courses: [
      { title: "Réseaux Sociaux Avancés", time: "13:00-14:00" }
    ]}
  ],
  "RH": [
    { day: 20, month: 2, year: 2025, courses: [
      { title: "Gestion de Carrière", time: "10:00-11:00" }
    ]},
    { day: 12, month: 3, year: 2025, courses: [
      { title: "Développement de Leadership", time: "15:00-16:00" }
    ]}
  ]
};

// Fonction pour vérifier si un jour a des cours programmés
function hasCourses(day, month, year) {
  // Check all departments for courses on this day
  return Object.keys(departmentCalendars).some(dept => {
    const departmentData = departmentCalendars[dept] || [];
    return departmentData.some(dateData => 
      dateData.day === day && 
      dateData.month === month && 
      dateData.year === year &&
      dateData.courses.length > 0
    );
  });
}

// Variables needed for calendar functionality
const addDayBtn = document.getElementById("addDayBtn");
let selectedDay = null;

// Array of month names for calendar
const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

// Current date for calendar initialization
let date = new Date();
let currYear = date.getFullYear();
let currMonth = date.getMonth();

// Function to render the calendar with proper month display and navigation
const renderCalendar = () => {
  const daysContainer = document.querySelector(".days");
  const currentDateElement = document.querySelector(".current-date");
  
  if (!daysContainer || !currentDateElement) {
    console.error("Calendar elements not found");
    return;
  }
  
  // Calculate first day, last date, and last day of the month
  let firstDayOfMonth = new Date(currYear, currMonth, 1).getDay();
  // Handle Sunday (0 in JavaScript) as day 7 for easier calculation
  firstDayOfMonth = firstDayOfMonth === 0 ? 7 : firstDayOfMonth;
  
  let lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
  let lastDayOfMonth = new Date(currYear, currMonth, lastDateOfMonth).getDay();
  // Convert Sunday (0) to 7 for consistency
  lastDayOfMonth = lastDayOfMonth === 0 ? 7 : lastDayOfMonth;
  
  let lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate();
  
let liTag = "";

  // Previous month's days
  for (let i = firstDayOfMonth - 1; i > 0; i--) {
    liTag += `<li class="inactive">${lastDateOfLastMonth - i + 1}</li>`;
  }

  // Current month's days
  for (let i = 1; i <= lastDateOfMonth; i++) {
    // Check if the current day is today
    let isToday = i === date.getDate() && currMonth === new Date().getMonth() 
                 && currYear === new Date().getFullYear() ? "active" : "";
    
    // Check if this day has courses scheduled
    const hasScheduledCourses = hasCourses(i, currMonth + 1, currYear);
    const courseClass = hasScheduledCourses ? "has-courses" : "";
    
    // Add data-day attribute to track the day
    liTag += `<li class="${isToday} ${courseClass}" data-day="${i}">${i}</li>`;
  }

  // Next month's days
  let nextDays = 7 - lastDayOfMonth;
  if (nextDays < 7) {
    for (let i = 1; i <= nextDays; i++) {
      liTag += `<li class="inactive">${i}</li>`;
    }
  }

  // Update the displayed month and year
  currentDateElement.innerText = `${months[currMonth]} ${currYear}`;
  daysContainer.innerHTML = liTag;

  // Add click event listeners to each day
document.querySelectorAll(".days li").forEach(day => {
        if (!day.classList.contains("inactive")) {
      day.addEventListener("click", () => {
        // Clear selection from previous day
        document.querySelectorAll(".days li.selected").forEach(selectedDay => {
          selectedDay.classList.remove("selected");
        });
        
        // Mark this day as selected
            day.classList.add("selected");
        selectedDay = day;
        
        // Show schedule for the selected day
        const selectedDayNum = parseInt(day.getAttribute("data-day"));
        showScheduleForDay(selectedDayNum, currMonth + 1, currYear);
      });
    }
});
};

// Event listeners for previous and next month buttons
document.querySelectorAll(".icons span").forEach(icon => {
icon.addEventListener("click", () => {
    // Update month and year based on which button was clicked
    if (icon.id === "prev") {
      currMonth--;
      if (currMonth < 0) {
        currMonth = 11;  // December
        currYear--;      // Previous year
      }
    } else if (icon.id === "next") {
      currMonth++;
      if (currMonth > 11) {
        currMonth = 0;   // January
        currYear++;      // Next year
      }
    }
    
    // Create a new date object to update the calendar correctly
    date = new Date(currYear, currMonth, 1);
    
    // Update the calendar with the new month
    renderCalendar();
});
});

// Initial calendar render when page loads
document.addEventListener("DOMContentLoaded", () => {
  renderCalendar();
});

// Add event listener for the addDayBtn
addDayBtn.addEventListener("click", () => {
if (selectedDay) {
    const selectedDayNum = parseInt(selectedDay.getAttribute("data-day"));
    const selectedTime = document.getElementById("courseTime").value;
    const department = getCurrentDepartment();
   
    // Check if there are conflicts with existing courses
    const hasConflict = checkTimeConflict(selectedDayNum, currMonth + 1, currYear, selectedTime);
  
    if (hasConflict) {
      const confirmAdd = confirm("Il y a déjà un cours à ce créneau horaire. Voulez-vous quand même ajouter cette formation?");
      if (!confirmAdd) return;
    }

    // Add the course to the calendar for the selected department
    addCourseToCalendar(department, selectedDayNum, currMonth + 1, currYear, selectedTime);

    // Highlight the selected day to show it has courses
    selectedDay.classList.add("has-courses");
} else {
    alert("Veuillez sélectionner un jour d'abord!");
}
});

// Function to clear demand display
function clearDemandeDisplay() {
  // Clear all text fields
  document.getElementById("demandeTitle").innerText = "Aucune demande";
  document.getElementById("department").innerText = "-";
  document.getElementById("prof").innerText = "-";
  document.getElementById("course").innerText = "-";
  document.getElementById("date").innerText = "-";
  document.getElementById("type").innerText = "-";
  document.getElementById("hour").innerText = "-";
  document.getElementById("description").innerText = "-";
  
  // Clear meeting link if it exists
  const meetingLinkElement = document.getElementById("meetingLink");
  if (meetingLinkElement) {
    meetingLinkElement.innerText = "-";
  }
  const meetingLinkContainer = document.getElementById("meetingLinkContainer");
  if (meetingLinkContainer) {
    meetingLinkContainer.style.display = "none";
  }
  
  // Reset image to placeholder or hide it
  const imageElement = document.getElementById("formationImage");
  if (imageElement) {
    imageElement.src = "../assets/images/no-demands.png";
    imageElement.alt = "Pas de demande";
    imageElement.style.opacity = "0.5";
    imageElement.style.filter = "grayscale(100%)";
  }
}

// Deleting demands functionality
function deleteDemande() {
  // Get the current department and demand index
  const demandeToDelete = allDemandes[selectedDepartment][selectedDemandeIndex];
  
  // Remove the demand from the array
  allDemandes[selectedDepartment].splice(selectedDemandeIndex, 1);
  
  // Update badges to reflect the deletion
  updateBadges();
  
  // Clear the display
  clearDemandeDisplay();
  
  // If there are remaining demands in this department
  if (allDemandes[selectedDepartment].length > 0) {
    // If we deleted the last demand in the list, move to the previous one
    if (selectedDemandeIndex >= allDemandes[selectedDepartment].length) {
      selectedDemandeIndex = allDemandes[selectedDepartment].length - 1;
    }
    updateDemande();
  }

  // Hide the calendar and text sections
  const textContainer = document.querySelector('.text-container');
  const calendarSection = document.querySelector('.calendar-section');
  if (textContainer) textContainer.classList.add('hidden-section');
  if (calendarSection) calendarSection.classList.add('hidden-section');
  
  // Hide message section if it exists
  const messageSection = document.querySelector('.message-section');
  if (messageSection) {
    messageSection.style.display = 'none';
  }
}

// Handle the "Envoyer" button in the message section to delete demand after sending message
document.querySelector('.message-section .Ajoute-button').addEventListener('click', function() {
  const messageText = document.querySelector('.message-section textarea').value;
  
  if (messageText.trim() === '') {
    alert("Veuillez entrer un message avant d'envoyer.");
    return;
  }
  
  alert("Message envoyé au professeur!");
  document.querySelector('.message-section textarea').value = '';
  
  // Delete the demand after sending the message
  deleteDemande();
});

// Handle the Annuler buttons to hide calendar view without deletion
document.querySelectorAll('.Annuler-button').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelector('.text-container').classList.add('hidden-section');
    document.querySelector('.calendar-section').classList.add('hidden-section');
    document.querySelector('.message-section').style.display = 'none';
  });
});

// Course schedule data structure to track courses for each department
const departmentCourses = {
  "IT": {},
  "Marketing": {},
  "RH": {},
  // Add other departments as needed
};

// Function to check if a time slot is available
function isTimeSlotAvailable(department, date, time) {
  const [day, month, year] = date.split('/').map(Number);
  const departmentSchedule = departmentCourses[department];
  
  // Create a key for the specific date
  const dateKey = `${day}-${month}-${year}`;
  
  if (!departmentSchedule[dateKey]) {
    return true; // No courses on this date
  }

  const [startTime, endTime] = time.split('-').map(t => {
    const [hours, minutes] = t.split(':').map(Number);
    return hours * 60 + minutes; // Convert to minutes for easier comparison
  });

  // Check for conflicts with existing courses
  return !departmentSchedule[dateKey].some(course => {
    const [courseStart, courseEnd] = course.time.split('-').map(t => {
      const [hours, minutes] = t.split(':').map(Number);
      return hours * 60 + minutes;
    });

    // Check if time slots overlap
    return !(endTime <= courseStart || startTime >= courseEnd);
  });
}

// Function to show time slot availability
function showTimeSlotAvailability(department, date, requestedTime) {
  const isAvailable = isTimeSlotAvailable(department, date, requestedTime);
  
  // Create or get the time slot info element
  let timeSlotInfo = document.querySelector('.time-slot-info');
  if (!timeSlotInfo) {
    timeSlotInfo = document.createElement('div');
    timeSlotInfo.className = 'time-slot-info';
    document.querySelector('.calendar-S').appendChild(timeSlotInfo);
  }

  // Update the time slot info content
  timeSlotInfo.innerHTML = `
    <div class="time-slot-status ${isAvailable ? 'available' : 'conflict'}">
      <h4>État du créneau horaire: ${requestedTime}</h4>
      <p>${isAvailable ? 
        'Ce créneau horaire est disponible.' : 
        'Ce créneau horaire est déjà réservé pour un autre cours.'}</p>
    </div>
  `;

  // Add styles for the time slot info
  const style = document.createElement('style');
  style.textContent = `
    .time-slot-info {
      margin-top: 20px;
      padding: 15px;
      border-radius: 8px;
      background-color: #f8f9fa;
    }
    .time-slot-status {
      padding: 10px;
      border-radius: 6px;
    }
    .time-slot-status.available {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    .time-slot-status.conflict {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    .time-slot-status h4 {
      margin: 0 0 10px 0;
      font-size: 16px;
    }
    .time-slot-status p {
      margin: 0;
      font-size: 14px;
    }
  `;
  document.head.appendChild(style);
}

// Function to update calendar to a specific date
function updateCalendarToDate(day, month, year) {
  console.log(`Updating calendar to: ${day}/${month + 1}/${year}`);
  
  // Update current month and year
  currMonth = month;
  currYear = year;
  
  // Render calendar
  renderCalendar();
  
  // Find and highlight the specific day with a small delay to ensure calendar is rendered
  setTimeout(() => {
    console.log('Finding day element...');
    const dayElements = document.querySelectorAll('.days li:not(.inactive)');
    let targetDay = null;
    
    dayElements.forEach(dayElement => {
      const dayNum = parseInt(dayElement.textContent);
      if (dayNum === day) {
        console.log(`Found day ${day}, selecting it...`);
        // Remove any existing selections
        document.querySelectorAll('.days li.selected').forEach(el => el.classList.remove('selected'));
        // Add selected class
        dayElement.classList.add('selected');
        targetDay = dayElement;
        selectedDay = dayElement; // Update the global selectedDay variable
      }
    });
    
    if (targetDay) {
      // Trigger click event programmatically
      const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      targetDay.dispatchEvent(clickEvent);
      
      // Show schedule explicitly
      showScheduleForDay(day, month + 1, year);
      
      // Scroll the day into view
      targetDay.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      console.error(`Could not find day ${day} in calendar`);
    }
  }, 200); // Increased delay to ensure calendar is fully rendered
}

// Modify showSections to be more direct

// Function to add course to calendar and handle validation
function addCourseToCalendar(department, day, month, year, course) {
  // Create a key for the specific date
  const dateKey = `${day}-${month}-${year}`;
  
  // Initialize the array for this date if it doesn't exist
  if (!departmentCalendars[department]) {
    departmentCalendars[department] = [];
  }
  
  // Find if there's an existing entry for this date
  let dateEntry = departmentCalendars[department].find(entry => 
    entry.day === day && 
    entry.month === month && 
    entry.year === year
  );
  
  // If no entry exists for this date, create one
  if (!dateEntry) {
    dateEntry = {
      day,
      month,
      year,
      courses: []
    };
    departmentCalendars[department].push(dateEntry);
  }
  
  // Add the course to the date entry
  dateEntry.courses.push(course);
  
  // Update the calendar display
  renderCalendar();
  
  // Show updated schedule
  showScheduleForDay(day, month, year);
  
  return true;
}

// Add styles for the popup and success message
const style = document.createElement('style');
style.textContent = `
  .confirmation-popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .popup-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 90%;
  }
  
  .popup-content h3 {
    margin-top: 0;
    color: #333;
    text-align: center;
  }
  
  .formation-details {
    margin: 15px 0;
    padding: 10px;
    background-color: #f8f9fa;
    border-radius: 4px;
    color: black;
  }
  
  .formation-details p {
    margin: 5px 0;
  }
  
  .popup-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
  }
  
  .confirm-btn, .cancel-btn {
    padding: 8px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .confirm-btn {
    background-color: #28a745;
    color: white;
  }
  
  .cancel-btn {
    background-color: #dc3545;
    color: white;
  }
  
  .confirm-btn:hover {
    background-color: #218838;
  }
  
  .cancel-btn:hover {
    background-color: #c82333;
  }

  .success-message {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: #28a745;
    color: white;
    padding: 10px 20px;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease-out, fadeOut 0.5s ease-out 2s forwards;
    z-index: 1000;
  }

  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  .refusal-popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .refusal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 90%;
  }
  
  .refusal-content h3 {
    margin-top: 0;
    color: #333;
    text-align: center;
  }
  
  .refusal-content textarea {
    width: 100%;
    min-height: 100px;
    margin: 10px 0;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    resize: vertical;
  }
  
  .refusal-buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
  }
  
  .refusal-buttons button {
    padding: 8px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .send-btn {
    background-color: #dc3545;
    color: white;
  }
  
  .direct-refuse-btn {
    background-color: #6c757d;
    color: white;
  }
  
  .cancel-refuse-btn {
    background-color: #f8f9fa;
    color: #333;
    border: 1px solid #ddd !important;
  }
  
  .send-btn:hover {
    background-color: #c82333;
  }
  
  .direct-refuse-btn:hover {
    background-color: #5a6268;
  }
  
  .cancel-refuse-btn:hover {
    background-color: #e2e6ea;
  }
`;
document.head.appendChild(style);

// Function to show success message
function showSuccessMessage(message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'success-message';
  successDiv.textContent = message;
  document.body.appendChild(successDiv);

  // Remove the message after animation
  setTimeout(() => {
    document.body.removeChild(successDiv);
  }, 2500);
}

// Add event listener for the Valider button
document.addEventListener('DOMContentLoaded', () => {
  const validerBtn = document.getElementById('addDayBtn');
  if (validerBtn) {
    validerBtn.addEventListener('click', function() {
      // Get current demand information
      const currentDemande = allDemandes[selectedDepartment][selectedDemandeIndex];
      
      if (!currentDemande) {
        showSuccessMessage("Aucune demande sélectionnée!");
        return;
      }
      
      // Create confirmation popup
      const confirmationPopup = document.createElement('div');
      confirmationPopup.className = 'confirmation-popup';
      confirmationPopup.innerHTML = `
        <div class="popup-content">
          <h3>Confirmation</h3>
          <p>Voulez-vous ajouter cette formation au calendrier ?</p>
          <div class="formation-details">
            <p><strong>Cours:</strong> ${currentDemande.course}</p>
            <p><strong>Professeur:</strong> ${currentDemande.professor}</p>
            <p><strong>Date:</strong> ${currentDemande.date}</p>
            <p><strong>Heure:</strong> ${currentDemande.hour}</p>
            <p><strong>Type:</strong> ${currentDemande.type}</p>
          </div>
          <div class="popup-buttons">
            <button class="confirm-btn">Valider</button>
            <button class="cancel-btn">Annuler</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(confirmationPopup);
      
      // Handle Valider button click
      confirmationPopup.querySelector('.confirm-btn').addEventListener('click', function() {
        // Parse the date from the current demand
        const [day, month, year] = currentDemande.date.split('/').map(Number);
        
        // Create course object from demand
        const course = {
          title: currentDemande.course,
          time: currentDemande.hour,
          professor: currentDemande.professor,
          type: currentDemande.type,
          meetingLink: currentDemande.meetingLink || ''
        };
        
        // Check for time conflicts
        const hasConflict = getCoursesForDay(day, month, year).some(existingCourse => 
          isTimeConflict(existingCourse.time, course.time)
        );
        
        if (hasConflict) {
          const confirmAdd = confirm("Il y a déjà un cours à ce créneau horaire. Voulez-vous quand même ajouter cette formation?");
          if (!confirmAdd) {
            document.body.removeChild(confirmationPopup);
            return;
          }
        }
        
        // Add the course to the calendar
        const success = addCourseToCalendar(selectedDepartment, day, month, year, course);
        
        if (success) {
          // Show success message instead of alert
          showSuccessMessage("Formation ajoutée avec succès!");
          
          // Delete the demand after successful addition
          deleteDemande();
          
          // Update badges
          updateBadges();
          
          // Hide calendar and text sections
          document.querySelector('.text-container').classList.add('hidden-section');
          document.querySelector('.calendar-section').classList.add('hidden-section');
        } else {
          showSuccessMessage("Erreur lors de l'ajout de la formation.");
        }
        
        // Remove the popup
        document.body.removeChild(confirmationPopup);
      });
      
      // Handle Annuler button click
      confirmationPopup.querySelector('.cancel-btn').addEventListener('click', function() {
        document.body.removeChild(confirmationPopup);
      });
    });
  }
});

// Add event listener for the Refuser button
document.addEventListener('DOMContentLoaded', () => {
  const refuserBtn = document.querySelector('.Annuler-button');
  if (refuserBtn) {
    refuserBtn.addEventListener('click', function() {
      // Get current demand information
      const currentDemande = allDemandes[selectedDepartment][selectedDemandeIndex];
      
      if (!currentDemande) {
        showSuccessMessage("Aucune demande sélectionnée!");
        return;
      }
      
      // Create refusal popup
      const refusalPopup = document.createElement('div');
      refusalPopup.className = 'refusal-popup';
      refusalPopup.innerHTML = `
        <div class="refusal-content">
          <h3>Refuser la demande</h3>
          <p>Voulez-vous envoyer un message au professeur ${currentDemande.professor} ?</p>
          <textarea placeholder="Écrivez votre message ici (optionnel)..."></textarea>
          <div class="refusal-buttons">
            <button class="send-btn">Envoyer et Refuser</button>
            <button class="direct-refuse-btn">Refuser Directement</button>
            <button class="cancel-refuse-btn">Annuler</button>
          </div>
        </div>
      `;
      
      document.body.appendChild(refusalPopup);
      
      // Function to handle refusal
      function handleRefusal(withMessage = false) {
        const message = withMessage ? refusalPopup.querySelector('textarea').value : '';
        
        if (withMessage && message.trim() !== '') {
          // Here you would typically send the message to the professor
          console.log(`Message to ${currentDemande.professor}: ${message}`);
          showSuccessMessage("Message envoyé et demande refusée!");
        } else {
          showSuccessMessage("Demande refusée!");
        }
        
        // Delete the demand
        deleteDemande();
        
        // Remove the popup
        document.body.removeChild(refusalPopup);
        
        // Hide calendar and text sections if they're visible
        const textContainer = document.querySelector('.text-container');
        const calendarSection = document.querySelector('.calendar-section');
        if (textContainer) textContainer.classList.add('hidden-section');
        if (calendarSection) calendarSection.classList.add('hidden-section');
      }
      
      // Handle Send and Refuse button click
      refusalPopup.querySelector('.send-btn').addEventListener('click', () => {
        handleRefusal(true);
      });
      
      // Handle Direct Refuse button click
      refusalPopup.querySelector('.direct-refuse-btn').addEventListener('click', () => {
        handleRefusal(false);
      });
      
      // Handle Cancel button click
      refusalPopup.querySelector('.cancel-refuse-btn').addEventListener('click', () => {
        document.body.removeChild(refusalPopup);
      });
    });
  } else {
    console.error("Refuser button not found!");
  }
});
