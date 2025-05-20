const token = localStorage.getItem("token");

fetch("https://backend-m6sm.onrender.com/users/me", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  }
})
.then(response => {
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération de l'utilisateur");
  }
  return response.json();
})
.then(user => {
  // Créer les éléments
  const profileContainer = document.getElementById("profile-container");

  const image = document.createElement("img");
  image.src = "../assets/images/profil-pic.png";
  image.classList.add("profileimg");

  const nom = document.createElement("h4");
  nom.classList.add("profile-sidebar-text");
  nom.textContent = `${user.profile.prenom} ${user.profile.nom}`;

  const departement = document.createElement("p");
  departement.classList.add("profile-sidebar-text");
  departement.textContent = user.profile.departement;


  // Ajouter les éléments à la div
  profileContainer.appendChild(image);
  profileContainer.appendChild(nom);
  profileContainer.appendChild(departement);
})
.catch(error => {
  console.error("Erreur :", error);
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

// Debug - Global initialization check
console.log("RH-dashboard.js file loaded");

document.addEventListener("DOMContentLoaded", function () {
    // Sélection des éléments
    const searchInput = document.querySelector(".search-wrapper .input") || document.querySelector(".search-bar input");
    const courses = document.querySelectorAll(".course-card");
    const domainFilters = document.querySelectorAll(".radio-inputs input");
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.querySelector(".toggle-btn");

    // Fonction de filtrage
    function filterCourses() {
        const searchValue = searchInput?.value.toLowerCase().trim() || "";
        const selectedDomain = document.querySelector(".radio-inputs input:checked")?.nextElementSibling.textContent.trim() || "Tous";

        courses.forEach(course => {
            const courseCategory = course.querySelector(".department")?.textContent.trim() || "";
            const courseText = course.textContent.toLowerCase();
            const matchesSearch = courseText.includes(searchValue);
            const matchesDomain = (selectedDomain === "Tous" || courseCategory === selectedDomain);

            course.style.display = (matchesSearch && matchesDomain) ? "block" : "none";
        });
    }

    // Événements de recherche et de sélection
    if (searchInput) searchInput.addEventListener("input", filterCourses);
    domainFilters.forEach(filter => filter.addEventListener("change", filterCourses));

    // Appliquer le filtre au chargement
    filterCourses();

   
    
    // Désactiver les boutons "site-mzl"
    document.querySelectorAll(".site-mzl").forEach(button => {
        button.addEventListener("click", () => {
            alert("Cette page n'est pas accessible pour le moment !");
        });
    });
});


    // Gestion de la Recherche
    const searchInput = document.getElementById("searchInput");
    const courses = document.querySelectorAll(".course-card");

    function filterCourses() {
        const searchValue = searchInput.value.toLowerCase().trim();

        courses.forEach(course => {
            const courseText = course.textContent.toLowerCase();
            course.style.display = courseText.includes(searchValue) ? "block" : "none";
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterCourses);
    }





    
document.addEventListener("DOMContentLoaded", function () {
    const profilePic = document.querySelector(".profile-pic");

    if (profilePic) {
        profilePic.addEventListener("click", function () {
            // Vérifier si l'overlay existe déjà
            if (document.getElementById("profile-overlay")) return;

            // Création de l'overlay
            const overlay = document.createElement("div");
            overlay.id = "profile-overlay";
            overlay.style.position = "fixed";
            overlay.style.top = "0";
            overlay.style.left = "0";
            overlay.style.width = "100vw";
            overlay.style.height = "100vh";
            overlay.style.background = "rgba(0, 0, 0, 0.7)";
            overlay.style.display = "flex";
            overlay.style.alignItems = "center";
            overlay.style.justifyContent = "center";
            overlay.style.zIndex = "1000";

            // Image agrandie
            const enlargedImg = document.createElement("img");
            enlargedImg.src = profilePic.src;
            enlargedImg.style.width = "200px";
            enlargedImg.style.height = "200px";
            enlargedImg.style.borderRadius = "50%";
            enlargedImg.style.border = "5px solid white";
            enlargedImg.style.cursor = "pointer";

            // Ajout de l'image à l'overlay
            overlay.appendChild(enlargedImg);
            document.body.appendChild(overlay);

            // Fermer l'overlay au clic
            overlay.addEventListener("click", function () {
                document.body.removeChild(overlay);
            });
        });
    }
});




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
document.addEventListener("DOMContentLoaded", function () {
    const courses = document.querySelectorAll(".course-card");

    courses.forEach(course => {
        course.addEventListener("click", function () {
            const courseData = {
                title: this.getAttribute("data-title"),
                description: this.getAttribute("data-description"),
                teacher: this.getAttribute("data-teacher"),
                department: this.getAttribute("data-department"),
                mainContent: this.getAttribute("data-main-content"),
                type: this.getAttribute("data-type")
            };

            // Save course data in localStorage
            localStorage.setItem("selectedCourse", JSON.stringify(courseData));

            // Redirect to the course details page
            window.location.href = "../pages/RH-course.html";
        });
    });
});


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
        throw new Error("Erreur lors de la récupération du calendrier");
    }
    const data = await response.json();
    console.log("Données des conférences:", data);
    return data;
}

// Initialize course schedule as empty
let courseSchedule = {};

// Function to load calendar courses
async function loadCalendarCourses() {
    try {
        const conferences = await fetchCalendarCourses();
        // Reset the schedule
        courseSchedule = {};
        
        // Only process conferences that have valid data
        conferences.forEach(conf => {
            if (!conf.date || !conf.name) return; // Skip invalid conferences
            
            const dateObj = new Date(conf.date);
            if (isNaN(dateObj.getTime())) return; // Skip invalid dates
            
            const year = dateObj.getFullYear();
            const month = dateObj.getMonth(); // 0-indexed
            const day = dateObj.getDate();
            const key = `${year}-${month}`;
            
            if (!courseSchedule[key]) {
                courseSchedule[key] = [];
            }
            
            // Only add conferences with required data
            if (conf.name && conf.requested_by) {
                courseSchedule[key].push({
                    day: day,
                    id: conf.id,
                    title: conf.name,
                    trainer: `${conf.requested_by.prenom} ${conf.requested_by.nom}`,
                    time: conf.time || "Non spécifié",
                    type: conf.type,
                    meetingLink: conf.link || "#",
                    date: conf.date,
                    departement: conf.departement
                });
            }
        });
        
        // Update the calendar with new data
        renderCalendar();
    } catch (error) {
        console.error("Erreur lors du chargement des cours du calendrier:", error);
        // Clear the calendar if there's an error
        courseSchedule = {};
        renderCalendar();
    }
}

// Function to update the courses shown in the sidebar
function updateSidebarCourses() {
    const sidebarCoursesContainer = document.querySelector(".sidebar2");
    const existingCourses = sidebarCoursesContainer.querySelectorAll(".cours-sidebar");

    // Remove existing course elements
    existingCourses.forEach(course => course.remove());

    // Get courses for the current month and year
    const currentMonthKey = `${currYear}-${currMonth}`;
    const coursesForMonth = courseSchedule[currentMonthKey] || [];

    // Check if a specific day is selected
    const selectedDayElement = daysTag2.querySelector("li.selected-day");
    let coursesToDisplay = [];

    if (selectedDayElement) {
        const selectedDay = parseInt(selectedDayElement.innerText);
        // Filter courses for the selected day
        coursesToDisplay = coursesForMonth.filter(course => course.day === selectedDay);
    } else {
        // No specific day selected, show all courses for the month
        coursesToDisplay = coursesForMonth;
    }

    // Sort courses by day
    coursesToDisplay.sort((a, b) => a.day - b.day);

    // Add courses to sidebar
    coursesToDisplay.forEach(course => {
        const courseElement = document.createElement('div');
        courseElement.className = 'cours-sidebar';
        courseElement.innerHTML = `
            <div class="infooo">
                <p class="date-cour2">${course.day} ${mois[currMonth]} ${currYear}</p>
                <p class="nom-cour">${course.title}</p>
                <p class="depa-cour"><strong>Département:</strong> ${course.departement}</p>
            </div>
        `;
        
        // Add click event to show course details popup
        courseElement.addEventListener('click', () => {
            showCourseDetailsPopup(course);
        });
        
        sidebarCoursesContainer.appendChild(courseElement);
    });
}

// Function to show course details popup
function showCourseDetailsPopup(course) {
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'popup-overlay';
    
    const popupContent = document.createElement('div');
    popupContent.className = 'popup-content';
    
    // Format the date properly
    const courseDate = new Date(course.date || `${currYear}-${currMonth + 1}-${course.day}`);
    const formattedDate = `${course.day} ${mois[currMonth]} ${currYear}`;
    
    // Format the time if it exists
    const timeDisplay = course.time ? course.time : "Non spécifié";
    
    // Format the type
    const typeDisplay = course.type === 'online' ? 'En ligne' : 'Présentiel';
    
    // Get the correct meeting link
    const meetingLink = course.meetingLink || course.link || '#';
    
    popupContent.innerHTML = `
        <div class="popup-header">
            <h3>${course.title}</h3>
            <span class="popup-close">&times;</span>
        </div>
        <div class="popup-body">
            <div class="popup-info">
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Heure:</strong> ${timeDisplay}</p>
                <p><strong>Département:</strong> ${course.departement}</p>
                <p><strong>Formateur:</strong> ${course.trainer}</p>
                <p><strong>Type de réunion:</strong> ${course.type}</p>
            </div>
        </div>
        <div class="popup-footer">
            ${course.type.toLowerCase() === 'en ligne' ? `<a href="${course.meetingLink}" target="_blank" class="join-button">Rejoindre</a>` : ''}
        </div>
    `;
    
    popupOverlay.appendChild(popupContent);
    document.body.appendChild(popupOverlay);
    
    // Prevent closing when clicking on the popup content
    popupContent.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    // Close popup when clicking on close button
    const closeButton = popupContent.querySelector('.popup-close');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(popupOverlay);
    });
    
    // Close popup when clicking outside
    popupOverlay.addEventListener('click', () => {
        document.body.removeChild(popupOverlay);
    });
}

