import { Lesson, Article } from './types';

// All lessons organized by module
export const lessons: Lesson[] = [
  // Module 1: Foundation
  {
    id: '1-1',
    moduleId: '1',
    title: 'Meet Your Enteric Nervous System',
    duration: '5 min',
    completed: false,
    content: [
      'Your gut contains a remarkable network of over 100 million neurons - more than your spinal cord. This is your Enteric Nervous System (ENS), often called your "second brain."',
      'The ENS operates independently from your central nervous system, controlling digestion, nutrient absorption, and communicating with your brain through the vagus nerve.',
      'What makes this significant is that your ENS produces 95% of your body\'s serotonin and about 50% of your dopamine - neurotransmitters essential for mood, sleep, and cognitive function.',
      'When your ENS is compromised by poor food choices, inflammation, or toxins, it directly impacts your brain function, energy levels, and overall health.',
    ],
    keyPoints: [
      '100 million neurons in your gut',
      '95% of serotonin produced in the gut',
      'Direct communication with brain via vagus nerve',
      'Controls digestion and nutrient absorption',
    ],
  },
  {
    id: '1-2',
    moduleId: '1',
    title: 'The Gut-Brain Connection',
    duration: '5 min',
    completed: false,
    content: [
      'The gut-brain axis is a bidirectional communication network linking your intestinal function with emotional and cognitive centers of the brain.',
      'This connection explains why stress can cause stomach issues, and why gut problems often accompany mood disorders like anxiety and depression.',
      'The vagus nerve serves as the main highway for this communication, carrying signals in both directions. When your gut is inflamed, it sends inflammatory signals to your brain.',
      'Research shows that improving gut health can have profound effects on mental clarity, mood stability, and even conditions like MS, Parkinson\'s, and Alzheimer\'s.',
    ],
    keyPoints: [
      'Bidirectional communication system',
      'Vagus nerve is the main pathway',
      'Gut inflammation affects brain function',
      'Improving gut health improves cognition',
    ],
  },
  {
    id: '1-3',
    moduleId: '1',
    title: 'Mitochondria: Your Cellular Powerhouses',
    duration: '5 min',
    completed: false,
    content: [
      'Mitochondria are the energy-producing organelles in your cells. They convert nutrients into ATP, the energy currency your body uses for everything.',
      'Your brain and nervous system are particularly dependent on mitochondrial function. When mitochondria are damaged or dysfunctional, neurological symptoms often follow.',
      'Many foods can either support or damage your mitochondria. Processed foods, seed oils, and excess sugar impair mitochondrial function, while omega-3s, B vitamins, and certain antioxidants support it.',
      'The JD Mercer Protocol focuses on foods that optimize mitochondrial health, directly supporting your nervous system\'s energy needs.',
    ],
    keyPoints: [
      'Mitochondria produce cellular energy (ATP)',
      'Brain is highly dependent on mitochondrial function',
      'Diet directly affects mitochondrial health',
      'Supporting mitochondria supports the nervous system',
    ],
  },
  {
    id: '1-4',
    moduleId: '1',
    title: 'The Three Intelligences',
    duration: '5 min',
    completed: false,
    content: [
      'The JD Mercer Protocol is built around supporting three interconnected "intelligences" in your body: Gut Intelligence (ENS), Brain Intelligence (CNS), and Cellular Intelligence (Mitochondria).',
      'These three systems form a triangle of health. When one is compromised, the others suffer. When you support all three, you create a powerful synergy of healing.',
      'Gut Intelligence processes food and generates neurotransmitters. Brain Intelligence coordinates body functions and cognition. Cellular Intelligence produces the energy both need to function.',
      'Every food you eat either supports or stresses these intelligences. Our scoring system reflects this - high-scoring foods support all three, while low-scoring foods stress them.',
    ],
    keyPoints: [
      'Three intelligences: Gut, Brain, Cellular',
      'All three are interconnected',
      'Food choices affect all three systems',
      'Protocol designed to optimize all three',
    ],
  },

  // Module 2: Mechanisms
  {
    id: '2-1',
    moduleId: '2',
    title: 'Understanding Inflammation',
    duration: '6 min',
    completed: false,
    content: [
      'Chronic inflammation is at the root of virtually all modern diseases, including neurological conditions. Unlike acute inflammation (which heals injuries), chronic inflammation slowly damages tissues.',
      'The gut is often ground zero for systemic inflammation. A damaged gut lining allows particles to "leak" into the bloodstream, triggering immune responses that affect the entire body.',
      'Certain foods are highly inflammatory: seed oils rich in omega-6, refined sugars, processed foods, and common allergens. These create ongoing stress on your immune system.',
      'Anti-inflammatory foods like fatty fish, leafy greens, turmeric, and olive oil help calm this response and allow healing to begin.',
    ],
    keyPoints: [
      'Chronic inflammation damages all tissues',
      'Gut damage leads to systemic inflammation',
      'Certain foods trigger inflammation',
      'Anti-inflammatory foods promote healing',
    ],
  },
  {
    id: '2-2',
    moduleId: '2',
    title: 'Omega-3 vs Omega-6 Balance',
    duration: '6 min',
    completed: false,
    content: [
      'Your body needs both omega-3 and omega-6 fatty acids, but the ratio matters enormously. Historically, humans consumed these in roughly equal amounts (1:1 to 1:4).',
      'Modern diets, heavy in seed oils and processed foods, push this ratio to 1:20 or even 1:40. This creates a pro-inflammatory environment in your body.',
      'Omega-3s (from fatty fish, walnuts, flaxseed) are anti-inflammatory and support brain function. Omega-6s (from seed oils, processed foods) tend to promote inflammation when consumed in excess.',
      'Rebalancing this ratio is one of the most powerful changes you can make. Prioritize omega-3 sources and minimize seed oils to shift your body toward healing.',
    ],
    keyPoints: [
      'Ideal ratio is 1:1 to 1:4 (omega-3 to omega-6)',
      'Modern diets are often 1:20 or worse',
      'Omega-3s reduce inflammation',
      'Seed oils are major omega-6 sources',
    ],
  },
  {
    id: '2-3',
    moduleId: '2',
    title: 'The Microbiome Connection',
    duration: '6 min',
    completed: false,
    content: [
      'Your gut hosts trillions of bacteria - your microbiome. These organisms aren\'t just passengers; they actively participate in digestion, immune function, and even neurotransmitter production.',
      'A diverse, healthy microbiome protects your gut lining, produces beneficial compounds, and helps regulate inflammation. An unhealthy microbiome does the opposite.',
      'Processed foods, artificial sweeteners, and antibiotics damage microbiome diversity. Fermented foods, fiber-rich vegetables, and variety support it.',
      'Research increasingly shows that many neurological conditions are associated with specific microbiome imbalances. Healing the microbiome can be a path to neurological improvement.',
    ],
    keyPoints: [
      'Trillions of bacteria in your gut',
      'Microbiome affects immune and brain function',
      'Diversity is key to microbiome health',
      'Fermented foods support healthy bacteria',
    ],
  },
  {
    id: '2-4',
    moduleId: '2',
    title: 'Blood Sugar and Brain Function',
    duration: '6 min',
    completed: false,
    content: [
      'Your brain, while only 2% of body weight, consumes about 20% of your daily glucose. Stable blood sugar is essential for optimal brain function.',
      'Blood sugar spikes and crashes stress your entire system. High sugar damages blood vessels, triggers inflammation, and impairs mitochondrial function.',
      'Insulin resistance - when cells stop responding to insulin properly - is now being called "Type 3 Diabetes" when it affects the brain, and is linked to Alzheimer\'s.',
      'By focusing on foods that stabilize blood sugar - proteins, healthy fats, fiber-rich vegetables - you protect both your brain and your ENS from glucose-related damage.',
    ],
    keyPoints: [
      'Brain uses 20% of daily glucose',
      'Blood sugar spikes cause damage',
      'Insulin resistance affects the brain',
      'Stable blood sugar protects neurons',
    ],
  },
  {
    id: '2-5',
    moduleId: '2',
    title: 'Toxins and Detoxification',
    duration: '6 min',
    completed: false,
    content: [
      'Modern life exposes us to countless toxins: pesticides, heavy metals, plastics, artificial additives. These accumulate in tissues and stress our detoxification systems.',
      'The liver is your primary detox organ, but it can become overwhelmed. When toxins aren\'t properly eliminated, they damage cells, including neurons.',
      'Certain foods support detoxification: cruciferous vegetables contain sulforaphane, which activates detox pathways. Cilantro and chlorella help bind and remove heavy metals.',
      'Reducing toxin exposure while supporting detox pathways helps your nervous system recover from accumulated damage.',
    ],
    keyPoints: [
      'Modern toxin exposure is unprecedented',
      'Liver can become overwhelmed',
      'Cruciferous vegetables support detox',
      'Reducing exposure is as important as detox',
    ],
  },

  // Module 3: Optimization
  {
    id: '3-1',
    moduleId: '3',
    title: 'Building Your Optimal Plate',
    duration: '6 min',
    completed: false,
    content: [
      'An optimal meal for nervous system support follows a simple template: quality protein, healthy fats, and fiber-rich vegetables. This combination stabilizes blood sugar and provides essential nutrients.',
      'Fill half your plate with non-starchy vegetables - leafy greens, cruciferous vegetables, colorful produce. These provide fiber, antioxidants, and support your microbiome.',
      'Include a palm-sized portion of quality protein: wild-caught fish, pasture-raised eggs, grass-fed meat. Protein provides amino acids essential for neurotransmitter production.',
      'Add healthy fats liberally: olive oil, avocado, nuts. These support cell membrane integrity and help absorb fat-soluble vitamins crucial for brain health.',
    ],
    keyPoints: [
      'Half plate: non-starchy vegetables',
      'Palm-sized quality protein',
      'Liberal healthy fats',
      'Minimize processed carbohydrates',
    ],
  },
  {
    id: '3-2',
    moduleId: '3',
    title: 'Superfoods for the Nervous System',
    duration: '6 min',
    completed: false,
    content: [
      'Certain foods stand out for their ability to support nervous system health. These "superfoods" should become staples in your diet.',
      'Fatty fish (salmon, sardines, mackerel): Rich in omega-3 DHA, the primary structural fat in your brain. Aim for 3-4 servings per week.',
      'Cruciferous vegetables (broccoli, cabbage, Brussels sprouts): Contain sulforaphane, which activates detox pathways and has direct neuroprotective effects.',
      'Fermented foods (sauerkraut, kimchi, kefir): Provide probiotics and postbiotics that support gut health and the gut-brain connection.',
      'Eggs from pasture-raised hens: One of the best sources of choline, essential for neurotransmitter production and cell membrane health.',
    ],
    keyPoints: [
      'Fatty fish for omega-3 DHA',
      'Cruciferous vegetables for sulforaphane',
      'Fermented foods for probiotics',
      'Pasture-raised eggs for choline',
    ],
  },
  {
    id: '3-3',
    moduleId: '3',
    title: 'Foods to Avoid',
    duration: '6 min',
    completed: false,
    content: [
      'Equally important as what to eat is what to avoid. Some foods actively damage your nervous system and should be minimized or eliminated.',
      'Seed oils (canola, soybean, corn, sunflower): High in omega-6, easily oxidized, and promote inflammation. Found in almost all processed and restaurant foods.',
      'Refined sugars and artificial sweeteners: Spike blood sugar, damage the microbiome, and create inflammation. Hidden in countless products under various names.',
      'Highly processed foods: Typically combine multiple harmful ingredients and lack the nutrients found in whole foods. If it has a long ingredient list, be cautious.',
      'Personal triggers: For those with autoimmune conditions, common triggers include gluten, dairy, nightshades, and eggs. Individual testing can help identify your triggers.',
    ],
    keyPoints: [
      'Eliminate seed oils',
      'Minimize sugars and sweeteners',
      'Avoid highly processed foods',
      'Identify personal trigger foods',
    ],
  },
  {
    id: '3-4',
    moduleId: '3',
    title: 'Meal Timing and Fasting',
    duration: '6 min',
    completed: false,
    content: [
      'When you eat can be almost as important as what you eat. Your body has natural rhythms that affect digestion, hormone production, and cellular repair.',
      'Time-restricted eating (eating within an 8-12 hour window) gives your gut time to rest and repair. Many people find eating between 10am and 6pm works well.',
      'Fasting periods activate autophagy - your body\'s cellular cleanup process. This is when damaged components, including damaged mitochondria, are cleared away.',
      'Start gradually. If you\'re used to eating from 7am to 10pm, slowly narrow that window. Don\'t force extreme fasting if it causes stress or blood sugar issues.',
    ],
    keyPoints: [
      'Eating window of 8-12 hours',
      'Give gut time to rest and repair',
      'Fasting activates cellular cleanup',
      'Start gradually and listen to your body',
    ],
  },
  {
    id: '3-5',
    moduleId: '3',
    title: 'Supplementation Basics',
    duration: '6 min',
    completed: false,
    content: [
      'While food should be your foundation, certain supplements can fill nutritional gaps and provide therapeutic benefits.',
      'Omega-3s (fish oil or algae-based): Unless you eat fatty fish 4+ times per week, supplementation helps ensure adequate DHA and EPA.',
      'Vitamin D: Most people are deficient, especially in northern latitudes. Essential for immune function and linked to neurological health.',
      'Magnesium: Involved in over 300 enzymatic reactions. Most people are deficient. Supports nervous system function and sleep.',
      'Quality matters enormously with supplements. Third-party tested products from reputable brands are worth the extra cost.',
    ],
    keyPoints: [
      'Supplements complement, not replace, good food',
      'Omega-3s, Vitamin D, Magnesium are common needs',
      'Quality and sourcing matter',
      'Test and adjust based on your needs',
    ],
  },
  {
    id: '3-6',
    moduleId: '3',
    title: 'Stress and Sleep',
    duration: '5 min',
    completed: false,
    content: [
      'No diet can overcome chronic stress and poor sleep. These are foundational to nervous system health and must be addressed alongside nutrition.',
      'Chronic stress keeps your nervous system in "fight or flight" mode, diverting resources from digestion and repair. The gut is particularly sensitive to stress hormones.',
      'Sleep is when your brain clears metabolic waste through the glymphatic system. Poor sleep impairs this process and accelerates neurological decline.',
      'Prioritize 7-9 hours of quality sleep. Develop stress management practices: meditation, breathing exercises, time in nature. These amplify the benefits of good nutrition.',
    ],
    keyPoints: [
      'Stress impairs gut function',
      'Sleep clears brain waste',
      '7-9 hours of quality sleep',
      'Stress management amplifies nutrition benefits',
    ],
  },

  // Module 4: Disease-Specific
  {
    id: '4-1',
    moduleId: '4',
    title: 'Autoimmune Conditions and the Gut',
    duration: '6 min',
    completed: false,
    content: [
      'Autoimmune diseases - where the immune system attacks the body\'s own tissues - are increasingly linked to gut health. The gut is where much of your immune system resides.',
      '"Leaky gut" (intestinal permeability) allows particles to enter the bloodstream that shouldn\'t be there. This can trigger immune responses that may target your own tissues.',
      'Many autoimmune conditions show improvement when gut health is prioritized. This includes MS, rheumatoid arthritis, Hashimoto\'s thyroiditis, and others.',
      'The protocol\'s focus on healing the gut, reducing inflammation, and removing trigger foods directly addresses these autoimmune mechanisms.',
    ],
    keyPoints: [
      'Most immune system is in the gut',
      'Leaky gut triggers autoimmune responses',
      'Gut healing can improve autoimmune conditions',
      'Removing triggers is essential',
    ],
  },
  {
    id: '4-2',
    moduleId: '4',
    title: 'Neurological Conditions',
    duration: '6 min',
    completed: false,
    content: [
      'Conditions like MS, Parkinson\'s, and Alzheimer\'s all show connections to gut health and inflammation. The gut-brain axis is a pathway for both damage and healing.',
      'In MS, research shows distinct differences in the microbiomes of patients versus healthy controls. Some bacteria are associated with inflammation; others with protection.',
      'Parkinson\'s often begins with gut symptoms years before motor symptoms appear. The disease may actually start in the gut and travel to the brain via the vagus nerve.',
      'While the protocol isn\'t a cure, supporting the gut-brain-mitochondria axis creates optimal conditions for your nervous system to function and potentially heal.',
    ],
    keyPoints: [
      'Neurological diseases link to gut health',
      'MS patients show altered microbiomes',
      'Parkinson\'s may begin in the gut',
      'Supporting these systems optimizes healing potential',
    ],
  },
  {
    id: '4-3',
    moduleId: '4',
    title: 'Mood and Cognitive Issues',
    duration: '6 min',
    completed: false,
    content: [
      'Depression, anxiety, and cognitive decline are increasingly understood as having gut components. Remember - 95% of serotonin is made in the gut.',
      'Inflammation from gut issues can directly affect brain function, causing "brain fog," difficulty concentrating, and mood instability.',
      'Many patients report significant improvements in mood and cognition when they address gut health, even when they came to the protocol for physical symptoms.',
      'The foods that support your ENS and mitochondria are the same foods that support your mental and cognitive health. It\'s all connected.',
    ],
    keyPoints: [
      '95% of serotonin made in the gut',
      'Gut inflammation causes brain fog',
      'Mood often improves with gut healing',
      'Physical and mental health are connected',
    ],
  },
  {
    id: '4-4',
    moduleId: '4',
    title: 'Your Personal Protocol',
    duration: '7 min',
    completed: false,
    content: [
      'While the principles are universal, your specific application should be personalized. Factors like your condition, triggers, and current health all matter.',
      'Start with the foundation: eliminate the biggest offenders (seed oils, processed foods, sugar), add the biggest supports (fatty fish, vegetables, fermented foods).',
      'Track how foods affect you. The app helps you identify patterns. Some people react to foods that are generally "healthy" - personalization matters.',
      'Progress isn\'t always linear. You may experience temporary setbacks as your gut adjusts. Trust the process and work with healthcare providers who understand these principles.',
      'Remember: this is a lifestyle, not a temporary diet. Small, consistent improvements compound over time into significant health transformations.',
    ],
    keyPoints: [
      'Personalize based on your needs',
      'Start with the biggest changes first',
      'Track and identify your patterns',
      'This is a lifestyle, not a temporary diet',
    ],
  },
];

