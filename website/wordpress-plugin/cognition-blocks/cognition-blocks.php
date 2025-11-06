<?php
/**
 * Plugin Name: Cognition Blocks Platform
 * Plugin URI: https://cognitionblocks.com
 * Description: Complete web platform for Cognition Blocks LLC - Assessment tool, 30-Day Challenge, and marketing pages
 * Version: 1.0.0
 * Author: Cognition Blocks LLC
 * Author URI: https://cognitionblocks.com
 * License: GPL v2 or later
 * Text Domain: cognition-blocks
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class CognitionBlocksPlatform {

    private $plugin_path;
    private $plugin_url;

    public function __construct() {
        $this->plugin_path = plugin_dir_path(__FILE__);
        $this->plugin_url = plugin_dir_url(__FILE__);

        // Register hooks
        add_action('wp_enqueue_scripts', array($this, 'enqueue_assets'));
        add_action('init', array($this, 'register_shortcodes'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
    }

    /**
     * Enqueue CSS and JavaScript
     */
    public function enqueue_assets() {
        // Marketing assets
        wp_register_style(
            'cb-marketing',
            $this->plugin_url . 'assets/marketing/styles.css',
            array(),
            '1.0.0'
        );

        wp_register_script(
            'cb-marketing',
            $this->plugin_url . 'assets/marketing/script.js',
            array(),
            '1.0.0',
            true
        );

        // Assessment assets
        wp_register_style(
            'cb-assessment',
            $this->plugin_url . 'assets/webapp/assessment.css',
            array(),
            '1.0.0'
        );

        wp_register_script(
            'cb-assessment',
            $this->plugin_url . 'assets/webapp/assessment.js',
            array(),
            '1.0.0',
            true
        );

        // Challenge assets
        wp_register_style(
            'cb-challenge',
            $this->plugin_url . 'assets/webapp/challenge.css',
            array(),
            '1.0.0'
        );

        wp_register_script(
            'cb-challenge',
            $this->plugin_url . 'assets/webapp/challenge.js',
            array(),
            '1.0.0',
            true
        );
    }

    /**
     * Register shortcodes
     */
    public function register_shortcodes() {
        add_shortcode('cb_marketing_hero', array($this, 'marketing_hero_shortcode'));
        add_shortcode('cb_three_pillars', array($this, 'three_pillars_shortcode'));
        add_shortcode('cb_assessment_preview', array($this, 'assessment_preview_shortcode'));
        add_shortcode('cb_assessment_full', array($this, 'assessment_full_shortcode'));
        add_shortcode('cb_challenge_preview', array($this, 'challenge_preview_shortcode'));
        add_shortcode('cb_challenge_full', array($this, 'challenge_full_shortcode'));
        add_shortcode('cb_contact_form', array($this, 'contact_form_shortcode'));
    }

    /**
     * Marketing Hero Section
     */
    public function marketing_hero_shortcode($atts) {
        wp_enqueue_style('cb-marketing');
        wp_enqueue_script('cb-marketing');

        ob_start();
        ?>
        <section id="home" class="hero">
            <div class="container">
                <div class="hero-content">
                    <h1 class="hero-title">
                        Optimize the Foundation.<br>
                        <span class="gradient-text">Elevate Everything.</span>
                    </h1>
                    <p class="hero-subtitle">
                        Transform your health through the power of nutrition and the gut-brain-mitochondria axis.
                        The Dowd Protocol unlocks your body's natural intelligence.
                    </p>
                    <div class="hero-cta">
                        <a href="/assessment" class="btn btn-primary">Take the Assessment</a>
                        <a href="#protocol" class="btn btn-secondary">Learn More</a>
                    </div>
                    <div class="hero-stats">
                        <div class="stat">
                            <div class="stat-number">10,000+</div>
                            <div class="stat-label">Active Users</div>
                        </div>
                        <div class="stat">
                            <div class="stat-number">88</div>
                            <div class="stat-label">Assessment Questions</div>
                        </div>
                        <div class="stat">
                            <div class="stat-number">30</div>
                            <div class="stat-label">Day Challenge</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="hero-background"></div>
        </section>
        <?php
        return ob_get_clean();
    }

    /**
     * Three Pillars Section
     */
    public function three_pillars_shortcode($atts) {
        wp_enqueue_style('cb-marketing');

        ob_start();
        include($this->plugin_path . 'templates/three-pillars.php');
        return ob_get_clean();
    }

    /**
     * Assessment Preview
     */
    public function assessment_preview_shortcode($atts) {
        wp_enqueue_style('cb-marketing');

        ob_start();
        include($this->plugin_path . 'templates/assessment-preview.php');
        return ob_get_clean();
    }

    /**
     * Full Assessment Tool
     */
    public function assessment_full_shortcode($atts) {
        wp_enqueue_style('cb-assessment');
        wp_enqueue_script('cb-assessment');

        ob_start();
        include($this->plugin_path . 'templates/assessment-full.php');
        return ob_get_clean();
    }

    /**
     * Challenge Preview
     */
    public function challenge_preview_shortcode($atts) {
        wp_enqueue_style('cb-marketing');

        ob_start();
        include($this->plugin_path . 'templates/challenge-preview.php');
        return ob_get_clean();
    }

    /**
     * Full Challenge Tool
     */
    public function challenge_full_shortcode($atts) {
        wp_enqueue_style('cb-challenge');
        wp_enqueue_script('cb-challenge');

        ob_start();
        include($this->plugin_path . 'templates/challenge-full.php');
        return ob_get_clean();
    }

    /**
     * Contact Form
     */
    public function contact_form_shortcode($atts) {
        wp_enqueue_style('cb-marketing');
        wp_enqueue_script('cb-marketing');

        ob_start();
        include($this->plugin_path . 'templates/contact-form.php');
        return ob_get_clean();
    }

    /**
     * Add admin menu
     */
    public function add_admin_menu() {
        add_menu_page(
            'Cognition Blocks',
            'Cognition Blocks',
            'manage_options',
            'cognition-blocks',
            array($this, 'admin_page'),
            'dashicons-heart',
            30
        );
    }

    /**
     * Admin page
     */
    public function admin_page() {
        ?>
        <div class="wrap">
            <h1>Cognition Blocks Platform</h1>
            <div class="card">
                <h2>Available Shortcodes</h2>
                <p>Use these shortcodes in your pages:</p>

                <h3>Marketing Sections</h3>
                <ul>
                    <li><code>[cb_marketing_hero]</code> - Hero section with CTA</li>
                    <li><code>[cb_three_pillars]</code> - The three pillars section</li>
                    <li><code>[cb_assessment_preview]</code> - Assessment preview section</li>
                    <li><code>[cb_challenge_preview]</code> - Challenge preview section</li>
                    <li><code>[cb_contact_form]</code> - Contact form</li>
                </ul>

                <h3>Full Applications</h3>
                <ul>
                    <li><code>[cb_assessment_full]</code> - Full 88-question assessment tool</li>
                    <li><code>[cb_challenge_full]</code> - Full 30-day challenge application</li>
                </ul>

                <h3>Recommended Page Setup</h3>
                <ol>
                    <li>Create a page called "Home" and use: <code>[cb_marketing_hero]</code></li>
                    <li>Create a page called "Assessment" and use: <code>[cb_assessment_full]</code></li>
                    <li>Create a page called "Challenge" and use: <code>[cb_challenge_full]</code></li>
                </ol>
            </div>

            <div class="card" style="margin-top: 20px;">
                <h2>Quick Start Guide</h2>
                <ol>
                    <li>Create a new page in WordPress</li>
                    <li>Add a shortcode block or use the Classic Editor</li>
                    <li>Paste one of the shortcodes above</li>
                    <li>Publish and view your page</li>
                </ol>
                <p><strong>Note:</strong> For best results, use a full-width page template.</p>
            </div>
        </div>
        <?php
    }
}

// Initialize plugin
new CognitionBlocksPlatform();
