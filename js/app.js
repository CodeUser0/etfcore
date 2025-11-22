const apiKey = ""; // Provided by environment at runtime

document.addEventListener('DOMContentLoaded', () => {
    
    // --- INIT WIDGETS (Finlogix) ---
    if (typeof Widget !== 'undefined') {
        Widget.init({
            widgetId: "9c2e86ff-cd79-4cf5-a1aa-5cb3045bb396",
            type: "StripBar",
            language: "en",
            showBrand: false,
            isShowTradeButton: false,
            symbolPairs: [
                { symbolId: "10021", symbolName: "NVIDIA" },
                { symbolId: "10007", symbolName: "Apple" },
                { symbolId: "10029", symbolName: "Microsoft" }
            ],
            isAdaptive: true,
        });
    }

    // --- MOBILE MENU ---
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.getElementById('nav-links');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => { navLinks.classList.toggle('active'); });
    }

    // --- SWIPER ---
    if (typeof Swiper !== 'undefined') {
        const swiper = new Swiper(".swiper", {
            slidesPerView: 1, spaceBetween: 30, loop: true,
            navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
            breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
        });
    }

    // --- FAQ TOGGLE ---
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const item = button.parentElement;
            item.classList.toggle('active');
        });
    });

    // --- CALCULATOR ---
    let myChart = null;
    const ctx = document.getElementById('mainChart')?.getContext('2d');
    
    if (ctx) {
        calculateAndRender('line');
        updateStrategyPreview();

        document.getElementById('calculate-btn').addEventListener('click', () => {
            calculateAndRender(getCurrentChartType());
            updateStrategyPreview();
        });

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                calculateAndRender(this.dataset.type);
            });
        });
    }

    function getCurrentChartType() { 
        return document.querySelector('.tab-btn.active').dataset.type; 
    }

    function calculateAndRender(chartType) {
        const initial = parseFloat(document.getElementById('initial').value) || 0;
        const monthly = parseFloat(document.getElementById('contribution').value) || 0;
        const annualRate = parseFloat(document.getElementById('rate').value) / 100;
        const inflation = parseFloat(document.getElementById('inflation').value) / 100;
        const years = parseInt(document.getElementById('years').value) || 10;
        
        // Real Rate Calculation (Fisher Equation approx)
        const realRate = (1 + annualRate) / (1 + inflation) - 1;
        const monthlyRate = realRate / 12;

        let balance = initial;
        let principal = initial;
        const labels = []; const dataPoints = []; const principalPoints = [];

        for(let i = 0; i <= years; i++) {
            labels.push(`Year ${i}`);
            dataPoints.push(balance);
            principalPoints.push(principal);
            for(let m=0; m<12; m++) {
                balance = (balance + monthly) * (1 + monthlyRate);
                principal += monthly;
            }
        }

        const totalInterest = balance - principal;
        document.getElementById('stat-principal').textContent = `£${principal.toLocaleString(undefined, {maximumFractionDigits:0})}`;
        document.getElementById('stat-interest').textContent = `£${totalInterest.toLocaleString(undefined, {maximumFractionDigits:0})}`;

        if(myChart) myChart.destroy();
        let config = {};

        if(chartType === 'line') {
            config = {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Projected Value', data: dataPoints,
                        borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        fill: true, tension: 0.4, pointRadius: 2
                    }]
                }, options: { responsive: true, maintainAspectRatio: false }
            };
        } else if (chartType === 'bar') {
            const interestPoints = dataPoints.map((val, i) => val - principalPoints[i]);
            config = {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        { label: 'Principal', data: principalPoints, backgroundColor: '#94a3b8' },
                        { label: 'Interest', data: interestPoints, backgroundColor: '#10b981' }
                    ]
                }, options: { responsive: true, maintainAspectRatio: false, scales: { x: { stacked: true }, y: { stacked: true } } }
            };
        } else if (chartType === 'doughnut') {
            config = {
                type: 'doughnut',
                data: {
                    labels: ['Your Money', 'Compound Interest'],
                    datasets: [{
                        data: [principal, totalInterest],
                        backgroundColor: ['#94a3b8', '#10b981'], hoverOffset: 4
                    }]
                }, options: { responsive: true, maintainAspectRatio: false }
            };
        }
        myChart = new Chart(ctx, config);
    }

    // --- SEARCH ---
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        const articles = document.querySelectorAll('.article-card');
        searchInput.addEventListener('input', function () {
            const filter = this.value.toLowerCase();
            articles.forEach((article) => {
                const title = article.getAttribute('data-title').toLowerCase();
                article.style.display = title.includes(filter) ? 'flex' : 'none';
            });
        });
    }
});

