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

    const output = `
JavaScript: var array = [${array.join(", ")}];
Python: list_name = [${array.join(", ")}]
PHP: $array = [${array.join(", ")}];
Perl: @array = (${array.join(", ")});
Raw: ${array.join(", ")}
    `.trim();

    document.getElementById("result").textContent = output;
}

function clearAll() {
    document.getElementById("inputText").value = "";
    document.getElementById("result").textContent = "";
}
