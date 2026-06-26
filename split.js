const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');
const content = fs.readFileSync(filePath, 'utf8');

// 1. Extract CSS
const styleStart = content.indexOf('<style>');
const styleEnd = content.indexOf('</style>') + '</style>'.length;
const styleContent = content.substring(styleStart + '<style>'.length, styleEnd - '</style>'.length).trim();
fs.writeFileSync(path.join(__dirname, 'style.css'), styleContent, 'utf8');

// 2. Extract Script
const scriptStart = content.indexOf('<script>');
const scriptEnd = content.lastIndexOf('</script>') + '</script>'.length;
const scriptContent = content.substring(scriptStart + '<script>'.length, scriptEnd - '</script>'.length).trim();

// 3. Extract CONFIG from scriptContent
const configStart = scriptContent.indexOf('const CONFIG = {');
const configEndMarker = '/* ════════════════════ END EDIT-ME ZONE ════════════════════ */';
const configEnd = scriptContent.indexOf(configEndMarker) + configEndMarker.length;

let configContent = scriptContent.substring(configStart, configEnd);

// Find the upsellItems and CONFIG.items.push inside scriptContent
const upsellStart = scriptContent.indexOf('const upsellItems = [');
const upsellEnd = scriptContent.indexOf('CONFIG.items.push(...upsellItems);') + 'CONFIG.items.push(...upsellItems);'.length;
const upsellBlock = scriptContent.substring(upsellStart, upsellEnd);

// Create the new config.js content
configContent = configContent + '\n\n' + upsellBlock + '\n\n' + 
`// NEW UPSELL MAPPING CONFIGURATION
CONFIG.upsellMap = {
  starters: ['u3'],
  tandoor: ['u1', 'u3'],
  mains: ['u1', 'u2'],
  biryani: ['u1', 'u2'],
  breads: ['u1'],
  desserts: [],
  drinks: [],
  default: ['u1']
};`;

fs.writeFileSync(path.join(__dirname, 'config.js'), configContent, 'utf8');

// 4. Create the remaining script.js
let remainingScript = scriptContent.substring(0, configStart) + scriptContent.substring(configEnd);
remainingScript = remainingScript.replace(upsellBlock, '');
fs.writeFileSync(path.join(__dirname, 'script.js'), remainingScript.trim(), 'utf8');

// 5. Update index.html
const headEnd = content.indexOf('</head>');
const newHead = content.substring(0, styleStart) + '<link rel="stylesheet" href="style.css">\n' + content.substring(styleEnd, headEnd) + '</head>';

const bodyEnd = content.indexOf('</body>');
const newBody = content.substring(headEnd + '</head>'.length, scriptStart) + 
  '<script src="config.js"></script>\n<script src="script.js"></script>\n' + 
  content.substring(scriptEnd);

fs.writeFileSync(filePath, newHead + newBody, 'utf8');
console.log('Split successful');
