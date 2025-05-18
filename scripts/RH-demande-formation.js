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
// Remove the default allDemandes object and replace with an empty object
const allDemandes = {};

// Function to fetch conference requests from API
async function fetchConferenceRequests() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
      showSuccessMessage("Erreur d'authentification");
      return;
    }

    const response = await fetch('https://backend-m6sm.onrender.com/admin/pending-conferences', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Received data:', data); // Debug log

    // Group requests by department
    const groupedRequests = {};
    data.forEach(request => {
      const departement = request.departement;
      if (!groupedRequests[departement]) {
        groupedRequests[departement] = [];
      }

      // Format the request data
      const formattedRequest = {
        id: request.id,
        title: `Demande ${groupedRequests[departement].length + 1}`,
        departement: departement,
        professor: `${request.requested_by.nom} ${request.requested_by.prenom}`,
        course: request.name,
        date: new Date(request.date).toLocaleDateString('fr-FR'),
        type: request.type,
        hour: request.time,
        description: request.description,
        meetingLink: request.link || '',
      };

      groupedRequests[departement].push(formattedRequest);
    });

    // Update the allDemandes object
    Object.keys(allDemandes).forEach(key => delete allDemandes[key]); // Clear existing data
    Object.assign(allDemandes, groupedRequests);

    console.log('Processed data:', allDemandes); // Debug log

    // Update the UI
    updateBadges();
    updateDemande();

    // Update notification dot
    const hasRequests = Object.values(groupedRequests).some(requests => requests.length > 0);
    const notificationDot = document.getElementById('formationNotificationDot');
    if (notificationDot) {
      notificationDot.style.display = hasRequests ? 'block' : 'none';
    }

  } catch (error) {
    console.error('Error fetching conference requests:', error);
    showSuccessMessage("Erreur lors du chargement des demandes");
  }
}

async function approveConference(conferenceId) {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      showSuccessMessage("Erreur d'authentification");
      return;
    }

    // Get only the selected day
    const selectedDayNum = parseInt(selectedDay.getAttribute("data-day"));
    const date = new Date(currYear, currMonth, selectedDayNum).toISOString().split('T')[0];

    const response = await fetch(`https://backend-m6sm.onrender.com/admin/approve/${conferenceId}?approve=true`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        date: date
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Erreur lors de l\'approbation de la demande');
    }

    showSuccessMessage("Demande approuvée avec succès!");
    await fetchConferenceRequests(); // Recharger les demandes
  } catch (error) {
    console.error('Erreur:', error);
    showSuccessMessage(error.message || "Erreur lors de l'approbation de la demande");
  }
}

async function deleteDemande() {
  const demandeToDelete = allDemandes[selectedDepartment][selectedDemandeIndex];
  if (!demandeToDelete) return;

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      showSuccessMessage("Erreur d'authentification");
      return;
    }

    const response = await fetch(`https://backend-m6sm.onrender.com/admin/approve/${demandeToDelete.id}?approve=false`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Erreur lors de la suppression de la demande');
    }

    // Mettre à jour l'interface
    allDemandes[selectedDepartment].splice(selectedDemandeIndex, 1);
    updateBadges();
    clearDemandeDisplay();

    if (allDemandes[selectedDepartment].length > 0) {
      if (selectedDemandeIndex >= allDemandes[selectedDepartment].length) {
        selectedDemandeIndex = allDemandes[selectedDepartment].length - 1;
      }
      updateDemande();
    }

    const textContainer = document.querySelector('.text-container');
    const calendarSection = document.querySelector('.calendar-section');
    const messageSection = document.querySelector('.message-section');

    if (textContainer) textContainer.classList.add('hidden-section');
    if (calendarSection) calendarSection.classList.add('hidden-section');
    if (messageSection) messageSection.style.display = 'none';

    showSuccessMessage("Demande supprimée avec succès!");
    await fetchConferenceRequests(); // Recharger les demandes
  } catch (error) {
    console.error('Erreur:', error);
    showSuccessMessage(error.message || "Erreur lors de la suppression de la demande");
  }
}


