// 30-Day Dowd Protocol Challenge Web App
// Complete functionality for tracking, meals, shopping, and progress

// ========================================
// STATE MANAGEMENT
// ========================================

let userData = {
    name: '',
    email: '',
    primaryGoal: '',
    restrictions: [],
    startDate: null,
    currentDay: 1,
    completedDays: [],
    dailyEntries: {},
    streak: 0
};

// ========================================
// CHALLENGE DATA
// ========================================

const challengeData = {
    dailyContent: [
        {
            day: 1,
            focus: "Welcome to the Dowd Protocol! Today, we focus on eliminating processed foods and sugar. Your gut-brain-mitochondria axis begins its transformation.",
            meals: [
                { name: "Breakfast", time: "7:00 AM", description: "Scrambled eggs with avocado and spinach. Green tea." },
                { name: "Lunch", time: "12:00 PM", description: "Grilled chicken salad with olive oil and lemon dressing. Mixed greens, cucumber, tomatoes." },
                { name: "Dinner", time: "6:00 PM", description: "Baked salmon with roasted broccoli and cauliflower. Side of sauerkraut." }
            ],
            checklist: [
                "Drink 8 glasses of water",
                "No processed foods today",
                "No added sugar",
                "Take a 15-minute walk",
                "Log all meals"
            ],
            education: {
                title: "Understanding the Gut-Brain Axis",
                content: "Your gut contains 500 million neurons and produces 95% of your body's serotonin. What you eat directly affects your mood, cognition, and overall health. The Dowd Protocol optimizes this connection."
            }
        },
        // Days 2-7
        {
            day: 2,
            focus: "Hydration and fiber. Today we increase water intake and add more vegetables to support your microbiome.",
            meals: [
                { name: "Breakfast", time: "7:00 AM", description: "Greek yogurt with chia seeds, blueberries, and walnuts." },
                { name: "Lunch", time: "12:00 PM", description: "Turkey lettuce wraps with hummus, carrots, and bell peppers." },
                { name: "Dinner", time: "6:00 PM", description: "Grass-fed beef stir-fry with mixed vegetables in coconut oil." }
            ],
            checklist: [
                "Drink 10 glasses of water",
                "Eat 5 servings of vegetables",
                "Add probiotic-rich food",
                "Practice mindful eating",
                "Track energy levels"
            ],
            education: {
                title: "The Power of Hydration",
                content: "Proper hydration supports every cellular function in your body. Water helps transport nutrients, remove toxins, and maintain optimal mitochondrial function. Aim for half your body weight in ounces daily."
            }
        },
        {
            day: 3,
            focus: "Eliminating inflammatory oils. Replace vegetable oils with healthy fats like olive oil, coconut oil, and avocado oil.",
            meals: [
                { name: "Breakfast", time: "7:00 AM", description: "Smoothie with spinach, avocado, coconut milk, and protein powder." },
                { name: "Lunch", time: "12:00 PM", description: "Quinoa bowl with roasted vegetables, chickpeas, and tahini dressing." },
                { name: "Dinner", time: "6:00 PM", description: "Grilled chicken thighs with Brussels sprouts roasted in olive oil." }
            ],
            checklist: [
                "Check all labels for inflammatory oils",
                "Use only approved cooking fats",
                "Eat omega-3 rich food",
                "Practice deep breathing for 5 minutes",
                "Journal how you feel"
            ],
            education: {
                title: "Healthy Fats vs Inflammatory Oils",
                content: "Vegetable oils (canola, soybean, corn) are high in omega-6 and cause inflammation. Instead, use olive oil, coconut oil, and avocado oil which support cellular health and reduce inflammation."
            }
        },
        {
            day: 4,
            focus: "Intermittent fasting introduction. Today we extend the overnight fast to 12 hours to promote autophagy.",
            meals: [
                { name: "Breakfast", time: "8:00 AM", description: "Omelet with mushrooms, onions, and bell peppers. Black coffee." },
                { name: "Lunch", time: "1:00 PM", description: "Wild-caught tuna salad with mixed greens and olive oil." },
                { name: "Dinner", time: "7:00 PM", description: "Pork chops with green beans and sweet potato." }
            ],
            checklist: [
                "Fast for 12 hours (8pm - 8am)",
                "No snacking after dinner",
                "Drink herbal tea in evening",
                "Get 7-8 hours of sleep",
                "Morning stretching routine"
            ],
            education: {
                title: "Autophagy and Cellular Cleanup",
                content: "Fasting triggers autophagy, your body's cellular recycling process. This removes damaged proteins and organelles, supporting mitochondrial health and longevity."
            }
        },
        {
            day: 5,
            focus: "Probiotic foods for gut health. Add fermented foods to support your microbiome diversity.",
            meals: [
                { name: "Breakfast", time: "8:00 AM", description: "Kefir smoothie with berries and flaxseeds." },
                { name: "Lunch", time: "1:00 PM", description: "Chicken soup with bone broth, vegetables, and kimchi." },
                { name: "Dinner", time: "7:00 PM", description: "Grilled fish with sauerkraut and roasted asparagus." }
            ],
            checklist: [
                "Eat 2 servings of fermented foods",
                "Include bone broth",
                "Avoid all dairy except kefir",
                "Take probiotics supplement",
                "Track digestive improvements"
            ],
            education: {
                title: "Fermented Foods and Gut Health",
                content: "Fermented foods like sauerkraut, kimchi, and kefir contain beneficial bacteria that support gut health, immune function, and neurotransmitter production."
            }
        },
        {
            day: 6,
            focus: "Movement and exercise. Physical activity supports mitochondrial biogenesis and overall health.",
            meals: [
                { name: "Breakfast", time: "8:00 AM", description: "Eggs with sautéed kale and cherry tomatoes." },
                { name: "Lunch", time: "1:00 PM", description: "Grass-fed burger (no bun) with guacamole and sweet potato fries." },
                { name: "Dinner", time: "7:00 PM", description: "Shrimp stir-fry with bok choy and cauliflower rice." }
            ],
            checklist: [
                "30 minutes of moderate exercise",
                "Include strength training",
                "Stay active throughout the day",
                "Stretch before bed",
                "Track energy post-workout"
            ],
            education: {
                title: "Exercise and Mitochondrial Function",
                content: "Regular exercise promotes mitochondrial biogenesis (creation of new mitochondria), improves insulin sensitivity, and enhances brain function through BDNF production."
            }
        },
        {
            day: 7,
            focus: "Weekly reflection and meal prep. Prepare for the week ahead and celebrate your first week!",
            meals: [
                { name: "Breakfast", time: "8:00 AM", description: "Chia pudding with coconut milk and mixed berries." },
                { name: "Lunch", time: "1:00 PM", description: "Large salad with grilled chicken, avocado, and diverse vegetables." },
                { name: "Dinner", time: "7:00 PM", description: "Roasted turkey breast with roasted root vegetables." }
            ],
            checklist: [
                "Meal prep for next 3 days",
                "Reflect on improvements",
                "Take progress photos",
                "Review your food journal",
                "Plan next week's meals"
            ],
            education: {
                title: "The Power of Consistency",
                content: "You've completed one week! Research shows it takes 21 days to form a habit. You're one-third of the way there. Notice improvements in energy, sleep, and mental clarity."
            }
        }
    ],

    shoppingLists: {
        week1: {
            proteins: ["Eggs (2 dozen)", "Chicken breast (2 lbs)", "Salmon (1 lb)", "Ground beef (1 lb)", "Turkey slices (1 lb)"],
            vegetables: ["Spinach (2 bunches)", "Broccoli (2 heads)", "Cauliflower (1 head)", "Mixed greens (3 bags)", "Cucumbers (3)", "Tomatoes (6)", "Bell peppers (4)", "Avocados (6)"],
            fats: ["Olive oil (1 bottle)", "Coconut oil (1 jar)", "Avocado oil (1 bottle)", "Raw nuts (almonds, walnuts)"],
            fermented: ["Sauerkraut (1 jar)", "Kimchi (1 jar)", "Greek yogurt (plain, 2 containers)"],
            pantry: ["Chia seeds", "Flaxseeds", "Green tea", "Herbal tea", "Bone broth (4 cartons)"],
            extras: ["Lemons (6)", "Garlic (2 bulbs)", "Ginger root", "Fresh herbs (parsley, cilantro)"]
        },
        week2: {
            proteins: ["Wild-caught fish (2 lbs)", "Organic chicken thighs (2 lbs)", "Grass-fed beef (1.5 lbs)", "Pork chops (1 lb)"],
            vegetables: ["Kale (2 bunches)", "Brussels sprouts (2 lbs)", "Asparagus (2 bunches)", "Bok choy (3 bunches)", "Sweet potatoes (4)", "Mushrooms (1 lb)"],
            fats: ["Tahini", "Coconut milk (3 cans)", "Olives (1 jar)"],
            fermented: ["Kefir (2 bottles)", "Kombucha (6 bottles)", "Pickles (sugar-free, 1 jar)"],
            pantry: ["Quinoa (1 bag)", "Coconut flour", "Almond flour", "Protein powder (unflavored)"],
            extras: ["Berries (mixed, 2 lbs)", "Coconut flakes (unsweetened)"]
        },
        week3: {
            proteins: ["Pasture-raised chicken (whole)", "Lamb chops (1 lb)", "Sardines (3 cans)", "Shrimp (1 lb)"],
            vegetables: ["Arugula (2 bags)", "Zucchini (4)", "Eggplant (2)", "Cabbage (1 head)", "Carrots (2 lbs)", "Celery (1 bunch)"],
            fats: ["Macadamia nuts", "Brazil nuts", "Ghee (1 jar)"],
            fermented: ["Apple cider vinegar (raw, 1 bottle)", "Miso paste (1 container)"],
            pantry: ["Turmeric powder", "Cumin", "Paprika", "Sea salt", "Black pepper"],
            extras: ["Seaweed snacks", "Cacao nibs (unsweetened)"]
        },
        week4: {
            proteins: ["Bison burger patties", "Duck breast", "Venison (if available)", "Halibut (1 lb)"],
            vegetables: ["Watercress", "Dandelion greens", "Fennel (2 bulbs)", "Artichokes (4)", "Rainbow chard (2 bunches)"],
            fats: ["Duck fat", "Lard (pasture-raised)", "Hemp seeds"],
            fermented: ["Tempeh (2 packages)", "Natto (if tolerated)"],
            pantry: ["Nutritional yeast", "Collagen powder", "MCT oil"],
            extras: ["Monk fruit sweetener", "Vanilla extract (pure)", "Cinnamon sticks"]
        }
    },

    achievements: [
        { id: 1, name: "First Day", icon: "🎯", unlockDay: 1 },
        { id: 2, name: "Week Warrior", icon: "💪", unlockDay: 7 },
        { id: 3, name: "Halfway Hero", icon: "🌟", unlockDay: 15 },
        { id: 4, name: "Three Weeks Strong", icon: "🏆", unlockDay: 21 },
        { id: 5, name: "Challenge Champion", icon: "👑", unlockDay: 30 },
        { id: 6, name: "Hydration Master", icon: "💧", condition: "water" },
        { id: 7, name: "Meal Prep Pro", icon: "🍱", condition: "mealprep" },
        { id: 8, name: "Streak Keeper", icon: "🔥", condition: "streak7" }
    ]
};

