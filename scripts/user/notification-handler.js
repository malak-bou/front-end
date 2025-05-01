document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the messages page
    if (window.location.href.includes('user-messages.html')) {
        initializeMessagesPage();
    }
    
    // Always update notification dots on any page
    updateNotificationDots();
});

function initializeMessagesPage() {
    // Count initial unread messages
    const unreadMessages = document.querySelectorAll('.message.unread');
    localStorage.setItem('unreadMessagesCount', unreadMessages.length.toString());
    
    // Add click handlers to all messages
    unreadMessages.forEach(message => {
        message.addEventListener('click', function() {
            if (this.classList.contains('unread')) {
                this.classList.remove('unread');
                updateUnreadCount();
            }
        });
    });
}

function updateUnreadCount() {
    const unreadMessages = document.querySelectorAll('.message.unread');
    const count = unreadMessages.length;
    localStorage.setItem('unreadMessagesCount', count.toString());
    updateNotificationDots();
}

function updateNotificationDots() {
    const unreadCount = parseInt(localStorage.getItem('unreadMessagesCount')) || 0;
    const dots = document.querySelectorAll('.notification-dot');
    dots.forEach(dot => {
        dot.style.display = unreadCount > 0 ? 'block' : 'none';
    });
}

// Utility functions for testing
function markAllAsRead() {
    const unreadMessages = document.querySelectorAll('.message.unread');
    unreadMessages.forEach(message => message.classList.remove('unread'));
    updateUnreadCount();
}

function simulateNewMessage() {
    const currentCount = parseInt(localStorage.getItem('unreadMessagesCount')) || 0;
    localStorage.setItem('unreadMessagesCount', (currentCount + 1).toString());
    updateNotificationDots();
} 