// Modifier l'événement de chargement de la page
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM content loaded, setting up event listeners...");
  
  // Initial fetch of conference requests
  fetchConferenceRequests();
  
  // Set up periodic refresh (every 30 seconds)
  setInterval(fetchConferenceRequests, 30000);
  
  // ... rest of the existing DOMContentLoaded code ...
});

// number of demande
 // Ensure badges are updated on page load
 // Updated variables for tracking the current department and index
let selectedDepartment = "Information Technology"; // Initial department
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
    document.getElementById("department").innerText = demande.departement;
    document.getElementById("prof").innerText = demande.professor;
    document.getElementById("course").innerText = demande.course;
    document.getElementById("date").innerText = demande.date;
    document.getElementById("type").innerText = demande.type;
    document.getElementById("hour").innerText = demande.hour || "N/A";
    document.getElementById("description").innerText = demande.description || "Aucune description disponible";
    
    
    // Handle meeting link
    const meetingLinkContainer = document.getElementById("meetingLinkContainer");
    const meetingLinkElement = document.getElementById("meetingLink");
    if (demande.type === "en ligne" && demande.meetingLink) {
      // Format the link as a proper URL
      let formattedLink = demande.meetingLink;
      if (!formattedLink.startsWith('http://') && !formattedLink.startsWith('https://')) {
        formattedLink = 'https://' + formattedLink;
      }
      meetingLinkElement.innerHTML = `<a href="${formattedLink}" target="_blank" style="color: #2563eb; text-decoration: underline;">${formattedLink}</a>`;
      meetingLinkContainer.style.display = "block";
    } else {
      meetingLinkElement.innerText = "N/A";
      meetingLinkContainer.style.display = demande.type === "en ligne" ? "block" : "none";
    }
  } else {
    clearDemandeDisplay();
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
    padding: 6px 20px;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    font-weight: 700;
  }
  
  

.confirm-btn {
  background-color: #A7F3D0;
  color: #065F46;
  box-shadow: 0 2px 6px rgba(6, 95, 70, 0.3);
}
.confirm-btn:hover {
  box-shadow: 0 4px 12px rgba(6, 95, 70, 0.4); /* Darker green shadow */
  transform: translateY(-1px);
  transition: all 0.2s ease;
}




  
  
  .cancel-btn {
  background-color: #FECACA;
  color: #7F1D1D;
  box-shadow: 0 2px 6px rgba(127, 29, 29, 0.3);
  
}
.cancel-btn:hover {
  box-shadow: 0 4px 12px rgba(127, 29, 29, 0.4); /* Ombre rouge plus foncée */
  transform: translateY(-1px);
  transition: all 0.2s ease;
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
    padding: 5px 20px;
    border: none;
    border-radius: 30px;
    cursor: pointer;
    font-weight: bold;
  }
  
  .send-btn {

    background-color: #DBEAFE;
    color: #1E40AF;
    box-shadow: 0 2px 6px rgba(30, 64, 175, 0.3);

  }
  
  .direct-refuse-btn {
   background-color: #FECACA;
    color: #7F1D1D;
    box-shadow: 0 2px 6px rgba(127, 29, 29, 0.3);
  }
  
  .cancel-refuse-btn {
   background-color:rgb(210, 214, 217);
   color: #65456;
   box-shadow: 0 2px 6px rgba(13, 13, 13, 0.3);
  }
  
  .send-btn:hover {
     box-shadow: 0 4px 12px rgba(30, 64, 175, 0.4); /* Darker blue shadow */
  transform: translateY(-1px);
  transition: all 0.2s ease;
  }
  
  .direct-refuse-btn:hover {
    box-shadow: 0 4px 12px rgba(127, 29, 29, 0.4); /* Ombre rouge plus foncée */
  transform: translateY(-1px);
  transition: all 0.2s ease;
  }
  
  .cancel-refuse-btn:hover {
     box-shadow: 0 4px 12px rgba(63, 63, 63, 0.4); /* Ombre rouge plus foncée */
  transform: translateY(-1px);
  transition: all 0.2s ease;
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



// Add event listener for the Refuser button
document.addEventListener('DOMContentLoaded', () => {
  const refuserBtn = document.querySelector('.Annuler-button');
  if (refuserBtn) {
    refuserBtn.addEventListener('click', function() {
      deleteDemande();
    });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const icon = document.querySelector("i.fa-users");
  const dot = icon ? icon.querySelector(".notification-dot") : null;

  const hasPending = localStorage.getItem("hasPendingAccountRequests") === "true";

  if (dot) {
      dot.style.display = hasPending ? "block" : "none";
  }
});






// Met à jour localStorage avec les comptes des demandes par département
function syncRequestsToLocalStorage(allDemandes) {
  const counts = {};
  for (const [dept, demandes] of Object.entries(allDemandes)) {
    counts[dept] = demandes.length;
  }
  localStorage.setItem('formationRequests', JSON.stringify(counts));
}
syncRequestsToLocalStorage(allDemandes);

// Function to fetch calendar data from API
async function fetchCalendarData() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authentication token found');
            return;
          }

    const response = await fetch('https://backend-m6sm.onrender.com/calendar', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
        
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Calendar data received:', data);
          
    // Clear existing calendar data
    Object.keys(departmentCalendars).forEach(key => delete departmentCalendars[key]);
          
    // Process and organize the data by department
    data.forEach(conference => {
      const date = new Date(conference.date);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const departement = conference.departement;

      if (!departmentCalendars[departement]) {
        departmentCalendars[departement] = [];
      }

      // Check if this date already exists in the department's calendar
      let dateEntry = departmentCalendars[departement].find(entry => 
        entry.day === day && entry.month === month && entry.year === year
      );

      if (!dateEntry) {
        dateEntry = { day, month, year, courses: [] };
        departmentCalendars[departement].push(dateEntry);
      }

      // Add the course to the date entry
      dateEntry.courses.push({
        title: conference.name,
        time: conference.time,
        professor: `${conference.requested_by.nom} ${conference.requested_by.prenom}`,
        type: conference.type
      });
    });

    console.log('Processed calendar data:', departmentCalendars);
    return departmentCalendars;
  } catch (error) {
    console.error('Error fetching calendar data:', error);
    return null;
  }
}

