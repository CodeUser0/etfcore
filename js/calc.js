const buttons = document.getElementsByClassName('button');

if (buttons.length > 0) {
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function() {
            const initial = parseFloat(document.getElementById('initial').value);
            const contribution = parseFloat(document.getElementById('contribution').value);
            const nominalRate = parseFloat(document.getElementById('rate').value) / 100;
            const inflationRate = parseFloat(document.getElementById('inflation').value) / 100; // Get inflation from input
            let expenses = parseFloat(document.getElementById('expenses').value); // Get expenses from input
            const years = parseInt(document.getElementById('years').value);

            if (isNaN(initial) || isNaN(contribution) || isNaN(nominalRate) || isNaN(inflationRate) || isNaN(expenses) || isNaN(years) ||
                initial < 0 || contribution < 0 || nominalRate < 0 || inflationRate < 0 || expenses < 0 || years < 0) {
                alert("Please enter valid positive numbers for all fields.");
                return;
            }

            // Calculate the real rate of return (using the approximation):
            const realRate = (1 + nominalRate) / (1 + inflationRate) - 1;

            let futureValue = initial;
            const balances = [futureValue];  // Store the initial value as the first year balance
            for (let j = 0; j < years; j++) {
                expenses *= (1 + inflationRate); // Increase expenses by the inflation rate
                futureValue = (futureValue + contribution - expenses) * (1 + realRate);
                balances.push(futureValue);  // Add the calculated future value for the year
            }

            // Update the result text
            document.getElementById('result').textContent = "Approximate end balance: £" + futureValue.toLocaleString();

            // Create or update the chart with the new data
            const ctx = document.getElementById('balanceChart').getContext('2d');

            // Check if the chart already exists and destroy it before creating a new one
            if (window.myChart) {
                window.myChart.destroy();
            }

            window.myChart = new Chart(ctx, {
                type: 'line',  // Changed to 'line' for better investment growth representation
                data: {
                    labels: Array.from({ length: years + 1 }, (_, i) => `Year ${i}`),
                    datasets: [{
                        label: 'Investment Value (£)',
                        data: balances,  // Use the balances array for the chart data
                        borderWidth: 1,
                        borderColor: 'grey',
                        tension: 0.4,  // Smooth the line curve
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        });
    }

    const inputs = document.querySelectorAll('.calculator input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            document.getElementById('result').textContent = "";
        });
    });
} else {
    console.log("No elements with class 'button' found.");
}
