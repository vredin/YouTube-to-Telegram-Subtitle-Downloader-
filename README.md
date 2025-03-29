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

### Step 1: Create Your Telegram Bot

1. Open [@BotFather](https://t.me/BotFather) in Telegram
2. Send the `/newbot` command
3. Follow the instructions to create your bot:
   - Enter a name for your bot (e.g., "My Subtitles Bot")
   - Enter a username for your bot (must end in 'bot', e.g., "my_subtitles_bot")
4. BotFather will give you a token (looks like `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
5. ⚠️ Keep this token private and secure!

### Step 2: Get Your Chat ID

1. Open [@getmyid_bot](https://t.me/getmyid_bot) in Telegram
2. Click "Start" or send the `/start` command
3. Find the "Your user ID:" line - this is your Chat ID
4. If the bot doesn't respond, use [@userinfobot](https://t.me/userinfobot) instead

### Step 3: Configure the Extension

1. Click on the extension icon and select "Options"
2. Enter your Bot Token from Step 1
3. Enter your Chat ID from Step 2
4. Click "Save Settings"
5. Start your bot by opening it in Telegram and clicking "Start"

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

- Check that you entered the correct Bot Token and Chat ID in settings
- Make sure you started the bot in Telegram
- Make sure the video has subtitles
- Check your internet connection

### "Invalid Bot Token format" error

- Make sure you copied the entire token from BotFather
- The token should look like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
- Create a new bot if you're unsure about your token

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
- Your Bot Token and Chat ID are stored locally in the browser
- The extension does not collect any personal data
- Never share your Bot Token with anyone

## License

MIT License 