// Add CSS styles for the popup to the page
function addPopupStyles() {
    console.log("Adding popup and UI styles");
    // Check if styles already exist
    if (!document.getElementById('popup-styles')) {
        const style = document.createElement('style');
        style.id = 'popup-styles';
        style.textContent = `
            /* Popup styles */
            .popup-overlay {
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
                border-radius: 10px;
                width: 80%;
                max-width: 500px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            }
            
            .popup-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 15px 20px;
                border-bottom: 1px solid #eee;
            }
            
            .popup-header h3 {
                margin: 0;
                color: #333;
            }
            
            .popup-close {
                font-size: 24px;
                font-weight: bold;
                cursor: pointer;
                color: #999;
            }
            
            .popup-close:hover {
                color: #333;
            }
            
            .popup-body {
                padding: 20px;
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
            }
            
            .popup-info {
                flex: 1;
                min-width: 200px;
                color: black;
            }
            
            
            .popup-footer {
                padding: 15px 20px;
                border-top: 1px solid #eee;
                display: flex;
                justify-content: flex-end;
            }
            
            .join-button {
                background-color: #DBEAFE;
                color: #1E40AF;
                 box-shadow: 0 2px 6px rgba(30, 64, 175, 0.3);
            }
            .join-button {
                padding: 6px 12px;
                border-radius: 15px;
                font-weight: 500;
                display: inline-block;
                margin-right: 10px;
                cursor: pointer;
                border: none;
                font-size: 18px;
                text-decoration: none;
            }

            .join-button:hover {
                box-shadow: 0 4px 12px rgba(30, 64, 175, 0.4);
                transform: translateY(-1px);
                transition: all 0.2s ease;
            }



            
            /* Make courses in sidebar look clickable */
            .cours-sidebar {
                cursor: pointer;
                transition: transform 0.2s, box-shadow 0.2s;
            }
            
            .cours-sidebar:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
            }
            
            /* Selected day styling */
            .days2 li.selected-day {
                // background-color: #e0e0e0 !important; /* Slightly darker gray, force override */
                color: #000 !important; /* Set text color to black for contrast */
                outline: 1px solid #bbb; /* Use outline to prevent movement */
                border-radius: 50%;
            }
        `;
        document.head.appendChild(style);
        console.log("Styles added to document");
    } else {
        console.log("Styles already exist");
    }
}

