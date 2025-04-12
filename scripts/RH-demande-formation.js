function toggleNav() {
  document.getElementById("sidebar").classList.toggle("active"); // Ajouter ou supprimer la classe active
}




















// calendar
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
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(), // getting first day of month
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
      type: "Enligne"
    },
    {
      title: "Demande 2",
      department: "Département IT",
      professor: "Houda G.",
      course: "Cybersécurité",
      date: "21/03/2025",
      type: "Présentiel"
    }
  ],
  "Marketing": [
    {
      title: "Demande 1",
      department: "Département Marketing",
      professor: "Sana Khelifi",
      course: "Stratégie digitale",
      date: "22/03/2025",
      type: "Présentiel"
    }
  ],
  "RH": [
    {
      title: "Demande 1",
      department: "Département RH",
      professor: "Mohamed Ali",
      course: "Gestion des talents",
      date: "10/03/2025",
      type: "Enligne"
    }
    
  
    
  ],
  
  
  
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
  } else {
    // If there are no demandes for the selected department
    document.getElementById("demandeTitle").innerText = "Aucune demande";
    document.getElementById("department").innerText = selectedDepartment;
    document.getElementById("prof").innerText = "-";
    document.getElementById("course").innerText = "-";
    document.getElementById("date").innerText = "-";
    document.getElementById("type").innerText = "-";
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
    if (allDemandes[selectedDept] && allDemandes[selectedDept].length > 0) {
      selectedDepartment = selectedDept;
      selectedDemandeIndex = 0; // Reset to first demande
      updateDemande(); // Update the demande display
    } else {
      // If no demandes exist for the selected department
      document.getElementById("demandeTitle").innerText = "Aucune demande";
      document.getElementById("department").innerText = selectedDept;
      document.getElementById("prof").innerText = "-";
      document.getElementById("course").innerText = "-";
      document.getElementById("date").innerText = "-";
      document.getElementById("type").innerText = "-";
    }
  });
});

// Initial render
updateDemande();
updateBadges(); // Ensure badges are updated when the page loads







// to show the additional sections
// Get the "Ajouter" button and the sections
const ajouterButton = document.querySelector('.Ajoute-button');  
const textContainer = document.querySelector('.text-container');
const calendarSection = document.querySelector('.calendar-section');

ajouterButton.addEventListener('click', () => {
  textContainer.classList.remove('hidden-section');
  calendarSection.classList.remove('hidden-section');
});











// to show the message section
const messageBtn = document.getElementById('messageBtn');
  const messageSection2 = document.querySelector('.message-section');

  // When the Message button is clicked, toggle the visibility of the message section
  messageBtn.addEventListener('click', () => {
    // Toggle the display of the message section
    if (messageSection2.style.display === 'none' || messageSection2.style.display === '') {
      messageSection2.style.display = 'block';
    } else {
      messageSection2.style.display = 'none';
    }
  });





  // Variables
// to show the message section
const messageBtn2 = document.getElementById('messagebtn2');
  const messageSection3 = document.querySelector('.message-section');

  
  messageBtn2.addEventListener('click', () => {
  
    if (messageSection3.style.display === 'none' || messageSection3.style.display === '') {
      messageSection3.style.display = 'block';
    } else {
      messageSection3.style.display = 'none';
    }
  });





  // Variables
  const jourElement = document.querySelector(".days"),
  dateActuelle = document.querySelector(".current-date"),
  iconesNavigation = document.querySelectorAll(".icons span"),
  addDayBtn = document.getElementById("addDayBtn");

let selectedDay = null;

// Fonction pour afficher le calendrier
const afficherCalendrier = () => {
let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
    lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
    lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
    lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
let liTag = "";

// Remplir les jours du mois précédent
for (let i = firstDayofMonth; i > 0; i--) {
    liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
}

// Remplir les jours du mois actuel
for (let i = 1; i <= lastDateofMonth; i++) {
    let isToday = i === date.getDate() && currMonth === new Date().getMonth() 
                 && currYear === new Date().getFullYear() ? "active" : "";
    liTag += `<li class="${isToday}" data-day="${i}">${i}</li>`;
}

// Remplir les jours du mois suivant
for (let i = lastDayofMonth; i < 6; i++) {
    liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
}

dateActuelle.innerText = `${months[currMonth]} ${currYear}`;
jourElement.innerHTML = liTag;

// Ajouter un gestionnaire de clic sur chaque jour
document.querySelectorAll(".days li").forEach(day => {
    day.addEventListener("click", () => {
        if (!day.classList.contains("inactive")) {
            // Sauvegarder le jour sélectionné
            selectedDay = day;
            day.classList.add("selected");
        }
    });
});
};

// Changer de mois avec les flèches
iconesNavigation.forEach(icon => {
icon.addEventListener("click", () => {
    currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;
    if (currMonth < 0 || currMonth > 11) {
        date = new Date(currYear, currMonth, new Date().getDate());
        currYear = date.getFullYear();
        currMonth = date.getMonth();
    } else {
        date = new Date();
    }
    afficherCalendrier();
});
});

// Ajouter la couleur au jour sélectionné quand le bouton "Ajouter" est cliqué
addDayBtn.addEventListener("click", () => {
if (selectedDay) {
    selectedDay.style.backgroundColor = "#FF6347";
   
     // Choisir la couleur de votre choix
    selectedDay.style.color = "#fff";
  


} else {
    alert("Veuillez sélectionner un jour d'abord!");
}
});

afficherCalendrier();
