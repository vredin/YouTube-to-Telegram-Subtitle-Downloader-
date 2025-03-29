window.addEventListener('message', async (event) => {
  if (event.source !== window || event.data.type !== 'DOWNLOAD_SUBTITLES') return;

  const player = document.querySelector('.html5-video-player');
  if (!player || !player.getPlayerResponse) {
    window.postMessage({ type: 'YOUTUBE_SUBTITLES', subtitles: null }, '*');
    return;
  }

  const playerResponse = player.getPlayerResponse();
  const captionTracks = playerResponse?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
  const videoTitle = playerResponse?.videoDetails?.title || 'YouTube Video';
  const channelName = playerResponse?.videoDetails?.author || 'Channel';

  if (!captionTracks || captionTracks.length === 0) {
    window.postMessage({ type: 'YOUTUBE_SUBTITLES', subtitles: null }, '*');
    return;
  }

  // Отримуємо активні субтитри з налаштувань плеєра
  const playerCaptionsTrack = player.getOption('captions', 'track');
  let activeCaptionTrack;

  if (playerCaptionsTrack && playerCaptionsTrack.languageCode) {
    activeCaptionTrack = captionTracks.find(track => track.languageCode === playerCaptionsTrack.languageCode);
  }

  if (!activeCaptionTrack) {
    activeCaptionTrack = captionTracks[0];
  }

  try {
    const response = await fetch(activeCaptionTrack.baseUrl);
    const xmlText = await response.text();

    const policy = window.trustedTypes?.createPolicy('youtubeSubtitles', { createHTML: input => input });
    const xml = new DOMParser().parseFromString(policy ? policy.createHTML(xmlText) : xmlText, 'application/xml');

    const decodeHTML = (html) => {
      const policyText = window.trustedTypes?.createPolicy('youtubeDecode', { createHTML: input => input });
      const txt = document.createElement('textarea');
      txt.innerHTML = policyText ? policyText.createHTML(html) : html;
      return txt.value;
    };

    const texts = xml.getElementsByTagName('text');
    let subtitlesText = '';
    for (let i = 0; i < texts.length; i++) {
      subtitlesText += decodeHTML(texts[i].textContent) + '\n';
    }

    window.postMessage({
      type: 'YOUTUBE_SUBTITLES',
      subtitles: subtitlesText,
      videoTitle: videoTitle.replace(/[\\/:*?"<>|]/g, ''),
      channelName: channelName.replace(/[\\/:*?"<>|]/g, '')
    }, '*');
  } catch (e) {
    console.error('Error:', e);
    window.postMessage({ type: 'YOUTUBE_SUBTITLES', subtitles: null }, '*');
  }
});
