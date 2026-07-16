# Cognition Blocks Website & Web App

Complete web platform for Cognition Blocks LLC - "Optimize the Foundation. Elevate Everything."

## 📁 Project Structure

```
website/
├── marketing/              # WordPress-ready marketing site
│   ├── index.html         # Main landing page
│   ├── styles.css         # Complete styling
│   └── script.js          # Interactive features
│
├── webapp/                # Standalone web applications
│   ├── assessment.html    # 88-question assessment
│   ├── assessment.css
│   ├── assessment.js
│   ├── challenge.html     # 30-Day Challenge app
│   ├── challenge.css
│   └── challenge.js
│
├── shared/                # Shared resources (future)
└── README.md             # This file
```

## 🚀 Features

### Marketing Site (WordPress Compatible)
- **Responsive Design**: Mobile-first, works on all devices
- **Modern UI/UX**: Gradient designs, smooth animations
- **SEO Optimized**: Semantic HTML, proper meta tags
- **Page Builder Ready**: Clean HTML/CSS for Elementor/Divi
- **Interactive**: Smooth scrolling, form validation, notifications

#### Sections:
- Hero with statistics
- The Three Pillars (Gut, Brain, Cellular Intelligence)
- Assessment preview
- 30-Day Challenge preview
- App download section
- Contact form
- Footer

### Assessment Web App
- **88 Questions** across 3 categories:
  - Gradients (30 questions): Health baseline
  - Cognitive Blocks (30 questions): Barriers identification
  - Fuel State (28 questions): Nutrition evaluation
- **Progress tracking** with visual indicators
- **Instant results** with circular score displays
- **Personalized recommendations**
- **PDF export** (backend integration needed)
- **Local storage** for progress saving

### 30-Day Challenge Web App
- **Daily meal plans** for all 30 days
- **Shopping lists** organized by week
- **Progress tracking** with calendar view
- **Achievement system** with badges
- **Metrics dashboard** for health tracking
- **Educational content** for each day
- **Checklist system** for daily tasks
- **Local storage** persistence

## 🛠️ Tech Stack

- **HTML5**: Semantic, accessible markup
- **CSS3**: Modern features, animations, gradients
- **Vanilla JavaScript**: No dependencies, lightweight
- **Local Storage API**: Client-side data persistence
- **SVG Icons**: Scalable, crisp graphics

## 📋 Installation & Setup

### Option 1: Static Hosting (GitHub Pages, Netlify, Vercel)

1. Clone the repository
```bash
git clone <repo-url>
cd CBI-APP/website
```

2. Serve the files
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

3. Open browser to `http://localhost:8000/marketing/`

### Option 2: WordPress Integration

#### Method A: Page Builder (Elementor/Divi)

1. **Upload files** to WordPress:
   ```
   wp-content/themes/your-theme/cognition-blocks/
   ```

2. **Create new pages** in WordPress:
   - Home Page
   - Assessment Page
   - Challenge Page

3. **Copy HTML content** from files into page builder HTML widgets

4. **Enqueue styles and scripts** in `functions.php`:
   ```php
   function cognition_blocks_assets() {
       wp_enqueue_style('cb-marketing', get_template_directory_uri() . '/cognition-blocks/marketing/styles.css');
       wp_enqueue_script('cb-marketing', get_template_directory_uri() . '/cognition-blocks/marketing/script.js', array(), '1.0', true);
   }
   add_action('wp_enqueue_scripts', 'cognition_blocks_assets');
   ```

#### Method B: Custom Theme

1. **Create custom page templates**:
   ```php
   // template-home.php
   <?php
   /* Template Name: Cognition Blocks Home */
   get_header();
   include(get_template_directory() . '/cognition-blocks/marketing/index.html');
   get_footer();
   ?>
   ```

2. **Integrate with WordPress**:
   - Replace hardcoded content with WordPress functions
   - Use `wp_nav_menu()` for navigation
   - Use `get_template_part()` for sections
   - Add custom fields for dynamic content

## 🔌 Backend Integration

### Required API Endpoints

#### Assessment API
```javascript
POST /api/assessment/submit
{
  "userId": "string",
  "answers": [0, 1, 2, ...], // 88 answers (0-4 scale)
  "timestamp": "ISO date"
}

GET /api/assessment/results/:userId
Returns: {
  "gradientsScore": 75,
  "blocksScore": 68,
  "fuelScore": 82,
  "recommendations": [...]
}
```

#### Challenge API
```javascript
POST /api/challenge/register
{
  "name": "string",
  "email": "string",
  "primaryGoal": "string",
  "restrictions": ["gluten-free", ...]
}

POST /api/challenge/complete-day
{
  "userId": "string",
  "day": 5,
  "checklist": [0, 1, 2, 3, 4],
  "metrics": { "energy": 8, "clarity": 7, ... }
}

GET /api/challenge/progress/:userId
Returns: {
  "currentDay": 15,
  "completedDays": [1, 2, 3, ...],
  "streak": 15,
  "achievements": [...]
}
```