// --- GLOBAL FUNCTIONS (For onclick HTML attributes) ---

function checkAnswer(isCorrect) {
    const result = document.getElementById('quiz-result');
    if(isCorrect) {
        result.style.display = 'block'; result.style.color = '#4ade80';
        result.innerHTML = "Correct! An ETF holds many assets to spread risk.";
    } else {
        result.style.display = 'block'; result.style.color = '#f87171';
        result.innerText = "Not quite! An ETF is a basket, not a single stock.";
    }
}

function updateStrategyPreview() {
    const initial = document.getElementById('initial').value;
    const monthly = document.getElementById('contribution').value;
    const years = document.getElementById('years').value;
    const rate = document.getElementById('rate').value;
    const preview = document.getElementById('strategy-preview');
    if(preview) {
        preview.innerText = `Initial: £${initial} | Monthly: £${monthly} | Term: ${years} Years | Rate: ${rate}%`;
    }
}

function switchAiTab(tabName) {
    document.querySelectorAll('.ai-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`panel-${tabName}`).classList.add('active');
    document.querySelectorAll('.ai-tab-btn').forEach(b => b.classList.remove('active'));
    const buttons = document.querySelectorAll('.ai-tab-btn');
    // Simple logic to toggle active class on buttons
    // We assume the order is Jargon (0) then Strategy (1)
    if(tabName === 'jargon') buttons[0].classList.add('active');
    else buttons[1].classList.add('active');
}

async function callGeminiAPI(prompt, resultElementId, loadingElementId) {
    const resultEl = document.getElementById(resultElementId);
    const loadingEl = document.getElementById(loadingElementId);
    resultEl.style.display = 'none'; loadingEl.style.display = 'block';

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    const payload = { contents: [{ parts: [{ text: prompt }] }] };

    const delays = [1000, 2000, 4000];
    let success = false;

    for (let i = 0; i <= delays.length; i++) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
                const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
                resultEl.innerHTML = formattedText;
                resultEl.style.display = 'block';
                success = true;
                break;
            }
        } catch (error) {
            if (i < delays.length) await new Promise(resolve => setTimeout(resolve, delays[i]));
        }
    }
    loadingEl.style.display = 'none';
    if (!success) {
        resultEl.innerHTML = "<span style='color:red'>AI service unavailable. Try again later.</span>";
        resultEl.style.display = 'block';
    }
}

function runJargonBuster() {
    const userText = document.getElementById('jargon-input').value;
    if(!userText.trim()) { alert("Please enter some text!"); return; }
    const prompt = `Explain this financial text simply for a beginner: "${userText}"`;
    callGeminiAPI(prompt, 'jargon-result', 'jargon-loading');
}

function runStrategyAnalyst() {
    const initial = document.getElementById('initial').value;
    const monthly = document.getElementById('contribution').value;
    const years = document.getElementById('years').value;
    const rate = document.getElementById('rate').value;
    const inflation = document.getElementById('inflation').value;
    const prompt = `User Plan: Initial £${initial}, Monthly £${monthly}, ${years} years, Growth ${rate}%, Inflation ${inflation}%. 
    1. Summarize potential result.
    2. Give 3 motivational tips.
    3. Disclaimer: Not financial advice.`;
    callGeminiAPI(prompt, 'strategy-result', 'strategy-loading');
}
