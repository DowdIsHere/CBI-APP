// Lesson content for CBI Education modules

export interface Lesson {
  id: number;
  moduleId: number;
  title: string;
  duration: string;
  content: LessonSection[];
  keyTakeaways: string[];
  quiz?: QuizQuestion[];
}

export interface LessonSection {
  type: 'heading' | 'text' | 'bullets' | 'quote' | 'highlight';
  content: string | string[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

// FOUNDATION MODULE - 4 Lessons
export const foundationLessons: Lesson[] = [
  {
    id: 1,
    moduleId: 1,
    title: 'Introduction to CBI & The Dowd Protocol',
    duration: '5 min',
    content: [
      {
        type: 'heading',
        content: 'What is CBI?',
      },
      {
        type: 'text',
        content:
          'CBI stands for Cellular Biology Intelligence - a revolutionary approach to understanding how food impacts your body at the cellular level. Unlike traditional nutrition that focuses only on calories and macros, CBI examines how every bite affects your three interconnected intelligence systems.',
      },
      {
        type: 'heading',
        content: 'The Three Intelligence Systems',
      },
      {
        type: 'bullets',
        content: [
          'Gut Intelligence (Enteric Nervous System) - Your "second brain" with 100 million neurons',
          'Brain Intelligence (Central Nervous System) - Your cognitive command center',
          'Cellular Intelligence (Mitochondria) - Your energy production powerhouses',
        ],
      },
      {
        type: 'quote',
        content:
          '"Every food you eat is either building your intelligence or blocking it. There is no neutral." - The Dowd Protocol',
      },
      {
        type: 'heading',
        content: 'How The Dowd Protocol Works',
      },
      {
        type: 'text',
        content:
          'The Dowd Protocol scores foods based on their impact on all three systems. Foods that enhance communication between your gut, brain, and cells earn positive scores. Foods that disrupt this communication receive lower or negative scores.',
      },
      {
        type: 'highlight',
        content:
          'The goal: Optimize your body\'s natural intelligence through strategic food choices.',
      },
    ],
    keyTakeaways: [
      'CBI measures how food affects your cellular intelligence',
      'Three systems work together: Gut, Brain, and Mitochondria',
      'Every food either builds or blocks your intelligence',
      'The Dowd Protocol provides a scoring system for optimal choices',
    ],
    quiz: [
      {
        question: 'What does CBI stand for?',
        options: [
          'Calorie Balance Intelligence',
          'Cellular Biology Intelligence',
          'Central Brain Intelligence',
          'Cognitive Behavior Intelligence',
        ],
        correctAnswer: 1,
        explanation:
          'CBI stands for Cellular Biology Intelligence, focusing on how food impacts you at the cellular level.',
      },
      {
        question: 'How many intelligence systems does the Dowd Protocol address?',
        options: ['One', 'Two', 'Three', 'Four'],
        correctAnswer: 2,
        explanation:
          'The protocol addresses three interconnected systems: Gut Intelligence (ENS), Brain Intelligence (CNS), and Cellular Intelligence (Mitochondria).',
      },
    ],
  },
  {
    id: 2,
    moduleId: 1,
    title: 'Meet Your Enteric Nervous System',
    duration: '5 min',
    content: [
      {
        type: 'heading',
        content: 'Your Second Brain',
      },
      {
        type: 'text',
        content:
          'Your gut contains over 100 million neurons - more than your spinal cord! This network, called the Enteric Nervous System (ENS), operates independently of your brain and controls digestion, nutrient absorption, and much more.',
      },
      {
        type: 'heading',
        content: 'What Your ENS Does',
      },
      {
        type: 'bullets',
        content: [
          'Produces 95% of your body\'s serotonin (the "happiness" neurotransmitter)',
          'Generates 50% of your dopamine (motivation and reward)',
          'Controls the movement of food through your digestive tract',
          'Manages immune responses in your gut',
          'Communicates constantly with your brain via the vagus nerve',
        ],
      },
      {
        type: 'highlight',
        content:
          'Your gut literally "talks" to your brain, influencing your mood, decisions, and mental clarity.',
      },
      {
        type: 'heading',
        content: 'The Gut-Brain Connection',
      },
      {
        type: 'text',
        content:
          'Ever had "butterflies in your stomach" or made a "gut decision"? That\'s your ENS communicating with your brain. This two-way highway (the gut-brain axis) means what you eat directly affects how you think and feel.',
      },
      {
        type: 'heading',
        content: 'Why This Matters for Health',
      },
      {
        type: 'text',
        content:
          'Many chronic conditions (depression, anxiety, autoimmune diseases, brain fog) are linked to ENS dysfunction. By supporting your ENS with the right foods, you can improve mental health, energy, and overall wellbeing.',
      },
    ],
    keyTakeaways: [
      'Your gut has 100 million neurons - it\'s your "second brain"',
      'The ENS produces 95% of serotonin and 50% of dopamine',
      'Your gut and brain communicate constantly via the vagus nerve',
      'ENS health directly impacts mood, cognition, and immune function',
    ],
    quiz: [
      {
        question: 'How many neurons does your Enteric Nervous System contain?',
        options: [
          '10 million',
          '50 million',
          '100 million',
          '500 million',
        ],
        correctAnswer: 2,
        explanation:
          'Your ENS contains over 100 million neurons - more than your spinal cord!',
      },
      {
        question: 'What percentage of your body\'s serotonin is produced in the gut?',
        options: ['25%', '50%', '75%', '95%'],
        correctAnswer: 3,
        explanation:
          'An incredible 95% of your body\'s serotonin is produced in your gut, not your brain!',
      },
    ],
  },
  {
    id: 3,
    moduleId: 1,
    title: 'The Gut-Brain-Mitochondria Axis',
    duration: '5 min',
    content: [
      {
        type: 'heading',
        content: 'The Three-Way Connection',
      },
      {
        type: 'text',
        content:
          'Your gut, brain, and mitochondria form a powerful communication network. When all three work in harmony, you experience optimal energy, mental clarity, and health. When one suffers, they all suffer.',
      },
      {
        type: 'heading',
        content: 'Understanding Mitochondria',
      },
      {
        type: 'text',
        content:
          'Mitochondria are the "power plants" of your cells. You have trillions of them, producing ATP (cellular energy) that powers everything from thinking to moving to healing. Your brain cells alone contain over 2 million mitochondria each!',
      },
      {
        type: 'bullets',
        content: [
          'Mitochondria convert food into usable energy (ATP)',
          'They regulate cell death and regeneration',
          'They control inflammation responses',
          'They determine your metabolic rate',
          'They influence aging and disease resistance',
        ],
      },
      {
        type: 'heading',
        content: 'How The Axis Works',
      },
      {
        type: 'text',
        content:
          '1. Your GUT absorbs nutrients and produces neurotransmitters\n2. These signals travel to your BRAIN via the vagus nerve\n3. Your BRAIN sends commands to your MITOCHONDRIA\n4. Your MITOCHONDRIA produce energy based on fuel quality\n5. This energy powers your GUT and BRAIN functions\n6. The cycle continues...',
      },
      {
        type: 'quote',
        content:
          '"When you eat inflammatory foods, you\'re not just affecting your gut - you\'re disrupting the entire axis of intelligence." - The Dowd Protocol',
      },
      {
        type: 'heading',
        content: 'Breaking the Cycle',
      },
      {
        type: 'text',
        content:
          'Poor food choices create a negative feedback loop: damaged gut → impaired brain function → mitochondrial dysfunction → more gut damage. The Dowd Protocol breaks this cycle by optimizing all three systems simultaneously.',
      },
    ],
    keyTakeaways: [
      'Your gut, brain, and mitochondria form an interconnected axis',
      'Mitochondria are cellular power plants that produce ATP energy',
      'Damage to one system affects all three systems',
      'The Dowd Protocol optimizes all three simultaneously',
    ],
    quiz: [
      {
        question: 'What do mitochondria produce?',
        options: [
          'Serotonin',
          'Dopamine',
          'ATP (energy)',
          'Insulin',
        ],
        correctAnswer: 2,
        explanation:
          'Mitochondria produce ATP (adenosine triphosphate), which is the primary energy currency of your cells.',
      },
    ],
  },
  {
    id: 4,
    moduleId: 1,
    title: 'How Food Scoring Works',
    duration: '5 min',
    content: [
      {
        type: 'heading',
        content: 'The CBI Scoring System',
      },
      {
        type: 'text',
        content:
          'Every food receives a score based on its impact on your three intelligence systems. Positive scores mean the food enhances your gut-brain-mitochondria axis. Lower or negative scores indicate disruption.',
      },
      {
        type: 'heading',
        content: 'What We Measure',
      },
      {
        type: 'bullets',
        content: [
          'Omega-3 to Omega-6 ratio (inflammation control)',
          'Polyphenol content (gut bacteria support)',
          'Sulforaphane and other beneficial compounds',
          'Toxin load (pesticides, heavy metals, additives)',
          'Nutrient density vs. anti-nutrient content',
          'Impact on blood sugar and insulin',
          'Effect on neurotransmitter production',
        ],
      },
      {
        type: 'heading',
        content: 'Score Categories',
      },
      {
        type: 'highlight',
        content: 'HIGH SCORE (+10 to +20): Superfoods that optimize all three systems\nExamples: Wild salmon, broccoli, blueberries, sardines',
      },
      {
        type: 'highlight',
        content: 'MEDIUM SCORE (+3 to +9): Beneficial foods with some limitations\nExamples: Chicken, sweet potatoes, apples, almonds',
      },
      {
        type: 'highlight',
        content: 'LOW SCORE (0 to +2): Neutral or slightly beneficial\nExamples: White rice, bananas, oats',
      },
      {
        type: 'highlight',
        content: 'NEGATIVE SCORE (-1 to -20): Foods that damage the axis\nExamples: Processed foods, seed oils, high-sugar items, inflammatory ingredients',
      },
      {
        type: 'heading',
        content: 'Daily Score Goals',
      },
      {
        type: 'text',
        content:
          'Aim for a daily score of +30 or higher to support optimal function. Most people eating a standard diet score between -10 and +5, explaining why chronic health issues are so common.',
      },
      {
        type: 'quote',
        content:
          '"You don\'t need to be perfect. You need to be consistent. A +30 daily score, maintained over time, transforms health." - The Dowd Protocol',
      },
    ],
    keyTakeaways: [
      'Foods are scored based on their impact on all three systems',
      'High-score foods (+10 to +20) are superfoods for your axis',
      'Negative scores indicate foods that damage your intelligence',
      'Aim for +30 or higher daily to optimize health',
    ],
    quiz: [
      {
        question: 'What is a good daily score goal?',
        options: ['+10', '+20', '+30', '+40'],
        correctAnswer: 2,
        explanation:
          'Aim for a daily score of +30 or higher to support optimal gut-brain-mitochondria function.',
      },
    ],
  },
];

// MECHANISMS MODULE - 5 Lessons
export const mechanismsLessons: Lesson[] = [
  {
    id: 5,
    moduleId: 2,
    title: 'How the ENS Works',
    duration: '6 min',
    content: [
      {
        type: 'heading',
        content: 'The Enteric Nervous System in Detail',
      },
      {
        type: 'text',
        content:
          'Your ENS is a complex network embedded in the lining of your gastrointestinal tract. It consists of two main layers of nerve cells that coordinate digestive functions independently of your brain.',
      },
      {
        type: 'heading',
        content: 'The Two Layers',
      },
      {
        type: 'bullets',
        content: [
          'Myenteric Plexus: Controls muscle contractions that move food through your gut',
          'Submucosal Plexus: Manages secretions, blood flow, and nutrient absorption',
        ],
      },
      {
        type: 'heading',
        content: 'Neurotransmitter Production',
      },
      {
        type: 'text',
        content:
          'Your gut produces and regulates over 30 neurotransmitters, the same chemicals your brain uses for communication. This is why gut health so profoundly affects mental health.',
      },
      {
        type: 'bullets',
        content: [
          'Serotonin: Regulates mood, sleep, and appetite',
          'Dopamine: Controls motivation, pleasure, and movement',
          'GABA: Calms anxiety and promotes relaxation',
          'Acetylcholine: Supports memory and learning',
          'Norepinephrine: Manages stress response and alertness',
        ],
      },
      {
        type: 'heading',
        content: 'The Vagus Nerve Highway',
      },
      {
        type: 'text',
        content:
          'The vagus nerve is the main communication cable between your gut and brain. It carries signals in both directions - 90% of signals travel FROM gut TO brain! This means your gut has more influence on your brain than your brain has on your gut.',
      },
      {
        type: 'highlight',
        content:
          'When your ENS is healthy, it sends positive signals to your brain. When damaged, it sends distress signals that manifest as anxiety, depression, and brain fog.',
      },
    ],
    keyTakeaways: [
      'The ENS has two layers that control digestion independently',
      'Your gut produces 30+ neurotransmitters including serotonin and dopamine',
      'The vagus nerve carries 90% of signals FROM gut TO brain',
      'ENS health directly determines brain health and mood',
    ],
    quiz: [
      {
        question: 'What percentage of vagus nerve signals travel from gut to brain?',
        options: ['10%', '50%', '75%', '90%'],
        correctAnswer: 3,
        explanation:
          'An amazing 90% of vagus nerve signals travel FROM your gut TO your brain, showing the gut\'s powerful influence on your mental state.',
      },
    ],
  },
  {
    id: 6,
    moduleId: 2,
    title: 'Neurotransmitter Production in the Gut',
    duration: '6 min',
    content: [
      {
        type: 'heading',
        content: 'Your Gut is a Chemical Factory',
      },
      {
        type: 'text',
        content:
          'Most people think neurotransmitters are only made in the brain. The truth? Your gut produces more neurotransmitters than your brain! This gut-based production depends entirely on the foods you eat and the health of your gut bacteria.',
      },
      {
        type: 'heading',
        content: 'Serotonin: The Happiness Molecule',
      },
      {
        type: 'text',
        content:
          '95% of your serotonin is produced in your gut by enterochromaffin cells. Serotonin regulates mood, sleep quality, appetite, and gut motility. Low serotonin causes depression, insomnia, and digestive issues.',
      },
      {
        type: 'bullets',
        content: [
          'Requires: Tryptophan (from protein), B vitamins, Omega-3s',
          'Blocked by: Inflammation, poor gut bacteria, stress',
          'Optimized by: Fermented foods, wild fish, leafy greens',
        ],
      },
      {
        type: 'heading',
        content: 'Dopamine: The Motivation Molecule',
      },
      {
        type: 'text',
        content:
          '50% of your dopamine is made in your gut. Dopamine drives motivation, focus, and pleasure. Without adequate dopamine, you experience lack of drive, difficulty concentrating, and anhedonia (inability to feel pleasure).',
      },
      {
        type: 'bullets',
        content: [
          'Requires: Tyrosine (from protein), iron, folate',
          'Blocked by: Sugar crashes, inflammatory oils, toxins',
          'Optimized by: Grass-fed beef, eggs, dark chocolate',
        ],
      },
      {
        type: 'heading',
        content: 'GABA: The Calm Molecule',
      },
      {
        type: 'text',
        content:
          'GABA is your brain\'s primary inhibitory neurotransmitter, responsible for calming anxiety and promoting relaxation. Certain gut bacteria actually produce GABA directly!',
      },
      {
        type: 'quote',
        content:
          '"You can\'t think your way out of anxiety if your gut isn\'t producing enough GABA. Fix the gut, fix the anxiety." - The Dowd Protocol',
      },
      {
        type: 'heading',
        content: 'The Role of Gut Bacteria',
      },
      {
        type: 'text',
        content:
          'Your gut bacteria (microbiome) are essential neurotransmitter factories. Different bacterial strains produce different neurotransmitters. When you eat inflammatory foods, you kill beneficial bacteria and lose neurotransmitter production.',
      },
    ],
    keyTakeaways: [
      '95% of serotonin and 50% of dopamine are made in your gut',
      'Neurotransmitter production depends on food quality and gut bacteria',
      'Poor gut health leads to depression, anxiety, and low motivation',
      'Optimizing gut bacteria optimizes brain chemistry',
    ],
    quiz: [
      {
        question: 'What percentage of your body\'s serotonin is produced in the gut?',
        options: ['50%', '70%', '85%', '95%'],
        correctAnswer: 3,
        explanation:
          'An incredible 95% of your body\'s serotonin is produced in your gut, not your brain!',
      },
    ],
  },
  {
    id: 7,
    moduleId: 2,
    title: 'Inflammation & Food Responses',
    duration: '6 min',
    content: [
      {
        type: 'heading',
        content: 'Understanding Inflammation',
      },
      {
        type: 'text',
        content:
          'Inflammation is your immune system\'s response to threats. Acute inflammation (from injury or infection) is helpful. Chronic inflammation (from daily food choices) is devastating to your gut-brain-mitochondria axis.',
      },
      {
        type: 'heading',
        content: 'How Food Causes Inflammation',
      },
      {
        type: 'bullets',
        content: [
          'Omega-6 oils (soybean, corn, canola) trigger inflammatory cascades',
          'Sugar spikes cause oxidative stress and glycation',
          'Processed additives activate immune responses',
          'Glyphosate and pesticides damage gut lining',
          'Food sensitivities create ongoing immune activation',
        ],
      },
      {
        type: 'highlight',
        content:
          'Most people consume 20-30x more inflammatory Omega-6 than anti-inflammatory Omega-3, creating a constant state of cellular inflammation.',
      },
      {
        type: 'heading',
        content: 'The Leaky Gut Connection',
      },
      {
        type: 'text',
        content:
          'Chronic inflammation damages your gut lining, creating gaps between cells (leaky gut). This allows undigested food particles, toxins, and bacteria to enter your bloodstream, triggering system-wide inflammation.',
      },
      {
        type: 'heading',
        content: 'Inflammation Affects All Three Systems',
      },
      {
        type: 'bullets',
        content: [
          'GUT: Damages ENS neurons, reduces neurotransmitter production',
          'BRAIN: Causes brain fog, depression, anxiety, cognitive decline',
          'MITOCHONDRIA: Impairs ATP production, accelerates aging',
        ],
      },
      {
        type: 'heading',
        content: 'Anti-Inflammatory Strategies',
      },
      {
        type: 'text',
        content:
          'The Dowd Protocol emphasizes anti-inflammatory foods rich in Omega-3s, polyphenols, and antioxidants while eliminating inflammatory triggers.',
      },
      {
        type: 'bullets',
        content: [
          'Prioritize: Wild fish, grass-fed meat, cruciferous vegetables',
          'Include: Berries, leafy greens, fermented foods',
          'Eliminate: Seed oils, processed foods, refined sugar',
          'Minimize: Grains, legumes (if sensitive), nightshades',
        ],
      },
    ],
    keyTakeaways: [
      'Chronic inflammation from food damages all three intelligence systems',
      'Most people consume 20-30x too much inflammatory Omega-6',
      'Leaky gut allows toxins into bloodstream, triggering system-wide issues',
      'Anti-inflammatory foods heal the gut-brain-mitochondria axis',
    ],
    quiz: [
      {
        question: 'What causes "leaky gut"?',
        options: [
          'Drinking too much water',
          'Chronic inflammation damaging gut lining',
          'Eating too much protein',
          'Vitamin deficiency',
        ],
        correctAnswer: 1,
        explanation:
          'Chronic inflammation damages the gut lining, creating gaps that allow toxins and particles to leak into the bloodstream.',
      },
    ],
  },
  {
    id: 8,
    moduleId: 2,
    title: 'Mitochondrial Function',
    duration: '6 min',
    content: [
      {
        type: 'heading',
        content: 'Your Cellular Power Plants',
      },
      {
        type: 'text',
        content:
          'You have approximately 37 trillion cells, and most contain hundreds to thousands of mitochondria. These tiny organelles are responsible for converting the food you eat into ATP - the energy currency your body uses for everything.',
      },
      {
        type: 'heading',
        content: 'How Mitochondria Produce Energy',
      },
      {
        type: 'text',
        content:
          'Mitochondria use a process called cellular respiration to break down nutrients (glucose, fats, amino acids) and produce ATP. This process requires oxygen and specific nutrients to work efficiently.',
      },
      {
        type: 'bullets',
        content: [
          'Krebs Cycle: Breaks down nutrients into usable components',
          'Electron Transport Chain: Produces ATP from these components',
          'Requires: B vitamins, CoQ10, iron, magnesium, antioxidants',
          'Produces: ATP energy + metabolic byproducts',
        ],
      },
      {
        type: 'heading',
        content: 'Mitochondrial Dysfunction',
      },
      {
        type: 'text',
        content:
          'When mitochondria are damaged or poorly fueled, they produce less ATP and more harmful byproducts (reactive oxygen species/ROS). This creates a vicious cycle of declining energy and increasing damage.',
      },
      {
        type: 'highlight',
        content:
          'Mitochondrial dysfunction is linked to: Chronic fatigue, brain fog, accelerated aging, cancer, neurodegenerative diseases, and metabolic disorders.',
      },
      {
        type: 'heading',
        content: 'What Damages Mitochondria',
      },
      {
        type: 'bullets',
        content: [
          'Inflammatory foods and seed oils',
          'Oxidative stress from sugar and toxins',
          'Nutrient deficiencies (especially B vitamins and CoQ10)',
          'Heavy metals and environmental toxins',
          'Chronic stress and poor sleep',
          'Sedentary lifestyle',
        ],
      },
      {
        type: 'heading',
        content: 'Optimizing Mitochondrial Function',
      },
      {
        type: 'text',
        content:
          'The Dowd Protocol supports mitochondria through nutrient-dense foods, anti-inflammatory choices, and specific compounds that enhance mitochondrial health.',
      },
      {
        type: 'bullets',
        content: [
          'Omega-3 fatty acids: Support mitochondrial membranes',
          'Polyphenols: Activate mitochondrial biogenesis (making new mitochondria)',
          'CoQ10: Essential for electron transport chain',
          'PQQ: Stimulates new mitochondria growth',
          'Intermittent fasting: Triggers mitochondrial cleanup (mitophagy)',
        ],
      },
      {
        type: 'quote',
        content:
          '"You are only as healthy as your mitochondria. Feed them well, and they\'ll power an extraordinary life." - The Dowd Protocol',
      },
    ],
    keyTakeaways: [
      'Mitochondria convert food into ATP energy through cellular respiration',
      'Damaged mitochondria cause fatigue, brain fog, and accelerated aging',
      'Inflammatory foods and toxins damage mitochondrial function',
      'Omega-3s, polyphenols, and CoQ10 optimize mitochondrial health',
    ],
    quiz: [
      {
        question: 'What is the primary function of mitochondria?',
        options: [
          'Store fat',
          'Produce ATP energy',
          'Digest food',
          'Filter toxins',
        ],
        correctAnswer: 1,
        explanation:
          'Mitochondria are cellular power plants that convert nutrients into ATP, the energy currency your body uses for all functions.',
      },
    ],
  },
  {
    id: 9,
    moduleId: 2,
    title: 'The Vagus Nerve Connection',
    duration: '6 min',
    content: [
      {
        type: 'heading',
        content: 'The Information Superhighway',
      },
      {
        type: 'text',
        content:
          'The vagus nerve is the longest cranial nerve in your body, running from your brainstem through your neck, chest, and into your abdomen. It connects your brain to your heart, lungs, and entire digestive tract.',
      },
      {
        type: 'heading',
        content: 'Bidirectional Communication',
      },
      {
        type: 'text',
        content:
          'The vagus nerve carries signals in both directions. While your brain can send commands to your gut (like "feel hungry" or "stop eating"), the majority of signals flow the opposite way - from gut to brain.',
      },
      {
        type: 'bullets',
        content: [
          '90% of signals: Gut → Brain (afferent pathway)',
          '10% of signals: Brain → Gut (efferent pathway)',
          'Transmits: Nutrient status, inflammation levels, gut bacteria signals',
          'Controls: Heart rate, breathing, digestion, immune responses',
        ],
      },
      {
        type: 'heading',
        content: 'Vagal Tone: The Measure of Health',
      },
      {
        type: 'text',
        content:
          'Vagal tone refers to how well your vagus nerve functions. High vagal tone means efficient communication between gut and brain, better stress resilience, improved digestion, and enhanced emotional regulation.',
      },
      {
        type: 'highlight',
        content:
          'High vagal tone = Better health, mood stability, stress resilience, and cognitive function',
      },
      {
        type: 'heading',
        content: 'What Damages Vagal Function',
      },
      {
        type: 'bullets',
        content: [
          'Chronic stress and anxiety',
          'Inflammation from poor diet',
          'Gut dysbiosis (bacterial imbalance)',
          'Processed foods and toxins',
          'Sedentary lifestyle',
          'Poor sleep quality',
        ],
      },
      {
        type: 'heading',
        content: 'How to Improve Vagal Tone',
      },
      {
        type: 'text',
        content:
          'The Dowd Protocol supports vagal function through anti-inflammatory nutrition and specific practices that activate the vagus nerve.',
      },
      {
        type: 'bullets',
        content: [
          'Omega-3 rich foods: Reduce inflammation along vagus pathway',
          'Fermented foods: Support gut bacteria that signal via vagus',
          'Deep breathing: Directly stimulates vagus activation',
          'Cold exposure: Brief cold showers activate vagal response',
          'Humming/singing: Vibrations stimulate vagus in throat',
          'Meditation: Increases vagal tone over time',
        ],
      },
      {
        type: 'heading',
        content: 'The Gut-Heart-Brain Triangle',
      },
      {
        type: 'text',
        content:
          'The vagus nerve creates a powerful connection between your gut, heart, and brain. When your gut is inflamed, the vagus carries distress signals to both your brain (causing anxiety) and heart (causing stress responses). Healing your gut improves communication across all three.',
      },
      {
        type: 'quote',
        content:
          '"A healthy vagus nerve is like a high-speed internet connection between your gut and brain. Inflammation is like cutting the cable." - The Dowd Protocol',
      },
    ],
    keyTakeaways: [
      'The vagus nerve connects your gut, brain, and major organs',
      '90% of vagal signals travel FROM gut TO brain',
      'High vagal tone indicates optimal gut-brain communication',
      'Anti-inflammatory foods and specific practices improve vagal function',
    ],
    quiz: [
      {
        question: 'What percentage of vagus nerve signals travel from gut to brain?',
        options: ['10%', '50%', '70%', '90%'],
        correctAnswer: 3,
        explanation:
          '90% of vagus nerve signals travel from your gut to your brain, demonstrating the profound influence your gut has on your mental state and overall health.',
      },
      {
        question: 'Which practice can help improve vagal tone?',
        options: [
          'Watching TV',
          'Deep breathing exercises',
          'Eating processed foods',
          'Staying sedentary',
        ],
        correctAnswer: 1,
        explanation:
          'Deep breathing exercises directly stimulate the vagus nerve and improve vagal tone over time.',
      },
    ],
  },
];

// Export all lessons
export const allLessons: Lesson[] = [
  ...foundationLessons,
  ...mechanismsLessons,
];

// Helper function to get lessons by module ID
export const getLessonsByModule = (moduleId: number): Lesson[] => {
  return allLessons.filter((lesson) => lesson.moduleId === moduleId);
};

// Helper function to get a specific lesson
export const getLesson = (lessonId: number): Lesson | undefined => {
  return allLessons.find((lesson) => lesson.id === lessonId);
};
