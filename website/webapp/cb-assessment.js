// CB Profile Assessment - Vanilla JavaScript Implementation
// Cognition Blocks LLC - Complete 88-Question Assessment

// ============================================================================
// QUESTION DATA (88 Total Questions)
// ============================================================================

// 10 GRADIENT QUESTIONS (Temporal, Spatial, Reference)
const gradientQuestions = [
    // TEMPORAL GRADIENT (3 questions) - Updated to Past/Now/Future
    {
        id: 'temporal_1',
        gradient: 'temporal',
        question: 'When making decisions, I tend to focus on:',
        options: [
            { value: 1, label: 'Past experiences and what has worked before', pole: 'past' },
            { value: 3, label: 'The present moment and current realities', pole: 'now' },
            { value: 5, label: 'Future possibilities and potential outcomes', pole: 'future' }
        ]
    },
    {
        id: 'temporal_2',
        gradient: 'temporal',
        question: 'When reflecting on my life, I find myself:',
        options: [
            { value: 1, label: 'Analyzing lessons from past experiences', pole: 'past' },
            { value: 3, label: 'Focusing on what\'s happening right now', pole: 'now' },
            { value: 5, label: 'Planning and imagining future scenarios', pole: 'future' }
        ]
    },
    {
        id: 'temporal_3',
        gradient: 'temporal',
        question: 'In conversations, I naturally reference:',
        options: [
            { value: 1, label: 'Historical context and previous situations', pole: 'past' },
            { value: 3, label: 'Current events and immediate circumstances', pole: 'now' },
            { value: 5, label: 'Upcoming plans and future implications', pole: 'future' }
        ]
    },

    // SPATIAL GRADIENT (3 questions)
    {
        id: 'spatial_1',
        gradient: 'spatial',
        question: 'When learning something new, I prefer:',
        options: [
            { value: 1, label: 'Concrete examples and hands-on practice', pole: 'concrete' },
            { value: 3, label: 'A mix of theory and practical application', pole: 'balanced' },
            { value: 5, label: 'Abstract concepts and theoretical frameworks', pole: 'abstract' }
        ]
    },
    {
        id: 'spatial_2',
        gradient: 'spatial',
        question: 'I find it easier to understand:',
        options: [
            { value: 1, label: 'Tangible, physical details and specifics', pole: 'concrete' },
            { value: 3, label: 'Both details and broader patterns', pole: 'balanced' },
            { value: 5, label: 'Big-picture ideas and conceptual relationships', pole: 'abstract' }
        ]
    },
    {
        id: 'spatial_3',
        gradient: 'spatial',
        question: 'When solving problems, I tend to:',
        options: [
            { value: 1, label: 'Focus on practical, step-by-step solutions', pole: 'concrete' },
            { value: 3, label: 'Balance practical needs with innovative thinking', pole: 'balanced' },
            { value: 5, label: 'Explore novel approaches and theoretical possibilities', pole: 'abstract' }
        ]
    },

    // REFERENCE GRADIENT (4 questions)
    {
        id: 'reference_1',
        gradient: 'reference',
        question: 'When evaluating a situation, I primarily consider:',
        options: [
            { value: 1, label: 'How it affects me personally', pole: 'self' },
            { value: 3, label: 'Both my needs and others\' perspectives', pole: 'balanced' },
            { value: 5, label: 'How it impacts others and the broader context', pole: 'other' }
        ]
    },
    {
        id: 'reference_2',
        gradient: 'reference',
        question: 'My decision-making process is guided more by:',
        options: [
            { value: 1, label: 'My own values and personal goals', pole: 'self' },
            { value: 3, label: 'A balance of personal and collective interests', pole: 'balanced' },
            { value: 5, label: 'Others\' needs and societal expectations', pole: 'other' }
        ]
    },
    {
        id: 'reference_3',
        gradient: 'reference',
        question: 'I feel most fulfilled when:',
        options: [
            { value: 1, label: 'Achieving my personal aspirations', pole: 'self' },
            { value: 3, label: 'Finding harmony between self and others', pole: 'balanced' },
            { value: 5, label: 'Contributing to others\' wellbeing', pole: 'other' }
        ]
    },
    {
        id: 'reference_4',
        gradient: 'reference',
        question: 'In group settings, I naturally:',
        options: [
            { value: 1, label: 'Maintain my individual perspective', pole: 'self' },
            { value: 3, label: 'Integrate my views with group dynamics', pole: 'balanced' },
            { value: 5, label: 'Attune to the collective mood and needs', pole: 'other' }
        ]
    }
];