#### Contact Form API
```javascript
POST /api/contact/submit
{
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string"
}
```

### WordPress Integration

Update `script.js` to use WordPress AJAX:

```javascript
// Example WordPress AJAX integration
function submitAssessment(answers) {
    jQuery.ajax({
        url: cbAjax.ajaxurl, // WordPress AJAX URL
        type: 'POST',
        data: {
            action: 'submit_assessment',
            nonce: cbAjax.nonce,
            answers: JSON.stringify(answers)
        },
        success: function(response) {
            // Handle response
        }
    });
}
```

Add to `functions.php`:
```php
function cb_ajax_submit_assessment() {
    check_ajax_referer('cb_nonce', 'nonce');

    $answers = json_decode(stripslashes($_POST['answers']), true);

    // Process assessment
    // Save to database
    // Generate results

    wp_send_json_success($results);
}
add_action('wp_ajax_submit_assessment', 'cb_ajax_submit_assessment');
add_action('wp_ajax_nopriv_submit_assessment', 'cb_ajax_submit_assessment');
```

## 🎨 Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-blue: #1e3a5f;
    --accent-blue: #2563eb;
    --primary-green: #10b981;
    --accent-green: #34d399;
    /* ... */
}
```

### Content
- **Marketing copy**: Edit `marketing/index.html`
- **Assessment questions**: Edit `webapp/assessment.js` → `assessmentData`
- **Challenge meals**: Edit `webapp/challenge.js` → `challengeData.dailyContent`
- **Shopping lists**: Edit `webapp/challenge.js` → `challengeData.shoppingLists`

### Branding
- Replace logo text in navigation
- Update footer information
- Modify hero tagline
- Customize email addresses

## 📱 Mobile App Integration

### Data Sync Strategy

1. **Shared Backend**: Both web and mobile use same API
2. **User Authentication**: Single sign-on across platforms
3. **Data Format**: JSON responses work for both
4. **Local Storage**: Web uses localStorage, mobile uses AsyncStorage
5. **Offline Support**: Both cache data locally

### Cross-Platform Features

| Feature | Web App | Mobile App | Notes |
|---------|---------|------------|-------|
| Assessment | ✅ | ✅ | Same 88 questions |
| Challenge | ✅ | ✅ | Shared progress tracking |
| Meal Logging | Basic | Advanced | Mobile has camera |
| Barcode Scan | ❌ | ✅ | Mobile only |
| Progress Charts | ✅ | ✅ | Same data visualization |
| Shopping Lists | ✅ | ✅ | Sync across devices |

## 🧪 Testing

### Browser Testing
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

### Functionality Testing
```bash
# Check all links
grep -r "href=" website/marketing/index.html

# Validate HTML
# Use https://validator.w3.org/

# Test responsive design
# Use browser DevTools device emulator
```

### Performance
- Lighthouse score target: 90+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Total page size: < 500KB

## 📦 Deployment

### Static Hosting

**Netlify**:
```bash
# netlify.toml
[build]
  publish = "website/marketing"

[[redirects]]
  from = "/assessment"
  to = "/webapp/assessment.html"

[[redirects]]
  from = "/challenge"
  to = "/webapp/challenge.html"
```

**Vercel**:
```json
{
  "routes": [
    { "src": "/assessment", "dest": "/webapp/assessment.html" },
    { "src": "/challenge", "dest": "/webapp/challenge.html" }
  ]
}
```

### WordPress Hosting

1. Upload to theme directory
2. Activate custom page templates
3. Configure permalinks
4. Set up SSL certificate
5. Configure CDN (optional)

## 🔒 Security Considerations

- **Input Validation**: All form inputs are validated client-side
- **XSS Protection**: HTML is escaped in dynamic content
- **HTTPS**: Always use HTTPS in production
- **API Keys**: Never expose in frontend code
- **Rate Limiting**: Implement on backend for form submissions
- **CORS**: Configure properly for API requests

## 🚧 Future Enhancements

### Phase 2
- [ ] User authentication system
- [ ] Backend API implementation
- [ ] Database integration
- [ ] Email notifications
- [ ] Payment integration for premium features
- [ ] Social sharing capabilities

### Phase 3
- [ ] React/Next.js conversion for better SEO
- [ ] Advanced analytics dashboard
- [ ] Community forum
- [ ] Recipe database
- [ ] Meal planner tool
- [ ] Integration with fitness trackers

## 📞 Support

For questions or issues:
- **Email**: inquire@cognitionblocksllc.com
- **Documentation**: See this README
- **Issues**: GitHub Issues (if applicable)

## 📄 License

Copyright © 2025 Cognition Blocks LLC. All rights reserved.

---

**Built with ❤️ for better health through nutrition**

**Version**: 1.0.0
**Last Updated**: January 2025
**Status**: Production Ready
