function injectScript() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('injected.js');
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);
}
injectScript();

const MAX_MESSAGE_LENGTH = 4000; // Keep some margin from the 4096 limit

async function sendMessageToTelegram(botToken, chatId, text) {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
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
      // If a single line is longer than maxLength, split it
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
    // Get settings from storage
    const { telegramBotToken, telegramChatId } = await chrome.storage.sync.get(['telegramBotToken', 'telegramChatId']);
    
    if (!telegramBotToken) {
      alert('Please set your Telegram Bot Token in the extension settings');
      return;
    }

    if (!telegramChatId) {
      alert('Please set your Telegram Chat ID in the extension settings');
      return;
    }

    // Create first message with video information
    const headerMessage = `Subtitles for video: ${videoUrl}`;
    await sendMessageToTelegram(telegramBotToken, telegramChatId, headerMessage);

    // Split subtitles into chunks and send them sequentially
    const chunks = splitTextIntoChunks(subtitles, MAX_MESSAGE_LENGTH);
    
    for (let i = 0; i < chunks.length; i++) {
      const partNumber = chunks.length > 1 ? `Part ${i + 1}/${chunks.length}\n\n` : '';
      await sendMessageToTelegram(telegramBotToken, telegramChatId, partNumber + chunks[i]);
      
      // Add a small delay between messages
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    alert('Subtitles sent to Telegram successfully!');
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    alert(`Error sending to Telegram: ${error.message}`);
  }
}

window.addEventListener('message', async (event) => {
  if (event.source !== window || event.data.type !== 'YOUTUBE_SUBTITLES') return;

  const subtitles = event.data.subtitles;
  const channelName = event.data.channelName;
  const videoTitle = event.data.videoTitle;
  const videoUrl = window.location.href;

  if (!subtitles) {
    alert('Subtitles not found.');
    return;
  }

  await sendToTelegram(videoUrl, subtitles, videoTitle, channelName);
});
