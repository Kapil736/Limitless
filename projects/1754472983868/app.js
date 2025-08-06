// JavaScript to handle real-time preview of Markdown
const markdownInput = document.getElementById('markdown-input');
const previewPanel = document.getElementById('preview-panel');

// Function to update the preview panel with rendered HTML
function updatePreview() {
  const markdownText = markdownInput.value;
  const html = marked(markdownText);
  previewPanel.innerHTML = html;
}

// Event listener for keyup event on Markdown input area
document.getElementById('markdown-input').addEventListener('keyup', updatePreview);