// 40 COGNITIVE BLOCK QUESTIONS (5 per block × 8 blocks)
const cognitiveBlockQuestions = [
    // SENSORY REGISTER (5 questions)
    {
        id: 'sensory_1',
        block: 'sensory',
        question: 'I notice subtle changes in my environment (sounds, smells, visual details):',
        options: [
            { value: 1, label: 'Rarely - I miss most sensory details' },
            { value: 2, label: 'Sometimes - only obvious changes' },
            { value: 3, label: 'Often - I pick up on quite a bit' },
            { value: 4, label: 'Usually - I\'m quite perceptive' },
            { value: 5, label: 'Always - I\'m highly attuned to sensory input' }
        ]
    },
    {
        id: 'sensory_2',
        block: 'sensory',
        question: 'I can distinguish between similar sensory experiences (different textures, subtle flavor differences):',
        options: [
            { value: 1, label: 'Very difficult for me' },
            { value: 2, label: 'Somewhat difficult' },
            { value: 3, label: 'Moderately able' },
            { value: 4, label: 'Quite skilled at this' },
            { value: 5, label: 'Extremely precise sensory discrimination' }
        ]
    },
    {
        id: 'sensory_3',
        block: 'sensory',
        question: 'When entering a new space, I quickly notice:',
        options: [
            { value: 1, label: 'Very little - I\'m usually focused elsewhere' },
            { value: 2, label: 'Basic elements only' },
            { value: 3, label: 'Several details about the environment' },
            { value: 4, label: 'Many specific sensory details' },
            { value: 5, label: 'A rich array of sensory information immediately' }
        ]
    },
    {
        id: 'sensory_4',
        block: 'sensory',
        question: 'I can recall sensory details from past experiences (how something looked, sounded, felt):',
        options: [
            { value: 1, label: 'Rarely - my memories are vague' },
            { value: 2, label: 'Sometimes - only strong impressions' },
            { value: 3, label: 'Often - moderately vivid recall' },
            { value: 4, label: 'Usually - quite detailed memories' },
            { value: 5, label: 'Always - I have photographic/sensory memory' }
        ]
    },
    {
        id: 'sensory_5',
        block: 'sensory',
        question: 'Sensory distractions (background noise, visual clutter) affect my focus:',
        options: [
            { value: 5, label: 'Not at all - I filter them out easily' },
            { value: 4, label: 'Minimally - I can mostly ignore them' },
            { value: 3, label: 'Moderately - somewhat distracting' },
            { value: 2, label: 'Significantly - hard to focus' },
            { value: 1, label: 'Extremely - I\'m overwhelmed by sensory input' }
        ]
    },

    // WORKING MEMORY (5 questions)
    {
        id: 'working_1',
        block: 'working',
        question: 'I can hold and manipulate multiple pieces of information in my mind simultaneously:',
        options: [
            { value: 1, label: 'Very difficult - I can barely track one thing' },
            { value: 2, label: 'Somewhat difficult - 2-3 items max' },
            { value: 3, label: 'Moderately able - several items' },
            { value: 4, label: 'Quite capable - many items at once' },
            { value: 5, label: 'Extremely capable - I juggle information effortlessly' }
        ]
    },
    {
        id: 'working_2',
        block: 'working',
        question: 'When following complex instructions, I:',
        options: [
            { value: 1, label: 'Need them repeated and written down' },
            { value: 2, label: 'Can follow 2-3 steps' },
            { value: 3, label: 'Can handle moderate complexity' },
            { value: 4, label: 'Can follow detailed multi-step processes' },
            { value: 5, label: 'Excel at complex, multi-layered instructions' }
        ]
    },
    {
        id: 'working_3',
        block: 'working',
        question: 'During conversations, I can track multiple topics and return to earlier points:',
        options: [
            { value: 1, label: 'Rarely - I lose track easily' },
            { value: 2, label: 'Sometimes - only 1-2 threads' },
            { value: 3, label: 'Often - can manage several topics' },
            { value: 4, label: 'Usually - very good at this' },
            { value: 5, label: 'Always - I never lose conversational threads' }
        ]
    },
    {
        id: 'working_4',
        block: 'working',
        question: 'I can perform mental calculations (arithmetic, estimations) without external aids:',
        options: [
            { value: 1, label: 'Very poorly - I need a calculator' },
            { value: 2, label: 'Basic operations only' },
            { value: 3, label: 'Moderate mental math ability' },
            { value: 4, label: 'Strong mental calculation skills' },
            { value: 5, label: 'Exceptional - complex calculations mentally' }
        ]
    },
    {
        id: 'working_5',
        block: 'working',
        question: 'When interrupted during a task, I can easily resume where I left off:',
        options: [
            { value: 1, label: 'Never - I have to start over' },
            { value: 2, label: 'Rarely - takes significant effort' },
            { value: 3, label: 'Sometimes - with moderate effort' },
            { value: 4, label: 'Usually - minimal disruption' },
            { value: 5, label: 'Always - seamless task resumption' }
        ]
    },

    // SEQUENTIAL PROCESSING (5 questions)
    {
        id: 'sequential_1',
        block: 'sequential',
        question: 'I excel at following step-by-step procedures:',
        options: [
            { value: 1, label: 'Strongly disagree - I struggle with sequences' },
            { value: 2, label: 'Disagree - sequential tasks are hard' },
            { value: 3, label: 'Neutral - depends on the task' },
            { value: 4, label: 'Agree - I\'m good at ordered processes' },
            { value: 5, label: 'Strongly agree - sequential thinking is my strength' }
        ]
    },
    {
        id: 'sequential_2',
        block: 'sequential',
        question: 'I prefer information presented in a logical, ordered manner:',
        options: [
            { value: 1, label: 'Not at all - I prefer non-linear approaches' },
            { value: 2, label: 'Slightly - order helps but isn\'t crucial' },
            { value: 3, label: 'Moderately - I appreciate some structure' },
            { value: 4, label: 'Strongly - order greatly helps understanding' },
            { value: 5, label: 'Absolutely - logical sequence is essential for me' }
        ]
    },
    {
        id: 'sequential_3',
        block: 'sequential',
        question: 'When learning a new skill, I need to master each step before moving forward:',
        options: [
            { value: 1, label: 'Never - I learn holistically' },
            { value: 2, label: 'Rarely - I can jump around' },
            { value: 3, label: 'Sometimes - depends on complexity' },
            { value: 4, label: 'Usually - sequential mastery helps' },
            { value: 5, label: 'Always - I must master steps in order' }
        ]
    },
    {
        id: 'sequential_4',
        block: 'sequential',
        question: 'I can easily identify what comes next in a sequence or pattern:',
        options: [
            { value: 1, label: 'Very difficult for me' },
            { value: 2, label: 'Somewhat difficult' },
            { value: 3, label: 'Moderately able' },
            { value: 4, label: 'Quite skilled' },
            { value: 5, label: 'Exceptionally skilled - I see sequences immediately' }
        ]
    },
    {
        id: 'sequential_5',
        block: 'sequential',
        question: 'Organizing tasks in chronological order feels:',
        options: [
            { value: 1, label: 'Unnatural and constraining' },
            { value: 2, label: 'Somewhat forced' },
            { value: 3, label: 'Neutral - neither easy nor hard' },
            { value: 4, label: 'Natural and helpful' },
            { value: 5, label: 'Completely intuitive - it\'s how I think' }
        ]
    },

    // SPATIAL RELATIONSHIPS (5 questions)
    {
        id: 'spatial_1',
        block: 'spatial',
        question: 'I can easily visualize 3D objects and mentally rotate them:',
        options: [
            { value: 1, label: 'Not at all - spatial visualization is very hard' },
            { value: 2, label: 'With difficulty - basic shapes only' },
            { value: 3, label: 'Moderately - simple rotations' },
            { value: 4, label: 'Well - most objects and rotations' },
            { value: 5, label: 'Exceptionally - complex 3D manipulation is easy' }
        ]
    },
    {
        id: 'spatial_2',
        block: 'spatial',
        question: 'I have a strong sense of direction and rarely get lost:',
        options: [
            { value: 1, label: 'Strongly disagree - I get lost constantly' },
            { value: 2, label: 'Disagree - poor sense of direction' },
            { value: 3, label: 'Neutral - average navigation skills' },
            { value: 4, label: 'Agree - good spatial orientation' },
            { value: 5, label: 'Strongly agree - internal compass is excellent' }
        ]
    },
    {
        id: 'spatial_3',
        block: 'spatial',
        question: 'I can accurately estimate distances, sizes, and proportions:',
        options: [
            { value: 1, label: 'Very poorly' },
            { value: 2, label: 'Below average' },
            { value: 3, label: 'Average ability' },
            { value: 4, label: 'Above average' },
            { value: 5, label: 'Exceptionally precise spatial estimation' }
        ]
    },
    {
        id: 'spatial_4',
        block: 'spatial',
        question: 'When assembling furniture or following diagrams, I:',
        options: [
            { value: 1, label: 'Struggle significantly - can\'t interpret spatial instructions' },
            { value: 2, label: 'Find it challenging - need help' },
            { value: 3, label: 'Can do it with moderate effort' },
            { value: 4, label: 'Find it easy - good at spatial tasks' },
            { value: 5, label: 'Excel at it - spatial reasoning is a strength' }
        ]
    },
    {
        id: 'spatial_5',
        block: 'spatial',
        question: 'I can visualize how pieces fit together to form a whole:',
        options: [
            { value: 1, label: 'Not at all - very difficult' },
            { value: 2, label: 'With great difficulty' },
            { value: 3, label: 'With moderate ability' },
            { value: 4, label: 'Quite well' },
            { value: 5, label: 'Perfectly - I see spatial relationships instantly' }
        ]
    },

    // PATTERN RECOGNITION (5 questions)
    {
        id: 'pattern_1',
        block: 'pattern',
        question: 'I quickly notice patterns in data, behavior, or events:',
        options: [
            { value: 1, label: 'Rarely - patterns aren\'t obvious to me' },
            { value: 2, label: 'Sometimes - only obvious patterns' },
            { value: 3, label: 'Often - I see common patterns' },
            { value: 4, label: 'Usually - pattern recognition is strong' },
            { value: 5, label: 'Always - I see patterns everywhere instantly' }
        ]
    },
    {
        id: 'pattern_2',
        block: 'pattern',
        question: 'I can predict outcomes based on identifying recurring patterns:',
        options: [
            { value: 1, label: 'Very poorly - I don\'t connect patterns to outcomes' },
            { value: 2, label: 'Below average prediction ability' },
            { value: 3, label: 'Moderate prediction skills' },
            { value: 4, label: 'Strong pattern-based forecasting' },
            { value: 5, label: 'Exceptional - my pattern predictions are highly accurate' }
        ]
    },
    {
        id: 'pattern_3',
        block: 'pattern',
        question: 'I notice when something breaks an established pattern or seems anomalous:',
        options: [
            { value: 1, label: 'Never - anomalies go unnoticed' },
            { value: 2, label: 'Rarely - only major disruptions' },
            { value: 3, label: 'Sometimes - obvious breaks in pattern' },
            { value: 4, label: 'Usually - I\'m alert to anomalies' },
            { value: 5, label: 'Always - I immediately detect pattern violations' }
        ]
    },
    {
        id: 'pattern_4',
        block: 'pattern',
        question: 'I can identify underlying themes or patterns across different contexts:',
        options: [
            { value: 1, label: 'Very difficult - I see things in isolation' },
            { value: 2, label: 'Somewhat difficult' },
            { value: 3, label: 'Moderately able' },
            { value: 4, label: 'Quite skilled at cross-context pattern matching' },
            { value: 5, label: 'Exceptionally skilled - I see meta-patterns effortlessly' }
        ]
    },
    {
        id: 'pattern_5',
        block: 'pattern',
        question: 'Abstract patterns (mathematical, musical, linguistic) come naturally to me:',
        options: [
            { value: 1, label: 'Not at all - abstract patterns confuse me' },
            { value: 2, label: 'With difficulty' },
            { value: 3, label: 'With moderate ease' },
            { value: 4, label: 'Quite naturally' },
            { value: 5, label: 'Completely intuitive - abstract patterns are my forte' }
        ]
    },

    // QUANTITATIVE REASONING (5 questions)
    {
        id: 'quantitative_1',
        block: 'quantitative',
        question: 'I enjoy working with numbers and mathematical concepts:',
        options: [
            { value: 1, label: 'Strongly disagree - I avoid math' },
            { value: 2, label: 'Disagree - math isn\'t appealing' },
            { value: 3, label: 'Neutral - math is just a tool' },
            { value: 4, label: 'Agree - I like quantitative thinking' },
            { value: 5, label: 'Strongly agree - I love mathematical reasoning' }
        ]
    },
    {
        id: 'quantitative_2',
        block: 'quantitative',
        question: 'I can quickly analyze numerical data and draw logical conclusions:',
        options: [
            { value: 1, label: 'Very poorly - numbers don\'t speak to me' },
            { value: 2, label: 'Below average - I struggle with data' },
            { value: 3, label: 'Average analytical ability' },
            { value: 4, label: 'Above average - good with data analysis' },
            { value: 5, label: 'Exceptional - numerical insights come easily' }
        ]
    },
    {
        id: 'quantitative_3',
        block: 'quantitative',
        question: 'I prefer decisions backed by data and quantitative evidence:',
        options: [
            { value: 1, label: 'Not at all - I rely on intuition' },
            { value: 2, label: 'Slightly - data is secondary' },
            { value: 3, label: 'Moderately - I use both data and intuition' },
            { value: 4, label: 'Strongly - data is very important' },
            { value: 5, label: 'Absolutely - data-driven decisions are essential' }
        ]
    },
    {
        id: 'quantitative_4',
        block: 'quantitative',
        question: 'I can identify trends and relationships in numerical information:',
        options: [
            { value: 1, label: 'Very difficult for me' },
            { value: 2, label: 'Somewhat difficult' },
            { value: 3, label: 'Moderately able' },
            { value: 4, label: 'Quite skilled' },
            { value: 5, label: 'Exceptionally skilled - I see numerical patterns instantly' }
        ]
    },
    {
        id: 'quantitative_5',
        block: 'quantitative',
        question: 'Logical, systematic problem-solving feels:',
        options: [
            { value: 1, label: 'Unnatural and frustrating' },
            { value: 2, label: 'Somewhat forced' },
            { value: 3, label: 'Neutral - depends on the problem' },
            { value: 4, label: 'Natural and comfortable' },
            { value: 5, label: 'Completely intuitive - it\'s how I approach everything' }
        ]
    },

    // EMPATHETIC INTELLIGENCE (5 questions)
    {
        id: 'empathetic_1',
        block: 'empathetic',
        question: 'I can accurately read others\' emotions from facial expressions and body language:',
        options: [
            { value: 1, label: 'Rarely - I often misread people' },
            { value: 2, label: 'Sometimes - only obvious emotions' },
            { value: 3, label: 'Often - moderately perceptive' },
            { value: 4, label: 'Usually - quite emotionally perceptive' },
            { value: 5, label: 'Always - I read emotional states accurately and instantly' }
        ]
    },
    {
        id: 'empathetic_2',
        block: 'empathetic',
        question: 'I naturally sense the emotional atmosphere when entering a room:',
        options: [
            { value: 1, label: 'Not at all - I\'m oblivious to group dynamics' },
            { value: 2, label: 'Slightly - only strong emotional climates' },
            { value: 3, label: 'Moderately - I pick up on some vibes' },
            { value: 4, label: 'Strongly - very attuned to emotional energy' },
            { value: 5, label: 'Extremely - I immediately feel collective emotional states' }
        ]
    },
    {
        id: 'empathetic_3',
        block: 'empathetic',
        question: 'Others often come to me to talk about their feelings and problems:',
        options: [
            { value: 1, label: 'Never - I\'m not sought out for emotional support' },
            { value: 2, label: 'Rarely' },
            { value: 3, label: 'Sometimes' },
            { value: 4, label: 'Often - people trust me with emotions' },
            { value: 5, label: 'Always - I\'m the go-to person for emotional matters' }
        ]
    },
    {
        id: 'empathetic_4',
        block: 'empathetic',
        question: 'I can put myself in others\' shoes and understand their perspective:',
        options: [
            { value: 1, label: 'Very difficult - I struggle with perspective-taking' },
            { value: 2, label: 'Somewhat difficult' },
            { value: 3, label: 'Moderately able' },
            { value: 4, label: 'Quite skilled at empathetic understanding' },
            { value: 5, label: 'Exceptionally skilled - I deeply understand others\' experiences' }
        ]
    },
    {
        id: 'empathetic_5',
        block: 'empathetic',
        question: 'When someone is upset, I instinctively know how to comfort them:',
        options: [
            { value: 1, label: 'Never - I don\'t know what to say or do' },
            { value: 2, label: 'Rarely - I\'m awkward with emotions' },
            { value: 3, label: 'Sometimes - depends on the person' },
            { value: 4, label: 'Usually - I\'m good at emotional support' },
            { value: 5, label: 'Always - providing comfort is natural for me' }
        ]
    },

    // GENERATIVE CREATION (5 questions)
    {
        id: 'generative_1',
        block: 'generative',
        question: 'I regularly come up with novel ideas and creative solutions:',
        options: [
            { value: 1, label: 'Rarely - creativity isn\'t my strength' },
            { value: 2, label: 'Sometimes - occasional creative moments' },
            { value: 3, label: 'Often - moderately creative' },
            { value: 4, label: 'Usually - creativity comes naturally' },
            { value: 5, label: 'Always - I\'m constantly generating new ideas' }
        ]
    },
    {
        id: 'generative_2',
        block: 'generative',
        question: 'I enjoy brainstorming and exploring unconventional approaches:',
        options: [
            { value: 1, label: 'Not at all - I prefer proven methods' },
            { value: 2, label: 'Slightly - innovation makes me uncomfortable' },
            { value: 3, label: 'Moderately - some creative exploration is good' },
            { value: 4, label: 'Strongly - I love creative thinking' },
            { value: 5, label: 'Absolutely - unconventional thinking is my passion' }
        ]
    },
    {
        id: 'generative_3',
        block: 'generative',
        question: 'I can synthesize disparate ideas into something entirely new:',
        options: [
            { value: 1, label: 'Very difficult - I work with existing concepts' },
            { value: 2, label: 'Somewhat difficult' },
            { value: 3, label: 'Moderately able' },
            { value: 4, label: 'Quite skilled at creative synthesis' },
            { value: 5, label: 'Exceptionally skilled - I\'m an innovative thinker' }
        ]
    },
    {
        id: 'generative_4',
        block: 'generative',
        question: 'When faced with a problem, I naturally think of multiple creative solutions:',
        options: [
            { value: 1, label: 'Never - I can barely think of one approach' },
            { value: 2, label: 'Rarely - I stick to conventional solutions' },
            { value: 3, label: 'Sometimes - a few alternatives come to mind' },
            { value: 4, label: 'Usually - multiple options emerge naturally' },
            { value: 5, label: 'Always - my mind generates abundant creative possibilities' }
        ]
    },
    {
        id: 'generative_5',
        block: 'generative',
        question: 'I find it easy to imagine "what if" scenarios and alternative realities:',
        options: [
            { value: 1, label: 'Very difficult - I\'m grounded in reality' },
            { value: 2, label: 'Somewhat difficult' },
            { value: 3, label: 'Moderately easy' },
            { value: 4, label: 'Quite easy - imagination comes naturally' },
            { value: 5, label: 'Extremely easy - I live in creative possibility' }
        ]
    }
];

