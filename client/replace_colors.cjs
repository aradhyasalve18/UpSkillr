const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');

const replacements = [
  { regex: /bg-canvas-raised/g, replace: 'bg-surface' },
  { regex: /bg-canvas-sunken/g, replace: 'bg-canvas' },
  { regex: /text-ink-faint/g, replace: 'text-ink-soft' },
  { regex: /border-ink\/10/g, replace: 'border-border-subtle' },
  { regex: /border-ink\/15/g, replace: 'border-border-subtle' },
  { regex: /border-ink\/20/g, replace: 'border-border-subtle' },
  { regex: /indigo-50/g, replace: 'brand-50' }, 
  { regex: /indigo-600/g, replace: 'brand-500' },
  { regex: /indigo-700/g, replace: 'brand-900' },
  { regex: /indigo-/g, replace: 'brand-' },
  { regex: /marigold-50/g, replace: 'canvas' },
  { regex: /marigold-400/g, replace: 'brand-500' },
  { regex: /marigold-600/g, replace: 'ink-soft' },
  { regex: /marigold-/g, replace: 'brand-' },
  { regex: /moss-500/g, replace: 'success' },
  { regex: /moss-600/g, replace: 'success' },
  { regex: /moss-/g, replace: 'success-' },
  { regex: /clay-400/g, replace: 'error' },
  { regex: /clay-500/g, replace: 'error' },
  { regex: /clay-/g, replace: 'error-' },
  { regex: /shadow-raised/g, replace: 'shadow-card' },
  { regex: /rounded-xl/g, replace: 'rounded-md' },
  { regex: /rounded-2xl/g, replace: 'rounded-md' },
  { regex: /backdrop-blur-md/g, replace: '' },
  { regex: /backdrop-blur-sm/g, replace: '' }
];

function walk(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = content;
      for (const r of replacements) {
        modified = modified.replace(r.regex, r.replace);
      }
      // Replace rounded-lg to rounded
      modified = modified.replace(/rounded-lg/g, 'rounded');
      
      if (modified !== content) {
        fs.writeFileSync(fullPath, modified);
        console.log('Updated', fullPath);
      }
    }
  }
}

walk(dir);
