const input = document.getElementById('input');
const output = document.getElementById('output');
const lineNumbers = document.getElementById('line-numbers');
const earningsDisplay = document.getElementById('earnings-display');
const autoCodersDisplay = document.getElementById('auto-coders-display');
const shopButton = document.getElementById('shop');
const settingsButton = document.getElementById('settings');
const menu = document.getElementById('menu');
const settingsMenu = document.getElementById('settings-menu');
const buyAutoCoderButton = document.getElementById('buy-auto-coder');
const autoCodersCount = document.getElementById('auto-coders-count');
const buyColorChangeButton = document.getElementById('buy-color-change');
const buyRainbowTextButton = document.getElementById('buy-rainbow-text');
const colorMenu = document.getElementById('color-menu');
const textColorPicker = document.getElementById('text-color-picker');
const applyColorsButton = document.getElementById('apply-colors');
const resetGameButton = document.getElementById('reset-game');
let earnings = 0;
let autoCoderCount = 0;
let colorChangePurchased = false; // Add a flag for color change purchase

// Load progress from local storage
loadProgress();

// Dictionary for converting characters to code
const charMap = {
    'a': 'let',
    'b': 'const',
    'c': 'function',
    'd': 'spercalifragilisticexpialidocious',
    'e': 'var',
    'f': 'if',
    'g': 'else',
    'h': 'for',
    'i': 'while',
    'j': 'return',
    'k': 'import',
    'l': 'def',
    'm': 'print',
    'n': 'True',
    'o': 'False',
    'p': 'None',
    'q': 'class',
    'r': 'self',
    's': 'from',
    't': 'import',
    'u': 'global',
    'v': 'nonlocal',
    'w': 'async',
    'x': 'await',
    'y': 'with',
    'z': 'yield'
};

// Handle input event
input.addEventListener('input', (event) => {
    const value = event.target.value;
    let translatedText = '';

    for (let char of value) {
        if (charMap[char]) {
            translatedText += charMap[char] + ' ';
        } else {
            translatedText += char + ' ';
        }
    }

    const lines = translatedText.split('\n');
    const maxLineLength = 50;
    const formattedText = lines.map(line => {
        if (line.length > maxLineLength) {
            const chunks = line.match(new RegExp(`.{1,${maxLineLength}}`, 'g'));
            return chunks.join('\n');
        }
        return line;
    }).join('\n');

    output.textContent = formattedText.trim();
    updateLineNumbers();
    syncScroll();

    // Update earnings
    earnings += 10;
    updateEarningsDisplay();
    saveProgress(); // Save progress to local storage
});

function syncScroll() {
    output.scrollTop = input.scrollTop;
    lineNumbers.scrollTop = input.scrollTop;
}

function updateLineNumbers() {
    const lines = output.textContent.split('\n').length;
    lineNumbers.innerHTML = '';
    for (let i = 1; i <= lines; i++) {
        const lineNumber = document.createElement('div');
        lineNumber.textContent = i;
        lineNumbers.appendChild(lineNumber);
    }
}

// Function to add earnings from auto coders
function startAutoCoders() {
    setInterval(() => {
        earnings += autoCoderCount * 10;
        updateEarningsDisplay();
        saveProgress(); // Save progress to local storage
    }, 1000);
}

// Initialize on window load
window.onload = function() {
    input.focus();
    updateLineNumbers();
    syncScroll();
    updateEarningsDisplay();
    startAutoCoders(); // Start auto coders
};

function updateEarningsDisplay() {
    earningsDisplay.textContent = `Earnings: $${earnings}`;
    autoCodersDisplay.textContent = `Auto Coders: ${autoCoderCount}`;
    document.title = `Earnings: $${earnings} - Code Typing Simulator`;
    autoCodersCount.textContent = `Auto Coders: ${autoCoderCount}`;
}

// Handle shop button click
shopButton.addEventListener('click', () => {
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
});

// Handle settings button click
settingsButton.addEventListener('click', () => {
    settingsMenu.style.display = settingsMenu.style.display === 'none' ? 'block' : 'none';
});

