document.addEventListener('DOMContentLoaded', function() {
    // --- Data Definitions ---
    const moduleData = {
        1: [
            { name: "Introduction to Computer Science", id: "ics" },
            { name: "Mathematics for Computing", id: "mc" },
            { name: "Algorithms & Programming Fundamentals", id: "apf" },
            { name: "Digital Logic & Computer Organization", id: "dl" },
            { name: "Object Oriented Programming", id: "oop" },
            { name: "Data Management 1", id: "dm1" },
            { name: "Computer Networks", id: "cn" },
            { name: "GUI Development", id: "gui" },
            { name: "Software Engineering", id: "se" },
            { name: "Enterprise Application Development 1", id: "ead1" },
            { name: "Operating Systems", id: "os" },
            { name: "Developing Modern Web", id: "dmw" },
            { name: "Effective Communication Skills 1", id: "ecs1" }
        ],
        2: [
            { name: "Prog, Data Structures & Algorithms 1", id: "pdsa1" },
            { name: "Enterprise Application Development 2", id: "ead2" },
            { name: "Data Management 2", id: "dm2" },
            { name: "Statistics for Computing", id: "stats" },
            { name: "Data Warehousing & BI", id: "dwbi" },
            { name: "Mobile Application Development", id: "mobile" },
            { name: "Internet of Things (IoT)", id: "iot" },
            { name: "Machine Learning", id: "ml" },
            { name: "IT Management Practices", id: "itmp" },
            { name: "Robotics Application Development", id: "robotics" }
        ],
        3: [
            { name: "User Experience (UX) Designing", id: "ux" },
            { name: "Prog, Data Structures & Algorithms 2", id: "pdsa2" },
            { name: "Social, Legal & Ethical Context", id: "ethics" },
            { name: "Cyber Security", id: "cyber" },
            { name: "Data Science", id: "ds" },
            { name: "Agile Development Methodologies", id: "agile" }
        ],
        4: [
            { name: "Web API Development", id: "webapi" },
            { name: "Project Discovery", id: "pd" },
            { name: "IOS Development", id: "ios" },
            { name: "Computer Vision", id: "cv" },
            { name: "Artificial Intelligence", id: "ai" },
            { name: "Dissertation & Project Artefact", id: "project" }
        ]
    };

    // --- State Management ---
    let currentProgram = 'diploma'; // 'diploma', 'hnd', 'degree'
    let currentYear = 1;
    let gpaState = {
        1: {}, // year: {moduleId: score}
        2: {},
        3: {},
        4: {}
    };

    // --- DOM Elements ---
    const programSelect = document.getElementById('program');
    const yearTabsContainer = document.getElementById('year-tabs');
    const inputsContainer = document.getElementById('inputs-container');
    const displayGpa = document.getElementById('display-gpa');
    const resultText = document.getElementById('result-text');
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const pageTitle = document.getElementById('page-title');

    // --- Functions ---

    function init() {
        renderTabs();
        renderInputs();
        setupEventListeners();
    }

    function renderTabs() {
        const tabs = yearTabsContainer.querySelectorAll('.year-tab');
        tabs.forEach(tab => {
            const yearNum = parseInt(tab.dataset.year);
            if (currentProgram === 'diploma') {
                tab.style.display = yearNum === 1 ? 'block' : 'none';
            } else if (currentProgram === 'hnd') {
                tab.style.display = yearNum <= 2 ? 'block' : 'none';
            } else {
                tab.style.display = 'block';
            }
        });
    }

    function renderInputs() {
        inputsContainer.innerHTML = '';
        const modules = moduleData[currentYear] || [];
        
        pageTitle.textContent = `Year ${currentYear} Modules`;

        modules.forEach(mod => {
            const group = document.createElement('div');
            group.className = 'input-group';
            
            const savedValue = gpaState[currentYear][mod.id] || '';
            
            group.innerHTML = `
                <label title="${mod.name}">${mod.name}</label>
                <input type="number" 
                       id="${mod.id}" 
                       placeholder="0.00" 
                       min="0" max="4" step="0.01" 
                       value="${savedValue}">
            `;
            
            // Auto-save on input
            const input = group.querySelector('input');
            input.addEventListener('input', (e) => {
                gpaState[currentYear][mod.id] = e.target.value;
            });
            
            inputsContainer.appendChild(group);
        });
    }

    function calculateGPA() {
        let totalWeightedGPA = 0;
        let totalYearsCount = 0;

        // Determine which years to include based on program
        let yearsToInclude = [1];
        if (currentProgram === 'hnd') yearsToInclude = [1, 2];
        if (currentProgram === 'degree') yearsToInclude = [1, 2, 3, 4];

        let grandTotalPoints = 0;
        let grandTotalModules = 0;

        yearsToInclude.forEach(yr => {
            let yearPoints = 0;
            let yearModules = 0;
            
            const modules = moduleData[yr];
            modules.forEach(mod => {
                const val = parseFloat(gpaState[yr][mod.id]);
                if (!isNaN(val) && val >= 0 && val <= 4) {
                    yearPoints += val;
                    yearModules++;
                }
            });

            if (yearModules > 0) {
                grandTotalPoints += (yearPoints / yearModules);
                grandTotalModules++;
            }
        });

        if (grandTotalModules === 0) {
            displayGpa.textContent = "0.00";
            updateBadge(0);
            return;
        }

        const finalGPA = grandTotalPoints / grandTotalModules;
        displayGpa.textContent = finalGPA.toFixed(2);
        updateBadge(finalGPA);
    }

    function updateBadge(gpa) {
        if (gpa === 0) {
            resultText.textContent = "Enter your grades";
            resultText.style.background = "rgba(255,255,255,0.2)";
        } else if (gpa >= 3.5) {
            resultText.textContent = "Excellent Performance!";
            resultText.style.background = "var(--accent)";
        } else if (gpa >= 2.5) {
            resultText.textContent = "Good Progress";
            resultText.style.background = "var(--primary)";
        } else {
            resultText.textContent = "Focus Required";
            resultText.style.background = "var(--secondary)";
        }
    }

    function setupEventListeners() {
        programSelect.addEventListener('change', (e) => {
            currentProgram = e.target.value;
            if (currentYear > 1 && currentProgram === 'diploma') currentYear = 1;
            if (currentYear > 2 && currentProgram === 'hnd') currentYear = 1;
            
            renderTabs();
            // Update active tab UI
            yearTabsContainer.querySelectorAll('.year-tab').forEach(t => {
                t.classList.toggle('active', parseInt(t.dataset.year) === currentYear);
            });
            renderInputs();
        });

        yearTabsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('year-tab')) {
                const yearNum = parseInt(e.target.dataset.year);
                
                // Switch Tabs
                yearTabsContainer.querySelectorAll('.year-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                currentYear = yearNum;
                renderInputs();
            }
        });

        calculateBtn.addEventListener('click', calculateGPA);

        resetBtn.addEventListener('click', () => {
            if (confirm("Are you sure you want to reset everything?")) {
                gpaState = { 1: {}, 2: {}, 3: {}, 4: {} };
                displayGpa.textContent = "0.00";
                updateBadge(0);
                renderInputs();
            }
        });
    }

    init();
});