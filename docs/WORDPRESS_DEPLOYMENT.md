# WordPress Deployment Guide
## Cognition Blocks Website - WordPress Integration

There are **4 main methods** to deploy this to WordPress. Choose based on your setup:

---

## Method 1: FTP/SFTP Upload (Easiest)

### Step 1: Upload Files
```bash
# Connect to your WordPress site via FTP/SFTP
# Upload to: wp-content/themes/your-theme/cognition-blocks/

# Directory structure on WordPress:
wp-content/themes/your-theme/
└── cognition-blocks/
    ├── marketing/
    │   ├── index.html
    │   ├── styles.css
    │   └── script.js
    └── webapp/
        ├── assessment.html
        ├── assessment.css
        ├── assessment.js
        ├── challenge.html
        ├── challenge.css
        └── challenge.js
```

### Step 2: Add to functions.php
```php
// Add to wp-content/themes/your-theme/functions.php

function cognition_blocks_enqueue_assets() {
    // Only load on specific pages
    if (is_page('home') || is_front_page()) {
        wp_enqueue_style(
            'cb-marketing',
            get_template_directory_uri() . '/cognition-blocks/marketing/styles.css',
            array(),
            '1.0.0'
        );
        wp_enqueue_script(
            'cb-marketing',
            get_template_directory_uri() . '/cognition-blocks/marketing/script.js',
            array(),
            '1.0.0',
            true
        );
    }

    if (is_page('assessment')) {
        wp_enqueue_style('cb-assessment', get_template_directory_uri() . '/cognition-blocks/webapp/assessment.css');
        wp_enqueue_script('cb-assessment', get_template_directory_uri() . '/cognition-blocks/webapp/assessment.js', array(), '1.0.0', true);
    }

    if (is_page('challenge')) {
        wp_enqueue_style('cb-challenge', get_template_directory_uri() . '/cognition-blocks/webapp/challenge.css');
        wp_enqueue_script('cb-challenge', get_template_directory_uri() . '/cognition-blocks/webapp/challenge.js', array(), '1.0.0', true);
    }
}
add_action('wp_enqueue_scripts', 'cognition_blocks_enqueue_assets');
```

### Step 3: Create WordPress Pages
1. **WordPress Admin → Pages → Add New**
2. **Create 3 pages:**
   - Home
   - Assessment
   - Challenge

### Step 4: Use Page Builder (Elementor/Divi)
1. Edit page with Elementor/Divi
2. Add **HTML Widget**
3. Copy/paste HTML from the corresponding HTML file
4. Save and publish

---

## Method 2: Custom Page Templates (More Professional)

### Step 1: Create Page Templates

Create these files in your theme:

**File: `wp-content/themes/your-theme/page-templates/template-cognition-home.php`**
```php
<?php
/**
 * Template Name: Cognition Blocks Home
 */

get_header(); ?>

<div id="primary" class="content-area">
    <main id="main" class="site-main">
        <?php include(get_template_directory() . '/cognition-blocks/marketing/index-content.php'); ?>
    </main>
</div>

<?php get_footer(); ?>
```

**File: `wp-content/themes/your-theme/page-templates/template-assessment.php`**
```php
<?php
/**
 * Template Name: Cognition Blocks Assessment
 */

get_header(); ?>

<div id="primary" class="content-area full-width">
    <main id="main" class="site-main">
        <?php include(get_template_directory() . '/cognition-blocks/webapp/assessment-content.php'); ?>
    </main>
</div>

<?php get_footer(); ?>
```

**File: `wp-content/themes/your-theme/page-templates/template-challenge.php`**
```php
<?php
/**
 * Template Name: Cognition Blocks Challenge
 */

get_header(); ?>

<div id="primary" class="content-area full-width">
    <main id="main" class="site-main">
        <?php include(get_template_directory() . '/cognition-blocks/webapp/challenge-content.php'); ?>
    </main>
</div>

<?php get_footer(); ?>
```

### Step 2: Extract HTML Content
I'll create content-only versions for you (without `<html>`, `<head>`, `<body>` tags)

---

## Method 3: WordPress Plugin (Most Automated)

### Create a Custom Plugin

