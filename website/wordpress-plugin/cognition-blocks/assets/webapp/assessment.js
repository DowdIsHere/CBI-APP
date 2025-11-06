// Cognitive Blocks Profile Assessment
// 88-Question Assessment: Gradients (30) + Cognitive Blocks (30) + Fuel State (28)

// ========================================
// ASSESSMENT DATA
// ========================================

const assessmentData = {
    gradients: [
        {
            question: "How would you rate your current energy levels throughout the day?",
            options: ["Always fatigued", "Often tired", "Moderate energy", "Good energy", "Excellent energy"],
            category: "Gradients"
        },
        {
            question: "How well do you sleep on average?",
            options: ["Very poor (< 4 hours)", "Poor (4-5 hours)", "Fair (5-6 hours)", "Good (6-7 hours)", "Excellent (7-8+ hours)"],
            category: "Gradients"
        },
        {
            question: "How often do you experience brain fog or difficulty concentrating?",
            options: ["Daily", "Several times per week", "Once per week", "Rarely", "Never"],
            category: "Gradients"
        },
        {
            question: "How would you describe your current stress levels?",
            options: ["Extremely high", "High", "Moderate", "Low", "Very low"],
            category: "Gradients"
        },
        {
            question: "How often do you experience digestive discomfort?",
            options: ["Daily", "Several times per week", "Once per week", "Rarely", "Never"],
            category: "Gradients"
        },
        {
            question: "How stable is your mood throughout the day?",
            options: ["Very unstable", "Often fluctuating", "Moderately stable", "Stable", "Very stable"],
            category: "Gradients"
        },
        {
            question: "How would you rate your physical recovery after exercise or activity?",
            options: ["Very poor", "Poor", "Average", "Good", "Excellent"],
            category: "Gradients"
        },
        {
            question: "How often do you experience inflammation or joint pain?",
            options: ["Daily", "Several times per week", "Once per week", "Rarely", "Never"],
            category: "Gradients"
        },
        {
            question: "How would you describe your skin health?",
            options: ["Very poor", "Poor", "Fair", "Good", "Excellent"],
            category: "Gradients"
        },
        {
            question: "How strong is your immune system (frequency of illness)?",
            options: ["Get sick monthly", "Get sick often", "Occasionally sick", "Rarely sick", "Almost never sick"],
            category: "Gradients"
        },
        {
            question: "How would you rate your mental clarity and focus?",
            options: ["Very poor", "Poor", "Average", "Good", "Excellent"],
            category: "Gradients"
        },
        {
            question: "How often do you experience food cravings?",
            options: ["Constantly", "Daily", "Several times per week", "Rarely", "Never"],
            category: "Gradients"
        },
        {
            question: "How balanced is your hunger throughout the day?",
            options: ["Very unbalanced", "Often unbalanced", "Moderately balanced", "Balanced", "Very balanced"],
            category: "Gradients"
        },
        {
            question: "How would you describe your current weight management?",
            options: ["Very difficult", "Difficult", "Moderate", "Easy", "Very easy"],
            category: "Gradients"
        },
        {
            question: "How often do you experience anxiety or nervousness?",
            options: ["Daily", "Several times per week", "Once per week", "Rarely", "Never"],
            category: "Gradients"
        },
        {
            question: "How would you rate your cardiovascular endurance?",
            options: ["Very poor", "Poor", "Average", "Good", "Excellent"],
            category: "Gradients"
        },
        {
            question: "How often do you experience headaches or migraines?",
            options: ["Daily", "Several times per week", "Once per week", "Rarely", "Never"],
            category: "Gradients"
        },
        {
            question: "How would you describe your hormonal balance?",
            options: ["Very imbalanced", "Imbalanced", "Moderately balanced", "Balanced", "Very balanced"],
            category: "Gradients"
        },
        {
            question: "How consistent is your bowel movement regularity?",
            options: ["Very inconsistent", "Inconsistent", "Moderately consistent", "Consistent", "Very consistent"],
            category: "Gradients"
        },
        {
            question: "How would you rate your muscle tone and strength?",
            options: ["Very poor", "Poor", "Average", "Good", "Excellent"],
            category: "Gradients"
        },
        {
            question: "How often do you experience bloating or gas?",
            options: ["Daily", "Several times per week", "Once per week", "Rarely", "Never"],
            category: "Gradients"
        },
        {
            question: "How would you describe your stress response?",
            options: ["Very reactive", "Reactive", "Moderately calm", "Calm", "Very calm"],
            category: "Gradients"
        },
        {
            question: "How well do you handle changes in routine?",
            options: ["Very poorly", "Poorly", "Average", "Well", "Very well"],
            category: "Gradients"
        },
        {
            question: "How would you rate your overall vitality?",
            options: ["Very low", "Low", "Moderate", "High", "Very high"],
            category: "Gradients"
        },
        {
            question: "How often do you experience acid reflux or heartburn?",
            options: ["Daily", "Several times per week", "Once per week", "Rarely", "Never"],
            category: "Gradients"
        },
        {
            question: "How would you describe your exercise tolerance?",
            options: ["Very low", "Low", "Moderate", "High", "Very high"],
            category: "Gradients"
        },
        {
            question: "How often do you feel overwhelmed?",
            options: ["Constantly", "Daily", "Several times per week", "Rarely", "Never"],
            category: "Gradients"
        },
        {
            question: "How would you rate your overall sense of well-being?",
            options: ["Very poor", "Poor", "Fair", "Good", "Excellent"],
            category: "Gradients"
        },
        {
            question: "How stable is your blood sugar throughout the day?",
            options: ["Very unstable", "Unstable", "Moderately stable", "Stable", "Very stable"],
            category: "Gradients"
        },
        {
            question: "How would you describe your ability to detoxify (based on symptoms)?",
            options: ["Very poor", "Poor", "Average", "Good", "Excellent"],
            category: "Gradients"
        }
    ],
    blocks: [
        {
            question: "How often do you consume processed foods?",
            options: ["Daily, multiple times", "Daily", "Several times per week", "Rarely", "Never"],
            category: "Cognitive Blocks"
        },
        {
            question: "How much sugar do you consume daily?",
            options: ["Very high (>50g)", "High (30-50g)", "Moderate (15-30g)", "Low (5-15g)", "Very low (<5g)"],
            category: "Cognitive Blocks"
        },
        {
            question: "Do you have known food sensitivities or allergies?",
            options: ["Many (5+)", "Several (3-4)", "A few (1-2)", "Possibly (unconfirmed)", "None"],
            category: "Cognitive Blocks"
        },
        {
            question: "How often do you eat gluten-containing foods?",
            options: ["Every meal", "Daily", "Several times per week", "Rarely", "Never"],
            category: "Cognitive Blocks"
        },
        {
            question: "How often do you consume dairy products?",
            options: ["Every meal", "Daily", "Several times per week", "Rarely", "Never"],
            category: "Cognitive Blocks"
        },
        {
            question: "How much water do you drink daily?",
            options: ["Very little (<4 cups)", "Below average (4-6 cups)", "Average (6-8 cups)", "Above average (8-10 cups)", "Excellent (10+ cups)"],
            category: "Cognitive Blocks"
        },
        {
            question: "How often do you skip meals?",
            options: ["Daily", "Several times per week", "Once per week", "Rarely", "Never"],
            category: "Cognitive Blocks"
        },
        {
            question: "How much caffeine do you consume daily?",
            options: ["Excessive (4+ drinks)", "High (3-4 drinks)", "Moderate (1-2 drinks)", "Low (occasional)", "None"],
            category: "Cognitive Blocks"
        },
        {
            question: "How often do you consume alcohol?",
            options: ["Daily", "Several times per week", "Once per week", "Rarely", "Never"],
            category: "Cognitive Blocks"
        },
        {
            question: "How much of your diet consists of vegetables?",
            options: ["Almost none", "Small amount", "Moderate amount", "Large amount", "Mostly vegetables"],
            category: "Cognitive Blocks"
        },
        {
            question: "How often do you eat late at night (within 3 hours of bed)?",
            options: ["Always", "Usually", "Sometimes", "Rarely", "Never"],
            category: "Cognitive Blocks"
        },
        {
            question: "How much artificial sweetener do you consume?",
            options: ["Daily, multiple times", "Daily", "Several times per week", "Rarely", "Never"],
            category: "Cognitive Blocks"
        },
        {
            question: "How often do you eat fried foods?",
            options: ["Daily", "Several times per week", "Once per week", "Rarely", "Never"],
            category: "Cognitive Blocks"
        },
        {
            question: "How much red meat do you consume?",
            options: ["Daily", "Several times per week", "Once per week", "Rarely", "Never"],
            category: "Cognitive Blocks"
        },
        {
            question: "How often do you consume omega-3 rich foods (fish, flax, walnuts)?",
            options: ["Never", "Rarely", "Once per week", "Several times per week", "Daily"],
            category: "Cognitive Blocks"
        },
        {
            question: "How much do you rely on restaurant or takeout food?",
            options: ["Almost all meals", "Most meals", "Several times per week", "Rarely", "Almost never"],
            category: "Cognitive Blocks"
        },
        {
            question: "How often do you eat mindfully (without distractions)?",
            options: ["Never", "Rarely", "Sometimes", "Usually", "Always"],
            category: "Cognitive Blocks"
        },
        {
            question: "How much variety is in your diet?",
            options: ["Very little", "Limited", "Moderate", "Good variety", "Excellent variety"],
            category: "Cognitive Blocks"
        },
        {
            question: "How often do you consume probiotic-rich foods?",
            options: ["Never", "Rarely", "Once per week", "Several times per week", "Daily"],
            category: "Cognitive Blocks"
        },
        {
            question: "How much do environmental toxins affect your daily life?",
            options: ["Significant exposure", "Moderate exposure", "Some exposure", "Limited exposure", "Minimal exposure"],
            category: "Cognitive Blocks"
        },
        {
            question: "How often do you eat organic foods?",
            options: ["Never", "Rarely", "Sometimes", "Usually", "Always"],
            category: "Cognitive Blocks"
        },
        {
            question: "How well do you chew your food?",
            options: ["Barely chew", "Quick chewing", "Moderate chewing", "Good chewing", "Excellent, thorough chewing"],
            category: "Cognitive Blocks"
        },
        {
            question: "How often do you consume inflammatory oils (vegetable, canola, soybean)?",
            options: ["Daily, multiple times", "Daily", "Several times per week", "Rarely", "Never"],
            category: "Cognitive Blocks"
        },
        {
            question: "How much of your diet is whole, unprocessed foods?",
            options: ["Very little", "Some", "About half", "Most", "Almost all"],
            category: "Cognitive Blocks"
        },
        {
            question: "How often do you fast or practice intermittent fasting?",
            options: ["Never", "Rarely", "Sometimes", "Regularly", "Daily practice"],
            category: "Cognitive Blocks"
        },
        {
            question: "How much non-organic produce do you consume?",
            options: ["Almost all produce", "Most produce", "About half", "Some", "Almost none"],
            category: "Cognitive Blocks"
        },
        {
            question: "How often do you read food labels and ingredients?",
            options: ["Never", "Rarely", "Sometimes", "Usually", "Always"],
            category: "Cognitive Blocks"
        },
        {
            question: "How much do you prioritize meal planning?",
            options: ["Never plan", "Rarely plan", "Sometimes plan", "Usually plan", "Always plan"],
            category: "Cognitive Blocks"
        },
        {
            question: "How often do you consume foods with added preservatives?",
            options: ["Daily, multiple times", "Daily", "Several times per week", "Rarely", "Never"],
            category: "Cognitive Blocks"
        },
        {
            question: "How aware are you of your body's response to different foods?",
            options: ["Not aware at all", "Slightly aware", "Moderately aware", "Very aware", "Extremely aware"],
            category: "Cognitive Blocks"
        }
    ],
    fuel: [
        {
            question: "What is your primary source of breakfast?",
            options: ["Skip breakfast", "High-sugar cereal/pastries", "Processed foods", "Eggs and protein", "Whole food plant-based"],
            category: "Fuel State"
        },
        {
            question: "How do you feel 2 hours after eating a typical meal?",
            options: ["Exhausted, need to nap", "Sluggish", "Neutral", "Good energy", "Energized and clear"],
            category: "Fuel State"
        },
        {
            question: "What percentage of your diet is carbohydrates?",
            options: ["Very high (>60%)", "High (50-60%)", "Moderate (40-50%)", "Low (30-40%)", "Very low (<30%)"],
            category: "Fuel State"
        },
        {
            question: "What percentage of your diet is healthy fats?",
            options: ["Very low (<10%)", "Low (10-20%)", "Moderate (20-30%)", "High (30-40%)", "Very high (>40%)"],
            category: "Fuel State"
        },
        {
            question: "What percentage of your diet is protein?",
            options: ["Very low (<10%)", "Low (10-20%)", "Moderate (20-30%)", "High (30-40%)", "Very high (>40%)"],
            category: "Fuel State"
        },
        {
            question: "How does your energy change after eating carbohydrates?",
            options: ["Crash significantly", "Drop noticeably", "Stay neutral", "Slight improvement", "Sustained energy"],
            category: "Fuel State"
        },
        {
            question: "How does your mental clarity change after meals?",
            options: ["Severe brain fog", "Noticeable fog", "No change", "Slight improvement", "Sharp and clear"],
            category: "Fuel State"
        },
        {
            question: "What is your primary cooking fat?",
            options: ["Vegetable/canola oil", "Margarine/shortening", "Butter", "Olive oil", "Coconut oil/avocado oil"],
            category: "Fuel State"
        },
        {
            question: "How much fiber do you consume daily?",
            options: ["Very low (<10g)", "Low (10-20g)", "Moderate (20-30g)", "High (30-40g)", "Very high (>40g)"],
            category: "Fuel State"
        },
        {
            question: "What type of grains do you primarily consume?",
            options: ["Refined white grains", "Mix of refined and whole", "Whole grains", "Ancient grains", "No grains"],
            category: "Fuel State"
        },
        {
            question: "How do you feel after eating dairy products?",
            options: ["Very uncomfortable", "Uncomfortable", "Neutral", "Good", "Don't consume dairy"],
            category: "Fuel State"
        },
        {
            question: "How do you feel after eating gluten?",
            options: ["Very uncomfortable", "Uncomfortable", "Neutral", "Good", "Don't consume gluten"],
            category: "Fuel State"
        },
        {
            question: "What is your primary protein source?",
            options: ["Processed meats", "Conventional meat", "Organic/grass-fed meat", "Fish and poultry", "Plant-based proteins"],
            category: "Fuel State"
        },
        {
            question: "How much does your diet support stable blood sugar?",
            options: ["Not at all", "Minimally", "Somewhat", "Well", "Excellently"],
            category: "Fuel State"
        },
        {
            question: "How nutrient-dense is your typical meal?",
            options: ["Very low", "Low", "Moderate", "High", "Very high"],
            category: "Fuel State"
        },
        {
            question: "How does your current diet support gut health?",
            options: ["Harms it significantly", "Somewhat harmful", "Neutral", "Somewhat supportive", "Very supportive"],
            category: "Fuel State"
        },
        {
            question: "How anti-inflammatory is your diet?",
            options: ["Very inflammatory", "Inflammatory", "Neutral", "Anti-inflammatory", "Highly anti-inflammatory"],
            category: "Fuel State"
        },
        {
            question: "How does your diet support mitochondrial function?",
            options: ["Harms it", "Doesn't support it", "Neutral", "Supports it", "Optimizes it"],
            category: "Fuel State"
        },
        {
            question: "How much does your diet promote autophagy (cellular cleanup)?",
            options: ["Not at all", "Minimally", "Somewhat", "Well", "Excellently"],
            category: "Fuel State"
        },
        {
            question: "How ketogenic is your diet?",
            options: ["Not at all", "Low fat intake", "Moderate fat", "Higher fat", "Fully ketogenic"],
            category: "Fuel State"
        },
        {
            question: "How does your diet support neurotransmitter production?",
            options: ["Hinders it", "Doesn't support it", "Neutral", "Supports it", "Optimizes it"],
            category: "Fuel State"
        },
        {
            question: "How balanced is your omega-6 to omega-3 ratio?",
            options: ["Very imbalanced (high omega-6)", "Imbalanced", "Somewhat balanced", "Balanced", "Optimal ratio"],
            category: "Fuel State"
        },
        {
            question: "How much does your diet support hormonal balance?",
            options: ["Disrupts hormones", "Doesn't support", "Neutral", "Supports", "Optimizes hormones"],
            category: "Fuel State"
        },
        {
            question: "How does your diet affect your inflammation markers?",
            options: ["Increases significantly", "Increases somewhat", "No effect", "Decreases somewhat", "Decreases significantly"],
            category: "Fuel State"
        },
        {
            question: "How well does your diet support cellular energy production?",
            options: ["Very poorly", "Poorly", "Adequately", "Well", "Excellently"],
            category: "Fuel State"
        },
        {
            question: "How much does your diet support brain health and cognitive function?",
            options: ["Harms it", "Doesn't support it", "Neutral", "Supports it", "Optimizes it"],
            category: "Fuel State"
        },
        {
            question: "How sustainable is your current eating pattern long-term?",
            options: ["Not sustainable", "Difficult to maintain", "Somewhat sustainable", "Sustainable", "Highly sustainable"],
            category: "Fuel State"
        },
        {
            question: "Overall, how well does your diet align with the Dowd Protocol principles?",
            options: ["Not at all", "Minimally", "Somewhat", "Well", "Perfectly aligned"],
            category: "Fuel State"
        }
    ]
};