// Add the popup styles when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing calendar");
    addPopupStyles(); // Add popup styles
    initializeCalendar();
});

// Calendar elements
const daysTag2 = document.querySelector(".days2"),
currentDate2 = document.querySelector(".current-date2"),
prevNextIcon2 = document.querySelectorAll(".icons2 span");

// Getting new date, current year and month
let date = new Date(),
currYear = date.getFullYear(),
currMonth = date.getMonth();

// Storing full name of all months in French array
const mois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet",
            "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

// Function to render calendar
const renderCalendar = () => {
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
    let liTag = "";

    // Creating li of previous month last days
    for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    // Get courses for the current month and year
    const currentMonthKey = `${currYear}-${currMonth}`;
    const coursesThisMonth = courseSchedule[currentMonthKey] || [];

    // Creating li of all days of current month
    for (let i = 1; i <= lastDateofMonth; i++) {
        let isToday = i === date.getDate() && currMonth === new Date().getMonth()
                     && currYear === new Date().getFullYear() ? "active" : "";

        let isCourseDay = coursesThisMonth.some(course => course.day === i) ? "cours" : "";
        liTag += `<li class="${isToday} ${isCourseDay}">${i}</li>`;
    }

    // Creating li of next month first days
    for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`
    }

    // Updating the HTML
    currentDate2.innerText = `${mois[currMonth]} ${currYear}`;
    daysTag2.innerHTML = liTag;

    // Remove selection from previously selected day if any
    const currentlySelected = daysTag2.querySelector("li.selected-day");
    if (currentlySelected) {
        currentlySelected.classList.remove("selected-day");
    }

    // Update the courses shown in the sidebar
    updateSidebarCourses();
}

// Add event listeners for calendar navigation
prevNextIcon2.forEach(icon => {
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
    });
});

// Add event listener for clicking on days
daysTag2.addEventListener('click', (event) => {
    const clickedLi = event.target;

    if (clickedLi.tagName === 'LI' && !clickedLi.classList.contains('inactive')) {
        const previouslySelected = daysTag2.querySelector("li.selected-day");
        if (previouslySelected) {
            previouslySelected.classList.remove("selected-day");
        }

        clickedLi.classList.add("selected-day");
        updateSidebarCourses();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.course-card').forEach(card => {
      card.addEventListener('click', function () {
        // Build the course object based on the card's content or data attributes
        const courseObj = {
          domain: this.querySelector('.department')?.textContent || 'IT',
          image: this.querySelector('img')?.getAttribute('src') || '',
          title: this.querySelector('h3')?.textContent || '',
          teacher: this.querySelector('p')?.textContent.replace('By ', '') || '',
          description: 'Description à compléter...', // You may want to add a data-description attribute
          field: this.querySelector('.department')?.textContent || '',
          resources: {
            record: null,
            pptx: null,
            pdf: null,
            extraLinks: [],
            quiz: null
          }
        };
        localStorage.setItem('selectedCourse', JSON.stringify(courseObj));
        window.location.href = 'RH-course.html';
      });
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const icon = document.querySelector("i.fa-users");
    const dot = icon ? icon.querySelector(".notification-dot") : null;

    const hasPending = localStorage.getItem("hasPendingAccountRequests") === "true";

    if (dot) {
        dot.style.display = hasPending ? "block" : "none";
    }
});


// Fonction pour vérifier les demandes de formation
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



// Function to fetch courses
async function fetchCourses() {
    const token = localStorage.getItem("token");
    const response = await fetch("https://backend-m6sm.onrender.com/courses/", {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des cours");
    }
    return await response.json();
}

console.log("fetchCourses", fetchCourses());
// Function to filter courses
function filterCourses() {
    const searchInput = document.querySelector(".search-wrapper .input-container");
    const courses = document.querySelectorAll(".course-card");
    const selectedDepartment = document.querySelector(".radio-inputs input:checked")?.value || "Tous";
    const searchValue = searchInput?.value.toLowerCase().trim() || "";

    courses.forEach(course => {
        const courseDepartment = course.querySelector(".department")?.textContent.trim() || "";
        const courseTitle = course.querySelector("h3")?.textContent.toLowerCase() || "";
        const courseTeacher = course.querySelector("p")?.textContent.toLowerCase() || "";
        
        const matchesSearch = searchValue === "" || 
            courseTitle.includes(searchValue) || 
            courseTeacher.includes(searchValue);
        const matchesDepartment = selectedDepartment === "Tous" || courseDepartment === selectedDepartment;

        course.style.display = (matchesSearch && matchesDepartment) ? "block" : "none";
    });
}

// Function to create course card
function createCourseCard(course) {
    const card = document.createElement('div');
    card.className = 'course-card';
    
    const instructorName = course.instructor?.nom || 'Instructeur non spécifié';
    const isNew = isCourseNew(course.created_at);
    
    const courseData = {
        id: course.id,
        departement: course.departement,
        image: course.image_url,
        title: course.title,
        teacher: instructorName,
        description: course.description || "Aucune description",
        field: course.domain,
        external_links: course.external_links,
        quiz_link: course.quiz_link,
        resources: {
            record: null,
            pptx: null,
            pdf: null,
            extraLinks: course.external_links || [],
            quiz: null
        }
    };

    card.setAttribute('data-course', JSON.stringify(courseData));

    card.innerHTML = `
        ${isNew ? '<span class="badge">new</span>' : ''}
        <span class="department">${course.departement}</span>
        <h3>${course.title}</h3>
        <p>By ${instructorName}</p>
    `;

    card.addEventListener('click', function() {
        const courseObj = JSON.parse(this.getAttribute('data-course'));
        localStorage.setItem('selectedCourse', JSON.stringify(courseObj));
        window.location.href = 'RH-course.html';
    });

    return card;
}

// Function to update department filters
function updateDepartmentFilters(courses) {
    const departments = new Set(courses.map(course => course.departement));
    const radioInputs = document.querySelector('.radio-inputs');
    
    if (!radioInputs) return;

    // Keep the "Tous" option
    const allOption = radioInputs.querySelector('label.radio:first-child');
    radioInputs.innerHTML = '';
    radioInputs.appendChild(allOption);

    // Add department options
    departments.forEach(dept => {
        const label = document.createElement('label');
        label.className = 'radio';
        label.innerHTML = `
            <input type="radio" name="radio" value="${dept}">
            <span class="name">${dept}</span>
        `;
        radioInputs.appendChild(label);
    });

    // Reattach event listeners
    const domainFilters = radioInputs.querySelectorAll('input');
    domainFilters.forEach(filter => filter.addEventListener('change', filterCourses));
}

// Function to load courses
async function loadCourses() {
    try {
        const courses = await fetchCourses();
        const courseContainer = document.querySelector(".departments .course-container");

        if (!courseContainer) return;

        // Clear existing courses
        courseContainer.innerHTML = '';

        // Display all courses
        courses.forEach(course => {
            const card = createCourseCard(course);
            courseContainer.appendChild(card);
        });

        // Add event listeners for department filters
        const domainFilters = document.querySelectorAll('.radio-inputs input');
        domainFilters.forEach(filter => filter.addEventListener('change', filterCourses));

        // Add search input event listener
        const searchInput = document.querySelector(".search-wrapper .input-container");
        if (searchInput) {
            searchInput.addEventListener("input", filterCourses);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des cours:', error);
        const container = document.querySelector('.departments .course-container');
        if (container) {
            container.innerHTML = `<p>Erreur lors du chargement des cours: ${error.message}</p>`;
        }
    }
}

// Function to check if a course is new (less than a week old)
function isCourseNew(createdAt) {
    if (!createdAt) return false;
    
    const courseDate = new Date(createdAt);
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return courseDate > oneWeekAgo;
}

// Function to load user info
async function loadUserInfo() {
    try {
        const userInfo = await fetchUserInfo();
        const profileSidebar = document.querySelector('.profile-side-bar');
        
        if (profileSidebar) {
            const nameElement = profileSidebar.querySelector('.profile-sidebar-text');
            if (nameElement) {
                nameElement.textContent = `${userInfo.prenom} ${userInfo.nom}`;
            }
        }
    } catch (error) {
        console.error('Erreur lors du chargement des informations utilisateur:', error);
    }
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    addPopupStyles();
    await loadUserInfo();
    await loadCourses();
    await loadCalendarCourses();
}); 
