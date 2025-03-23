// Constants for limits
const CHAR_LIMIT = 100000;
const LINE_LIMIT = 5000;

function sanitizeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function sanitizeArrayName(name) {
    // Remove any characters that aren't letters, numbers, or underscores
    return name.replace(/[^a-zA-Z0-9_]/g, '')
        // Ensure it doesn't start with a number
        .replace(/^(\d)/, '_$1');
    // Removed the '|| array' to allow empty values during input
}

function getArrayDeclaration(language, arrayName, arrayContent) {
    // Use default 'array' if the provided name is empty
    const safeArrayName = arrayName || 'array';
    
    switch(language) {
        case 'JavaScript':
            return `var ${safeArrayName} = [${arrayContent}];`;
        case 'Python':
            return `${safeArrayName} = [${arrayContent}]`;
        case 'PHP':
            return `$${safeArrayName} = [${arrayContent}];`;
        case 'Perl':
            return `@${safeArrayName} = (${arrayContent});`;
        case 'PowerShell':
            return `$${safeArrayName} = @(${arrayContent})`;
        case 'Raw':
            return arrayContent;
        default:
            return `${safeArrayName} = [${arrayContent}]`;
    }
}

function convertArray() {
    const input = document.getElementById("inputText").value;
    const quoteStyle = document.getElementById("quoteStyle").value === "double" ? '"' : "'";
    const quoteNumbers = document.getElementById("quoteNumbers").checked;
    let arrayName = sanitizeArrayName(document.getElementById("arrayName").value);
    // arrayName can now be empty, but it will be handled in getArrayDeclaration

    if (!input.trim()) {
        alert("Please enter some text.");
        return;
    }

    // Additional safety check for processing time
    const lineCount = (input.match(/\n/g) || []).length + 1;
    if (lineCount > 5000) {
        if (!confirm(`You are about to process ${lineCount.toLocaleString()} lines. This might take a while. Continue?`)) {
            return;
        }
    }

    // Sanitize and validate input
    const lines = input
        .split("\n")
        .map(line => line.trim())
        .filter(line => line !== "")
        .map(line => sanitizeHtml(line));

    const array = lines.map(item => {
        const isNumber = !isNaN(item) && item !== '';
        if (isNumber && !quoteNumbers) {
            return item;
        } else {
            return `${quoteStyle}${item}${quoteStyle}`;
        }
    });

    const arrayContent = array.join(", ");
    
    const outputs = {
        'JavaScript': getArrayDeclaration('JavaScript', arrayName, arrayContent),
        'Python': getArrayDeclaration('Python', arrayName, arrayContent),
        'PHP': getArrayDeclaration('PHP', arrayName, arrayContent),
        'Perl': getArrayDeclaration('Perl', arrayName, arrayContent),
        'PowerShell': getArrayDeclaration('PowerShell', arrayName, arrayContent),
        'Raw': getArrayDeclaration('Raw', arrayName, arrayContent)
    };

    const container = document.getElementById("outputContainer");
    // Clear container safely
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    Object.entries(outputs).forEach(([language, code]) => {
        // Create elements safely using DOM methods
        const card = document.createElement('div');
        card.className = 'output-card';
        
        const header = document.createElement('div');
        header.className = 'output-header';
        
        const title = document.createElement('h3');
        title.className = 'output-title';
        title.textContent = language;
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.textContent = 'Copy';
        copyBtn.addEventListener('click', () => copyToClipboard(language));
        
        const content = document.createElement('div');
        content.className = 'output-content';
        content.id = `output-${language}`;
        content.textContent = code;
        
        header.appendChild(title);
        header.appendChild(copyBtn);
        card.appendChild(header);
        card.appendChild(content);
        container.appendChild(card);
    });
}

async function copyToClipboard(language) {
    try {
        const content = document.getElementById(`output-${language}`).textContent;
        await navigator.clipboard.writeText(content);
        showCopySuccess();
    } catch (err) {
        console.error('Failed to copy:', err);
    }
}

function showCopySuccess() {
    const message = document.getElementById('copySuccess');
    message.style.display = 'block';
    setTimeout(() => {
        message.style.display = 'none';
    }, 2000);
}

function clearAll() {
    const input = document.getElementById("inputText");
    const container = document.getElementById("outputContainer");
    const arrayNameInput = document.getElementById("arrayName");
    
    if (input) {
        input.value = getDefaultPlaceholder();
    }
    
    if (arrayNameInput) {
        arrayNameInput.value = 'array';
    }
    
    // Clear container safely
    while (container && container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

function getDefaultPlaceholder() {
    return `Enter your values (one per line)
Limits:
- Maximum ${(CHAR_LIMIT).toLocaleString()} characters
- Maximum ${LINE_LIMIT.toLocaleString()} lines`;
}

function updateInputInfo() {
    const input = document.getElementById("inputText");
    const charCount = input.value.length;
    const lineCount = (input.value.match(/\n/g) || []).length + 1;
    
    // Update textarea with current counts
    const infoText = `Current:
- ${charCount.toLocaleString()}/${CHAR_LIMIT.toLocaleString()} characters
- ${lineCount.toLocaleString()}/${LINE_LIMIT.toLocaleString()} lines`;
    
    const infoElement = document.getElementById("inputInfo");
    if (infoElement) {
        infoElement.textContent = infoText;
    }
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById("inputText");
    
    if (inputText) {
        // Set initial placeholder
        inputText.value = getDefaultPlaceholder();
        
        // Create info element
        const infoDiv = document.createElement('div');
        infoDiv.id = 'inputInfo';
        infoDiv.style.color = '#666';
        infoDiv.style.fontSize = '12px';
        infoDiv.style.marginTop = '5px';
        inputText.parentNode.insertBefore(infoDiv, inputText.nextSibling);
        
        // Add input event listener
        inputText.addEventListener('input', function() {
            // Check total character length
            if (this.value.length > CHAR_LIMIT) {
                this.value = this.value.slice(0, CHAR_LIMIT);
                alert(`Input limited to ${CHAR_LIMIT.toLocaleString()} characters`);
            }
            
            // Check number of lines
            const lineCount = (this.value.match(/\n/g) || []).length + 1;
            if (lineCount > LINE_LIMIT) {
                // Keep only the first LINE_LIMIT lines
                const lines = this.value.split('\n');
                this.value = lines.slice(0, LINE_LIMIT).join('\n');
                alert(`Input limited to ${LINE_LIMIT.toLocaleString()} lines`);
            }
            
            updateInputInfo();
        });

        // On focus, if the content is the default, clear it
        inputText.addEventListener('focus', function() {
            if (this.value === getDefaultPlaceholder()) {
                this.value = '';
                updateInputInfo();
            }
        });

        // On blur, if the content is empty, restore the default
        inputText.addEventListener('blur', function() {
            if (!this.value.trim()) {
                this.value = getDefaultPlaceholder();
                updateInputInfo();
            }
        });

        // Initialize input info
        updateInputInfo();
    }

    // Add array name input validation
    const arrayNameInput = document.getElementById("arrayName");
    if (arrayNameInput) {
        arrayNameInput.addEventListener('input', function() {
            // Allow empty values and only sanitize non-empty values
            if (this.value) {
                this.value = sanitizeArrayName(this.value);
            }
        });
    }
});