// Combine all questions
const allQuestions = [
    ...assessmentData.gradients,
    ...assessmentData.blocks,
    ...assessmentData.fuel
];

// ========================================
// STATE MANAGEMENT
// ========================================

let currentQuestionIndex = 0;
let answers = new Array(allQuestions.length).fill(null);

// ========================================
// SCREEN MANAGEMENT
// ========================================

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function startAssessment() {
    currentQuestionIndex = 0;
    answers = new Array(allQuestions.length).fill(null);
    showScreen('questionScreen');
    renderQuestion();
}

// ========================================
// QUESTION RENDERING
// ========================================

function renderQuestion() {
    const question = allQuestions[currentQuestionIndex];

    // Update progress bar
    const progress = ((currentQuestionIndex + 1) / allQuestions.length) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;

    // Update question info
    document.getElementById('questionNumber').textContent = `Question ${currentQuestionIndex + 1} of ${allQuestions.length}`;
    document.getElementById('questionCategory').textContent = question.category;
    document.getElementById('questionText').textContent = question.question;

    // Render options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-button';
        button.textContent = option;

        if (answers[currentQuestionIndex] === index) {
            button.classList.add('selected');
        }

        button.onclick = () => selectOption(index);
        optionsContainer.appendChild(button);
    });

    // Update navigation buttons
    document.getElementById('prevBtn').disabled = currentQuestionIndex === 0;
    document.getElementById('nextBtn').disabled = answers[currentQuestionIndex] === null;
}

