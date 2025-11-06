#!/bin/bash
# Build WordPress Plugin for Cognition Blocks
# This script prepares the plugin for WordPress upload

echo "🚀 Building Cognition Blocks WordPress Plugin..."

# Set directories
PLUGIN_DIR="cognition-blocks"
ASSETS_DIR="$PLUGIN_DIR/assets"
TEMPLATES_DIR="$PLUGIN_DIR/templates"

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p "$ASSETS_DIR/marketing"
mkdir -p "$ASSETS_DIR/webapp"
mkdir -p "$TEMPLATES_DIR"

# Copy marketing assets
echo "📋 Copying marketing assets..."
cp ../marketing/styles.css "$ASSETS_DIR/marketing/"
cp ../marketing/script.js "$ASSETS_DIR/marketing/"

# Copy webapp assets
echo "📋 Copying webapp assets..."
cp ../webapp/assessment.css "$ASSETS_DIR/webapp/"
cp ../webapp/assessment.js "$ASSETS_DIR/webapp/"
cp ../webapp/challenge.css "$ASSETS_DIR/webapp/"
cp ../webapp/challenge.js "$ASSETS_DIR/webapp/"

# Create template files
echo "📄 Creating template files..."

# Three Pillars Template
cat > "$TEMPLATES_DIR/three-pillars.php" << 'EOF'
<section id="protocol" class="pillars">
    <div class="container">
        <div class="section-header">
            <h2 class="section-title">The Dowd Protocol</h2>
            <p class="section-subtitle">
                Three interconnected systems working in harmony for optimal health
            </p>
        </div>
        <div class="pillars-grid">
            <div class="pillar-card">
                <div class="pillar-icon brain-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2a9 9 0 1 0 9 9 9 9 0 0 0-9-9z"></path>
                        <path d="M12 2v9l6.36 3.68"></path>
                    </svg>
                </div>
                <h3 class="pillar-title">Gut Intelligence</h3>
                <p class="pillar-subtitle">Enteric Nervous System</p>
                <p class="pillar-description">
                    Your "second brain" contains 500 million neurons. What you eat directly impacts mood,
                    immunity, and cognitive function through the gut-brain axis.
                </p>
                <ul class="pillar-benefits">
                    <li>95% of serotonin produced in gut</li>
                    <li>Direct vagus nerve communication</li>
                    <li>Microbiome influences everything</li>
                </ul>
            </div>

            <div class="pillar-card">
                <div class="pillar-icon energy-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                    </svg>
                </div>
                <h3 class="pillar-title">Brain Intelligence</h3>
                <p class="pillar-subtitle">Central Nervous System</p>
                <p class="pillar-description">
                    Your brain's performance depends on clean fuel. Reduce inflammation, optimize
                    neurotransmitters, and unlock peak cognitive potential.
                </p>
                <ul class="pillar-benefits">
                    <li>Enhanced focus and clarity</li>
                    <li>Reduced brain fog</li>
                    <li>Improved memory and learning</li>
                </ul>
            </div>

            <div class="pillar-card">
                <div class="pillar-icon cellular-icon">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="6"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                    </svg>
                </div>
                <h3 class="pillar-title">Cellular Intelligence</h3>
                <p class="pillar-subtitle">Mitochondrial Function</p>
                <p class="pillar-description">
                    Mitochondria power every cell in your body. Clean nutrition fuels optimal energy
                    production, longevity, and cellular repair.
                </p>
                <ul class="pillar-benefits">
                    <li>Sustained energy all day</li>
                    <li>Enhanced recovery</li>
                    <li>Anti-aging benefits</li>
                </ul>
            </div>
        </div>
    </div>
</section>
EOF

# Assessment Preview Template
cat > "$TEMPLATES_DIR/assessment-preview.php" << 'EOF'
<section id="assessment" class="assessment-preview">
    <div class="container">
        <div class="assessment-grid">
            <div class="assessment-content">
                <span class="badge">Free Assessment</span>
                <h2 class="assessment-title">Discover Your Cognitive Blocks Profile</h2>
                <p class="assessment-description">
                    Our comprehensive 88-question assessment analyzes three key areas:
                </p>
                <ul class="assessment-features">
                    <li>
                        <span class="feature-icon">📊</span>
                        <div>
                            <strong>Gradients Analysis</strong>
                            <p>Understand your current health baseline across multiple dimensions</p>
                        </div>
                    </li>
                    <li>
                        <span class="feature-icon">🧩</span>
                        <div>
                            <strong>Cognitive Blocks Identification</strong>
                            <p>Discover what's preventing you from reaching optimal health</p>
                        </div>
                    </li>
                    <li>
                        <span class="feature-icon">⚡</span>
                        <div>
                            <strong>Fuel State Evaluation</strong>
                            <p>Learn how your nutrition impacts energy and performance</p>
                        </div>
                    </li>
                </ul>
                <div class="assessment-cta">
                    <a href="/assessment" class="btn btn-primary btn-large">Start Assessment</a>
                    <p class="assessment-note">Takes 10-15 minutes • Get instant results</p>
                </div>
            </div>
        </div>
    </div>
</section>
EOF

