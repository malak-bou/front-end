
document.addEventListener("DOMContentLoaded", () => {
    fetch('header-searchbar.html')
      .then(res => res.text())
      .then(data => {
        document.getElementById("headersearchbar-slot").innerHTML = data;
      });
  });