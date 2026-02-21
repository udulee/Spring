//   Live Clock
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    document.getElementById('currentTime').textContent = `${hours}:${minutes}:${seconds}`;
}
setInterval(updateClock, 1000);
updateClock();

//   Optional: Slight hover movement on cards (subtle effect)
document.querySelectorAll('.nav-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width/2;
        const y = e.clientY - rect.top - rect.height/2;
        card.style.transform = `translate(${x*0.02}px, ${y*0.02}px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translate(0,0)';
    });
});