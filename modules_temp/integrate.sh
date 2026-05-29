#!/bin/bash
# Integration script for AniCura Campus modules
# This script inserts all module HTML files into index.html

set -e

HTML_FILE="/home/pasqui/Github/anicuracampus/index.html"
MODULES_DIR="/home/pasqui/Github/anicuracampus/modules_temp"
BACKUP_FILE="/home/pasqui/Github/anicuracampus/index.html.bak"

# Check all module files exist
EXPECTED_MODULES="tema-1 tema-2 tema-3 tema-4 tema-5 tema-6 tema-8 tema-9 tema-10 tema-11 tema-12 tema-13 tema-14 tema-15 tema-16 tema-17 tema-18 tema-19"
MISSING=0
for mod in $EXPECTED_MODULES; do
  if [ ! -f "$MODULES_DIR/$mod.html" ]; then
    echo "MISSING: $MODULES_DIR/$mod.html"
    MISSING=$((MISSING+1))
  else
    SIZE=$(wc -c < "$MODULES_DIR/$mod.html")
    echo "OK: $mod.html ($SIZE bytes)"
  fi
done

if [ $MISSING -gt 0 ]; then
  echo "ERROR: $MISSING module files missing. Aborting."
  exit 1
fi

echo ""
echo "All modules present. Starting integration..."

# Backup original
cp "$HTML_FILE" "$BACKUP_FILE"
echo "Backup saved to $BACKUP_FILE"

# The integration point is just before </main>
# We need to:
# 1. Remove the existing tema-2 section (lines 223-290)
# 2. Add all new module sections before </main>

# Step 1: Create combined modules file
COMBINED="$MODULES_DIR/combined_modules.html"
echo "" > "$COMBINED"

for mod in $EXPECTED_MODULES; do
  echo "<!-- ===== $mod ===== -->" >> "$COMBINED"
  cat "$MODULES_DIR/$mod.html" >> "$COMBINED"
  echo "" >> "$COMBINED"
done

echo "Combined modules file: $(wc -c < $COMBINED) bytes"

# Step 2: Remove old tema-2 section and insert all modules before </main>
# Use Python for reliable HTML manipulation
python3 << 'PYTHON'
import re

html_file = "/home/pasqui/Github/anicuracampus/index.html"
combined_file = "/home/pasqui/Github/anicuracampus/modules_temp/combined_modules.html"

with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

with open(combined_file, 'r', encoding='utf-8') as f:
    modules_html = f.read()

# 1. Remove the existing tema-2 section
# Find <section id="tema-2" and its closing </section>
pattern = r'<section id="tema-2" class="content-panel hide".*?</section>\s*\n\s*\n'
match = re.search(pattern, content, re.DOTALL)
if match:
    print(f"Found existing tema-2 section at positions {match.start()}-{match.end()}")
    content = content[:match.start()] + content[match.end():]
    print("Removed existing tema-2 section")
else:
    print("WARNING: Could not find existing tema-2 section to remove")

# 2. Insert all modules before the closing </main>
# Find the marker just before </main>
insertion_marker = '</main>'
insertion_pos = content.rfind(insertion_marker)
if insertion_pos == -1:
    print("ERROR: Could not find </main> tag")
    exit(1)

print(f"Found </main> at position {insertion_pos}")

# Insert the modules HTML
new_content = (
    content[:insertion_pos] +
    '\n      <!-- ===== MÓDULOS GENERADOS ===== -->\n' +
    modules_html +
    '\n' +
    content[insertion_pos:]
)

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(new_content)

print(f"Done! New index.html size: {len(new_content)} bytes")
print("Integration complete!")
PYTHON