// 38 FUEL STATE QUESTIONS (Diet + Symptoms)
const fuelStateQuestions = [
    // DIET QUESTIONS (12 questions)
    {
        id: 'diet_1',
        category: 'diet',
        question: 'I consume processed foods (packaged snacks, fast food, frozen meals):',
        options: [
            { value: 0, label: 'Never or almost never' },
            { value: 1, label: 'Rarely (1-2 times/week)' },
            { value: 2, label: 'Sometimes (3-4 times/week)' },
            { value: 3, label: 'Often (5-6 times/week)' },
            { value: 4, label: 'Daily or almost daily' }
        ]
    },
    {
        id: 'diet_2',
        category: 'diet',
        question: 'I consume refined sugars (candy, soda, desserts, sweetened beverages):',
        options: [
            { value: 0, label: 'Never or almost never' },
            { value: 1, label: 'Rarely (1-2 times/week)' },
            { value: 2, label: 'Sometimes (3-4 times/week)' },
            { value: 3, label: 'Often (5-6 times/week)' },
            { value: 4, label: 'Daily or almost daily' }
        ]
    },
    {
        id: 'diet_3',
        category: 'diet',
        question: 'I consume refined grains (white bread, white rice, regular pasta):',
        options: [
            { value: 0, label: 'Never or almost never' },
            { value: 1, label: 'Rarely (1-2 times/week)' },
            { value: 2, label: 'Sometimes (3-4 times/week)' },
            { value: 3, label: 'Often (5-6 times/week)' },
            { value: 4, label: 'Daily or almost daily' }
        ]
    },
    {
        id: 'diet_4',
        category: 'diet',
        question: 'I consume industrial seed oils (vegetable oil, canola oil, soybean oil, corn oil):',
        options: [
            { value: 0, label: 'Never or almost never' },
            { value: 1, label: 'Rarely (1-2 times/week)' },
            { value: 2, label: 'Sometimes (3-4 times/week)' },
            { value: 3, label: 'Often (5-6 times/week)' },
            { value: 4, label: 'Daily or almost daily' }
        ]
    },
    {
        id: 'diet_5',
        category: 'diet',
        question: 'I consume fried foods:',
        options: [
            { value: 0, label: 'Never or almost never' },
            { value: 1, label: 'Rarely (1-2 times/week)' },
            { value: 2, label: 'Sometimes (3-4 times/week)' },
            { value: 3, label: 'Often (5-6 times/week)' },
            { value: 4, label: 'Daily or almost daily' }
        ]
    },
    {
        id: 'diet_6',
        category: 'diet',
        question: 'I consume artificial sweeteners (aspartame, sucralose, saccharin):',
        options: [
            { value: 0, label: 'Never or almost never' },
            { value: 1, label: 'Rarely (1-2 times/week)' },
            { value: 2, label: 'Sometimes (3-4 times/week)' },
            { value: 3, label: 'Often (5-6 times/week)' },
            { value: 4, label: 'Daily or almost daily' }
        ]
    },
    {
        id: 'diet_7',
        category: 'diet',
        question: 'I consume alcohol:',
        options: [
            { value: 0, label: 'Never or almost never' },
            { value: 1, label: 'Rarely (1-2 times/week)' },
            { value: 2, label: 'Sometimes (3-4 times/week)' },
            { value: 3, label: 'Often (5-6 times/week)' },
            { value: 4, label: 'Daily or almost daily' }
        ]
    },
    {
        id: 'diet_8',
        category: 'diet',
        question: 'I consume conventionally-raised meat (non-organic, factory-farmed):',
        options: [
            { value: 0, label: 'Never or almost never' },
            { value: 1, label: 'Rarely (1-2 times/week)' },
            { value: 2, label: 'Sometimes (3-4 times/week)' },
            { value: 3, label: 'Often (5-6 times/week)' },
            { value: 4, label: 'Daily or almost daily' }
        ]
    },
    {
        id: 'diet_9',
        category: 'diet',
        question: 'I consume conventional dairy products (non-organic milk, cheese, yogurt):',
        options: [
            { value: 0, label: 'Never or almost never' },
            { value: 1, label: 'Rarely (1-2 times/week)' },
            { value: 2, label: 'Sometimes (3-4 times/week)' },
            { value: 3, label: 'Often (5-6 times/week)' },
            { value: 4, label: 'Daily or almost daily' }
        ]
    },
    {
        id: 'diet_10',
        category: 'diet',
        question: 'I consume foods with artificial additives (colors, flavors, preservatives):',
        options: [
            { value: 0, label: 'Never or almost never' },
            { value: 1, label: 'Rarely (1-2 times/week)' },
            { value: 2, label: 'Sometimes (3-4 times/week)' },
            { value: 3, label: 'Often (5-6 times/week)' },
            { value: 4, label: 'Daily or almost daily' }
        ]
    },
    {
        id: 'diet_11',
        category: 'diet',
        question: 'I consume high-fructose corn syrup (in sodas, condiments, packaged foods):',
        options: [
            { value: 0, label: 'Never or almost never' },
            { value: 1, label: 'Rarely (1-2 times/week)' },
            { value: 2, label: 'Sometimes (3-4 times/week)' },
            { value: 3, label: 'Often (5-6 times/week)' },
            { value: 4, label: 'Daily or almost daily' }
        ]
    },
    {
        id: 'diet_12',
        category: 'diet',
        question: 'I eat late at night (within 2 hours of bedtime):',
        options: [
            { value: 0, label: 'Never or almost never' },
            { value: 1, label: 'Rarely (1-2 times/week)' },
            { value: 2, label: 'Sometimes (3-4 times/week)' },
            { value: 3, label: 'Often (5-6 times/week)' },
            { value: 4, label: 'Daily or almost daily' }
        ]
    },

    // SYMPTOM QUESTIONS (26 questions)
    {
        id: 'symptom_1',
        category: 'symptom',
        question: 'I experience brain fog or difficulty concentrating:',
        options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' },
            { value: 4, label: 'Very often or constantly' }
        ]
    },
    {
        id: 'symptom_2',
        category: 'symptom',
        question: 'I feel fatigued even after adequate sleep:',
        options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' },
            { value: 4, label: 'Very often or constantly' }
        ]
    },
    {
        id: 'symptom_3',
        category: 'symptom',
        question: 'I experience afternoon energy crashes:',
        options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' },
            { value: 4, label: 'Very often or constantly' }
        ]
    },
    {
        id: 'symptom_4',
        category: 'symptom',
        question: 'I have difficulty falling or staying asleep:',
        options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' },
            { value: 4, label: 'Very often or constantly' }
        ]
    },
    {
        id: 'symptom_5',
        category: 'symptom',
        question: 'I experience mood swings or irritability:',
        options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' },
            { value: 4, label: 'Very often or constantly' }
        ]
    },
    {
        id: 'symptom_6',
        category: 'symptom',
        question: 'I feel anxious or restless:',
        options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' },
            { value: 4, label: 'Very often or constantly' }
        ]
    },
    {
        id: 'symptom_7',
        category: 'symptom',
        question: 'I experience digestive issues (bloating, gas, discomfort):',
        options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' },
            { value: 4, label: 'Very often or constantly' }
        ]
    },
    {
        id: 'symptom_8',
        category: 'symptom',
        question: 'I have food cravings (especially for sugar or carbs):',
        options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' },
            { value: 4, label: 'Very often or constantly' }
        ]
    },
    {
        id: 'symptom_9',
        category: 'symptom',
        question: 'I feel mentally sluggish or slow:',
        options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' },
            { value: 4, label: 'Very often or constantly' }
        ]
    },
    {
        id: 'symptom_10',
        category: 'symptom',
        question: 'I have difficulty with memory or recall:',
        options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' },
            { value: 4, label: 'Very often or constantly' }
        ]
    },
    {
        id: 'symptom_11',
        category: 'symptom',
        question: 'I experience headaches:',
        options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' },
            { value: 4, label: 'Very often or constantly' }
        ]
    },
    {
        id: 'symptom_12',
        category: 'symptom',
        question: 'I feel depressed or have low mood:',
        options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' },
            { value: 4, label: 'Very often or constantly' }
        ]
    },
    {
        id: 'symptom_13',
        category: 'symptom',
        question: 'I have joint pain or muscle aches:',
        options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' },
            { value: 4, label: 'Very often or constantly' }
        ]
    },
    {
        id: 'symptom_14',
        category: 'symptom',
        question: 'I experience inflammation (skin issues, puffiness):',
        options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' },
            { value: 4, label: 'Very often or constantly' }
        ]
    },
    {
        id: 'symptom_15',
        category: 'symptom',
        question: 'I have difficulty losing weight despite efforts:',
        options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' },
            { value: 4, label: 'Very often or constantly' }
        ]
    },
    {
        id: 'symptom_16',
        category: 'symptom',
        question: 'I feel cold often or have cold extremities:',
        options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' },
            { value: 4, label: 'Very often or constantly' }
        ]
    },
    {
        id: 'symptom_17',
        category: 'symptom',
        question: 'I have skin problems (acne, eczema, rashes):',
        options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' },
            { value: 4, label: 'Very often or constantly' }
        ]
    },
    {
        id: 'symptom_18',
        category: 'symptom',
        question: 'I have allergies or sensitivities:',
        options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' },
            { value: 4, label: 'Very often or constantly' }
        ]
    },
    {
        id: 'symptom_19',
        category: 'symptom',
        question: 'I get sick frequently (colds, infections):',
        options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' },
            { value: 4, label: 'Very often or constantly' }
        ]
    },
    {
        id: 'symptom_20',
        category: 'symptom',
        question: 'I experience dizziness or lightheadedness:',
        options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' },
            { value: 4, label: 'Very often or constantly' }
        ]
    },
    {
        id: 'symptom_21',
        category: 'symptom',
        question: 'I have low libido or sexual dysfunction:',
        options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' },
            { value: 4, label: 'Very often or constantly' }
        ]
    },
    {
        id: 'symptom_22',
        category: 'symptom',
        question: 'I feel "wired but tired":',
        options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' },
            { value: 4, label: 'Very often or constantly' }
        ]
    },
    {
        id: 'symptom_23',
        category: 'symptom',
        question: 'I have difficulty recovering from exercise:',
        options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' },
            { value: 4, label: 'Very often or constantly' }
        ]
    },
    {
        id: 'symptom_24',
        category: 'symptom',
        question: 'I experience heart palpitations or irregular heartbeat:',
        options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' },
            { value: 4, label: 'Very often or constantly' }
        ]
    },
    {
        id: 'symptom_25',
        category: 'symptom',
        question: 'I have dry eyes or vision problems:',
        options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' },
            { value: 4, label: 'Very often or constantly' }
        ]
    },
    {
        id: 'symptom_26',
        category: 'symptom',
        question: 'I need caffeine to function normally:',
        options: [
            { value: 0, label: 'Never' },
            { value: 1, label: 'Rarely' },
            { value: 2, label: 'Sometimes' },
            { value: 3, label: 'Often' },
            { value: 4, label: 'Very often or constantly' }
        ]
    }
];

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

