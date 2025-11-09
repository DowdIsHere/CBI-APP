// 30-Day Dowd Protocol Challenge - Vanilla JavaScript
// Cognition Blocks LLC - Complete Challenge Implementation

// ============================================================================
// PROTOCOL DATA
// ============================================================================

const protocolPhases = {
    phase1: {
        name: 'Foundation Reset',
        days: '1-7',
        focus: 'Eliminate ATP disruptors, stabilize baseline',
        keyRemovals: ['Seed oils', 'Artificial sweeteners', 'Food dyes', 'HFCS']
    },
    phase2: {
        name: 'Mitochondrial Support',
        days: '8-14',
        focus: 'Add nutrient-dense foods, support cellular energy',
        keyAdditions: ['Bone broth', 'Fermented foods', 'Quality proteins', 'Healthy fats']
    },
    phase3: {
        name: 'Optimization',
        days: '15-21',
        focus: 'Fine-tune timing, maximize ATP production',
        keyStrategies: ['Meal timing', 'Sleep optimization', 'Stress management']
    },
    phase4: {
        name: 'Integration',
        days: '22-30',
        focus: 'Solidify habits, prepare for long-term success',
        keyGoals: ['Sustainable routines', 'Social navigation', 'Maintenance planning']
    }
};

const dailyCheckIn = {
    energy: {
        question: 'How was your energy level today?',
        options: ['Very Low', 'Low', 'Moderate', 'Good', 'Excellent']
    },
    mood: {
        question: 'How was your mood stability?',
        options: ['Very Unstable', 'Unstable', 'Neutral', 'Stable', 'Very Stable']
    },
    focus: {
        question: 'How was your mental clarity and focus?',
        options: ['Very Poor', 'Poor', 'Average', 'Good', 'Excellent']
    },
    sleep: {
        question: 'How was your sleep quality?',
        options: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent']
    },
    cravings: {
        question: 'How strong were your cravings?',
        options: ['Intense', 'Strong', 'Moderate', 'Mild', 'None']
    },
    digestion: {
        question: 'How was your digestion?',
        options: ['Very Poor', 'Poor', 'Fair', 'Good', 'Excellent']
    }
};

