function injectScript() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('injected.js');
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);
}
injectScript();

const TELEGRAM_BOT_TOKEN = '7609555371:AAGY4uTTmo23DfPQs6_mGVjf0Nlf1dcBdZs';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
const MAX_MESSAGE_LENGTH = 4000; // Оставляем небольшой запас от лимита в 4096

async function sendMessageToTelegram(chatId, text) {
  const response = await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML'
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Telegram API Error: ${JSON.stringify(errorData)}`);
  }

  return response;
}

function splitTextIntoChunks(text, maxLength) {
  const chunks = [];
  let currentChunk = '';
  const lines = text.split('\n');

  for (const line of lines) {
    if ((currentChunk + line + '\n').length > maxLength) {
      if (currentChunk) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }
      // Если одна строка больше максимальной длины, разбиваем её
      if (line.length > maxLength) {
        const parts = line.match(new RegExp(`.{1,${maxLength}}`, 'g')) || [];
        chunks.push(...parts);
        continue;
      }
    }
    currentChunk += line + '\n';
  }

  if (currentChunk) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

async function sendToTelegram(videoUrl, subtitles, videoTitle, channelName) {
  try {
    // Получаем chat_id из настроек
    const { telegramChatId } = await chrome.storage.sync.get(['telegramChatId']);
    
    if (!telegramChatId) {
      alert('Пожалуйста, укажите ваш Telegram Chat ID в настройках расширения');
      return;
    }

    // Создаем первое сообщение с информацией о видео
    const headerMessage = `Субтитры к видео: ${videoUrl}`;
    await sendMessageToTelegram(telegramChatId, headerMessage);

    // Разбиваем субтитры на части и отправляем их последовательно
    const chunks = splitTextIntoChunks(subtitles, MAX_MESSAGE_LENGTH);
    
    for (let i = 0; i < chunks.length; i++) {
      const partNumber = chunks.length > 1 ? `Часть ${i + 1}/${chunks.length}\n\n` : '';
      await sendMessageToTelegram(telegramChatId, partNumber + chunks[i]);
      
      // Добавляем небольшую задержку между отправкой сообщений
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    alert('Субтитры успешно отправлены в Telegram!');
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    alert(`Ошибка при отправке в Telegram: ${error.message}`);
  }
}

window.addEventListener('message', async (event) => {
  if (event.source !== window || event.data.type !== 'YOUTUBE_SUBTITLES') return;

  const subtitles = event.data.subtitles;
  const channelName = event.data.channelName;
  const videoTitle = event.data.videoTitle;
  const videoUrl = window.location.href;

  if (!subtitles) {
    alert('Субтитры не найдены.');
    return;
  }

  await sendToTelegram(videoUrl, subtitles, videoTitle, channelName);
});
