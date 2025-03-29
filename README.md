# YouTube Subtitles Downloader for Telegram

A Chrome extension that allows you to download subtitles from YouTube videos and send them directly to your Telegram.

## Features

- 📝 Download subtitles from YouTube videos
- 📱 Automatic sending to Telegram
- 🌐 Support for all subtitle languages available on the video
- 🔗 Sends the original video link along with subtitles
- ⚡ Works with long subtitles (automatic splitting into parts)

## Installation

1. Download the latest version of the extension
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select the extension folder

## Setup

1. After installation, click on the extension icon and select "Options"
2. Get your Telegram Chat ID:
   - Open [@getmyid_bot](https://t.me/getmyid_bot) in Telegram
   - Click "Start" or send the `/start` command
   - Find the "Your user ID:" line - this is your Chat ID
   - If the bot doesn't respond, use the alternative bot [@userinfobot](https://t.me/userinfobot)
3. Enter your Chat ID in the extension settings
4. Click "Save Settings"

## Usage

1. Open a video on YouTube
2. Make sure the video has subtitles
3. Click on the extension icon
4. Subtitles will be automatically sent to your Telegram

## Requirements

- Google Chrome (or other Chromium-based browser)
- Telegram account
- YouTube video must have subtitles

## Troubleshooting

### Subtitles are not being sent

- Check that you entered the correct Chat ID in settings
- Make sure the video has subtitles
- Check your internet connection

### "Chat ID must be a number" error

- Chat ID should contain only digits
- Don't use username or bot link
- Use the ID obtained from @getmyid_bot or @userinfobot

## Technical Details

- Uses Manifest V3
- Uses Telegram Bot API
- Supports automatic splitting of long subtitles (Telegram's 4096 characters limit)

## Security

- Extension requests only necessary permissions
- Your Chat ID is stored locally in the browser
- The extension does not collect any personal data

## License

MIT License 