// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(function () {
    const vscode = acquireVsCodeApi();

    const oldState = vscode.getState();

    const counter = document.getElementById('lines-of-code-counter');
    console.log(oldState);
    let currentCount = (oldState && oldState.count) || 0;
    counter.textContent = currentCount;

    setInterval(() => {
        counter.textContent = currentCount++;

        // Update state
        vscode.setState({ count: currentCount });

        // Alert the extension when the cat introduces a bug
        if (Math.random() < Math.min(0.001 * currentCount, 0.05)) {
            // Send a message back to the extension
            vscode.postMessage({
                command: 'alert',
                text: '🐛  on line ' + currentCount
            });
        }
    }, 100);

    // Handle messages sent from the extension to the webview
    window.addEventListener('message', event => {
        const message = event.data; // The json data that the extension sent
        switch (message.command) {
            case 'refactor':
                currentCount = Math.ceil(currentCount * 0.5);
                counter.textContent = currentCount;
                break;
        }
    });
}());

// function setCaret() {
//     var el = document.getElementById("editable");
//     var range = document.createRange();
//     var sel = window.getSelection();

//     range.setStart(el.childNodes[2], 5);
//     range.collapse(true);

//     sel.removeAllRanges();
//     sel.addRange(range);
// }

function onPaste() {
    const editable = document.getElementById("editable");
    const dockerCompose = editable.innerText;
    editable.innerHTML = '<code id="yaml" class="language-yaml"></code>';
    const yaml = document.getElementById("yaml");
    yaml.innerHTML = Prism.highlight(
      dockerCompose,
      Prism.languages.yaml,
      "yaml"
    );
}