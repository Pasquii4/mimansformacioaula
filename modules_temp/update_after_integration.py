#!/usr/bin/env python3
"""
Update app.js to remove devModules entries for modules that now have static HTML.
Also update the sidebar badges to remove 'badge-dev' from completed modules.
"""

import re

# ============================================================
# 1. Update app.js - remove all devModules entries
# ============================================================
APP_JS = "/home/pasqui/Github/anicuracampus/js/app.js"

with open(APP_JS, 'r', encoding='utf-8') as f:
    js_content = f.read()

# Replace the entire devModules array with an empty one
# The modules are now static HTML, so no dynamic generation needed
old_dev_modules = re.search(
    r'const devModules = \[.*?\];',
    js_content,
    re.DOTALL
)

if old_dev_modules:
    print(f"Found devModules array at {old_dev_modules.start()}-{old_dev_modules.end()}")
    new_dev_modules = "const devModules = []; // All modules now have static HTML"
    js_content = js_content[:old_dev_modules.start()] + new_dev_modules + js_content[old_dev_modules.end():]
    print("Replaced devModules with empty array")
else:
    print("WARNING: Could not find devModules array")

with open(APP_JS, 'w', encoding='utf-8') as f:
    f.write(js_content)

print("app.js updated!")

# ============================================================
# 2. Update index.html sidebar - remove badge-dev from completed modules
# ============================================================
HTML_FILE = "/home/pasqui/Github/anicuracampus/index.html"

with open(HTML_FILE, 'r', encoding='utf-8') as f:
    html_content = f.read()

# Remove badge-dev spans from all sidebar module buttons except "Próximamente" placeholder
# Pattern: <span class="badge badge-dev">Próximamente</span>
# We want to remove these from all tema-* buttons (since all will be complete)
modules_to_complete = [
    'tema-1', 'tema-2', 'tema-3', 'tema-4', 'tema-5', 'tema-6',
    'tema-8', 'tema-9', 'tema-10', 'tema-11', 'tema-12', 'tema-13',
    'tema-14', 'tema-15', 'tema-16', 'tema-17', 'tema-18', 'tema-19'
]

# Find and update each sidebar button
for module_id in modules_to_complete:
    # Pattern to find module button with badge-dev
    pattern = rf'(<button[^>]*data-panel="{module_id}"[^>]*>.*?)<span class="badge badge-dev">Próximamente</span>(.*?</button>)'
    replacement = r'\1\2'
    
    new_html = re.sub(pattern, replacement, html_content, flags=re.DOTALL)
    if new_html != html_content:
        print(f"Removed badge-dev from {module_id} sidebar button")
    else:
        print(f"WARNING: Could not find badge-dev in {module_id} sidebar button")
    html_content = new_html

# Update module cards in the home grid from inactive to live
# For each completed module, update its card
for module_id in modules_to_complete:
    # Find inactive module cards and update them to be clickable
    # Pattern: <article class="module-card inactive"><span class="pill pill-dev">Próximamente</span><h4>X. Title</h4>
    # Update to add data-jump button
    pass  # This is done separately in the template

with open(HTML_FILE, 'w', encoding='utf-8') as f:
    f.write(html_content)

print("index.html sidebar updated!")
print("Done!")