let assessmentState = {
    currentSection: 0, // 0=gradients, 1=blocks, 2=fuel
    currentQuestion: 0,
    allQuestions: [],
    answers: {},
    startTime: null,
    results: null
};

const sections = [
    { name: 'Layer 1: Gradients', questions: gradientQuestions, total: 10 },
    { name: 'Layer 2: Cognitive Blocks', questions: cognitiveBlockQuestions, total: 40 },
    { name: 'Layer 3: Fuel State', questions: fuelStateQuestions, total: 38 }
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function saveToLocalStorage() {
    localStorage.setItem('cbAssessmentState', JSON.stringify(assessmentState));
}

function loadFromLocalStorage() {
    const saved = localStorage.getItem('cbAssessmentState');
    if (saved) {
        assessmentState = JSON.parse(saved);
        return true;
    }
    return false;
}

// ============================================================================
// ASSESSMENT FLOW
// ============================================================================

function startAssessment() {
    // Shuffle questions within each section for randomization
    const shuffledGradients = shuffleArray(gradientQuestions);
    const shuffledBlocks = shuffleArray(cognitiveBlockQuestions);
    const shuffledFuel = shuffleArray(fuelStateQuestions);

    assessmentState = {
        currentSection: 0,
        currentQuestion: 0,
        allQuestions: [...shuffledGradients, ...shuffledBlocks, ...shuffledFuel],
        answers: {},
        startTime: Date.now(),
        results: null
    };

    saveToLocalStorage();

    // Hide intro, show question screen
    document.getElementById('introScreen').classList.add('hidden');
    document.getElementById('questionScreen').classList.remove('hidden');

    displayCurrentQuestion();
}

function displayCurrentQuestion() {
    const totalQuestions = assessmentState.allQuestions.length;
    const currentIndex = getCurrentGlobalIndex();
    const question = assessmentState.allQuestions[currentIndex];

    if (!question) {
        // Assessment complete
        calculateResults();
        showResults();
        return;
    }

    // Update section title
    let sectionTitle = '';
    let sectionQuestionNumber = 0;
    let sectionTotal = 0;

    if (currentIndex < 10) {
        sectionTitle = 'Layer 1: Gradients';
        sectionQuestionNumber = currentIndex + 1;
        sectionTotal = 10;
    } else if (currentIndex < 50) {
        sectionTitle = 'Layer 2: Cognitive Blocks';
        sectionQuestionNumber = currentIndex - 9;
        sectionTotal = 40;
    } else {
        sectionTitle = 'Layer 3: Fuel State';
        sectionQuestionNumber = currentIndex - 49;
        sectionTotal = 38;
    }

    document.getElementById('sectionTitle').textContent = sectionTitle;
    document.getElementById('questionCounter').textContent = `Question ${sectionQuestionNumber} of ${sectionTotal}`;

    // Update progress bar
    const progress = (currentIndex / totalQuestions) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;

    // Display question
    document.getElementById('questionText').textContent = question.question;

    // Display options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option.label;
        button.onclick = () => selectOption(index);

        // Check if this option was previously selected
        if (assessmentState.answers[question.id] === option.value) {
            button.classList.add('selected');
        }

        optionsContainer.appendChild(button);
    });

    // Update navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = !assessmentState.answers[question.id];
}