const dailyProtocol = {
    1: {
        title: 'Day 1: The Foundation',
        focus: 'Kitchen Clean-Out',
        tasks: [
            'Read through entire 30-day protocol',
            'Take "before" measurements (weight, photos, energy rating)',
            'Clean out pantry: remove seed oils, artificial sweeteners, food dyes',
            'Shop for Phase 1 replacements',
            'Plan tomorrow\'s meals'
        ],
        nutrition: 'Focus on whole foods only. If you can\'t pronounce an ingredient, don\'t eat it.',
        education: 'Why seed oils disrupt ATP: Polyunsaturated fats oxidize easily, creating free radicals that damage mitochondrial membranes.'
    },
    2: {
        title: 'Day 2: Morning Routine Reset',
        focus: 'Establish baseline energy patterns',
        tasks: [
            'Track your morning energy (before caffeine)',
            'Replace seed oil breakfast with butter/coconut oil',
            'Drink 16oz water upon waking',
            'Note afternoon energy crash time (if any)',
            'Complete daily check-in'
        ],
        nutrition: 'Breakfast: Eggs cooked in butter, vegetables, no bread or pastries',
        education: 'Your afternoon crash is often 2-3 hours after eating calcium propionate in bread.'
    },
    3: {
        title: 'Day 3: Hydration & Elimination',
        focus: 'Support detoxification pathways',
        tasks: [
            'Drink 80oz of water today',
            'Remove all diet sodas and artificial sweeteners',
            'Add sea salt to meals (supports cellular hydration)',
            'Track bathroom visits (detox indicator)',
            'Note any headaches (withdrawal symptoms)'
        ],
        nutrition: 'If experiencing headaches: you\'re detoxing. Add more salt and water.',
        education: 'Aspartame converts to formaldehyde in your body. Withdrawal can cause headaches for 2-3 days.'
    },
    4: {
        title: 'Day 4: Label Reading 101',
        focus: 'Identify hidden ATP disruptors',
        tasks: [
            'Read labels on everything you eat today',
            'Take photos of ingredient lists with preservatives',
            'Find alternatives to your top 3 packaged foods',
            'Share one discovery in community (if available)',
            'Plan weekend meal prep'
        ],
        nutrition: 'Avoid: calcium propionate, TBHQ, BHT, BHA, sodium benzoate',
        education: 'Preservatives extend shelf life by being toxic to microorganisms. They\'re also toxic to your mitochondria.'
    },
    5: {
        title: 'Day 5: Energy Baseline Established',
        focus: 'Compare energy to Day 1',
        tasks: [
            'Rate today\'s energy vs Day 1',
            'Identify your highest energy time of day',
            'Note any reduction in cravings',
            'Track sleep quality changes',
            'Prepare bone broth for Phase 2'
        ],
        nutrition: 'Most people notice first improvements by Day 5',
        education: 'Your mitochondria are no longer in constant detoxification mode.'
    },
    6: {
        title: 'Day 6: Social Navigation',
        focus: 'Eating out without ATP disruptors',
        tasks: [
            'Research restaurant options with quality oils',
            'Practice asking "what oil do you cook with?"',
            'Bring your own salad dressing if needed',
            'Find 3 "safe" restaurants in your area',
            'Don\'t stress - do your best'
        ],
        nutrition: 'At restaurants: ask for butter instead of oil, skip the bread',
        education: 'Most restaurants use soybean oil because it\'s cheap. Speak with your wallet.'
    },
    7: {
        title: 'Day 7: Week 1 Assessment',
        focus: 'Measure progress and adjust',
        tasks: [
            'Weigh yourself (same time as Day 1)',
            'Rate overall energy improvement 1-10',
            'Review daily check-ins for patterns',
            'Identify biggest challenge so far',
            'Set specific goal for Week 2'
        ],
        nutrition: 'Typical Week 1 results: 2-5 lbs weight loss, increased energy',
        education: 'You\'ve removed ATP disruptors. Now we add ATP builders.'
    },
    8: {
        title: 'Day 8: Bone Broth Introduction',
        focus: 'Gut healing and collagen support',
        tasks: [
            'Drink 8oz bone broth in morning',
            'Note any digestive changes',
            'Continue all Phase 1 eliminations',
            'Add fermented vegetables to one meal',
            'Track mood stability'
        ],
        nutrition: 'Bone broth contains glycine, proline, glutamine - gut healing amino acids',
        education: 'Your gut lining uses these amino acids to repair damage from industrial foods.'
    },
    9: {
        title: 'Day 9: Fermentation Introduction',
        focus: 'Microbiome support',
        tasks: [
            '1-2 tablespoons sauerkraut or kimchi with meals',
            'Start with small amounts (powerful!)',
            'Continue bone broth',
            'Note any bloating (die-off reaction)',
            'Increase gradually'
        ],
        nutrition: 'Live probiotics support neurotransmitter production',
        education: '90% of serotonin is produced in your gut. Feed the right bacteria.'
    },
    10: {
        title: 'Day 10: Protein Quality Upgrade',
        focus: 'Nutrient density over quantity',
        tasks: [
            'Switch to pasture-raised eggs',
            'Add grass-fed beef or wild fish',
            'Compare how you feel vs conventional',
            'Track energy 2 hours after eating',
            'Note any inflammation changes'
        ],
        nutrition: 'Grass-fed contains higher omega-3, CLA, and vitamins A & E',
        education: 'Conventional meat has different fatty acid ratios that promote inflammation.'
    },
    11: {
        title: 'Day 11: Fat Ratio Optimization',
        focus: 'Balance omega-6:omega-3',
        tasks: [
            'Add wild-caught fatty fish (salmon, sardines)',
            'Use butter or ghee generously',
            'Avoid all seed oils (still!)',
            'Track mental clarity',
            'Note any joint pain changes'
        ],
        nutrition: 'Target ratio: 4:1 omega-6 to omega-3 (most Americans: 20:1)',
        education: 'Mitochondrial membranes are made from the fats you eat.'
    },
    12: {
        title: 'Day 12: Collagen Addition',
        focus: 'Connective tissue and gut support',
        tasks: [
            'Add collagen powder to morning beverage',
            'Or continue bone broth daily',
            'Track skin, hair, nail changes (long-term)',
            'Note joint comfort',
            'Ensure adequate vitamin C (collagen synthesis)'
        ],
        nutrition: '10-20g collagen daily supports gut lining repair',
        education: 'Collagen provides glycine - most deficient amino acid in modern diets.'
    },
    13: {
        title: 'Day 13: Nutrient Timing Experiment',
        focus: 'When you eat matters',
        tasks: [
            'Track energy after breakfast vs skipping',
            'Note focus levels at different meal times',
            'Experiment with eating window',
            'Find your optimal meal timing',
            'This is individual - no rules'
        ],
        nutrition: 'Some thrive on breakfast, others on intermittent fasting',
        education: 'Your temporal gradient affects optimal meal timing.'
    },
    14: {
        title: 'Day 14: Week 2 Assessment',
        focus: 'Mid-point evaluation',
        tasks: [
            'Weigh in and compare to Week 1',
            'Rate energy, mood, focus, sleep',
            'Review all daily check-ins',
            'Identify biggest win so far',
            'Set Phase 3 goals'
        ],
        nutrition: 'Typical Week 2 results: 5-10 lbs total loss, stable energy',
        education: 'Your mitochondria are now supported, not just less disrupted.'
    },
    15: {
        title: 'Day 15: Sleep Optimization',
        focus: 'Recovery and cellular repair',
        tasks: [
            'Set consistent bedtime',
            'Remove screens 1 hour before bed',
            'Ensure room is dark and cool',
            'Track morning energy rating',
            'Consider magnesium supplement'
        ],
        nutrition: 'ATP production peaks during deep sleep',
        education: 'Mitochondrial biogenesis (making new mitochondria) happens during sleep.'
    },
    16: {
        title: 'Day 16: Stress Response Audit',
        focus: 'Cortisol and ATP',
        tasks: [
            'Track stressful moments today',
            'Note how food affects stress response',
            'Practice 3 deep breaths before eating',
            'Identify stress eating triggers',
            'Plan healthier coping strategies'
        ],
        nutrition: 'Stress diverts ATP from digestion to survival mode',
        education: 'Chronic stress keeps mitochondria in emergency mode, reducing efficiency.'
    },
    17: {
        title: 'Day 17: Movement & Mitochondria',
        focus: 'Exercise without depletion',
        tasks: [
            '20-30 min moderate movement',
            'Track energy after vs sedentary days',
            'Don\'t over-exercise (mitochondrial stress)',
            'Focus on enjoyment, not punishment',
            'Note sleep quality tonight'
        ],
        nutrition: 'Movement signals mitochondrial biogenesis',
        education: 'Exercise creates temporary ATP deficit, triggering mitochondria to multiply.'
    },
    18: {
        title: 'Day 18: Meal Prep Mastery',
        focus: 'Sustainability through preparation',
        tasks: [
            'Batch cook proteins for week',
            'Pre-cut vegetables',
            'Make large batch bone broth',
            'Portion out fermented foods',
            'Prep grab-and-go options'
        ],
        nutrition: 'Success is about removing obstacles',
        education: 'Decision fatigue depletes ATP. Meal prep preserves mental energy.'
    },
    19: {
        title: 'Day 19: Cognitive Performance Test',
        focus: 'Notice the difference',
        tasks: [
            'Do challenging mental task in morning',
            'Rate focus and sustained attention',
            'Compare to before-challenge memory',
            'Test decision-making quality',
            'Note afternoon productivity'
        ],
        nutrition: 'Your brain uses 20% of ATP but is only 2% of body weight',
        education: 'Optimal ATP = optimal cognition. You\'re experiencing your potential.'
    },
    20: {
        title: 'Day 20: Social Proof',
        focus: 'Others are noticing',
        tasks: [
            'Ask 3 people if they notice changes',
            'Take new progress photos',
            'Compare to Day 1 photos',
            'Document non-scale victories',
            'Share one win'
        ],
        nutrition: 'Visible changes: skin clarity, eye brightness, energy presence',
        education: 'Cellular health shows on your face before the scale.'
    },
    21: {
        title: 'Day 21: Week 3 Assessment',
        focus: 'Three-week milestone',
        tasks: [
            'Full measurements and weigh-in',
            'Rate all metrics vs baseline',
            'Identify remaining challenges',
            'Set goals for final week',
            'Celebrate progress'
        ],
        nutrition: 'Typical Week 3 results: 8-15 lbs total, significant energy improvement',
        education: '21 days to start a habit. Now we solidify it.'
    },
    22: {
        title: 'Day 22: Restaurant Strategy Refinement',
        focus: 'Real-world application',
        tasks: [
            'Eat out using all your knowledge',
            'Order confidently',
            'Don\'t apologize for requirements',
            'Tip well when accommodated',
            'Find your "regular" spots'
        ],
        nutrition: 'You can maintain this anywhere',
        education: 'Sustainability requires social integration.'
    },
    23: {
        title: 'Day 23: Travel Planning',
        focus: 'Maintaining protocol on the go',
        tasks: [
            'Research travel-friendly foods',
            'Pack emergency snacks',
            'Identify hotel room options',
            'Download restaurant apps',
            'Plan without perfection'
        ],
        nutrition: '80/20 rule: 80% compliant = 100% of benefits',
        education: 'Flexibility prevents all-or-nothing thinking.'
    },
    24: {
        title: 'Day 24: Cost Analysis',
        focus: 'Investment vs expense',
        tasks: [
            'Calculate food costs (before vs after)',
            'Factor in reduced medical expenses',
            'Consider lost productivity costs',
            'Value your energy improvement',
            'Money spent on health = money saved later'
        ],
        nutrition: 'Quality food costs more upfront, less long-term',
        education: 'Cheap food has hidden costs: energy, health, longevity.'
    },
    25: {
        title: 'Day 25: Maintenance Blueprint',
        focus: 'After Day 30, then what?',
        tasks: [
            'List non-negotiable rules',
            'Identify flexible areas',
            'Plan for special occasions',
            'Set ongoing check-in schedule',
            'Define your 90/10 approach'
        ],
        nutrition: 'This is a lifestyle, not a challenge',
        education: 'Your mitochondria remember. One meal won\'t undo 30 days.'
    },
    26: {
        title: 'Day 26: Knowledge Consolidation',
        focus: 'What did you learn?',
        tasks: [
            'Write down top 5 insights',
            'Identify biggest surprise',
            'Note most difficult change',
            'List biggest benefits',
            'Share knowledge with someone'
        ],
        nutrition: 'Teaching solidifies learning',
        education: 'You now know more about mitochondrial health than most doctors.'
    },
    27: {
        title: 'Day 27: Community Building',
        focus: 'You\'re not alone',
        tasks: [
            'Connect with others on same journey',
            'Share your favorite recipe',
            'Offer support to someone struggling',
            'Ask questions you still have',
            'Build accountability network'
        ],
        nutrition: 'Social support predicts long-term success',
        education: 'Humans evolved eating in community. Modern isolation is abnormal.'
    },
    28: {
        title: 'Day 28: Goal Setting - Next 30 Days',
        focus: 'Continuous improvement',
        tasks: [
            'Set specific goals for Days 31-60',
            'Identify areas for deeper optimization',
            'Plan advanced experiments',
            'Schedule check-ins',
            'Commit to ongoing growth'
        ],
        nutrition: 'Optimization never ends, but it gets easier',
        education: 'Mitochondrial biogenesis is lifelong. Keep building.'
    },
    29: {
        title: 'Day 29: Final Preparations',
        focus: 'Tomorrow is graduation',
        tasks: [
            'Prepare for final weigh-in and photos',
            'Review all daily check-ins',
            'Calculate total progress',
            'Write letter to Day 1 self',
            'Plan celebration (protocol-friendly!)'
        ],
        nutrition: 'You\'ve earned this',
        education: 'Your body is 99% different cells than Day 1. You\'ve literally rebuilt yourself.'
    },
    30: {
        title: 'Day 30: Graduation Day',
        focus: 'You did it.',
        tasks: [
            'Final measurements and photos',
            'Complete final assessment',
            'Calculate total changes',
            'Reflect on journey',
            'Commit to ongoing optimization'
        ],
        nutrition: 'This is your new baseline',
        education: 'Congratulations. You\'ve optimized your foundation. Now elevate everything.'
    }
};

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