# Challenge Preview Template
cat > "$TEMPLATES_DIR/challenge-preview.php" << 'EOF'
<section id="challenge" class="challenge">
    <div class="container">
        <div class="challenge-header">
            <h2 class="section-title">The 30-Day Dowd Protocol Challenge</h2>
            <p class="section-subtitle">
                Transform your health in just one month with guided daily actions
            </p>
        </div>
        <div class="challenge-grid">
            <div class="challenge-content">
                <div class="challenge-benefits">
                    <div class="benefit-item">
                        <span class="benefit-icon">✓</span>
                        <div>
                            <strong>Daily Meal Plans</strong>
                            <p>Scientifically optimized for gut-brain-mitochondria health</p>
                        </div>
                    </div>
                    <div class="benefit-item">
                        <span class="benefit-icon">✓</span>
                        <div>
                            <strong>Progress Tracking</strong>
                            <p>Monitor improvements in energy, focus, and overall wellness</p>
                        </div>
                    </div>
                    <div class="benefit-item">
                        <span class="benefit-icon">✓</span>
                        <div>
                            <strong>Shopping Lists</strong>
                            <p>Automated grocery lists for each week of the challenge</p>
                        </div>
                    </div>
                    <div class="benefit-item">
                        <span class="benefit-icon">✓</span>
                        <div>
                            <strong>Educational Content</strong>
                            <p>Learn why each food choice matters for your health</p>
                        </div>
                    </div>
                </div>
                <div class="challenge-cta">
                    <a href="/challenge" class="btn btn-accent btn-large">Start Your Challenge</a>
                    <p class="challenge-note">Join 5,000+ people who've transformed their health</p>
                </div>
            </div>
        </div>
    </div>
</section>
EOF

# Contact Form Template
cat > "$TEMPLATES_DIR/contact-form.php" << 'EOF'
<section id="contact" class="contact">
    <div class="container">
        <div class="contact-grid">
            <div class="contact-info">
                <h2 class="contact-title">Get in Touch</h2>
                <p class="contact-description">
                    Have questions about the Dowd Protocol? Want to learn more about
                    Cognition Blocks? We're here to help.
                </p>
                <div class="contact-details">
                    <div class="contact-item">
                        <span class="contact-icon">📧</span>
                        <div>
                            <strong>Email</strong>
                            <p>support@cognitionblocks.com</p>
                        </div>
                    </div>
                    <div class="contact-item">
                        <span class="contact-icon">💬</span>
                        <div>
                            <strong>Support</strong>
                            <p>Available Mon-Fri, 9am-5pm EST</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="contact-form-wrapper">
                <form class="contact-form" id="contactForm">
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="subject">Subject</label>
                        <select id="subject" name="subject" required>
                            <option value="">Select a topic</option>
                            <option value="general">General Inquiry</option>
                            <option value="assessment">Assessment Questions</option>
                            <option value="challenge">30-Day Challenge</option>
                            <option value="app">Mobile App Support</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="message">Message</label>
                        <textarea id="message" name="message" rows="5" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary btn-block">Send Message</button>
                </form>
            </div>
        </div>
    </div>
</section>
EOF

# Assessment Full Template
echo "<?php include(plugin_dir_path(__DIR__) . 'assets/webapp/assessment.html'); ?>" > "$TEMPLATES_DIR/assessment-full.php"

# Challenge Full Template
echo "<?php include(plugin_dir_path(__DIR__) . 'assets/webapp/challenge.html'); ?>" > "$TEMPLATES_DIR/challenge-full.php"

# Create readme.txt for WordPress.org format
cat > "$PLUGIN_DIR/readme.txt" << 'EOF'
=== Cognition Blocks Platform ===
Contributors: cognitionblocks
Tags: health, nutrition, assessment, challenge, wellness
Requires at least: 5.0
Tested up to: 6.4
Stable tag: 1.0.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Complete web platform for Cognition Blocks LLC - Assessment tool, 30-Day Challenge, and marketing pages.

== Description ==

Cognition Blocks Platform provides a comprehensive health and wellness solution including:

* 88-question health assessment tool
* 30-day Dowd Protocol challenge
* Educational content about gut-brain-mitochondria axis
* Shopping lists and meal plans
* Progress tracking

== Installation ==

1. Upload the plugin files to `/wp-content/plugins/cognition-blocks/`
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Use the shortcodes in your pages

== Shortcodes ==

* [cb_marketing_hero] - Hero section
* [cb_three_pillars] - Three pillars section
* [cb_assessment_preview] - Assessment preview
* [cb_assessment_full] - Full assessment
* [cb_challenge_preview] - Challenge preview
* [cb_challenge_full] - Full challenge
* [cb_contact_form] - Contact form

== Changelog ==

= 1.0.0 =
* Initial release
EOF

# Create ZIP file
echo "📦 Creating ZIP file..."
zip -r cognition-blocks.zip cognition-blocks/ -x "*.DS_Store" "*/\.*"

echo ""
echo "✅ Plugin built successfully!"
echo ""
echo "📦 File created: cognition-blocks.zip"
echo "📊 Size: $(du -h cognition-blocks.zip | cut -f1)"
echo ""
echo "🚀 Next steps:"
echo "   1. Go to WordPress Admin → Plugins → Add New → Upload Plugin"
echo "   2. Choose cognition-blocks.zip"
echo "   3. Click Install Now → Activate"
echo "   4. Use shortcodes in your pages"
echo ""
echo "📖 See README.md for full instructions"
echo ""
