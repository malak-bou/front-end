// =================== auth.js ===================
function loadUserProfile() {
    const token = localStorage.getItem("token");
  
    fetch("https://backend-m6sm.onrender.com/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) throw new Error("Erreur lors de la récupération de l'utilisateur");
      return response.json();
    })
    .then(user => {
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
  
      profileContainer.appendChild(image);
      profileContainer.appendChild(nom);
      profileContainer.appendChild(departement);
    })
    .catch(error => console.error("Erreur :", error));
  }
  loadUserProfile();
  
  
  // =================== sidebar.js ===================
  function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.style.width = sidebar.style.width === "250px" ? "0" : "250px";
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    const profileLink = document.getElementById("profile-link");
    const sidebar = document.getElementById("sidebar2");
    const closeSidebar = document.getElementById("close-sidebar2");
    const overlay = document.getElementById("overlay");
  
    profileLink.addEventListener("click", (e) => {
      e.preventDefault();
      sidebar.classList.add("show");
      sidebar.classList.remove("hide");
      overlay.classList.add("show");
    });
  
    closeSidebar.addEventListener("click", closeSidebarHandler);
    overlay.addEventListener("click", closeSidebarHandler);
  
    function closeSidebarHandler() {
      sidebar.classList.add("hide");
      sidebar.classList.remove("show");
      overlay.classList.remove("show");
    }
  });
  
  
  // =================== search.js ===================
  document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".search-wrapper .input") || document.querySelector(".search-bar input");
    const courses = document.querySelectorAll(".course-card");
    const domainFilters = document.querySelectorAll(".radio-inputs input");
  
    function filterCourses() {
      const searchValue = searchInput?.value.toLowerCase().trim() || "";
      const selectedDomain = document.querySelector(".radio-inputs input:checked")?.nextElementSibling.textContent.trim() || "Tous";
  
      courses.forEach(course => {
        const courseCategory = course.querySelector(".department")?.textContent.trim() || "";
        const courseText = course.textContent.toLowerCase();
        const matchesSearch = courseText.includes(searchValue);
        const matchesDomain = selectedDomain === "Tous" || courseCategory === selectedDomain;
        course.style.display = (matchesSearch && matchesDomain) ? "block" : "none";
      });
    }
  
    if (searchInput) searchInput.addEventListener("input", filterCourses);
    domainFilters.forEach(filter => filter.addEventListener("change", filterCourses));
    filterCourses();
  });
  
  
  // =================== courseCard.js ===================
  document.addEventListener("DOMContentLoaded", () => {
    const courses = document.querySelectorAll(".course-card");
  
    courses.forEach(course => {
      course.addEventListener("click", function (e) {
        e.preventDefault();
  
        const courseData = {
          title: this.getAttribute("data-title"),
          description: this.getAttribute("data-description"),
          teacher: this.getAttribute("data-teacher"),
          department: this.getAttribute("data-department"),
          mainContent: this.getAttribute("data-main-content"),
          type: this.getAttribute("data-type")
        };
  
        localStorage.setItem("selectedCourse", JSON.stringify(courseData));
        window.location.href = "../pages/prof-course.html";
      });
    });
  });
  
  
  // =================== calendar.js ===================
  let courseSchedule = {};
  
  async function fetchCalendarCourses() {
    const token = localStorage.getItem("token");
    const response = await fetch("https://backend-m6sm.onrender.com/calendar", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) throw new Error("Erreur lors de la récupération du calendrier");
    return await response.json();
  }
  
  async function loadCalendarCourses() {
    try {
      const conferences = await fetchCalendarCourses();
      courseSchedule = {};
  
      conferences.forEach(conf => {
        if (!conf.date || !conf.name) return;
        const dateObj = new Date(conf.date);
        if (isNaN(dateObj.getTime())) return;
  
        const key = `${dateObj.getFullYear()}-${dateObj.getMonth()}`;
        if (!courseSchedule[key]) courseSchedule[key] = [];
  
        if (conf.name && conf.requested_by) {
          courseSchedule[key].push({
            day: dateObj.getDate(),
            id: conf.id,
            title: conf.name,
            trainer: `${conf.requested_by.prenom} ${conf.requested_by.nom}`,
            time: conf.time || "Non spécifié",
            type: conf.type || "Présentiel",
            meetingLink: conf.link || "#",
            date: conf.date
          });
        }
      });
  
      renderCalendar(); // Assure-toi que renderCalendar() est bien défini
    } catch (error) {
      console.error("Erreur lors du chargement des cours du calendrier:", error);
      courseSchedule = {};
      renderCalendar();
    }
  }
  
  function updateSidebarCourses() {
    const sidebarCoursesContainer = document.querySelector(".sidebar2");
    const existingCourses = sidebarCoursesContainer.querySelectorAll(".cours-sidebar");
    existingCourses.forEach(course => course.remove());
  
    const currentMonthKey = `${currYear}-${currMonth}`;
    const coursesForMonth = courseSchedule[currentMonthKey] || [];
  
    const selectedDayElement = daysTag2.querySelector("li.selected-day");
    const selectedDay = selectedDayElement ? parseInt(selectedDayElement.innerText) : null;
    const coursesToDisplay = selectedDay
      ? coursesForMonth.filter(course => course.day === selectedDay)
      : coursesForMonth;
  
    coursesToDisplay.sort((a, b) => a.day - b.day);
  
    coursesToDisplay.forEach(course => {
      const courseElement = document.createElement('div');
      courseElement.className = 'cours-sidebar';
      courseElement.innerHTML = `
        <img src="${course.image}" class="rh-commun" alt="${course.title}">
        <div class="infooo">
          <p class="date-cour2">${course.day} ${mois[currMonth]} ${currYear}</p>
          <p class="nom-cour">${course.title}</p>
        </div>
      `;
      courseElement.addEventListener('click', () => showCourseDetailsPopup(course));
      sidebarCoursesContainer.appendChild(courseElement);
    });
  }
  
  function showCourseDetailsPopup(course) {
    const popupOverlay = document.createElement('div');
    popupOverlay.className = 'popup-overlay';
  
    const popupContent = document.createElement('div');
    popupContent.className = 'popup-content';
  
    const formattedDate = `${course.day} ${mois[currMonth]} ${currYear}`;
    const timeDisplay = course.time || "Non spécifié";
    const typeDisplay = course.type === 'en ligne' ? 'En ligne' : 'Présentiel';
    const meetingLink = course.meetingLink || "#";
  
    popupContent.innerHTML = `
      <div class="popup-header">
        <h3>${course.title}</h3>
        <span class="popup-close">&times;</span>
      </div>
      <div class="popup-body">
        <div class="popup-info">
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Heure:</strong> ${timeDisplay}</p>
          <p><strong>Formateur:</strong> ${course.trainer}</p>
          <p><strong>Type:</strong> ${typeDisplay}</p>
          <p><strong>Lien:</strong> <a href="${meetingLink}" target="_blank">Rejoindre</a></p>
        </div>
      </div>
    `;
  
    popupOverlay.appendChild(popupContent);
    document.body.appendChild(popupOverlay);
  
    popupOverlay.querySelector(".popup-close").addEventListener("click", () => {
      popupOverlay.remove();
    });
  }
  