function getCurrentGlobalIndex() {
    let index = 0;
    for (let i = 0; i < assessmentState.currentSection; i++) {
        index += sections[i].total;
    }
    index += assessmentState.currentQuestion;
    return index;
}

function selectOption(optionIndex) {
    const currentIndex = getCurrentGlobalIndex();
    const question = assessmentState.allQuestions[currentIndex];
    const selectedValue = question.options[optionIndex].value;

    // Save answer
    assessmentState.answers[question.id] = selectedValue;
    saveToLocalStorage();

    // Update UI
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach((btn, idx) => {
        if (idx === optionIndex) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });

    // Enable next button
    document.getElementById('nextBtn').disabled = false;
}

function nextQuestion() {
    const totalInSection = sections[assessmentState.currentSection].total;

    if (assessmentState.currentQuestion < totalInSection - 1) {
        assessmentState.currentQuestion++;
    } else if (assessmentState.currentSection < sections.length - 1) {
        assessmentState.currentSection++;
        assessmentState.currentQuestion = 0;
    } else {
        // Assessment complete
        calculateResults();
        showResults();
        return;
    }

    saveToLocalStorage();
    displayCurrentQuestion();
}

function prevQuestion() {
    if (assessmentState.currentQuestion > 0) {
        assessmentState.currentQuestion--;
    } else if (assessmentState.currentSection > 0) {
        assessmentState.currentSection--;
        assessmentState.currentQuestion = sections[assessmentState.currentSection].total - 1;
    }

    saveToLocalStorage();
    displayCurrentQuestion();
}

