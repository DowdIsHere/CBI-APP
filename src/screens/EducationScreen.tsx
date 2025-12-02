import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  LayoutAnimation,
  Platform,
  UIManager,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Lesson {
  id: number;
  title: string;
  duration: string;
  content: string[];
}

interface Module {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessons: Lesson[];
}

interface Article {
  id: number;
  title: string;
  category: string;
  readTime: string;
  icon: string;
  content: string[];
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const MODULES: Module[] = [
  {
    id: 1,
    title: 'Foundation',
    description: 'Core concepts of the Dowd Protocol',
    icon: 'school',
    color: '#3b82f6',
    lessons: [
      {
        id: 1,
        title: 'Meet Your Enteric Nervous System',
        duration: '5 min',
        content: [
          'Your gut contains over 100 million neurons, more than your spinal cord. This network is called the Enteric Nervous System (ENS), often referred to as your "second brain."',
          'The ENS operates independently from your central nervous system and controls digestion, nutrient absorption, and much more. It produces 95% of your body\'s serotonin and 50% of your dopamine.',
          'When we talk about "gut feelings," we\'re actually referring to real neurological signals. Your ENS communicates constantly with your brain through the vagus nerve, influencing mood, cognition, and overall health.',
          'Understanding this connection is the foundation of the Dowd Protocol. By optimizing what we feed our ENS, we can directly impact our mental clarity, energy levels, and long-term health.',
        ],
      },
      {
        id: 2,
        title: 'The CBI Scoring System',
        duration: '5 min',
        content: [
          'CBI stands for Cellular Biology Intelligence - a scoring system that measures how foods affect your body\'s natural intelligence systems.',
          'Foods are scored from -3 to +3:\n\n+3: Highly beneficial (wild salmon, broccoli sprouts, sardines)\n+2: Very beneficial (leafy greens, berries, olive oil)\n+1: Beneficial (whole grains, legumes, nuts)\n0: Neutral (limited impact)\n-1: Mildly harmful (processed foods, refined grains)\n-2: Harmful (fried foods, excess sugar)\n-3: Highly harmful (trans fats, artificial additives)',
          'Your daily goal is to accumulate positive CBI points. Aim for a daily score of +15 or higher for optimal ENS health.',
          'The scoring accounts for how foods interact with your gut microbiome, mitochondrial function, and inflammatory pathways.',
        ],
      },
      {
        id: 3,
        title: 'Why Food Matters for Your Brain',
        duration: '5 min',
        content: [
          'Every bite you eat sends signals to your brain. The gut-brain axis is a bidirectional communication highway that affects everything from mood to memory.',
          'Inflammatory foods disrupt this communication, leading to brain fog, fatigue, and decreased cognitive function. Anti-inflammatory foods enhance it.',
          'Key nutrients for brain health include:\n\n• Omega-3 fatty acids (DHA & EPA)\n• Polyphenols and antioxidants\n• B vitamins and folate\n• Magnesium and zinc',
          'The Dowd Protocol focuses on foods that cross the blood-brain barrier and directly support neurological function.',
        ],
      },
      {
        id: 4,
        title: 'Getting Started with the Protocol',
        duration: '5 min',
        content: [
          'Starting the Dowd Protocol doesn\'t require a complete diet overhaul. Begin with small, sustainable changes.',
          'Week 1 Focus:\n\n• Add one +3 food daily (wild salmon, broccoli, or leafy greens)\n• Remove one -2 or -3 food you currently eat regularly\n• Track your meals using the app',
          'Use the meal logging feature to track everything you eat. The app will calculate your daily CBI score automatically.',
          'Remember: consistency beats perfection. A sustainable +10 daily score is better than sporadic +20 days followed by -10 days.',
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Mechanisms',
    description: 'How food affects cellular health',
    icon: 'cog',
    color: '#8b5cf6',
    lessons: [
      {
        id: 1,
        title: 'Understanding Mitochondria',
        duration: '6 min',
        content: [
          'Mitochondria are the powerhouses of your cells, producing ATP - the energy currency that fuels every biological process.',
          'You have approximately 10 million billion mitochondria in your body. Their health directly determines your energy levels, mental clarity, and aging rate.',
          'Mitochondrial dysfunction is linked to:\n\n• Chronic fatigue\n• Neurodegenerative diseases\n• Autoimmune conditions\n• Accelerated aging',
          'The Dowd Protocol specifically targets mitochondrial health through foods that support electron transport chain function and reduce oxidative stress.',
        ],
      },
      {
        id: 2,
        title: 'The Inflammation Connection',
        duration: '6 min',
        content: [
          'Chronic low-grade inflammation is the root cause of most modern diseases. It silently damages tissues, disrupts hormone balance, and impairs cognitive function.',
          'Pro-inflammatory foods trigger your immune system to release cytokines - signaling molecules that cause systemic inflammation.',
          'Common inflammatory triggers:\n\n• Refined sugars and carbohydrates\n• Industrial seed oils (canola, soybean)\n• Processed meats\n• Artificial additives',
          'Anti-inflammatory foods like fatty fish, turmeric, and green leafy vegetables help restore balance and reduce chronic inflammation.',
        ],
      },
      {
        id: 3,
        title: 'Gut Microbiome Basics',
        duration: '6 min',
        content: [
          'Your gut houses trillions of microorganisms - collectively called the microbiome. These bacteria, fungi, and viruses play crucial roles in digestion, immunity, and even mood.',
          'A healthy microbiome produces short-chain fatty acids (SCFAs) like butyrate, which:\n\n• Strengthen the gut barrier\n• Reduce inflammation\n• Support brain health\n• Regulate metabolism',
          'Fiber-rich foods feed beneficial bacteria, while processed foods feed harmful ones. This is why the Dowd Protocol emphasizes whole, plant-rich foods.',
          'Fermented foods like sauerkraut, kimchi, and kefir introduce beneficial bacteria directly to your gut.',
        ],
      },
      {
        id: 4,
        title: 'Oxidative Stress and Antioxidants',
        duration: '6 min',
        content: [
          'Oxidative stress occurs when free radicals overwhelm your body\'s antioxidant defenses. This damages cells, proteins, and DNA.',
          'Your body produces some antioxidants naturally, but diet is a critical source. Key dietary antioxidants include:\n\n• Vitamin C (citrus, bell peppers)\n• Vitamin E (nuts, seeds)\n• Polyphenols (berries, dark chocolate)\n• Carotenoids (carrots, tomatoes)',
          'The most powerful antioxidant in your body is glutathione. Foods like broccoli, garlic, and sulfur-rich vegetables support glutathione production.',
          'Sulforaphane from broccoli sprouts is particularly powerful - it activates the Nrf2 pathway, your body\'s master antioxidant switch.',
        ],
      },
      {
        id: 5,
        title: 'Nutrient Absorption',
        duration: '6 min',
        content: [
          'It\'s not just what you eat, but what you absorb. A damaged gut lining (leaky gut) impairs nutrient absorption and allows toxins into your bloodstream.',
          'Factors that damage gut lining:\n\n• Gluten (for sensitive individuals)\n• NSAIDs and certain medications\n• Chronic stress\n• Alcohol and processed foods',
          'Healing foods for the gut lining include bone broth (collagen), L-glutamine rich foods, and omega-3 fatty acids.',
          'Proper food combining can also enhance absorption. For example, vitamin C enhances iron absorption, while fat helps absorb fat-soluble vitamins (A, D, E, K).',
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Optimization',
    description: 'Advanced strategies for peak performance',
    icon: 'fitness',
    color: '#10b981',
    lessons: [
      {
        id: 1,
        title: 'Meal Timing and Circadian Rhythm',
        duration: '6 min',
        content: [
          'When you eat is almost as important as what you eat. Your body operates on a 24-hour circadian rhythm that affects digestion, hormone production, and metabolism.',
          'Key timing principles:\n\n• Eat larger meals earlier in the day\n• Finish eating 3+ hours before bed\n• Consider time-restricted eating (12-16 hour fasting window)\n• Expose yourself to morning sunlight to set your circadian clock',
          'Late-night eating disrupts melatonin production and impairs glucose metabolism. This leads to poor sleep quality and increased inflammation.',
          'Aligning your eating patterns with your circadian rhythm can enhance energy, improve sleep, and accelerate healing.',
        ],
      },
      {
        id: 2,
        title: 'Stacking Synergistic Foods',
        duration: '6 min',
        content: [
          'Certain food combinations create synergistic effects that amplify their individual benefits.',
          'Powerful combinations:\n\n• Turmeric + black pepper (piperine increases curcumin absorption by 2000%)\n• Salmon + leafy greens (omega-3s enhance nutrient absorption)\n• Tomatoes + olive oil (fat enhances lycopene absorption)\n• Vitamin C + iron-rich foods (enhances iron absorption)',
          'Avoid combining:\n\n• Calcium-rich foods with iron-rich foods\n• High-fiber foods with medications\n• Caffeine with iron supplements',
          'Planning meals with synergy in mind can dramatically increase the nutritional value of your diet.',
        ],
      },
      {
        id: 3,
        title: 'Stress Eating and the ENS',
        duration: '6 min',
        content: [
          'Stress directly impacts your ENS through the vagus nerve. When stressed, digestion slows, nutrient absorption decreases, and you crave high-calorie foods.',
          'The stress-gut connection explains why:\n\n• Anxiety causes stomach upset\n• Stress leads to comfort food cravings\n• Chronic stress contributes to IBS and digestive disorders',
          'Strategies to manage stress eating:\n\n• Practice deep breathing before meals\n• Eat mindfully without distractions\n• Identify emotional triggers\n• Keep +2 and +3 snacks readily available',
          'Supporting your ENS with high-CBI foods actually helps regulate stress hormones, creating a positive feedback loop.',
        ],
      },
      {
        id: 4,
        title: 'Personalization and Bio-individuality',
        duration: '6 min',
        content: [
          'There is no one-size-fits-all diet. Your genetics, microbiome, health conditions, and lifestyle all influence how you respond to different foods.',
          'Bio-individuality means:\n\n• A food beneficial for one person may be harmful for another\n• Allergies and sensitivities are personal\n• Optimal macronutrient ratios vary by individual\n• Cultural and ethical preferences matter',
          'The app allows you to track sensitivities and allergies, personalizing your recommendations based on your unique profile.',
          'Pay attention to how you feel after eating specific foods. Energy, mood, digestion, and sleep quality are all feedback signals from your body.',
        ],
      },
      {
        id: 5,
        title: 'Building Sustainable Habits',
        duration: '6 min',
        content: [
          'Lasting change comes from sustainable habits, not willpower. The goal is to make healthy eating automatic.',
          'Habit formation strategies:\n\n• Start small (one change at a time)\n• Habit stacking (attach new habits to existing ones)\n• Environment design (keep healthy foods visible)\n• Track progress (use the app daily)',
          'The 21/90 rule: It takes 21 days to create a habit and 90 days to make it a lifestyle change.',
          'Celebrate small wins. Every positive CBI day is progress toward better cellular health.',
        ],
      },
      {
        id: 6,
        title: 'Troubleshooting Plateaus',
        duration: '5 min',
        content: [
          'Progress isn\'t always linear. If you hit a plateau, here\'s how to break through.',
          'Common plateau causes:\n\n• Hidden inflammatory foods\n• Stress and sleep deprivation\n• Micronutrient deficiencies\n• Eating too little or too much',
          'Solutions:\n\n• Review your meal logs for patterns\n• Consider an elimination diet\n• Focus on sleep hygiene\n• Add variety to prevent food monotony',
          'Remember that healing takes time. Your cells are constantly regenerating - give them the right nutrients and be patient.',
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'Disease-Specific',
    description: 'Targeted protocols for health conditions',
    icon: 'medical',
    color: '#ef4444',
    lessons: [
      {
        id: 1,
        title: 'Autoimmune Conditions',
        duration: '7 min',
        content: [
          'Autoimmune diseases occur when the immune system attacks the body\'s own tissues. Gut health plays a central role in autoimmune regulation.',
          'The gut-autoimmune connection:\n\n• 70-80% of immune cells reside in the gut\n• Leaky gut can trigger autoimmune responses\n• Certain foods can calm or excite the immune system',
          'The Autoimmune Protocol (AIP) removes common triggers:\n\n• Grains and legumes\n• Dairy products\n• Nightshades (tomatoes, peppers, potatoes)\n• Eggs and nuts (temporarily)\n• Refined sugars and processed foods',
          'After an elimination phase, foods are gradually reintroduced to identify personal triggers. The app can help track these experiments.',
        ],
      },
      {
        id: 2,
        title: 'Neurological Health',
        duration: '7 min',
        content: [
          'Conditions like MS, Parkinson\'s, and Alzheimer\'s have strong connections to gut health and inflammation.',
          'Neuroprotective strategies:\n\n• High omega-3 intake (fatty fish, algae oil)\n• Antioxidant-rich foods (berries, dark leafy greens)\n• Avoiding excitotoxins (MSG, artificial sweeteners)\n• Supporting myelin with healthy fats',
          'The ketogenic approach may benefit neurological conditions by providing ketones as alternative brain fuel.',
          'Focus on foods that cross the blood-brain barrier: DHA, curcumin (with piperine), resveratrol, and sulforaphane.',
        ],
      },
      {
        id: 3,
        title: 'Metabolic Health',
        duration: '6 min',
        content: [
          'Type 2 diabetes, insulin resistance, and metabolic syndrome are driven largely by diet and lifestyle.',
          'Blood sugar management:\n\n• Prioritize protein and fiber at each meal\n• Choose low-glycemic carbohydrates\n• Include healthy fats to slow glucose absorption\n• Avoid refined sugars and processed carbs',
          'Key foods for metabolic health:\n\n• Cinnamon (improves insulin sensitivity)\n• Apple cider vinegar (reduces post-meal glucose spikes)\n• Chromium-rich foods (broccoli, green beans)\n• Bitter melon and fenugreek',
          'Consistent meal timing and avoiding late-night eating are especially important for metabolic conditions.',
        ],
      },
      {
        id: 4,
        title: 'Digestive Disorders',
        duration: '6 min',
        content: [
          'IBS, IBD, GERD, and other digestive issues often improve dramatically with dietary changes.',
          'For IBS:\n\n• Consider a low-FODMAP elimination diet\n• Identify personal trigger foods\n• Manage stress (gut-brain connection)\n• Include soluble fiber',
          'For inflammatory conditions (IBD):\n\n• Anti-inflammatory omega-3 foods\n• Bone broth for gut healing\n• Avoid processed foods and refined sugars\n• Consider specific carbohydrate diet (SCD)',
          'The app\'s tracking features help you correlate symptoms with specific foods, enabling personalized dietary management.',
        ],
      },
    ],
  },
];

const ARTICLES: Article[] = [
  {
    id: 1,
    title: 'The Gut-Brain Connection',
    category: 'Science',
    readTime: '5 min',
    icon: 'book',
    content: [
      'The gut-brain axis is a bidirectional communication network linking the enteric nervous system with the central nervous system. This connection influences everything from mood and memory to immune function and inflammation.',
      'Research has shown that the gut microbiome produces neurotransmitters identical to those made in the brain. In fact, 95% of serotonin - the "happiness hormone" - is produced in the gut.',
      'This explains why digestive issues often accompany anxiety and depression, and why addressing gut health can improve mental well-being.',
      'The vagus nerve serves as the primary highway for this communication, carrying signals between the brain and gut in both directions.',
      'Practical takeaway: Supporting your gut health through high-CBI foods directly benefits your mental and emotional health.',
    ],
  },
  {
    id: 2,
    title: 'Omega-3s and Brain Health',
    category: 'Nutrition',
    readTime: '7 min',
    icon: 'nutrition',
    content: [
      'Omega-3 fatty acids, particularly DHA (docosahexaenoic acid), are essential building blocks of brain cell membranes. Your brain is about 60% fat, and DHA makes up a significant portion of that.',
      'Studies have linked adequate omega-3 intake to:\n\n• Reduced risk of cognitive decline\n• Lower rates of depression and anxiety\n• Improved focus and attention\n• Better memory function',
      'The best sources of omega-3s are fatty fish like wild salmon, sardines, mackerel, and anchovies. Plant sources like flaxseed and walnuts provide ALA, which converts poorly to DHA.',
      'Most people are deficient in omega-3s due to modern diets high in omega-6 fats from vegetable oils. The optimal omega-6 to omega-3 ratio is 2:1, but typical Western diets are 15:1 or higher.',
      'Aim for 2-3 servings of fatty fish per week, or consider a high-quality fish oil or algae oil supplement if you don\'t eat fish.',
    ],
  },
  {
    id: 3,
    title: 'Sulforaphane Benefits',
    category: 'Research',
    readTime: '6 min',
    icon: 'flask',
    content: [
      'Sulforaphane is a powerful compound found in cruciferous vegetables, with the highest concentrations in broccoli sprouts. It activates Nrf2, your body\'s master antioxidant pathway.',
      'When Nrf2 is activated, your cells produce their own antioxidants at much higher rates than any supplement could provide. This includes glutathione, the "master antioxidant."',
      'Research shows sulforaphane may:\n\n• Protect against cancer\n• Reduce inflammation\n• Support detoxification\n• Improve autism symptoms\n• Protect brain cells',
      'Broccoli sprouts contain 20-100 times more sulforaphane than mature broccoli. Growing your own sprouts is easy and cost-effective.',
      'To maximize sulforaphane from mature broccoli, chop it and let it sit for 40 minutes before cooking. This allows the enzyme myrosinase to convert glucoraphanin to sulforaphane.',
    ],
  },
];

const FAQS: FAQ[] = [
  {
    id: 1,
    question: 'How quickly will I see results?',
    answer:
      'Most people notice improvements in energy and mental clarity within 2-4 weeks of following the Dowd Protocol consistently. More significant changes like improved symptoms and lab markers typically appear after 8-12 weeks. Remember, you\'re rebuilding your cellular health from the inside out - this takes time but the results are lasting.',
  },
  {
    id: 2,
    question: 'What makes the Dowd Protocol different?',
    answer:
      'Unlike conventional diets that focus on calories or macros, the Dowd Protocol targets your Enteric Nervous System (ENS) - your "second brain." By optimizing the gut-brain-mitochondria axis through specific foods, we support cellular intelligence rather than just body composition. This science-based approach addresses root causes rather than just symptoms.',
  },
  {
    id: 3,
    question: 'Can I follow this with dietary restrictions?',
    answer:
      'Absolutely! The Dowd Protocol is highly adaptable. Whether you\'re vegetarian, have food allergies, or follow religious dietary laws, there are always alternative foods that provide similar CBI benefits. The app tracks your restrictions and provides personalized recommendations that work within your constraints.',
  },
  {
    id: 4,
    question: 'What is a CBI Score?',
    answer:
      'CBI (Cellular Biology Intelligence) Score measures how foods affect your body\'s natural intelligence systems. Positive scores (+1 to +3) indicate foods that support your ENS, mitochondria, and gut health. Negative scores (-1 to -3) indicate foods that may cause inflammation or disrupt cellular function. Your daily goal is to accumulate positive points.',
  },
  {
    id: 5,
    question: 'How do I track my progress?',
    answer:
      'The app automatically tracks your meals, calculates daily and weekly CBI scores, and monitors your streak. Over time, you\'ll see trends in your Progress tab showing how your food choices correlate with energy levels, mood, and other health metrics. The more consistent you are, the clearer the patterns become.',
  },
];

export default function EducationScreen() {
  const { learningProgress, completeLesson, completeArticle, setCurrentLesson } = useApp();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<{ module: Module; lesson: Lesson } | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Calculate progress for current module
  const currentProgress = useMemo(() => {
    const currentModule = MODULES.find(m => m.id === learningProgress.currentModuleId);
    if (!currentModule) return { title: 'Week 1: Foundation', lesson: 'Meet Your Enteric Nervous System', progress: 0 };

    const completedInModule = currentModule.lessons.filter(l =>
      learningProgress.completedLessons.includes(`${currentModule.id}-${l.id}`)
    ).length;
    const progress = Math.round((completedInModule / currentModule.lessons.length) * 100);

    const nextLesson = currentModule.lessons.find(
      l => !learningProgress.completedLessons.includes(`${currentModule.id}-${l.id}`)
    );

    return {
      title: `Week ${currentModule.id}: ${currentModule.title}`,
      lesson: nextLesson?.title || 'Module Complete!',
      progress,
    };
  }, [learningProgress]);

  // Calculate module completion status
  const getModuleStatus = (module: Module) => {
    const completedCount = module.lessons.filter(l =>
      learningProgress.completedLessons.includes(`${module.id}-${l.id}`)
    ).length;
    return {
      completed: completedCount === module.lessons.length,
      completedCount,
      totalCount: module.lessons.length,
    };
  };

  const toggleFaq = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const toggleModule = (id: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedModule(expandedModule === id ? null : id);
  };

  const openLesson = (module: Module, lesson: Lesson) => {
    setSelectedLesson({ module, lesson });
  };

  const handleCompleteLesson = () => {
    if (selectedLesson) {
      completeLesson(selectedLesson.module.id, selectedLesson.lesson.id);

      // Find next incomplete lesson
      const currentModuleIndex = MODULES.findIndex(m => m.id === selectedLesson.module.id);
      const currentLessonIndex = selectedLesson.module.lessons.findIndex(l => l.id === selectedLesson.lesson.id);

      // Check if there's a next lesson in current module
      if (currentLessonIndex < selectedLesson.module.lessons.length - 1) {
        const nextLesson = selectedLesson.module.lessons[currentLessonIndex + 1];
        setCurrentLesson(selectedLesson.module.id, nextLesson.id);
      } else if (currentModuleIndex < MODULES.length - 1) {
        // Move to next module
        const nextModule = MODULES[currentModuleIndex + 1];
        setCurrentLesson(nextModule.id, nextModule.lessons[0].id);
      }

      setSelectedLesson(null);
    }
  };

  const openArticle = (article: Article) => {
    setSelectedArticle(article);
  };

  const handleCompleteArticle = () => {
    if (selectedArticle) {
      completeArticle(selectedArticle.id);
      setSelectedArticle(null);
    }
  };

  const handleContinueLearning = () => {
    const currentModule = MODULES.find(m => m.id === learningProgress.currentModuleId);
    if (currentModule) {
      const currentLessonData = currentModule.lessons.find(l => l.id === learningProgress.currentLessonId);
      if (currentLessonData) {
        openLesson(currentModule, currentLessonData);
      } else {
        // If current lesson not found, open first incomplete lesson
        const nextLesson = currentModule.lessons.find(
          l => !learningProgress.completedLessons.includes(`${currentModule.id}-${l.id}`)
        );
        if (nextLesson) {
          openLesson(currentModule, nextLesson);
        }
      }
    }
  };

  const isLessonCompleted = (moduleId: number, lessonId: number) => {
    return learningProgress.completedLessons.includes(`${moduleId}-${lessonId}`);
  };

  const isArticleCompleted = (articleId: number) => {
    return learningProgress.completedArticles.includes(articleId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Current Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressTitle}>{currentProgress.title}</Text>
              <Text style={styles.progressSubtitle}>
                Next: {currentProgress.lesson}
              </Text>
            </View>
            <Text style={styles.progressPercent}>{currentProgress.progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${currentProgress.progress}%` },
              ]}
            />
          </View>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinueLearning}>
            <Text style={styles.continueButtonText}>Continue Learning</Text>
            <Ionicons name="arrow-forward" size={20} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        {/* Learning Modules */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Modules</Text>
          {MODULES.map((module) => {
            const status = getModuleStatus(module);
            const isExpanded = expandedModule === module.id;

            return (
              <View key={module.id}>
                <TouchableOpacity
                  style={styles.moduleCard}
                  onPress={() => toggleModule(module.id)}
                >
                  <View
                    style={[styles.moduleIcon, { backgroundColor: module.color }]}
                  >
                    <Ionicons name={module.icon as any} size={24} color="white" />
                  </View>
                  <View style={styles.moduleInfo}>
                    <Text style={styles.moduleName}>{module.title}</Text>
                    <Text style={styles.moduleDetails}>
                      {status.completedCount}/{status.totalCount} lessons
                    </Text>
                  </View>
                  {status.completed ? (
                    <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                  ) : (
                    <Ionicons
                      name={isExpanded ? 'chevron-up' : 'chevron-down'}
                      size={24}
                      color="#9ca3af"
                    />
                  )}
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.lessonsContainer}>
                    {module.lessons.map((lesson) => {
                      const completed = isLessonCompleted(module.id, lesson.id);
                      return (
                        <TouchableOpacity
                          key={lesson.id}
                          style={styles.lessonItem}
                          onPress={() => openLesson(module, lesson)}
                        >
                          <View style={[
                            styles.lessonIndicator,
                            completed && styles.lessonIndicatorCompleted
                          ]}>
                            {completed ? (
                              <Ionicons name="checkmark" size={14} color="white" />
                            ) : (
                              <Text style={styles.lessonNumber}>{lesson.id}</Text>
                            )}
                          </View>
                          <View style={styles.lessonInfo}>
                            <Text style={[
                              styles.lessonTitle,
                              completed && styles.lessonTitleCompleted
                            ]}>
                              {lesson.title}
                            </Text>
                            <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                          </View>
                          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Quick Reads */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Reads</Text>
          {ARTICLES.map((article) => {
            const completed = isArticleCompleted(article.id);
            return (
              <TouchableOpacity
                key={article.id}
                style={styles.articleCard}
                onPress={() => openArticle(article)}
              >
                <View style={styles.articleIcon}>
                  <Ionicons
                    name={article.icon as any}
                    size={20}
                    color="#3b82f6"
                  />
                </View>
                <View style={styles.articleInfo}>
                  <Text style={styles.articleTitle}>{article.title}</Text>
                  <View style={styles.articleMeta}>
                    <Text style={styles.articleCategory}>
                      {article.category}
                    </Text>
                    <Text style={styles.articleDot}>•</Text>
                    <Text style={styles.articleReadTime}>
                      {article.readTime}
                    </Text>
                  </View>
                </View>
                {completed ? (
                  <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                ) : (
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Key Concepts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Concepts</Text>

          <View style={styles.conceptCard}>
            <Text style={styles.conceptTitle}>What is CBI?</Text>
            <Text style={styles.conceptText}>
              Cellular Biology Intelligence - Understanding how food either
              enhances or impairs your body's natural intelligence systems.
            </Text>
          </View>

          <View style={styles.conceptCard}>
            <Text style={styles.conceptTitle}>Enteric Nervous System</Text>
            <Text style={styles.conceptText}>
              Your "second brain" with over 100 million neurons in your gut,
              producing 95% of your serotonin and 50% of your dopamine.
            </Text>
          </View>

          <View style={styles.conceptCard}>
            <Text style={styles.conceptTitle}>Gut-Brain-Mitochondria Axis</Text>
            <Text style={styles.conceptText}>
              The communication network between your gut, brain, and cellular
              energy producers that determines your health.
            </Text>
          </View>
        </View>

        {/* FAQs with Expansion */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked</Text>

          {FAQS.map((faq) => (
            <TouchableOpacity
              key={faq.id}
              style={styles.faqCard}
              onPress={() => toggleFaq(faq.id)}
              activeOpacity={0.7}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Ionicons
                  name={expandedFaq === faq.id ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#6b7280"
                />
              </View>
              {expandedFaq === faq.id && (
                <View style={styles.faqAnswerContainer}>
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Lesson Modal */}
      <Modal
        visible={selectedLesson !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedLesson(null)}
      >
        {selectedLesson && (
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedLesson(null)}>
                <Ionicons name="close" size={28} color="#1f2937" />
              </TouchableOpacity>
              <View style={styles.modalHeaderInfo}>
                <Text style={styles.modalHeaderSubtitle}>{selectedLesson.module.title}</Text>
                <Text style={styles.modalHeaderTitle}>{selectedLesson.lesson.title}</Text>
              </View>
              <View style={[styles.modalBadge, { backgroundColor: selectedLesson.module.color }]}>
                <Text style={styles.modalBadgeText}>{selectedLesson.lesson.duration}</Text>
              </View>
            </View>

            <ScrollView style={styles.modalContent}>
              {selectedLesson.lesson.content.map((paragraph, index) => (
                <Text key={index} style={styles.modalParagraph}>
                  {paragraph}
                </Text>
              ))}
              <View style={{ height: 100 }} />
            </ScrollView>

            <View style={styles.modalFooter}>
              {isLessonCompleted(selectedLesson.module.id, selectedLesson.lesson.id) ? (
                <View style={styles.completedBanner}>
                  <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                  <Text style={styles.completedBannerText}>Lesson Completed</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={handleCompleteLesson}
                >
                  <Text style={styles.completeButtonText}>Mark as Complete</Text>
                  <Ionicons name="checkmark" size={20} color="white" />
                </TouchableOpacity>
              )}
            </View>
          </SafeAreaView>
        )}
      </Modal>

      {/* Article Modal */}
      <Modal
        visible={selectedArticle !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedArticle(null)}
      >
        {selectedArticle && (
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedArticle(null)}>
                <Ionicons name="close" size={28} color="#1f2937" />
              </TouchableOpacity>
              <View style={styles.modalHeaderInfo}>
                <Text style={styles.modalHeaderSubtitle}>{selectedArticle.category}</Text>
                <Text style={styles.modalHeaderTitle}>{selectedArticle.title}</Text>
              </View>
              <View style={[styles.modalBadge, { backgroundColor: '#3b82f6' }]}>
                <Text style={styles.modalBadgeText}>{selectedArticle.readTime}</Text>
              </View>
            </View>

            <ScrollView style={styles.modalContent}>
              {selectedArticle.content.map((paragraph, index) => (
                <Text key={index} style={styles.modalParagraph}>
                  {paragraph}
                </Text>
              ))}
              <View style={{ height: 100 }} />
            </ScrollView>

            <View style={styles.modalFooter}>
              {isArticleCompleted(selectedArticle.id) ? (
                <View style={styles.completedBanner}>
                  <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                  <Text style={styles.completedBannerText}>Article Read</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.completeButton}
                  onPress={handleCompleteArticle}
                >
                  <Text style={styles.completeButtonText}>Mark as Read</Text>
                  <Ionicons name="checkmark" size={20} color="white" />
                </TouchableOpacity>
              )}
            </View>
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  progressSection: {
    backgroundColor: '#3b82f6',
    padding: 20,
    margin: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  progressPercent: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  continueButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  continueButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
  moduleCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  moduleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleInfo: {
    flex: 1,
  },
  moduleName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  moduleDetails: {
    fontSize: 12,
    color: '#6b7280',
  },
  lessonsContainer: {
    backgroundColor: '#f3f4f6',
    marginTop: -8,
    marginBottom: 12,
    marginHorizontal: 4,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 12,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 8,
  },
  lessonIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lessonIndicatorCompleted: {
    backgroundColor: '#10b981',
  },
  lessonNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  lessonTitleCompleted: {
    color: '#6b7280',
  },
  lessonDuration: {
    fontSize: 12,
    color: '#9ca3af',
  },
  articleCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  articleIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#dbeafe',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  articleInfo: {
    flex: 1,
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  articleCategory: {
    fontSize: 12,
    color: '#6b7280',
  },
  articleDot: {
    fontSize: 12,
    color: '#9ca3af',
  },
  articleReadTime: {
    fontSize: 12,
    color: '#6b7280',
  },
  conceptCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  conceptTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  conceptText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  faqCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    paddingRight: 12,
  },
  faqAnswerContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  faqAnswer: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalHeaderInfo: {
    flex: 1,
    marginLeft: 16,
  },
  modalHeaderSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  modalBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalParagraph: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 16,
  },
  modalFooter: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  completeButton: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  completedBanner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  completedBannerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
  },
});
