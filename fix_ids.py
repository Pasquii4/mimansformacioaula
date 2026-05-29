import re

html_file = '/home/pasqui/Github/anicuracampus/index.html'
with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

parts = content.split('<section id="tema-')
new_parts = [parts[0]]

count = 0

for part in parts[1:]:
    match = re.match(r'^(\d+)', part)
    if not match:
        new_parts.append('<section id="tema-' + part)
        continue
        
    tema_num = match.group(1)
    if tema_num == '7':
        new_parts.append('<section id="tema-' + part)
        continue
        
    # Replace id="u1" -> id="u1-tX"
    part, n1 = re.subn(r'id="u([1-9])"', rf'id="u\1-t{tema_num}"', part)
    part, n2 = re.subn(r'data-unit="u([1-9])"', rf'data-unit="u\1-t{tema_num}"', part)
    part, n3 = re.subn(r"id='u([1-9])'", rf"id='u\1-t{tema_num}'", part)
    part, n4 = re.subn(r"data-unit='u([1-9])'", rf"data-unit='u\1-t{tema_num}'", part)
    
    count += (n1 + n2 + n3 + n4)
    new_parts.append('<section id="tema-' + part)

print(f"Made {count} replacements.")

if count > 0:
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write("".join(new_parts))
