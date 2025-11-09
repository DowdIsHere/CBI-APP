<?php
// Enqueue the challenge CSS and JS inline for standalone functionality
$plugin_url = plugin_dir_url(__DIR__);
?>
<link rel="stylesheet" href="<?php echo $plugin_url; ?>assets/webapp/challenge.css">
<?php
// Read and output the challenge HTML
$challenge_html = file_get_contents(plugin_dir_path(__DIR__) . 'assets/webapp/challenge.html');
// Extract body content (everything between <body> and </body>)
preg_match('/<body[^>]*>(.*?)<\/body>/is', $challenge_html, $matches);
if (isset($matches[1])) {
    echo $matches[1];
}
?>
<script src="<?php echo $plugin_url; ?>assets/webapp/challenge.js"></script>
