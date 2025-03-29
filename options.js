document.addEventListener('DOMContentLoaded', () => {
  const chatIdInput = document.getElementById('chatId');
  const saveButton = document.getElementById('save');
  const statusDiv = document.getElementById('status');

  // Загружаем сохраненный chat_id
  chrome.storage.sync.get(['telegramChatId'], (result) => {
    if (result.telegramChatId) {
      chatIdInput.value = result.telegramChatId;
    }
  });

  // Сохраняем настройки
  saveButton.addEventListener('click', () => {
    const chatId = chatIdInput.value.trim();
    
    // Проверяем, что Chat ID является числом
    if (!chatId) {
      showStatus('Пожалуйста, введите Telegram Chat ID', 'error');
      return;
    }

    // Проверяем формат Chat ID
    if (!/^\d+$/.test(chatId)) {
      showStatus('Chat ID должен быть положительным числом. Пожалуйста, проверьте инструкцию выше.', 'error');
      return;
    }

    chrome.storage.sync.set({ telegramChatId: chatId }, () => {
      showStatus('Настройки успешно сохранены!', 'success');
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