// Generate remaining days (8-30) with similar structure
for (let i = 8; i <= 30; i++) {
    challengeData.dailyContent.push({
        day: i,
        focus: `Day ${i}: Continue optimizing your nutrition and building healthy habits.`,
        meals: [
            { name: "Breakfast", time: "8:00 AM", description: "Nutrient-dense breakfast following Dowd Protocol principles." },
            { name: "Lunch", time: "1:00 PM", description: "Balanced lunch with protein, healthy fats, and vegetables." },
            { name: "Dinner", time: "7:00 PM", description: "Satisfying dinner supporting gut-brain-mitochondria health." }
        ],
        checklist: [
            "Follow meal plan",
            "Stay hydrated",
            "Move your body",
            "Practice mindful eating",
            "Track your progress"
        ],
        education: {
            title: `Day ${i} Learning`,
            content: "Continue applying the principles you've learned. Your body is adapting and healing."
        }
    });
}

// ========================================
// LOCAL STORAGE
// ========================================

function saveUserData() {
    localStorage.setItem('cognitionBlocksChallenge', JSON.stringify(userData));
}

function loadUserData() {
    const saved = localStorage.getItem('cognitionBlocksChallenge');
    if (saved) {
        userData = JSON.parse(saved);
        return true;
    }
    return false;
}