function selectOption(optionIndex) {
    answers[currentQuestionIndex] = optionIndex;

    // Update UI
    document.querySelectorAll('.option-button').forEach((btn, index) => {
        if (index === optionIndex) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });

    // Enable next button
    document.getElementById('nextBtn').disabled = false;
}

// ========================================
// NAVIGATION
// ========================================

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
}

function nextQuestion() {
    if (currentQuestionIndex < allQuestions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    } else {
        // Assessment complete
        calculateResults();
    }
}

// ========================================
// RESULTS CALCULATION
// ========================================

function calculateResults() {
    // Calculate scores for each section
    const gradientsAnswers = answers.slice(0, 30);
    const blocksAnswers = answers.slice(30, 60);
    const fuelAnswers = answers.slice(60, 88);

    const gradientsScore = Math.round((gradientsAnswers.reduce((sum, val) => sum + val, 0) / (30 * 4)) * 100);
    const blocksScore = Math.round((blocksAnswers.reduce((sum, val) => sum + val, 0) / (30 * 4)) * 100);
    const fuelScore = Math.round((fuelAnswers.reduce((sum, val) => sum + val, 0) / (28 * 4)) * 100);

    // Show results screen
    showScreen('resultsScreen');

    // Animate scores
    setTimeout(() => {
        animateScore('gradients', gradientsScore);
        animateScore('blocks', blocksScore);
        animateScore('fuel', fuelScore);

        // Generate recommendations
        generateRecommendations(gradientsScore, blocksScore, fuelScore);
    }, 300);
}

