document.addEventListener('DOMContentLoaded', function() {
    const calculateButton = document.querySelector('button[type="button"]');
    const resetButton = document.getElementById('reset-btn');
    const gpaSpan = document.querySelector('.gpa');
    const resultText = document.getElementById('result-text');
    
    // Calculate GPA
    calculateButton.addEventListener('click', function() {
        const inputs = document.querySelectorAll('input[type="number"]');
        let totalGPA = 0;
        let count = 0;
        
        inputs.forEach(input => {
            if (input.value !== '') {
                const value = parseFloat(input.value);
                // Check if the value is within valid GPA range (0-4.0)
                if (value >= 0 && value <= 4.0) {
                    totalGPA += value;
                    count++;
                } else {
                    alert("Please enter GPA values between 0 and 4.0.");
                    return;
                }
            }
        });
        
        if (count === 0) {
            gpaSpan.textContent = "0.0";
            resultText.textContent = "Please enter at least one GPA";
            return;
        }
        
        // Calculate average GPA
        const averageGPA = totalGPA / count;
        
        // Update the GPA display in the left sidebar
        gpaSpan.textContent = averageGPA.toFixed(1);
        
        // Update the result text based on GPA range
        updateResultText(averageGPA);
    });
    
    // Reset functionality
    resetButton.addEventListener('click', function() {
        document.querySelectorAll('input[type="number"]').forEach(input => input.value = '');
        gpaSpan.textContent = "0.0";
        resultText.textContent = "Enter your grades";
        resultText.className = "";
    });
    
    // Update result text based on GPA
    function updateResultText(gpa) {
        if (gpa >= 3.5) {
            resultText.textContent = "Excellent Performance!";
            resultText.className = "excellent";
        } else if (gpa >= 2.5) {
            resultText.textContent = "Good Job!";
            resultText.className = "good";
        } else if (gpa >= 1.5) {
            resultText.textContent = "Average Performance";
            resultText.className = "average";
        } else {
            resultText.textContent = "Needs Improvement";
            resultText.className = "needs-improvement";
        }
    }
});