let challengeState = {
    currentDay: 1,
    userData: {
        name: '',
        email: '',
        startDate: null,
        currentWeight: '',
        primaryGoal: ''
    },
    dailyEntries: {},
    currentView: 'intro'
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function saveToLocalStorage() {
    localStorage.setItem('cbChallengeState', JSON.stringify(challengeState));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('cbChallengeState');
    if (saved) {
        challengeState = JSON.parse(saved);
        return true;
    }
    return false;
}

function getCurrentPhase(day) {
    if (day <= 7) return 'phase1';
    if (day <= 14) return 'phase2';
    if (day <= 21) return 'phase3';
    return 'phase4';
}

function calculateAverage(metric) {
    const values = Object.values(challengeState.dailyEntries)
        .map(entry => entry[metric])
        .filter(val => val !== undefined);
    if (values.length === 0) return 0;
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
}

// ============================================================================
// VIEW SWITCHING
// ============================================================================

function showView(viewName) {
    const views = ['introScreen', 'signupScreen', 'dashboardScreen', 'dailyScreen', 'progressScreen'];
    views.forEach(view => {
        document.getElementById(view).classList.add('hidden');
    });
    document.getElementById(viewName).classList.remove('hidden');
    challengeState.currentView = viewName.replace('Screen', '');
    saveToLocalStorage();
}

function showSignup() {
    showView('signupScreen');
}

function showDashboard() {
    renderDashboard();
    showView('dashboardScreen');
}

function showDaily() {
    renderDaily();
    showView('dailyScreen');
}

function showProgress() {
    renderProgress();
    showView('progressScreen');
}

// ============================================================================
// INITIALIZATION
// ============================================================================

function initializeChallenge() {
    // Render phases on intro screen
    const phasesGrid = document.getElementById('phasesGrid');
    Object.entries(protocolPhases).forEach(([key, phase]) => {
        const phaseCard = document.createElement('div');
        phaseCard.className = 'phase-card';
        phaseCard.innerHTML = `
            <div class="phase-days">Days ${phase.days}</div>
            <div class="phase-name">${phase.name}</div>
            <div class="phase-focus">${phase.focus}</div>
        `;
        phasesGrid.appendChild(phaseCard);
    });

    // Enable signup button when form is valid
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const goalInput = document.getElementById('userGoal');
    const startBtn = document.getElementById('startBtn');

    function validateSignup() {
        const isValid = nameInput.value && emailInput.value && goalInput.value;
        startBtn.disabled = !isValid;
    }

    nameInput.addEventListener('input', validateSignup);
    emailInput.addEventListener('input', validateSignup);
    goalInput.addEventListener('change', validateSignup);

    // Load saved state if exists
    if (loadFromLocalStorage()) {
        if (challengeState.userData.startDate) {
            showDashboard();
        }
    }
}

// ============================================================================
// SIGNUP
// ============================================================================

function startChallenge() {
    challengeState.userData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        currentWeight: document.getElementById('userWeight').value,
        primaryGoal: document.getElementById('userGoal').value,
        startDate: new Date().toISOString()
    };
    challengeState.currentDay = 1;
    saveToLocalStorage();
    showDashboard();
}

