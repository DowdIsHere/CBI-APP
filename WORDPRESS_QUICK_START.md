# 🚀 WordPress Quick Start - Cognition Blocks

## ⚡ FASTEST Way to Deploy to WordPress

### Step 1: Download the Plugin ZIP
```
Location: /home/user/CBI-APP/website/wordpress-plugin/cognition-blocks.zip
Size: 34KB
```

**Or get it from GitHub:**
- Go to your repository
- Navigate to: `website/wordpress-plugin/`
- Download `cognition-blocks.zip`

---

### Step 2: Upload to WordPress (2 minutes)

1. **Log in to WordPress Admin**
   - Go to: `https://yoursite.com/wp-admin`

2. **Navigate to Plugins**
   - Click: **Plugins → Add New → Upload Plugin**

3. **Upload the ZIP**
   - Click **"Choose File"**
   - Select `cognition-blocks.zip`
   - Click **"Install Now"**

4. **Activate**
   - Click **"Activate Plugin"**

✅ **Done!** The plugin is now active.

---

### Step 3: Create Your Pages (5 minutes)

#### Create Homepage
1. **Pages → Add New**
2. **Title**: "Home" (or use existing)
3. **Add these shortcodes** (one per line):
   ```
   [cb_marketing_hero]

   [cb_three_pillars]

   [cb_assessment_preview]

   [cb_challenge_preview]

   [cb_contact_form]
   ```
4. **Publish**

#### Create Assessment Page
1. **Pages → Add New**
2. **Title**: "Assessment"
3. **Add shortcode**:
   ```
   [cb_assessment_full]
   ```
4. **Page Attributes → Template**: Select "Full Width" if available
5. **Publish**

#### Create Challenge Page
1. **Pages → Add New**
2. **Title**: "Challenge"
3. **Add shortcode**:
   ```
   [cb_challenge_full]
   ```
4. **Page Attributes → Template**: Select "Full Width" if available
5. **Publish**

---

### Step 4: Set Homepage (1 minute)

1. **Settings → Reading**
2. **Homepage displays**: Select "A static page"
3. **Homepage**: Select your "Home" page
4. **Save Changes**

---

## 🎉 You're Live!

Visit your website:
- **Homepage**: `https://yoursite.com`
- **Assessment**: `https://yoursite.com/assessment`
- **Challenge**: `https://yoursite.com/challenge`

---

## 📋 All Available Shortcodes

| Shortcode | What It Does | Best For |
|-----------|--------------|----------|
| `[cb_marketing_hero]` | Hero section with tagline & CTAs | Homepage top |
| `[cb_three_pillars]` | Gut-Brain-Mitochondria section | Homepage middle |
| `[cb_assessment_preview]` | Preview of assessment tool | Homepage |
| `[cb_challenge_preview]` | Preview of 30-day challenge | Homepage |
| `[cb_contact_form]` | Contact form | Homepage bottom or Contact page |
| `[cb_assessment_full]` | Complete 88-question assessment | Dedicated "Assessment" page |
| `[cb_challenge_full]` | Full 30-day challenge app | Dedicated "Challenge" page |

---

## 🎨 Pro Tips

### Tip 1: Use Full-Width Templates
For Assessment and Challenge pages:
- Edit Page → Page Attributes → Template
- Select: "Full Width" or "No Sidebar"
- This gives the apps maximum space

### Tip 2: Works with Page Builders
Compatible with:
- ✅ **Elementor**: Add "Shortcode" widget
- ✅ **Divi**: Add "Shortcode" module
- ✅ **Gutenberg**: Add "Shortcode" block
- ✅ **Classic Editor**: Just paste the shortcode

### Tip 3: Hide Header/Footer on App Pages
For an app-like experience on Assessment/Challenge pages:

**Appearance → Customize → Additional CSS**
```css
/* Hide header on assessment page */
.page-id-XXX .site-header {
    display: none;
}

/* Hide footer on assessment page */
.page-id-XXX .site-footer {
    display: none;
}

/* Replace XXX with your page ID */
/* Find it in Pages list - hover over page title */
```

---

## 🔧 Troubleshooting

### Styles Not Loading?
1. **Deactivate** caching plugins temporarily
2. **Clear** WordPress cache
3. **Hard refresh** browser: `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)

### Shortcode Shows as Text?
- Make sure plugin is **activated**
- Use **Shortcode block** in Gutenberg (not Code block)
- Check for typos in shortcode name

### JavaScript Not Working?
1. Open browser console: `F12`
2. Check for errors
3. Try disabling conflicting plugins
4. Make sure jQuery is enabled

---

## 📦 File Locations in Your Repository

```
/home/user/CBI-APP/
└── website/
    └── wordpress-plugin/
        ├── cognition-blocks.zip          ← UPLOAD THIS TO WORDPRESS
        ├── README.md                     ← Full documentation
        ├── build-plugin.sh               ← Rebuild script (if you edit files)
        └── cognition-blocks/             ← Plugin source (don't upload this, use ZIP)
```

---

## 🔄 Updating the Plugin

If you make changes to the website files:

```bash
# From your computer terminal:
cd /home/user/CBI-APP/website/wordpress-plugin
./build-plugin.sh

# This creates a new cognition-blocks.zip
# Re-upload to WordPress (it will overwrite)
```

---

## 📞 Support Resources

**Documentation**:
- Full Guide: `/website/wordpress-plugin/README.md`
- Deployment Options: `/docs/WORDPRESS_DEPLOYMENT.md`
- Main Docs: `/website/README.md`

**Common Questions**:

**Q: Can I customize the colors?**
A: Yes! Go to: Appearance → Customize → Additional CSS

**Q: Can I edit the text?**
A: Not directly via WordPress admin. You'd need to edit the template files in the plugin folder.

**Q: Does it work with my theme?**
A: Yes! It's designed to work with any WordPress theme.

**Q: Can I use it with Elementor/Divi?**
A: Absolutely! Just add the shortcodes using their shortcode widgets.

---

## ✅ Deployment Checklist

Before going live:

- [ ] Plugin uploaded and activated
- [ ] Home page created with shortcodes
- [ ] Assessment page created (full-width template)
- [ ] Challenge page created (full-width template)
- [ ] Homepage set in Settings → Reading
- [ ] Tested all pages on desktop
- [ ] Tested all pages on mobile
- [ ] Forms are working
- [ ] Links are correct
- [ ] SSL certificate active (HTTPS)
- [ ] Cache plugins configured
- [ ] SEO settings configured

---

## 🎯 What You Get

✅ **Professional marketing site**
✅ **88-question assessment tool**
✅ **30-day challenge application**
✅ **Shopping lists**
✅ **Progress tracking**
✅ **All features from the web apps**

All bundled in one **34KB plugin** that installs in **2 minutes**!

---

**Ready to go live? Just upload `cognition-blocks.zip` and you're done! 🚀**
