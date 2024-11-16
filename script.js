function convertArray() {
    const input = document.getElementById("inputText").value;
    const quoteStyle = document.getElementById("quoteStyle").value === "double" ? '"' : "'";
    const quoteNumbers = document.getElementById("quoteNumbers").checked;

    if (!input.trim()) {
        alert("Please enter some text.");
        return;
    }

    const lines = input.split("\n").map(line => line.trim()).filter(line => line !== "");
    const array = lines.map(item => {
        const isNumber = !isNaN(item);
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
    container.innerHTML = '';

    Object.entries(outputs).forEach(([language, code]) => {
        const card = document.createElement('div');
        card.className = 'output-card';
        card.innerHTML = `
            <div class="output-header">
                <h3 class="output-title">${language}</h3>
                <button class="copy-btn" onclick="copyToClipboard('${language}')">Copy</button>
            </div>
            <div class="output-content" id="output-${language}">${code}</div>
        `;
        container.appendChild(card);
    });
}

function copyToClipboard(language) {
    const content = document.getElementById(`output-${language}`).textContent;
    navigator.clipboard.writeText(content).then(() => {
        showCopySuccess();
    });
}

function showCopySuccess() {
    const message = document.getElementById('copySuccess');
    message.style.display = 'block';
    setTimeout(() => {
        message.style.display = 'none';
    }, 2000);
}

function clearAll() {
    document.getElementById("inputText").value = "";
    document.getElementById("outputContainer").innerHTML = "";
}