// ========================================
// SCREEN MANAGEMENT
// ========================================

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function showTab(tabName) {
    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.target.closest('.nav-item').classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');

    // Load tab-specific content
    if (tabName === 'calendar') {
        renderCalendar();
    } else if (tabName === 'progress') {
        updateProgress();
    } else if (tabName === 'shopping') {
        renderShoppingList(1);
    }
}

// ========================================
// PROFILE SETUP
// ========================================

document.getElementById('profileForm')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const restrictions = Array.from(document.querySelectorAll('input[name="restrictions"]:checked'))
        .map(cb => cb.value);

    userData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        primaryGoal: document.getElementById('primaryGoal').value,
        restrictions: restrictions,
        startDate: new Date().toISOString(),
        currentDay: 1,
        completedDays: [],
        dailyEntries: {},
        streak: 0
    };

    saveUserData();
    initializeDashboard();
    showScreen('dashboardScreen');
});

// ========================================
// DASHBOARD INITIALIZATION
// ========================================

function initializeDashboard() {
    // Update user info
    const initials = userData.name.split(' ').map(n => n[0]).join('').toUpperCase();
    document.getElementById('userAvatar').textContent = initials;
    document.getElementById('displayName').textContent = userData.name;

    const goalText = {
        'energy': 'Boosting Energy',
        'focus': 'Sharpening Focus',
        'digestion': 'Improving Digestion',
        'weight': 'Managing Weight',
        'overall': 'Overall Wellness'
    };
    document.getElementById('displayGoal').textContent = goalText[userData.primaryGoal] || 'Your Health Journey';

    // Update stats
    document.getElementById('currentDay').textContent = userData.currentDay;
    const completion = Math.round((userData.completedDays.length / 30) * 100);
    document.getElementById('completionRate').textContent = `${completion}%`;
    document.getElementById('currentStreak').textContent = `${userData.streak} 🔥`;

    // Load today's content
    renderTodayContent();
}

