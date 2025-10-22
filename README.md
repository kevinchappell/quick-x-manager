# X.com Tweet Deleter

A Chrome extension that improves the X.com (Twitter) UI to make deleting tweets easier.

## Features

- Adds checkboxes to each tweet on your profile page and /with_replies page
- Provides a floating "Delete Selected Tweets" button
- Bulk delete multiple tweets with a single click
- Automatically handles the deletion process through X.com's UI

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension directory

## Usage

1. Navigate to your profile page or /with_replies page on X.com
2. Check the boxes next to the tweets you want to delete
3. Click the red "Delete Selected Tweets" button in the top right corner
4. Confirm the deletion when prompted

## How It Works

The extension works by:

1. Injecting checkboxes into each tweet element
2. Adding a floating delete button to the page
3. When you click the delete button, it:
   - Clicks the tweet's caret button (`data-testid="caret"`)
   - Finds and clicks the "Delete" option in the dropdown menu
   - Confirms the deletion in the dialog that appears
4. Uses a MutationObserver to add checkboxes to dynamically loaded tweets

## Disclaimer

This extension interacts with X.com's UI programmatically. Use at your own risk, as X.com may change their UI elements which could affect functionality.