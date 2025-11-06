# Cognition Blocks WordPress Plugin

## 📦 Easy WordPress Installation

This plugin allows you to add the Cognition Blocks platform to any WordPress site with shortcodes.

---

## 🚀 Installation Steps

### Method 1: Upload via WordPress Admin (EASIEST)

1. **Create ZIP file** of the `cognition-blocks` folder:
   ```bash
   cd website/wordpress-plugin
   zip -r cognition-blocks.zip cognition-blocks/
   ```

2. **Upload to WordPress**:
   - Go to: **WordPress Admin → Plugins → Add New → Upload Plugin**
   - Click **"Choose File"** and select `cognition-blocks.zip`
   - Click **"Install Now"**
   - Click **"Activate Plugin"**

3. **Done!** You'll see "Cognition Blocks" in your WordPress admin menu

---

### Method 2: FTP/SFTP Upload

1. **Upload the entire `cognition-blocks` folder** to:
   ```
   wp-content/plugins/cognition-blocks/
   ```

2. **Activate**:
   - Go to: **WordPress Admin → Plugins**
   - Find "Cognition Blocks Platform"
   - Click **"Activate"**

---

## 📝 How to Use Shortcodes

### Step 1: Create Pages

Create these pages in WordPress:
- **Home** (or use existing homepage)
- **Assessment**
- **Challenge**

### Step 2: Add Shortcodes

Edit each page and add the shortcodes:

#### **Home Page:**
```
[cb_marketing_hero]
[cb_three_pillars]
[cb_assessment_preview]
[cb_challenge_preview]
[cb_contact_form]
```

#### **Assessment Page:**
```
[cb_assessment_full]
```

#### **Challenge Page:**
```
[cb_challenge_full]
```

### Step 3: Publish!

Save and publish your pages. That's it!

---

## 🎨 Available Shortcodes

| Shortcode | Description | Best For |
|-----------|-------------|----------|
| `[cb_marketing_hero]` | Hero section with tagline and CTA buttons | Homepage top |
| `[cb_three_pillars]` | Gut-Brain-Mitochondria section | Homepage |
| `[cb_assessment_preview]` | Preview of assessment tool | Homepage |
| `[cb_challenge_preview]` | Preview of 30-day challenge | Homepage |
| `[cb_contact_form]` | Contact form | Homepage/Contact page |
| `[cb_assessment_full]` | Full 88-question assessment | Dedicated page |
| `[cb_challenge_full]` | Full 30-day challenge app | Dedicated page |

---

## 🛠️ Setup Before Creating ZIP

**IMPORTANT**: Before zipping, you need to copy the assets!

```bash
# From the CBI-APP directory:
cd website/wordpress-plugin/cognition-blocks

# Create assets directory
mkdir -p assets/marketing assets/webapp

# Copy marketing files
cp ../../marketing/styles.css assets/marketing/
cp ../../marketing/script.js assets/marketing/

# Copy webapp files
cp ../../webapp/assessment.css assets/webapp/
cp ../../webapp/assessment.js assets/webapp/
cp ../../webapp/challenge.css assets/webapp/
cp ../../webapp/challenge.js assets/webapp/

# Create templates directory
mkdir -p templates

# Now create ZIP
cd ../
zip -r cognition-blocks.zip cognition-blocks/
```

**Then upload `cognition-blocks.zip` to WordPress!**

---

## 📋 Page Template Recommendations

For best appearance, use these page settings:

1. **Edit Page → Page Attributes → Template**
2. Select: **"Full Width"** or **"No Sidebar"**
3. This gives your content maximum space

---

## 🎯 Pro Tips

### Tip 1: Use with Page Builders
Works great with:
- ✅ Elementor (add shortcode widget)
- ✅ Divi (add shortcode module)
- ✅ Gutenberg (add shortcode block)
- ✅ Classic Editor (paste directly)

### Tip 2: Full-Width Layout
For assessment and challenge pages:
- Use full-width page template
- Remove header/footer if possible
- This creates an "app-like" experience

### Tip 3: Custom CSS
Add custom CSS in:
- **WordPress Admin → Appearance → Customize → Additional CSS**

Example:
```css
/* Hide default navigation on app pages */
.page-id-123 .site-header {
    display: none;
}
```

---

## 🔧 Troubleshooting

### Styles not loading?
1. Clear WordPress cache (if using cache plugin)
2. Hard refresh browser (Ctrl + F5)
3. Check that plugin is activated
4. Verify files in: `wp-content/plugins/cognition-blocks/assets/`

### Shortcode shows as text?
- Make sure plugin is **activated**
- Use shortcode block in Gutenberg (not code block)
- Check for typos in shortcode name

### JavaScript not working?
1. Open browser console (F12)
2. Check for errors
3. Make sure no conflicting plugins
4. Try disabling other JS plugins temporarily

---

## 📞 Need Help?

Check the main documentation:
- `/website/README.md` - Full documentation
- `/docs/WORDPRESS_DEPLOYMENT.md` - Deployment guide

---

## 🔄 Updating the Plugin

When you make changes to your files:

1. Update the files in `assets/` folder
2. Bump version number in `cognition-blocks.php`
3. Re-upload to WordPress (it will overwrite)

Or use FTP to replace files directly.

---

## ✅ Installation Checklist

- [ ] Created `cognition-blocks.zip` file
- [ ] Uploaded to WordPress via Admin or FTP
- [ ] Plugin activated
- [ ] Created Home/Assessment/Challenge pages
- [ ] Added shortcodes to pages
- [ ] Set pages to full-width template
- [ ] Tested all pages
- [ ] Checked mobile responsiveness

---

**Your Cognition Blocks platform is ready to go! 🚀**