// ========================================
// TODAY TAB
// ========================================

function renderTodayContent() {
    const dayData = challengeData.dailyContent[userData.currentDay - 1];

    document.getElementById('todayDayNumber').textContent = userData.currentDay;
    document.getElementById('dailyFocusText').textContent = dayData.focus;

    // Render meals
    const mealsContainer = document.getElementById('mealsContainer');
    mealsContainer.innerHTML = dayData.meals.map(meal => `
        <div class="meal-card">
            <div class="meal-header">
                <span class="meal-name">${meal.name}</span>
                <span class="meal-time">${meal.time}</span>
            </div>
            <p class="meal-description">${meal.description}</p>
        </div>
    `).join('');

    // Render checklist
    const checklistContainer = document.getElementById('checklistContainer');
    const dayKey = `day${userData.currentDay}`;
    const completedItems = userData.dailyEntries[dayKey]?.checklist || [];

    checklistContainer.innerHTML = dayData.checklist.map((item, index) => {
        const isCompleted = completedItems.includes(index);
        return `
            <div class="checklist-item ${isCompleted ? 'completed' : ''}" onclick="toggleChecklistItem(${index})">
                <div class="checklist-checkbox"></div>
                <span class="checklist-text">${item}</span>
            </div>
        `;
    }).join('');

    // Render education
    document.getElementById('educationTitle').textContent = dayData.education.title;
    document.getElementById('educationContent').textContent = dayData.education.content;
}

function toggleChecklistItem(index) {
    const dayKey = `day${userData.currentDay}`;
    if (!userData.dailyEntries[dayKey]) {
        userData.dailyEntries[dayKey] = { checklist: [] };
    }

    const checklist = userData.dailyEntries[dayKey].checklist;
    const itemIndex = checklist.indexOf(index);

    if (itemIndex > -1) {
        checklist.splice(itemIndex, 1);
    } else {
        checklist.push(index);
    }

    saveUserData();
    renderTodayContent();
}

function completeDay() {
    if (!userData.completedDays.includes(userData.currentDay)) {
        userData.completedDays.push(userData.currentDay);

        // Update streak
        if (userData.currentDay === 1 || userData.completedDays.includes(userData.currentDay - 1)) {
            userData.streak++;
        } else {
            userData.streak = 1;
        }

        // Move to next day
        if (userData.currentDay < 30) {
            userData.currentDay++;
        }

        saveUserData();
        initializeDashboard();

        alert(`🎉 Day ${userData.currentDay - 1} complete! Great work!`);
    }
}