// ============================================================================
// RESULTS CALCULATION
// ============================================================================

function calculateResults() {
    const results = {
        gradients: calculateGradients(),
        blocks: calculateCognitiveBlocks(),
        atp: calculateATPScore()
    };

    assessmentState.results = results;
    saveToLocalStorage();
}

function calculateGradients() {
    const gradients = {
        temporal: { score: 0, count: 0, position: '' },
        spatial: { score: 0, count: 0, position: '' },
        reference: { score: 0, count: 0, position: '' }
    };

    // Calculate average for each gradient
    assessmentState.allQuestions.slice(0, 10).forEach(q => {
        const answer = assessmentState.answers[q.id];
        if (answer && q.gradient) {
            gradients[q.gradient].score += answer;
            gradients[q.gradient].count++;
        }
    });

    // Determine positions
    Object.keys(gradients).forEach(key => {
        const avg = gradients[key].score / gradients[key].count;
        gradients[key].average = avg;

        if (key === 'temporal') {
            if (avg <= 2) gradients[key].position = 'Past-Oriented';
            else if (avg <= 3.5) gradients[key].position = 'Now-Focused';
            else gradients[key].position = 'Future-Oriented';
        } else if (key === 'spatial') {
            if (avg <= 2) gradients[key].position = 'Concrete';
            else if (avg <= 3.5) gradients[key].position = 'Balanced';
            else gradients[key].position = 'Abstract';
        } else if (key === 'reference') {
            if (avg <= 2) gradients[key].position = 'Self-Referenced';
            else if (avg <= 3.5) gradients[key].position = 'Balanced';
            else gradients[key].position = 'Other-Referenced';
        }
    });

    return gradients;
}

