<?php
// Load and display the complete assessment HTML
$assessment_html_path = plugin_dir_path(__DIR__) . 'assets/webapp/cb-assessment.html';
$plugin_url = plugin_dir_url(__DIR__);

if (file_exists($assessment_html_path)) {
    $html = file_get_contents($assessment_html_path);
    // Replace the relative script src with absolute plugin URL
    $html = str_replace('src="cb-assessment.js"', 'src="' . $plugin_url . 'assets/webapp/cb-assessment.js"', $html);
    echo $html;
} else {
    echo '<p>Assessment not found. Please ensure the plugin is properly installed.</p>';
}
?>