function animateScore(section, score) {
    const scoreElement = document.getElementById(`${section}Score`);
    const circleElement = document.getElementById(`${section}Circle`);
    const descriptionElement = document.getElementById(`${section}Description`);

    // Animate number
    let current = 0;
    const interval = setInterval(() => {
        current += 1;
        scoreElement.textContent = current;
        if (current >= score) {
            clearInterval(interval);
        }
    }, 20);

    // Animate circle
    const circumference = 2 * Math.PI * 65;
    const offset = circumference - (score / 100) * circumference;
    circleElement.style.strokeDasharray = `${circumference} ${circumference}`;
    circleElement.style.strokeDashoffset = offset;

    // Set description
    descriptionElement.textContent = getScoreDescription(section, score);
}

function getScoreDescription(section, score) {
    const descriptions = {
        gradients: {
            low: "Your health baseline shows room for improvement. Focus on fundamental wellness practices.",
            medium: "You have a decent health foundation with opportunities for optimization.",
            high: "Your health baseline is strong. Continue maintaining and fine-tuning your practices."
        },
        blocks: {
            low: "Significant dietary and lifestyle barriers identified. Targeted interventions recommended.",
            medium: "Some cognitive blocks present. Strategic adjustments can yield improvements.",
            high: "Minimal blocks detected. You're on the right path with minor tweaks needed."
        },
        fuel: {
            low: "Current nutrition isn't optimally supporting your health goals. Major dietary changes recommended.",
            medium: "Your nutrition provides moderate support. Refinements can enhance performance.",
            high: "Excellent fuel state! Your nutrition aligns well with optimal health principles."
        }
    };

    const level = score < 50 ? 'low' : score < 75 ? 'medium' : 'high';
    return descriptions[section][level];
}