// Function to check for time conflicts
function checkTimeConflict(day, month, year, time) {
  // Check all departments for conflicts
  return Object.values(departmentCalendars).some(departmentData => {
    const dateData = departmentData.find(data => 
      data.day === day && 
      data.month === month && 
      data.year === year
    );
      
    if (!dateData) return false;

    return dateData.courses.some(course => isTimeConflict(time, course.time));
  });
      }
      
// Update the showScheduleForDay function to use the API data
function showScheduleForDay(day, month, year) {
  let scheduleDisplay = document.getElementById('daySchedule');
  if (!scheduleDisplay) {
    scheduleDisplay = document.createElement('div');
    scheduleDisplay.id = 'daySchedule';
    scheduleDisplay.className = 'day-schedule';
    document.querySelector('.calendar-S').appendChild(scheduleDisplay);
  }

  // Get all courses from all departments
  const allCourses = [];
  Object.entries(departmentCalendars).forEach(([dept, departmentData]) => {
    const dateData = departmentData.find(data => 
      data.day === day && 
      data.month === month && 
      data.year === year
    );

    if (dateData && dateData.courses) {
      dateData.courses.forEach(course => {
        allCourses.push({
          ...course,
          department: dept
      });
    });
    }
  });

  // Get the current demande
  const currentDemande = allDemandes[selectedDepartment][selectedDemandeIndex];
  const requestedTime = currentDemande.hour;

  // Build the HTML for the schedule
  let scheduleHTML = `
    <div class="schedule-header">
      <h4>Cours programmés le ${day}/${month}/${year}</h4>
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
      const isConflict = requestedTime === course.time;
      if (isConflict) conflict = true;

      scheduleHTML += `
        <li class="${isConflict ? 'time-conflict' : ''}">
          <span class="course-time">${course.time}</span>
          <span class="course-title">${course.title}</span>
          <span class="course-dept">${course.department}</span>
          <span class="course-prof">${course.professor}</span>
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
  // Add event listener for the Valider button
  document.addEventListener('DOMContentLoaded', () => {
    const validerBtn = document.getElementById('addDayBtn');
    if (validerBtn) {
      validerBtn.addEventListener('click', async function() {
        const currentDemande = allDemandes[selectedDepartment][selectedDemandeIndex];
        
        if (currentDemande?.id) {
          // Check if there's a conflict warning in the schedule display
          const conflictWarning = document.querySelector('.conflict-warning');
          if (conflictWarning) {
            showSuccessMessage("❌ Erreur: L'horaire est déjà pris. Veuillez choisir un autre créneau.");
            return;
          }
          await approveConference(currentDemande.id);
  }
});
    }
  });

// Update the DOMContentLoaded event to fetch calendar data
document.addEventListener('DOMContentLoaded', async () => {
  console.log("DOM content loaded, setting up event listeners...");
  
  // Initial fetch of conference requests and calendar data
  await Promise.all([
    fetchConferenceRequests(),
    fetchCalendarData()
  ]);
  
  // Set up periodic refresh (every 30 seconds)
  setInterval(async () => {
    await Promise.all([
      fetchConferenceRequests(),
      fetchCalendarData()
    ]);
  }, 30000);

  // ... rest of the existing DOMContentLoaded code ...
});


// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  // Gérer la soumission du formulaire
  const form = document.getElementById('formation-form');
  form.addEventListener('submit', addFormation);

  // Gérer le changement de type de formation
  const formationType = document.getElementById('formation-type');
  formationType.addEventListener('change', handleFormationType);
  
  // Initialiser l'état du champ de lien
  handleFormationType();

  // Gérer le bouton Annuler
  document.querySelector('.cancel').addEventListener('click', function(e) {
      e.preventDefault();
      const form = document.getElementById('formation-form');
      form.reset();
 
      
      // Réinitialiser l'état du champ de lien
      handleFormationType();
  });

  // Initialiser le tableau
  updateTable();
  fetchAndDisplayConferences();
});