// ============================================================================
// DASHBOARD RENDERING
// ============================================================================

function renderDashboard() {
    const currentPhase = getCurrentPhase(challengeState.currentDay);
    const phase = protocolPhases[currentPhase];
    const today = dailyProtocol[challengeState.currentDay];

    // Update header
    document.getElementById('dashboardName').textContent = challengeState.userData.name;
    document.getElementById('dashboardDay').textContent = challengeState.currentDay;

    // Render stats
    const statsGrid = document.getElementById('statsGrid');
    const completedDays = Object.keys(challengeState.dailyEntries).length;
    const daysRemaining = 30 - challengeState.currentDay + 1;

    statsGrid.innerHTML = `
        <div class="stat-card">
            <div class="stat-label">Current Phase</div>
            <div class="stat-value" style="color: #2563eb;">${phase.name}</div>
            <div class="stat-detail">Days ${phase.days}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Days Completed</div>
            <div class="stat-value" style="color: #10b981;">${completedDays}</div>
            <div class="stat-detail">of 30 days</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Streak</div>
            <div class="stat-value" style="color: #f59e0b;">${completedDays}</div>
            <div class="stat-detail">consecutive days</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Days Remaining</div>
            <div class="stat-value" style="color: #8b5cf6;">${daysRemaining}</div>
            <div class="stat-detail">Keep going!</div>
        </div>
    `;

    // Update today's focus
    document.getElementById('todayFocusTitle').textContent = `Today's Focus: ${phase.focus}`;
    document.getElementById('todayFocusContent').textContent = today.title;

    // Render action cards
    const actionsGrid = document.getElementById('actionsGrid');
    actionsGrid.innerHTML = `
        <button class="action-card" onclick="showDaily()">
            <svg class="action-icon" fill="none" stroke="#2563eb" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <div class="action-title">Today's Protocol</div>
            <div class="action-description">View tasks and education for Day ${challengeState.currentDay}</div>
        </button>
        <button class="action-card" onclick="showProgress()">
            <svg class="action-icon" fill="none" stroke="#10b981" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
            <div class="action-title">View Progress</div>
            <div class="action-description">See your trends and improvements</div>
        </button>
        <button class="action-card">
            <svg class="action-icon" fill="none" stroke="#8b5cf6" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
            </svg>
            <div class="action-title">Resources</div>
            <div class="action-description">Shopping lists, meal plans, guides</div>
        </button>
    `;
}