// All articles
export const articles: Article[] = [
  {
    id: 'a1',
    title: 'The Gut-Brain Connection',
    category: 'Science',
    readTime: '5 min',
    icon: 'book',
    content: [
      'The gut-brain axis represents one of the most fascinating discoveries in modern medicine. This bidirectional communication system connects your intestinal tract directly to your brain through neural, hormonal, and immune pathways.',
      'The primary conduit is the vagus nerve, the longest cranial nerve in your body. It carries signals in both directions - from gut to brain and brain to gut. This explains why stress can cause stomach upset, and why gut problems often manifest as anxiety or depression.',
      'Your gut produces the majority of your body\'s neurotransmitters. About 95% of serotonin, the "happiness molecule," is synthesized in the intestines. This means gut health directly influences mood and mental well-being.',
      'When the gut is inflamed or the microbiome is imbalanced, pro-inflammatory signals travel up the vagus nerve to the brain. This can manifest as brain fog, mood disorders, or even contribute to neurodegenerative conditions.',
      'The good news: this connection works both ways. By improving gut health through diet, you can positively influence brain function. Many patients report improved mood, clearer thinking, and better energy when they heal their gut.',
    ],
    keyTakeaways: [
      'The vagus nerve is the main gut-brain highway',
      '95% of serotonin is made in the gut',
      'Gut inflammation sends signals to the brain',
      'Healing the gut can improve mental function',
    ],
  },
  {
    id: 'a2',
    title: 'Omega-3s and Brain Health',
    category: 'Nutrition',
    readTime: '7 min',
    icon: 'nutrition',
    content: [
      'Omega-3 fatty acids, particularly DHA (docosahexaenoic acid), are essential structural components of your brain. DHA makes up about 25% of the fat in your brain and is crucial for neuronal membrane fluidity and function.',
      'Your body cannot efficiently produce omega-3s from plant sources alone. While flax and chia contain ALA (alpha-linolenic acid), conversion to DHA is less than 5% in most people. Direct sources of DHA - primarily fatty fish - are far more effective.',
      'The ratio of omega-3 to omega-6 in modern diets has shifted dramatically. Our ancestors consumed roughly equal amounts; today\'s diets often have 20-40 times more omega-6 than omega-3. This imbalance promotes inflammation.',
      'Research consistently links higher omega-3 intake with reduced risk of cognitive decline, depression, and neurological conditions. Some studies show improvement in symptoms of MS, ADHD, and mood disorders with adequate omega-3 intake.',
      'Aim for 3-4 servings of fatty fish per week (salmon, sardines, mackerel, herring). If that\'s not feasible, high-quality fish oil supplementation can help bridge the gap. Look for products tested for purity and oxidation.',
    ],
    keyTakeaways: [
      'DHA is essential for brain structure',
      'Fish is far superior to plant sources for omega-3',
      'Modern diets are severely imbalanced toward omega-6',
      '3-4 servings of fatty fish per week is ideal',
    ],
  },
  {
    id: 'a3',
    title: 'Sulforaphane Benefits',
    category: 'Research',
    readTime: '6 min',
    icon: 'flask',
    content: [
      'Sulforaphane is a compound found in cruciferous vegetables - broccoli, cauliflower, Brussels sprouts, cabbage, and especially broccoli sprouts. It\'s one of the most potent natural activators of the body\'s detoxification pathways.',
      'When you chew or chop cruciferous vegetables, an enzyme called myrosinase converts glucoraphanin into sulforaphane. This is why raw or lightly cooked preparations are more potent than heavily cooked ones.',
      'Sulforaphane activates the Nrf2 pathway, which turns on hundreds of protective genes. This includes genes for detoxification, antioxidant production, and anti-inflammatory processes.',
      'Research has shown neuroprotective effects of sulforaphane in various conditions. Studies suggest benefits in autism, depression, and neurodegenerative diseases. It also supports the blood-brain barrier.',
      'Broccoli sprouts contain 10-100 times more sulforaphane precursor than mature broccoli. Growing your own sprouts is inexpensive and ensures maximum potency. Alternatively, frozen broccoli retains myrosinase when cooked properly.',
    ],
    keyTakeaways: [
      'Found in cruciferous vegetables',
      'Raw or lightly cooked is more potent',
      'Activates hundreds of protective genes',
      'Broccoli sprouts are the most concentrated source',
    ],
  },
  {
    id: 'a4',
    title: 'The Problem with Seed Oils',
    category: 'Science',
    readTime: '6 min',
    icon: 'alert-circle',
    content: [
      'Seed oils - including canola, soybean, corn, sunflower, and safflower oils - are found in virtually all processed foods and most restaurant cooking. They\'re promoted as "heart-healthy" but emerging evidence suggests otherwise.',
      'These oils are extremely high in omega-6 fatty acids, particularly linoleic acid. As these accumulate in your tissues, they shift your body toward a pro-inflammatory state.',
      'Seed oils are also highly susceptible to oxidation, especially when heated. Oxidized fats are directly toxic to cells and have been linked to cardiovascular disease, cancer, and neurological damage.',
      'These oils didn\'t exist in human diets until the 20th century. Their rise parallels increases in chronic disease. While correlation isn\'t causation, the mechanisms of harm are well-documented.',
      'Replacing seed oils with stable traditional fats - olive oil, coconut oil, butter, tallow - removes a significant source of inflammation and oxidative damage from your diet.',
    ],
    keyTakeaways: [
      'Seed oils are extremely high in omega-6',
      'They oxidize easily, especially when heated',
      'They\'re a modern addition to human diets',
      'Traditional fats are healthier alternatives',
    ],
  },
  {
    id: 'a5',
    title: 'Fasting for Brain Health',
    category: 'Research',
    readTime: '5 min',
    icon: 'time',
    content: [
      'Fasting - intentionally going without food for extended periods - triggers profound changes in your body that support brain health and cellular repair.',
      'When you fast, your body shifts from burning glucose to burning fat for fuel. This produces ketones, which are actually a preferred fuel source for the brain and provide more stable energy.',
      'Fasting also activates autophagy - literally "self-eating" - where your cells clean up damaged components. This includes damaged mitochondria and misfolded proteins associated with neurological disease.',
      'Research shows fasting can increase BDNF (brain-derived neurotrophic factor), which supports the growth of new neurons and connections. It\'s like fertilizer for your brain.',
      'You don\'t need extreme fasting to benefit. Time-restricted eating - eating within an 8-12 hour window daily - provides many of the benefits with minimal disruption to daily life.',
    ],
    keyTakeaways: [
      'Fasting shifts the body to burning fat',
      'Ketones are excellent brain fuel',
      'Autophagy cleans up cellular damage',
      'Time-restricted eating (8-12 hours) works well',
    ],
  },
];

// Get lessons by module
export function getLessonsByModule(moduleId: string): Lesson[] {
  return lessons.filter(lesson => lesson.moduleId === moduleId);
}

// Get lesson by ID
export function getLessonById(lessonId: string): Lesson | undefined {
  return lessons.find(lesson => lesson.id === lessonId);
}

// Get article by ID
export function getArticleById(articleId: string): Article | undefined {
  return articles.find(article => article.id === articleId);
}
