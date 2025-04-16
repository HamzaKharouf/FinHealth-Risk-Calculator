document.addEventListener('DOMContentLoaded', function() {
    // Add this at the beginning of your existing DOMContentLoaded function
    const instructionsModal = new bootstrap.Modal(document.getElementById('instructionsModal'));
    const instructionsCheck = document.getElementById('instructionsCheck');
    const startAfterInstructions = document.getElementById('startAfterInstructions');
    
    // Modify the existing start assessment click handler
    document.getElementById('startAssessment').addEventListener('click', () => {
        instructionsModal.show();
    });

    // Add these new event listeners
    instructionsCheck.addEventListener('change', (e) => {
        startAfterInstructions.disabled = !e.target.checked;
    });

    startAfterInstructions.addEventListener('click', () => {
        instructionsModal.hide();
        homePage.classList.add('d-none');
        questionContainer.classList.remove('d-none');
        showQuestion(0);
    });

    const questions = [
        {
            id: 'ageGroup',
            title: 'Personal Information',
            question: 'Which age group do you belong to?',
            options: [
                { value: 'teen', label: '13-19 years' },
                { value: 'student', label: 'University Student' },
                { value: 'young', label: 'Young Professional (20-25)' },
                { value: 'adult', label: '26+ years' }
            ]
        },
        {
            id: 'incomeSource',
            title: 'Income Source',
            question: 'What is your primary source of income?',
            options: [
                { value: 'multiple', label: 'Multiple income sources' },
                { value: 'fulltime', label: 'Full-time job' },
                { value: 'parttime', label: 'Part-time job' },
                { value: 'allowance', label: 'Allowance/Support' }
            ]
        },
        {
            id: 'savingsBehavior',
            title: 'Savings Habits',
            question: 'How much of your income do you save?',
            options: [
                { value: 'high', label: 'More than 30%' },
                { value: 'medium', label: '15-30%' },
                { value: 'low', label: 'Less than 15%' },
                { value: 'none', label: 'I don\'t save regularly' }
            ]
        },
        {
            id: 'financialPlanning',
            title: 'Financial Planning',
            question: 'How do you manage your finances to ensure you are financially prepared for the future?',
            options: [
                { value: 'strict', label: 'I follow a detailed monthly budget and track every expense' },
                { value: 'flexible', label: 'I have a budget, but I allow flexibility for unexpected expenses' },
                { value: 'rough', label: 'I have a general idea of my income and spending but don\'t track it strictly' },
                { value: 'none', label: 'I don\'t actively plan or track my finances' }
            ]
        },
        {
            id: 'riskPreference',
            title: 'Investment Risk Preference',
            question: 'In an investment scenario, which of these options would you be most comfortable with?',
            options: [
                { value: 'guaranteed', label: 'A guaranteed 5% annual return with minimal risk' },
                { value: 'moderate', label: 'A 50% chance to earn 15% return, or break even' },
                { value: 'high', label: 'A 20% chance to earn 40% return, but could lose 10%' },
                { value: 'none', label: 'I would rather keep my money in a savings account' }
            ]
        },
        {
            id: 'investmentResponse',
            title: 'Investment Behavior',
            question: 'How do you react to investment losses?',
            options: [
                { value: 'calm', label: 'Stay calm and hold' },
                { value: 'worried', label: 'Worried but consult first' },
                { value: 'sell', label: 'Sell to avoid further losses' },
                { value: 'advice', label: 'Seek professional advice' }
            ]
        },
        {
            id: 'financialGoals',
            title: 'Financial Goals',
            question: 'What are your primary financial goals?',
            options: [
                { value: 'longterm', label: 'Long-term wealth building' },
                { value: 'emergency', label: 'Building emergency fund' },
                { value: 'shortterm', label: 'Short-term purchases' },
                { value: 'none', label: 'No specific goals' }
            ]
        },
        {
            id: 'financialKnowledge',
            title: 'Financial Knowledge',
            question: 'How do you learn about money management?',
            options: [
                { value: 'active', label: 'Active learning (Courses/Research)' },
                { value: 'casual', label: 'Read financial articles' },
                { value: 'family', label: 'Learn from family/friends' },
                { value: 'none', label: 'Never learned about it' }
            ]
        },
        {
            id: 'emergencyPreparedness',
            title: 'Emergency Preparedness',
            question: 'How many months of expenses could you cover if you lost income?',
            options: [
                { value: 'sixplus', label: '6+ months' },
                { value: 'threesix', label: '3-6 months' },
                { value: 'onetothree', label: '1-3 months' },
                { value: 'less', label: 'Less than 1 month' }
            ]
        },
        {
            id: 'futurePlanning',
            title: 'Future Planning',
            question: 'Have you started planning for long-term financial goals?',
            options: [
                { value: 'active', label: 'Yes, actively planning/investing' },
                { value: 'starting', label: 'Starting to plan' },
                { value: 'thinking', label: 'Thinking about it' },
                { value: 'none', label: 'Not yet' }
            ]
        }
    ];

    let currentQuestion = 0;
    const responses = {};

    const homePage = document.getElementById('homePage');
    const questionContainer = document.getElementById('questionContainer');
    const resultsPage = document.getElementById('resultsPage');
    const progressBar = document.getElementById('progressBar');
    const riskForm = document.getElementById('riskForm');
    const prevButton = document.getElementById('prevQuestion');
    const nextButton = document.getElementById('nextQuestion');
    const riskScore = document.getElementById('riskScore');
    const recommendations = document.getElementById('recommendations');

    const ctx = document.getElementById('riskMeter').getContext('2d');
    const riskMeter = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [0, 100],
                backgroundColor: ['#4CAF50', '#ecf0f1']
            }]
        },
        options: {
            cutout: '80%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            }
        }
    });

    document.getElementById('startAssessment').addEventListener('click', () => {
        homePage.classList.add('d-none');
        questionContainer.classList.remove('d-none');
        showQuestion(0);
    });

    document.getElementById('restartAssessment').addEventListener('click', () => {
        // Reset all responses
        Object.keys(responses).forEach(key => delete responses[key]);
        currentQuestion = 0;
        
        // Hide results and show home page
        resultsPage.classList.add('d-none');
        homePage.classList.remove('d-none');
        
        // Reset the risk meter
        riskMeter.data.datasets[0].data = [0, 100];
        riskMeter.data.datasets[0].backgroundColor = ['#4CAF50', '#ecf0f1'];
        riskMeter.update();
    });

    prevButton.addEventListener('click', () => {
        if (currentQuestion > 0) {
            showQuestion(currentQuestion - 1);
        }
    });

    nextButton.addEventListener('click', () => {
        const currentInput = document.querySelector(`input[name="${questions[currentQuestion].id}"]:checked`);
        
        if (!currentInput) {
            alert('Please select an option to continue');
            return;
        }

        responses[questions[currentQuestion].id] = currentInput.value;

        if (currentQuestion === questions.length - 1) {
            showResults();
        } else {
            showQuestion(currentQuestion + 1);
        }
    });

    function showQuestion(index) {
        currentQuestion = index;
        const question = questions[index];
    
        // Update question counter (now only updates one counter)
        document.getElementById('currentQuestionNum').textContent = index + 1;
        document.getElementById('totalQuestions').textContent = questions.length;

        const progress = ((index + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;

        prevButton.style.visibility = index === 0 ? 'hidden' : 'visible';
        nextButton.textContent = index === questions.length - 1 ? 'Submit' : 'Next';

        riskForm.innerHTML = `
            <h3 class="mb-3">${question.title}</h3>
            <div class="mb-4">
                <label class="d-block mb-3">${question.question}</label>
                ${question.options.map(option => `
                    <div class="form-check mb-2">
                        <input class="form-check-input" type="radio" 
                            name="${question.id}" 
                            id="${question.id}_${option.value}" 
                            value="${option.value}"
                            ${responses[question.id] === option.value ? 'checked' : ''}>
                        <label class="form-check-label" for="${question.id}_${option.value}">
                            ${option.label}
                        </label>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function showResults() {
        questionContainer.classList.add('d-none');
        resultsPage.classList.remove('d-none');
        
        const result = calculateRisk(responses);
        updateDisplay(result);
        displayDetailedReport(responses, result.score);
    }

    function calculateRisk(responses) {
        const scoringRules = {
            ageGroup: { adult: 10, young: 8, student: 6, teen: 4 },
            riskPreference: { guaranteed: 10, moderate: 7, high: 5, none: 3 },
            incomeSource: { multiple: 10, fulltime: 8, parttime: 5, allowance: 3 },
            savingsBehavior: { high: 15, medium: 10, low: 5, none: 0 },
            financialPlanning: { strict: 10, flexible: 7, rough: 4, none: 0 },
            investmentResponse: { calm: 10, worried: 7, advice: 5, sell: 3 },
            financialGoals: { longterm: 10, emergency: 8, shortterm: 5, none: 0 },
            financialKnowledge: { active: 10, casual: 7, family: 5, none: 0 },
            emergencyPreparedness: { sixplus: 10, threesix: 7, onetothree: 4, less: 0 },
            futurePlanning: { active: 5, starting: 3, thinking: 2, none: 0 }
        };

        let score = 0;
        const recommendations = [];

        Object.keys(responses).forEach(key => {
            if (scoringRules[key] && scoringRules[key][responses[key]]) {
                score += scoringRules[key][responses[key]];
            }
        });

        if (responses.savingsBehavior === 'none' || responses.savingsBehavior === 'low') {
            recommendations.push("Start with a basic savings plan - aim to save at least 20% of your income.");
        }
        if (responses.emergencyPreparedness === 'less' || responses.emergencyPreparedness === 'onetothree') {
            recommendations.push("Build an emergency fund covering at least 3-6 months of expenses.");
        }
        if (responses.financialKnowledge === 'none') {
            recommendations.push("Consider taking basic financial literacy courses.");
        }
        if (responses.financialPlanning === 'none') {
            recommendations.push("Start tracking your expenses and create a monthly budget.");
        }

        return {
            score: Math.min(100, Math.max(0, score)),
            recommendations: recommendations
        };
    }

    function updateDisplay(result) {
        const colors = {
            excellent: '#4CAF50',
            good: '#8BC34A',
            average: '#FFC107',
            needsImprovement: '#FF5722'
        };

        let color = colors.needsImprovement;
        let category = '';

        if (result.score >= 90) {
            category = 'Excellent';
            color = colors.excellent;
        } else if (result.score >= 70) {
            category = 'Good';
            color = colors.good;
        } else if (result.score >= 50) {
            category = 'Average';
            color = colors.average;
        } else {
            category = 'Needs Improvement';
            color = colors.needsImprovement;
        }

        // Update risk meter and score display
        riskMeter.data.datasets[0].data = [result.score, 100 - result.score];
        riskMeter.data.datasets[0].backgroundColor = [color, '#ecf0f1'];
        riskMeter.update();

        // Update the score display
        const scoreDisplay = document.querySelector('.score-display');
        scoreDisplay.innerHTML = `
            <div class="percentage" style="color: ${color}">${Math.round(result.score)}%</div>
            <div class="category" style="color: ${color}">Category: ${category}</div>
        `;

        // Add disclaimer
        const riskScore = document.querySelector('#riskScore');
        riskScore.innerHTML = `
            <div class="disclaimer mt-3">
                <p><i class="fas fa-info-circle"></i> This assessment provides general guidance only. For accurate financial advice tailored to your specific situation, please consult with a qualified financial advisor.</p>
            </div>
        `;
    }

    function displayDetailedReport(responses, score) {
        const scoringRules = {
            ageGroup: { adult: 10, young: 8, student: 6, teen: 4 },
            riskPreference: { guaranteed: 10, moderate: 7, high: 5, none: 3 },
            incomeSource: { multiple: 10, fulltime: 8, parttime: 5, allowance: 3 },
            savingsBehavior: { high: 15, medium: 10, low: 5, none: 0 },
            financialPlanning: { strict: 10, flexible: 7, rough: 4, none: 0 },
            investmentResponse: { calm: 10, worried: 7, advice: 5, sell: 3 },
            financialGoals: { longterm: 10, emergency: 8, shortterm: 5, none: 0 },
            financialKnowledge: { active: 10, casual: 7, family: 5, none: 0 },
            emergencyPreparedness: { sixplus: 10, threesix: 7, onetothree: 4, less: 0 },
            futurePlanning: { active: 5, starting: 3, thinking: 2, none: 0 }
        };

        const getPointsEarned = (category, response) => {
            return scoringRules[category][response] || 0;
        };

        const reportHTML = `
            <div class="report-sections">
                <div class="report-section">
                    <h5>Financial Health Overview</h5>
                    <p>${getFinancialAnalysis(responses)}</p>
                    <div class="points-list">
                        <div class="points-display">Age Group: ${getPointsEarned('ageGroup', responses.ageGroup)}/10 points</div>
                        <div class="points-display">Income Source: ${getPointsEarned('incomeSource', responses.incomeSource)}/10 points</div>
                        <div class="points-display">Savings Behavior: ${getPointsEarned('savingsBehavior', responses.savingsBehavior)}/15 points</div>
                    </div>
                </div>
                <div class="report-section">
                    <h5>Investment Profile</h5>
                    <p>${getInvestmentAnalysis(responses)}</p>
                    <div class="points-list">
                        <div class="points-display">Risk Preference: ${getPointsEarned('riskPreference', responses.riskPreference)}/10 points</div>
                        <div class="points-display">Investment Response: ${getPointsEarned('investmentResponse', responses.investmentResponse)}/10 points</div>
                    </div>
                </div>
                <div class="report-section">
                    <h5>Planning & Preparedness</h5>
                    <p>${getPlanningAnalysis(responses)}</p>
                    <div class="points-list">
                        <div class="points-display">Financial Planning: ${getPointsEarned('financialPlanning', responses.financialPlanning)}/10 points</div>
                        <div class="points-display">Emergency Preparedness: ${getPointsEarned('emergencyPreparedness', responses.emergencyPreparedness)}/10 points</div>
                        <div class="points-display">Future Planning: ${getPointsEarned('futurePlanning', responses.futurePlanning)}/5 points</div>
                    </div>
                </div>
                <div class="report-section">
                    <h5>Financial Goals & Knowledge</h5>
                    <p>${getKnowledgeAnalysis(responses)}</p>
                    <div class="points-list">
                        <div class="points-display">Financial Goals: ${getPointsEarned('financialGoals', responses.financialGoals)}/10 points</div>
                        <div class="points-display">Financial Knowledge: ${getPointsEarned('financialKnowledge', responses.financialKnowledge)}/10 points</div>
                    </div>
                </div>
            </div>
        `;

        recommendations.innerHTML = reportHTML;
    }

    function getFinancialAnalysis(responses) {
        const analyses = {
            high: "You demonstrate excellent financial discipline with high savings and structured planning.",
            medium: "You show good financial awareness but there's room for improvement.",
            low: "Consider strengthening your financial foundation through better saving and planning habits."
        };

        const savingsLevel = responses.savingsBehavior === 'high' ? 'high' : 
                           responses.savingsBehavior === 'medium' ? 'medium' : 'low';

        return analyses[savingsLevel];
    }

    function getInvestmentAnalysis(responses) {
        const analyses = {
            conservative: "You prefer a conservative investment approach, choosing guaranteed returns of 5% with minimal risk. This indicates a strong preference for financial security over potentially higher returns.",
            moderate: "You show a balanced risk approach, being comfortable with a 50-50 chance for a 15% return. This suggests you understand and accept moderate market fluctuations.",
            aggressive: "You demonstrate comfort with higher risk, willing to pursue a 40% return despite a potential 10% loss. This indicates a higher risk tolerance for potentially greater rewards.",
            none: "You prefer keeping your money in a savings account, indicating a very conservative approach to financial management."
        };

        const riskLevel = responses.riskPreference === 'guaranteed' ? 'conservative' :
                       responses.riskPreference === 'moderate' ? 'moderate' :
                       responses.riskPreference === 'high' ? 'aggressive' : 'none';

        return analyses[riskLevel];
    }

    function getPlanningAnalysis(responses) {
        const analyses = {
            strong: "Your long-term planning and emergency preparedness are strong.",
            moderate: "You have started planning but could benefit from more structure.",
            weak: "Focus on developing more concrete long-term financial plans."
        };

        const planningLevel = responses.futurePlanning === 'active' ? 'strong' :
                            responses.futurePlanning === 'starting' ? 'moderate' : 'weak';

        return analyses[planningLevel];
    }

    function getKnowledgeAnalysis(responses) {
        const analyses = {
            advanced: "You actively pursue financial education and stay informed.",
            intermediate: "You have a good foundation of financial knowledge.",
            basic: "Consider expanding your financial education through courses or research."
        };

        const knowledgeLevel = responses.financialKnowledge === 'active' ? 'advanced' :
                             responses.financialKnowledge === 'casual' ? 'intermediate' : 'basic';

        return analyses[knowledgeLevel];
    }

    // Add this event listener for the back to home button
    document.getElementById('backToHome').addEventListener('click', () => {
        // Reset all responses
        Object.keys(responses).forEach(key => delete responses[key]);
        currentQuestion = 0;
        
        // Hide question container and show home page
        questionContainer.classList.add('d-none');
        homePage.classList.remove('d-none');
        
        // Reset the form
        riskForm.innerHTML = '';
    });
});
