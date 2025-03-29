document.addEventListener('DOMContentLoaded', () => {
  const chatIdInput = document.getElementById('chatId');
  const saveButton = document.getElementById('save');
  const statusDiv = document.getElementById('status');

  // Load saved chat_id
  chrome.storage.sync.get(['telegramChatId'], (result) => {
    if (result.telegramChatId) {
      chatIdInput.value = result.telegramChatId;
    }
  });

  // Save settings
  saveButton.addEventListener('click', () => {
    const chatId = chatIdInput.value.trim();
    
    // Check if Chat ID is provided
    if (!chatId) {
      showStatus('Please enter your Telegram Chat ID', 'error');
      return;
    }

    // Validate Chat ID format
    if (!/^\d+$/.test(chatId)) {
      showStatus('Chat ID must be a positive number. Please check the instructions above.', 'error');
      return;
    }

    chrome.storage.sync.set({ telegramChatId: chatId }, () => {
      showStatus('Settings saved successfully!', 'success');
    });
  });

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 5000);
  }
});