// Handle buy auto coder button click
buyAutoCoderButton.addEventListener('click', () => {
    if (earnings >= 100) {
        earnings -= 100;
        updateEarningsDisplay();
        displayPopup('Auto Coder purchased!');
        autoCoderCount++;
        updateEarningsDisplay();
        saveProgress(); // Save progress to local storage
    } else {
        displayPopup('Not enough money to purchase Auto Coder.');
    }
});

// Handle buy color change button click
buyColorChangeButton.addEventListener('click', () => {
    if (earnings >= 1500) {
        earnings -= 1500;
        updateEarningsDisplay();
        displayPopup('You have purchased Color Change for $1,500!');
        colorChangePurchased = true; // Update the flag
        colorMenu.style.display = 'block';
        saveProgress(); // Save progress to local storage
    } else {
        displayPopup('Not enough money to purchase Color Change.');
    }
});

// Handle buy animated rainbow highlights button click
buyRainbowTextButton.addEventListener('click', () => {
    if (earnings >= 1000000) {
        earnings -= 1000000;
        updateEarningsDisplay();
        document.body.classList.add('rainbow-text');
        updateEarningsDisplay();
        displayPopup('Animated Rainbow Highlights applied!');
        saveProgress(); // Save progress to local storage
        location.reload(); // Refresh the page to apply changes
    } else {
        displayPopup('Not enough money to purchase Animated Rainbow Highlights.');
    }
});
// Only allow color changes if the upgrade has been purchased
applyColorsButton.addEventListener('click', () => {
    if (colorChangePurchased) {
        const textColor = textColorPicker.value;
        updateTextColor(textColor);
        colorMenu.style.display = 'none';
        colorChangePurchased = false; // Reset the flag for next purchase
        displayPopup('Colors applied successfully!');
        saveProgress(); // Save progress to local storage
        location.reload(); // Refresh the page to apply changes
    } else {
        displayPopup('You need to purchase the color change upgrade first!');
    }
});

function updateTextColor(color) {
    document.querySelectorAll('*').forEach(el => {
        if (window.getComputedStyle(el).color === 'rgb(0, 255, 0)' || window.getComputedStyle(el).borderColor === 'rgb(0, 255, 0)') {
            el.style.color = color;
            el.style.borderColor = color;
        }
    });

    // Update scrollbar styles
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
        ::-webkit-scrollbar-thumb {
            background: ${color};
        }
        button:hover {
            background-color: ${shadeColor(color, 20)};
        }
        #popup {
            color: ${color};
            border-color: ${color};
        }
    `;
    document.head.appendChild(styleEl);
}

// Function to shade a color
function shadeColor(color, percent) {
    const f = parseInt(color.slice(1), 16),
          t = percent < 0 ? 0 : 255,
          p = percent < 0 ? percent * -1 : percent,
          R = f >> 16,
          G = f >> 8 & 0x00FF,
          B = f & 0x0000FF;
    return `#${(0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1)}`;
}

// Handle reset game button click
resetGameButton.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
});

function displayPopup(message) {
    const popup = document.createElement('div');
    popup.id = 'popup';
    popup.textContent = message;
    document.body.appendChild(popup);
    popup.style.display = 'block';
    setTimeout(() => {
        popup.style.display = 'none';
        document.body.removeChild(popup);
    }, 2000);
}

function saveProgress() {
    const progress = {
        earnings,
        autoCoderCount,
        textColor: document.body.style.color,
        rainbowText: document.body.classList.contains('rainbow-text')
    };
    localStorage.setItem('progress', JSON.stringify(progress));
}

function loadProgress() {
    const progress = JSON.parse(localStorage.getItem('progress'));
    if (progress) {
        earnings = progress.earnings;
        autoCoderCount = progress.autoCoderCount;
        updateTextColor(progress.textColor);
        if (progress.rainbowText) {
            document.body.classList.add('rainbow-text');
        }
        updateEarningsDisplay();
        startAutoCoders(); // Start auto coders after loading progress
    }
}
