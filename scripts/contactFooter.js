const path = window.location.pathname;

if (path.endsWith("index.html") || path === "/" || path === "/index.html") {
  // You're on the homepage
  fetch("pages/contactFooter.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("contact-container2").innerHTML = data;
    });
} else {
  // You're on a page inside /pages/
  fetch("contactFooter.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("contact-container2").innerHTML = data;
    });
}
