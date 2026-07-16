<?php
// Load and display the complete 30-day challenge HTML
$challenge_html_path = plugin_dir_path(__DIR__) . 'assets/webapp/30-day-challenge.html';
$plugin_url = plugin_dir_url(__DIR__);

if (file_exists($challenge_html_path)) {
    $html = file_get_contents($challenge_html_path);
    // Replace the relative script src with absolute plugin URL
    $html = str_replace('src="30-day-challenge.js"', 'src="' . $plugin_url . 'assets/webapp/30-day-challenge.js"', $html);
    echo $html;
} else {
    echo '<p>30-Day Challenge not found. Please ensure the plugin is properly installed.</p>';
}
?>