// ============================================================================
// DAILY PROTOCOL RENDERING
// ============================================================================

function renderDaily() {
    const today = dailyProtocol[challengeState.currentDay];

    // Update header
    document.getElementById('protocolDayNumber').textContent = challengeState.currentDay;
    document.getElementById('protocolTitle').textContent = today.title;
    document.getElementById('protocolFocusText').textContent = `Focus: ${today.focus}`;

    // Render tasks
    const tasksList = document.getElementById('tasksList');
    tasksList.innerHTML = today.tasks.map(task => `
        <div class="task-item">
            <svg class="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>${task}</span>
        </div>
    `).join('');

    // Update nutrition and education
    document.getElementById('nutritionText').textContent = today.nutrition;
    document.getElementById('educationText').textContent = today.education;

    // Render check-in form
    renderCheckInForm();
}

function renderCheckInForm() {
    const checkinForm = document.getElementById('checkinForm');
    const currentDayEntry = challengeState.dailyEntries[challengeState.currentDay] || {};

    checkinForm.innerHTML = Object.entries(dailyCheckIn).map(([metric, data]) => `
        <div class="checkin-group">
            <label class="checkin-question">${data.question}</label>
            <div class="options-grid">
                ${data.options.map((option, index) => {
                    const value = index + 1;
                    const isSelected = currentDayEntry[metric] === value;
                    return `
                        <button
                            class="option-btn ${isSelected ? 'selected' : ''}"
                            onclick="handleCheckIn('${metric}', ${value})"
                        >
                            ${option}
                        </button>
                    `;
                }).join('')}
            </div>
        </div>
    `).join('');

    // Enable/disable complete button
    updateCompleteDayButton();
}