// ========================================
// CALENDAR TAB
// ========================================

function renderCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');

    calendarGrid.innerHTML = Array.from({ length: 30 }, (_, i) => {
        const dayNum = i + 1;
        const isCompleted = userData.completedDays.includes(dayNum);
        const isCurrent = userData.currentDay === dayNum;
        const dayClass = isCompleted ? 'completed' : isCurrent ? 'current' : '';

        return `
            <div class="calendar-day ${dayClass}" onclick="viewDay(${dayNum})">
                <div class="day-number">${dayNum}</div>
                <div class="day-label">${isCompleted ? '✓' : isCurrent ? 'Today' : ''}</div>
            </div>
        `;
    }).join('');
}

function viewDay(dayNum) {
    if (dayNum <= userData.currentDay) {
        const previousDay = userData.currentDay;
        userData.currentDay = dayNum;
        renderTodayContent();
        showTab('today');
        // Restore current day after viewing
        setTimeout(() => {
            userData.currentDay = previousDay;
        }, 100);
    }
}

// ========================================
// PROGRESS TAB
// ========================================

function updateProgress() {
    // Update metrics (these would normally come from user input)
    const baseEnergy = 5;
    const improvementRate = userData.completedDays.length * 0.1;

    document.getElementById('energyMetric').textContent = `${Math.min(10, Math.round(baseEnergy + improvementRate))}/10`;
    document.getElementById('clarityMetric').textContent = `${Math.min(10, Math.round(baseEnergy + improvementRate + 1))}/10`;
    document.getElementById('digestionMetric').textContent = `${Math.min(10, Math.round(baseEnergy + improvementRate - 1))}/10`;
    document.getElementById('wellnessMetric').textContent = `${Math.min(10, Math.round(baseEnergy + improvementRate))}/10`;

    // Render achievements
    const achievementsGrid = document.getElementById('achievementsGrid');
    achievementsGrid.innerHTML = challengeData.achievements.map(achievement => {
        let isUnlocked = false;

        if (achievement.unlockDay) {
            isUnlocked = userData.completedDays.includes(achievement.unlockDay);
        } else if (achievement.condition === 'streak7') {
            isUnlocked = userData.streak >= 7;
        }

        return `
            <div class="achievement-badge ${isUnlocked ? 'unlocked' : ''}">
                <div class="badge-icon">${achievement.icon}</div>
                <div class="badge-name">${achievement.name}</div>
            </div>
        `;
    }).join('');
}

// ========================================
// SHOPPING TAB
// ========================================

function selectWeek(weekNum) {
    document.querySelectorAll('.week-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    renderShoppingList(weekNum);
}

function renderShoppingList(weekNum) {
    const weekData = challengeData.shoppingLists[`week${weekNum}`];
    const container = document.getElementById('shoppingListContainer');

    container.innerHTML = Object.entries(weekData).map(([category, items]) => `
        <div class="shopping-category">
            <h4 class="category-name">${category.charAt(0).toUpperCase() + category.slice(1)}</h4>
            <div class="shopping-items">
                ${items.map((item, index) => `
                    <div class="shopping-item">
                        <input type="checkbox" id="item-${category}-${index}" onchange="toggleShoppingItem(this)">
                        <label for="item-${category}-${index}" class="item-name">${item}</label>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function toggleShoppingItem(checkbox) {
    const item = checkbox.closest('.shopping-item');
    if (checkbox.checked) {
        item.classList.add('checked');
    } else {
        item.classList.remove('checked');
    }
}

function downloadShoppingList() {
    alert('Shopping list PDF download will be integrated with your backend. For now, you can screenshot or print this page!');
    // TODO: Integrate with backend PDF generation
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    if (loadUserData() && userData.name) {
        // User has already started
        initializeDashboard();
        showScreen('dashboardScreen');
    } else {
        // New user
        showScreen('welcomeScreen');
    }
});

// Expose functions globally
window.showTab = showTab;
window.completeDay = completeDay;
window.selectWeek = selectWeek;
window.toggleShoppingItem = toggleShoppingItem;
window.downloadShoppingList = downloadShoppingList;
window.viewDay = viewDay;
window.toggleChecklistItem = toggleChecklistItem;
