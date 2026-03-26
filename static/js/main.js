// static/js/main.js
document.addEventListener('DOMContentLoaded', () => {

    // Inicializa os ícones vetoriais
    lucide.createIcons();

    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    // Começa no modo Light
    let isDark = false;

    let chartFalencia;
    let chartConversao;

    function renderCharts() {
        // Define as cores com base no tema ativo
        const textColor = isDark ? '#ffffff' : '#111111';
        const borderColor = isDark ? '#ffffff' : '#111111';
        const gridColor = isDark ? '#333333' : '#e5e7eb';

        Chart.defaults.color = textColor;
        Chart.defaults.font.family = "'Inter', sans-serif";
        Chart.defaults.font.weight = '600';
        Chart.defaults.borderColor = gridColor;

        if (chartFalencia) chartFalencia.destroy();
        if (chartConversao) chartConversao.destroy();

        // Gráfico 1 (Rosca)
        const ctxFalencia = document.getElementById('chartFalencia').getContext('2d');
        chartFalencia = new Chart(ctxFalencia, {
            type: 'doughnut',
            data: {
                labels: ['Gestão Financeira', 'Planejamento', 'Outros'],
                datasets: [{
                    data: [50, 30, 20],
                    backgroundColor: ['#ff3b30', isDark ? '#3b82f6' : '#0055ff', isDark ? '#333333' : '#f3f4f6'],
                    borderWidth: 2,
                    borderColor: borderColor // Muda a borda de preto pra branco
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false, cutout: '75%',
                plugins: { legend: { position: 'bottom', labels: { padding: 15, usePointStyle: true } } }
            }
        });

        // Gráfico 2 (Linha)
        const ctxConversao = document.getElementById('chartConversao').getContext('2d');
        chartConversao = new Chart(ctxConversao, {
            type: 'line',
            data: {
                labels: ['0m', '5m', '30m', '1h', '24h'],
                datasets: [{
                    label: 'Chances de Venda (%)',
                    data: [100, 80, 30, 10, 1],
                    borderColor: borderColor, // Muda a linha do gráfico
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
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, max: 100, ticks: { callback: (value) => value + '%' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    renderCharts();
    window.addEventListener('resize', renderCharts);

    // Lógica do Botão de Trocar Tema
    themeToggleBtn.addEventListener('click', () => {
        isDark = !isDark;

        if (isDark) {
            htmlElement.setAttribute('data-theme', 'dark');
            // Troca o ícone de lua para sol
            themeToggleBtn.innerHTML = '<i data-lucide="sun"></i>';
        } else {
            htmlElement.removeAttribute('data-theme');
            // Troca o ícone de sol para lua
            themeToggleBtn.innerHTML = '<i data-lucide="moon"></i>';
        }

        // Recria o ícone recém injetado e atualiza os gráficos
        lucide.createIcons();
        renderCharts();
    });
});