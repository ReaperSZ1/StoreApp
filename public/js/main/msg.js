window.addEventListener('DOMContentLoaded', () => {
    const messages = document.querySelectorAll('.msg-responsive');
    messages.forEach(msg => {
        setTimeout(() => {
            msg.classList.add('opacity-0');
            setTimeout(() => msg.remove(), 500); 
        }, 3000); 
    });
});
