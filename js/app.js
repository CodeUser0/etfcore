// ----- Mobile menu toggle -----
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');

menuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Close menu when clicking outside (optional)
document.addEventListener('click', (e) => {
  if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
    navLinks.classList.remove('active');
  }
});

// ----- Calculator JS -----
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.getElementsByClassName('button');

  if (buttons.length > 0) {
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function () {
        const initial = parseFloat(document.getElementById('initial').value);
        const contribution = parseFloat(document.getElementById('contribution').value);
        const nominalRate = parseFloat(document.getElementById('rate').value) / 100;
        const inflationRate = parseFloat(document.getElementById('inflation').value) / 100;
        let expenses = parseFloat(document.getElementById('expenses').value);
        const years = parseInt(document.getElementById('years').value);

        if (
          isNaN(initial) ||
          isNaN(contribution) ||
          isNaN(nominalRate) ||
          isNaN(inflationRate) ||
          isNaN(expenses) ||
          isNaN(years) ||
          initial < 0 ||
          contribution < 0 ||
          nominalRate < 0 ||
          inflationRate < 0 ||
          expenses < 0 ||
          years < 0
        ) {
          alert('Please enter valid positive numbers for all fields.');
          return;
        }

        const realRate = (1 + nominalRate) / (1 + inflationRate) - 1;

        let futureValue = initial;
        const balances = [futureValue];
        for (let j = 0; j < years; j++) {
          expenses *= 1 + inflationRate;
          futureValue = (futureValue + contribution - expenses) * (1 + realRate);
          balances.push(futureValue);
        }

        document.getElementById('result').textContent =
          'Approximate end balance: £' + futureValue.toLocaleString();

        const ctx = document.getElementById('balanceChart').getContext('2d');

        if (window.myChart) {
          window.myChart.destroy();
        }

        window.myChart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: Array.from({ length: years + 1 }, (_, i) => `Year ${i}`),
            datasets: [
              {
                label: 'Investment Value (£)',
                data: balances,
                borderWidth: 1,
                borderColor: 'grey',
                tension: 0.4,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      });
    }

    const inputs = document.querySelectorAll('.calculator input[type="number"]');
    inputs.forEach((input) => {
      input.addEventListener('input', () => {
        document.getElementById('result').textContent = '';
      });
    });
  } else {
    console.log("No elements with class 'button' found.");
  }
});