**File: `wp-content/plugins/cognition-blocks/cognition-blocks.php`**
```php
<?php
/**
 * Plugin Name: Cognition Blocks Platform
 * Description: Complete web platform for Cognition Blocks LLC
 * Version: 1.0.0
 * Author: Cognition Blocks LLC
 */

// Prevent direct access
if (!defined('ABSPATH')) exit;

class CognitionBlocksPlatform {

    public function __construct() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'));
        add_shortcode('cb_assessment', array($this, 'assessment_shortcode'));
        add_shortcode('cb_challenge', array($this, 'challenge_shortcode'));
        add_shortcode('cb_marketing', array($this, 'marketing_shortcode'));
    }

    public function enqueue_assets() {
        // Marketing CSS
        wp_register_style(
            'cb-marketing',
            plugins_url('marketing/styles.css', __FILE__),
            array(),
            '1.0.0'
        );

        // Marketing JS
        wp_register_script(
            'cb-marketing',
            plugins_url('marketing/script.js', __FILE__),
            array(),
            '1.0.0',
            true
        );

        // Assessment assets
        wp_register_style('cb-assessment', plugins_url('webapp/assessment.css', __FILE__));
        wp_register_script('cb-assessment', plugins_url('webapp/assessment.js', __FILE__), array(), '1.0.0', true);

        // Challenge assets
        wp_register_style('cb-challenge', plugins_url('webapp/challenge.css', __FILE__));
        wp_register_script('cb-challenge', plugins_url('webapp/challenge.js', __FILE__), array(), '1.0.0', true);
    }

    public function marketing_shortcode($atts) {
        wp_enqueue_style('cb-marketing');
        wp_enqueue_script('cb-marketing');

        ob_start();
        include(plugin_dir_path(__FILE__) . 'marketing/content.php');
        return ob_get_clean();
    }

    public function assessment_shortcode($atts) {
        wp_enqueue_style('cb-assessment');
        wp_enqueue_script('cb-assessment');

        ob_start();
        include(plugin_dir_path(__FILE__) . 'webapp/assessment-content.php');
        return ob_get_clean();
    }

    public function challenge_shortcode($atts) {
        wp_enqueue_style('cb-challenge');
        wp_enqueue_script('cb-challenge');

        ob_start();
        include(plugin_dir_path(__FILE__) . 'webapp/challenge-content.php');
        return ob_get_clean();
    }
}

new CognitionBlocksPlatform();
```

### Upload Plugin
1. Create folder: `wp-content/plugins/cognition-blocks/`
2. Upload all website files there
3. Upload the plugin file above
4. **Activate in WordPress Admin → Plugins**

### Use Shortcodes
```
[cb_marketing]   - Marketing homepage
[cb_assessment]  - Assessment tool
[cb_challenge]   - 30-Day Challenge
```

---

## Method 4: Git Deploy (Most Advanced)

### Using WP Pusher or Similar

**Install WP Pusher Plugin:**
1. Install WP Pusher from WordPress.org
2. Connect to GitHub
3. Deploy directly from your repository

**Or use SSH/Git Hooks:**
```bash
# On your WordPress server
cd /var/www/html/wp-content/themes/your-theme/
git clone https://github.com/DowdIsHere/CBI-APP.git cognition-blocks
cd cognition-blocks
git checkout claude/cognition-blocks-website-011CUrSa4RrRKyvdqpktBgZM

# Create symlink
ln -s /var/www/html/wp-content/themes/your-theme/cognition-blocks/website/* ./

# Set up auto-deploy with webhook
```

---

## Recommended Approach for You

### **🎯 BEST FOR BEGINNERS: Method 3 (Plugin)**

**Why?**
- ✅ Clean and organized
- ✅ Easy to update
- ✅ Can activate/deactivate
- ✅ Use shortcodes anywhere
- ✅ Won't break with theme updates

**I'll create the plugin files for you now!**

---

## WordPress Hosting Providers Support

### If using popular hosts:

**Bluehost/HostGator/GoDaddy:**
- Use FTP (FileZilla) - Method 1
- Or use cPanel File Manager

**WP Engine/Kinsta:**
- Use SFTP or Git deploy
- SSH access available

**WordPress.com:**
- Need Business Plan for plugins/themes
- Use built-in code editor

**Elementor Cloud/Other Managed:**
- Usually Method 1 (FTP) or Method 4 (Git)

---

## After Deployment Checklist

- [ ] Files uploaded to WordPress
- [ ] CSS and JS loading correctly (check browser console)
- [ ] Pages created in WordPress
- [ ] Templates/shortcodes working
- [ ] Forms submitting correctly
- [ ] Mobile responsive working
- [ ] SSL certificate active (HTTPS)
- [ ] Permalinks set correctly
- [ ] Cache cleared (if using cache plugin)
- [ ] Test on mobile devices

---

## Need Help?

**Common Issues:**

1. **Styles not loading?**
   - Check file paths in functions.php
   - Clear WordPress cache
   - Hard refresh browser (Ctrl+F5)

2. **JavaScript not working?**
   - Check browser console for errors
   - Verify file paths
   - Disable conflicting plugins

3. **Layout broken?**
   - WordPress theme CSS may conflict
   - Add `!important` to critical styles
   - Or use iframe method (isolates styles)

---

**Which method would you like me to set up for you?**
