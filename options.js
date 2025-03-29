document.addEventListener('DOMContentLoaded', () => {
  const botTokenInput = document.getElementById('botToken');
  const chatIdInput = document.getElementById('chatId');
  const saveButton = document.getElementById('save');
  const statusDiv = document.getElementById('status');

  // Load saved settings
  chrome.storage.sync.get(['telegramBotToken', 'telegramChatId'], (result) => {
    if (result.telegramBotToken) {
      botTokenInput.value = result.telegramBotToken;
    }
    if (result.telegramChatId) {
      chatIdInput.value = result.telegramChatId;
    }
  });

  // Save settings
  saveButton.addEventListener('click', () => {
    const botToken = botTokenInput.value.trim();
    const chatId = chatIdInput.value.trim();
    
    // Validate Bot Token
    if (!botToken) {
      showStatus('Please enter your Telegram Bot Token', 'error');
      return;
    }

    // Basic Bot Token format validation
    if (!/^\d+:[A-Za-z0-9_-]{35}$/.test(botToken)) {
      showStatus('Invalid Bot Token format. Please check your token from BotFather.', 'error');
      return;
    }

    // Validate Chat ID
    if (!chatId) {
      showStatus('Please enter your Telegram Chat ID', 'error');
      return;
    }

    // Validate Chat ID format
    if (!/^\d+$/.test(chatId)) {
      showStatus('Chat ID must be a positive number. Please check the instructions above.', 'error');
      return;
    }

    // Save both settings
    chrome.storage.sync.set({ 
      telegramBotToken: botToken,
      telegramChatId: chatId 
    }, () => {
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
