function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    // Check the current width of the sidebar and adjust it
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0"; // Close the sidebar
    } else {
        sidebar.style.width = "250px"; // Open the sidebar
    }
}

