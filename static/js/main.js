// static/js/main.js
document.addEventListener('DOMContentLoaded', () => {

    lucide.createIcons();

    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    let isDark = false;
    let chartFalencia;
    let chartConversao;

    function renderCharts() {
        const textColor = isDark ? '#ffffff' : '#111111';
        const borderColor = isDark ? '#ffffff' : '#111111';
        const gridColor = isDark ? '#333333' : '#e5e7eb';

        Chart.defaults.color = textColor;
        Chart.defaults.font.family = "'Inter', sans-serif";
        Chart.defaults.font.weight = '600';
        Chart.defaults.borderColor = gridColor;

        if (chartFalencia) chartFalencia.destroy();
        if (chartConversao) chartConversao.destroy();

        const ctxFalencia = document.getElementById('chartFalencia').getContext('2d');
        chartFalencia = new Chart(ctxFalencia, {
            type: 'doughnut',
            data: {
                labels: ['Gestão Financeira', 'Planejamento', 'Outros'],
                datasets: [{
                    data: [50, 30, 20],
                    backgroundColor: ['#ff3b30', isDark ? '#3b82f6' : '#0055ff', isDark ? '#333333' : '#f3f4f6'],
                    borderWidth: 2,
                    borderColor: borderColor
                }]
            },
            options: {
                responsive: true, 
                maintainAspectRatio: false, 
                cutout: '75%',
                plugins: { legend: { position: 'bottom', labels: { padding: 15, usePointStyle: true } } }
            }
        });

        const ctxConversao = document.getElementById('chartConversao').getContext('2d');
        chartConversao = new Chart(ctxConversao, {
            type: 'line',
            data: {
                labels: ['0m', '5m', '30m', '1h', '24h'],
                datasets: [{
                    label: 'Chances de Venda (%)',
                    data: [100, 80, 30, 10, 1],
                    borderColor: borderColor,
                    backgroundColor: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(0, 85, 255, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.1,
                    pointBackgroundColor: isDark ? '#3b82f6' : '#0055ff',
                    pointBorderWidth: 2,
                    pointBorderColor: borderColor,
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, max: 100, ticks: { callback: (value) => value + '%' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    renderCharts();

    // Atraso intencional no redimensionamento para os gráficos não enlouquecerem no telemóvel
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(renderCharts, 250);
    });

    themeToggleBtn.addEventListener('click', () => {
        isDark = !isDark;
        if (isDark) {
            htmlElement.setAttribute('data-theme', 'dark');
            themeToggleBtn.innerHTML = '<i data-lucide="sun"></i>';
        } else {
            htmlElement.removeAttribute('data-theme');
            themeToggleBtn.innerHTML = '<i data-lucide="moon"></i>';
        }
        lucide.createIcons();
        renderCharts();
    });

    // --- Animações de Scroll ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card-animate-left, .card-animate-right').forEach(el => {
        observer.observe(el);
    });

    // --- Carrossel Automático ---
    const track = document.getElementById('carouselTrack');
    if (track) {
        const slides = Array.from(track.children);
        const dots = document.querySelectorAll('.carousel-dots .dot');
        let currentSlideIndex = 0;

        function updateCarousel(index) {
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[index]) dots[index].classList.add('active');
        }

        setInterval(() => {
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            updateCarousel(currentSlideIndex);
        }, 4000);

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlideIndex = index;
                updateCarousel(currentSlideIndex);
            });
        });
    }
});