function handleCheckIn(metric, value) {
    if (!challengeState.dailyEntries[challengeState.currentDay]) {
        challengeState.dailyEntries[challengeState.currentDay] = {};
    }

    challengeState.dailyEntries[challengeState.currentDay][metric] = value;
    challengeState.dailyEntries[challengeState.currentDay].completedAt = new Date().toISOString();

    saveToLocalStorage();
    renderCheckInForm();
}

function updateCompleteDayButton() {
    const currentDayEntry = challengeState.dailyEntries[challengeState.currentDay] || {};
    const completedMetrics = Object.keys(currentDayEntry).filter(key => key !== 'completedAt').length;
    const totalMetrics = Object.keys(dailyCheckIn).length;

    const completeBtn = document.getElementById('completeDayBtn');
    completeBtn.disabled = completedMetrics < totalMetrics;

    if (challengeState.currentDay === 30) {
        completeBtn.textContent = 'Complete Challenge! 🎉';
    } else {
        completeBtn.textContent = 'Complete Day & Continue →';
    }
}

function completeDay() {
    if (challengeState.currentDay < 30) {
        challengeState.currentDay++;
        saveToLocalStorage();
        showDashboard();
    } else {
        // Challenge complete!
        alert('🎉 Congratulations! You\'ve completed the 30-Day Dowd Protocol Challenge!\n\nYour body has been transformed at the cellular level. You\'ve optimized your foundation. Now elevate everything!');
        showProgress();
    }
}