document.getElementById('formation-form').addEventListener('submit', async function(e) {
  e.preventDefault();

  // Get form data
  const formData = new FormData();
  
  // Récupérer et logger les valeurs pour le débogage
  const formationName = document.getElementById('formation-name').value;
  const description = document.getElementById('formation-description').value;
  const department = document.getElementById('departement').value;
  const date = document.getElementById('datePicker').value;
  const time = document.getElementById('timePicker').value;
  const type = document.getElementById('formation-type').value;
  const link = document.getElementById('formation-link').value;

  console.log('Form values:', {
      formationName,
      description,
      department,
      date,
      time,
      type,
      link
  });

  // Ajouter les données au FormData avec les bons noms de champs
  formData.append('name', formationName);
  formData.append('description', description);
  formData.append('departement', department);
  formData.append('date', date);
  formData.append('time', time);
  formData.append('type', type);
  if (link) {
      formData.append('link', link);
  }


  // Log the FormData contents
  for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
  }

  try {
      const token = localStorage.getItem('token');
      if (!token) {
          alert('Vous devez être connecté pour envoyer une demande');
          return;
      }

      console.log('Sending request to server...');
      const response = await fetch('https://backend-m6sm.onrender.com/request/', {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${token}`
          },
          body: formData
      });

      console.log('Server response status:', response.status);
      const responseData = await response.json();
      console.log('Server response:', responseData);

      if (response.ok) {
          alert('Formation demandée avec succès!');
          this.reset();
          document.getElementById('preview').src = '';
          await fetchAndDisplayConferences();
      } else {
          let errorMessage = 'Une erreur est survenue';
          if (response.status === 422) {
              errorMessage = 'Les données envoyées ne sont pas valides. Détails des erreurs:\n' + 
                  JSON.stringify(responseData, null, 2);
          } else if (responseData.message) {
              errorMessage = responseData.message;
          }
          console.error('Error details:', responseData);
          alert('Erreur: ' + errorMessage);
      }
  } catch (error) {
      console.error('Error:', error);
  }
});


const formationType = document.getElementById('formation-type');
  if (formationType) {
      formationType.addEventListener('change', handleFormationType);
      // Appeler la fonction une fois au chargement pour gérer l'état initial
      handleFormationType();
  }