function calculateCognitiveBlocks() {
    const blocks = {
        sensory: { score: 0, count: 0, percentage: 0 },
        working: { score: 0, count: 0, percentage: 0 },
        sequential: { score: 0, count: 0, percentage: 0 },
        spatial: { score: 0, count: 0, percentage: 0 },
        pattern: { score: 0, count: 0, percentage: 0 },
        quantitative: { score: 0, count: 0, percentage: 0 },
        empathetic: { score: 0, count: 0, percentage: 0 },
        generative: { score: 0, count: 0, percentage: 0 }
    };

    // Calculate average for each block
    assessmentState.allQuestions.slice(10, 50).forEach(q => {
        const answer = assessmentState.answers[q.id];
        if (answer && q.block) {
            blocks[q.block].score += answer;
            blocks[q.block].count++;
        }
    });

    // Convert to percentages
    Object.keys(blocks).forEach(key => {
        const avg = blocks[key].score / blocks[key].count;
        blocks[key].percentage = Math.round((avg / 5) * 100);
    });

    return blocks;
}

function calculateATPScore() {
    let totalDisruption = 0;
    const maxPossible = 152; // 12 diet × 4 + 26 symptoms × 4

    // Sum all fuel state answers
    assessmentState.allQuestions.slice(50, 88).forEach(q => {
        const answer = assessmentState.answers[q.id];
        if (answer !== undefined) {
            totalDisruption += answer;
        }
    });

    // Convert to 0-100 scale
    const atpScore = Math.round((totalDisruption / maxPossible) * 100);

    return {
        score: atpScore,
        level: atpScore < 20 ? 'Low' : atpScore < 40 ? 'Moderate' : atpScore < 60 ? 'High' : atpScore < 80 ? 'Very High' : 'Critical',
        description: atpScore < 20 ? 'Your cellular energy is well-optimized' :
                     atpScore < 40 ? 'Minor ATP disruption - room for improvement' :
                     atpScore < 60 ? 'Moderate ATP disruption - significant impact on energy' :
                     atpScore < 80 ? 'High ATP disruption - major energy challenges' :
                     'Critical ATP disruption - urgent intervention needed'
    };
}