// ============================================================================
// PROGRESS RENDERING
// ============================================================================

function renderProgress() {
    // Render metrics
    const metricsGrid = document.getElementById('metricsGrid');
    metricsGrid.innerHTML = Object.entries(dailyCheckIn).map(([metric, data]) => {
        const average = calculateAverage(metric);
        return `
            <div class="metric-card">
                <div class="metric-name">${metric}</div>
                <div class="metric-score">${average}/5</div>
                <div class="metric-label">Average score</div>
            </div>
        `;
    }).join('');

    // Render history
    const historyList = document.getElementById('historyList');
    const entries = Object.entries(challengeState.dailyEntries).reverse();

    if (entries.length === 0) {
        historyList.innerHTML = '<p style="text-align: center; color: #6b7280;">No check-ins yet. Complete your first daily protocol!</p>';
        return;
    }

    historyList.innerHTML = entries.map(([day, entry]) => {
        const scoresHtml = Object.entries(dailyCheckIn).map(([metric]) => {
            const score = entry[metric] || 0;
            const scoreClass = score >= 4 ? 'good' : score >= 3 ? 'medium' : 'poor';
            return `
                <div class="score-item">
                    <div class="score-label">${metric}</div>
                    <div class="score-value ${scoreClass}">${score}/5</div>
                </div>
            `;
        }).join('');

        return `
            <div class="history-entry">
                <div class="history-day">Day ${day}</div>
                <div class="history-scores">
                    ${scoresHtml}
                </div>
            </div>
        `;
    }).join('');
}

// ============================================================================
// INITIALIZE ON PAGE LOAD
// ============================================================================

document.addEventListener('DOMContentLoaded', initializeChallenge);
