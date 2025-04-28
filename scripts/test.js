// Test file
console.log("Test file loaded!");

function testToggleSections() {
  console.log("Testing if toggleSections exists in global scope");
  if (typeof toggleSections === 'function') {
    console.log("toggleSections exists!");
    toggleSections();
  } else {
    console.log("toggleSections function not found!");
  }
}

// Run the test when the page loads
window.addEventListener('DOMContentLoaded', () => {
  console.log("DOM loaded, running test...");
  testToggleSections();
}); 