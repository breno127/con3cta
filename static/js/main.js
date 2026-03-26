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

    // --- Carrossel Automático e Swipe (Mobile + PC) ---
    const track = document.getElementById('carouselTrack');
    if (track) {
        const slides = Array.from(track.children);
        const dots = document.querySelectorAll('.carousel-dots .dot');
        let currentSlideIndex = 0;
        let carouselInterval;
        
        let isDragging = false;
        let startX = 0;
        let currentX = 0;

        function updateCarousel(index) {
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[index]) dots[index].classList.add('active');
        }

        function startInterval() {
            carouselInterval = setInterval(() => {
                currentSlideIndex = (currentSlideIndex + 1) % slides.length;
                updateCarousel(currentSlideIndex);
            }, 4000);
        }

        function resetInterval() {
            clearInterval(carouselInterval);
            startInterval();
        }

        startInterval();

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlideIndex = index;
                updateCarousel(currentSlideIndex);
                resetInterval();
            });
        });

        // Função de Início do Arrastar (Mouse/Touch)
        function dragStart(e) {
            isDragging = true;
            startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
            clearInterval(carouselInterval);
        }

        // Função de Movimento do Arrastar (Mouse/Touch)
        function dragMove(e) {
            if (!isDragging) return;
            currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        }

        // Função de Fim do Arrastar (Mouse/Touch)
        function dragEnd() {
            if (!isDragging) return;
            isDragging = false;
            
            if (!startX || !currentX) {
                resetInterval();
                return;
            }
            
            let diffX = startX - currentX;

            if (Math.abs(diffX) > 40) {
                if (diffX > 0) {
                    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
                } else {
                    currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
                }
                updateCarousel(currentSlideIndex);
            }

            startX = 0;
            currentX = 0;
            resetInterval();
        }

        // Eventos Touch (Telemóvel)
        track.addEventListener('touchstart', dragStart, { passive: true });
        track.addEventListener('touchmove', dragMove, { passive: true });
        track.addEventListener('touchend', dragEnd);

        // Eventos Mouse (PC)
        track.addEventListener('mousedown', dragStart);
        track.addEventListener('mousemove', dragMove);
        track.addEventListener('mouseup', dragEnd);
        track.addEventListener('mouseleave', dragEnd); 
    }
});