// ============================================================================
// RESULTS DISPLAY
// ============================================================================

function showResults() {
    document.getElementById('questionScreen').classList.add('hidden');
    document.getElementById('resultsScreen').classList.remove('hidden');

    displayGradientResults();
    displayBlockResults();
    displayATPResults();
}

function displayGradientResults() {
    const container = document.getElementById('gradientsResults');
    const gradients = assessmentState.results.gradients;

    const gradientNames = {
        temporal: 'Temporal Gradient',
        spatial: 'Spatial Gradient',
        reference: 'Reference Gradient'
    };

    const gradientLabels = {
        temporal: { left: 'Past', right: 'Future' },
        spatial: { left: 'Concrete', right: 'Abstract' },
        reference: { left: 'Self', right: 'Other' }
    };

    container.innerHTML = '';

    Object.keys(gradients).forEach(key => {
        const gradient = gradients[key];
        const percentage = ((gradient.average - 1) / 4) * 100;

        const gradientDiv = document.createElement('div');
        gradientDiv.className = 'gradient-result';
        gradientDiv.innerHTML = `
            <div class="gradient-header">
                <h3>${gradientNames[key]}</h3>
                <span style="color: #3b82f6; font-weight: bold;">${gradient.position}</span>
            </div>
            <div class="gradient-labels">
                <span>${gradientLabels[key].left}</span>
                <span>${gradientLabels[key].right}</span>
            </div>
            <div class="gradient-bar">
                <div class="gradient-fill" style="width: ${percentage}%"></div>
            </div>
        `;
        container.appendChild(gradientDiv);
    });
}

function displayBlockResults() {
    const container = document.getElementById('blocksResults');
    const blocks = assessmentState.results.blocks;

    const blockNames = {
        sensory: 'Sensory Register',
        working: 'Working Memory',
        sequential: 'Sequential Processing',
        spatial: 'Spatial Relationships',
        pattern: 'Pattern Recognition',
        quantitative: 'Quantitative Reasoning',
        empathetic: 'Empathetic Intelligence',
        generative: 'Generative Creation'
    };

    container.innerHTML = '';

    Object.keys(blocks).forEach(key => {
        const block = blocks[key];

        const blockDiv = document.createElement('div');
        blockDiv.className = 'block-card';
        blockDiv.innerHTML = `
            <div class="block-header">
                <span class="block-name">${blockNames[key]}</span>
                <span class="block-score">${block.percentage}%</span>
            </div>
            <div class="block-bar">
                <div class="block-fill" style="width: ${block.percentage}%"></div>
            </div>
        `;
        container.appendChild(blockDiv);
    });
}

function displayATPResults() {
    const container = document.getElementById('atpResults');
    const atp = assessmentState.results.atp;

    container.innerHTML = `
        <div class="atp-number">${atp.score}</div>
        <div class="atp-label">${atp.level} ATP Disruption</div>
        <div class="atp-description">${atp.description}</div>
    `;
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Check if there's a saved assessment in progress
    if (loadFromLocalStorage() && assessmentState.allQuestions.length > 0) {
        // Resume assessment
        const resume = confirm('You have an assessment in progress. Would you like to resume?');
        if (resume) {
            document.getElementById('introScreen').classList.add('hidden');
            if (assessmentState.results) {
                showResults();
            } else {
                document.getElementById('questionScreen').classList.remove('hidden');
                displayCurrentQuestion();
            }
        }
    }
});