function generateRecommendations(gradientsScore, blocksScore, fuelScore) {
    const recommendationsList = document.getElementById('recommendationsList');
    const recommendations = [];

    // Generate recommendations based on scores
    if (gradientsScore < 60) {
        recommendations.push({
            icon: "🛌",
            title: "Prioritize Sleep Quality",
            description: "Focus on getting 7-8 hours of quality sleep. Establish a consistent bedtime routine and optimize your sleep environment."
        });
        recommendations.push({
            icon: "⚡",
            title: "Address Energy Levels",
            description: "Work on improving your energy through better nutrition timing, stress management, and regular movement."
        });
    }

    if (blocksScore < 60) {
        recommendations.push({
            icon: "🚫",
            title: "Eliminate Inflammatory Foods",
            description: "Begin removing processed foods, excess sugar, and inflammatory oils from your diet."
        });
        recommendations.push({
            icon: "💧",
            title: "Increase Hydration",
            description: "Aim for at least 8-10 cups of clean water daily to support all bodily functions."
        });
    }

    if (fuelScore < 60) {
        recommendations.push({
            icon: "🥗",
            title: "Optimize Macronutrient Balance",
            description: "Adjust your protein, fat, and carbohydrate ratios to better support gut-brain-mitochondria health."
        });
        recommendations.push({
            icon: "🐟",
            title: "Increase Omega-3 Intake",
            description: "Add fatty fish, flaxseeds, or walnuts to reduce inflammation and support brain health."
        });
    }

    // Always add these
    recommendations.push({
        icon: "🎯",
        title: "Start the 30-Day Challenge",
        description: "Apply these insights in our structured 30-day program designed to transform your health."
    });

    recommendations.push({
        icon: "📱",
        title: "Track Your Progress",
        description: "Use the CBI mobile app to monitor meals, symptoms, and improvements over time."
    });

    // Render recommendations
    recommendationsList.innerHTML = recommendations.map(rec => `
        <div class="recommendation-item">
            <div class="recommendation-icon">${rec.icon}</div>
            <div class="recommendation-content">
                <h4>${rec.title}</h4>
                <p>${rec.description}</p>
            </div>
        </div>
    `).join('');
}

// ========================================
// RESULTS ACTIONS
// ========================================

function downloadResults() {
    alert('PDF download functionality will be integrated with your backend. For now, take a screenshot of your results!');
    // TODO: Integrate with backend PDF generation
}

function retakeAssessment() {
    if (confirm('Are you sure you want to retake the assessment? This will reset your current results.')) {
        startAssessment();
    }
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Show intro screen by default
    showScreen('introScreen');
});
