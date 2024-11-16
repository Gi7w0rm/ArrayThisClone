function sanitizeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function convertArray() {
    const input = document.getElementById("inputText").value;
    const quoteStyle = document.getElementById("quoteStyle").value === "double" ? '"' : "'";
    const quoteNumbers = document.getElementById("quoteNumbers").checked;

    if (!input.trim()) {
        alert("Please enter some text.");
        return;
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

    const outputs = {
        'JavaScript': `var array = [${array.join(", ")}];`,
        'Python': `list_name = [${array.join(", ")}]`,
        'PHP': `$array = [${array.join(", ")}];`,
        'Perl': `@array = (${array.join(", ")});`,
        'Raw': array.join(", ")
    };

    const container = document.getElementById("outputContainer");
    // Clear container safely
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    Object.entries(outputs).forEach(([language, code]) => {
        // Create elements safely using DOM methods instead of innerHTML
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
        // Use a closure to safely pass the language parameter
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
    
    if (input) input.value = "";
    
    // Clear container safely
    while (container && container.firstChild) {
        container.removeChild(container.firstChild);
    }
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Limit input size to prevent DoS
    const inputText = document.getElementById("inputText");
    if (inputText) {
        inputText.addEventListener('input', function() {
            if (this.value.length > 10000) { // Adjust limit as needed
                this.value = this.value.slice(0, 10000);
                alert("Input length limited to 10,000 characters");
            }
        });
    }
});
