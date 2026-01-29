# AjaxTracker

A Tampermonkey/Greasemonkey userscript that tracks and logs AJAX-based navigation on MerchantOS websites.

## Description

AjaxTracker monitors single-page application (SPA) navigation on merchantos.com domains by intercepting various navigation events and logging them to localStorage. It captures page visits triggered by AJAX calls, browser history changes, and DOM mutations.

## Features

- **AJAX Navigation Tracking**: Monitors pushState and replaceState for history-based navigation
- **Mutation Observer**: Detects DOM changes that indicate page transitions
- **Popstate Handling**: Tracks browser back/forward button clicks
- **Duplicate Prevention**: Intelligently filters out duplicate log entries
- **Account ID Integration**: Waits for merchantos.account.id to be available before logging
- **CSV Export**: Download logs as CSV file
- **Console API**: Easy access to view and clear logs

## Installation

1. Install a userscript manager:
   - [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Safari, Edge)
   - [Greasemonkey](https://www.greasespot.net/) (Firefox)
   - [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Firefox, Edge)

2. Click on the raw AjaxTracker file in this repository
3. Your userscript manager should prompt you to install it
4. Confirm the installation

## Usage

Once installed, the script automatically runs on any `*.merchantos.com` page.

### Viewing Logs

Open the browser console and use these commands:

```javascript
// View logs as a table in console
window.getVisitLog(true)

// Get logs as an array
let logs = window.getVisitLog()

// Download logs as CSV
window.getVisitLog(false, true)
```

### Clearing Logs

```javascript
window.clearVisitLog()
```

## Log Entry Format

Each log entry contains:

- `url`: Full URL of the page
- `pathOnly`: Cleaned path (extracted from URL)
- `time`: ISO timestamp of the visit
- `how`: Method that triggered the log (e.g., "pushState", "mutationObserver", "popstate", "firstLoad")
- `rad`: MerchantOS account ID

## Events

The script dispatches a custom event `LitanyOfActivation` for each page visit, which can be caught by other scripts (like EchoesintotheGloam.js):

```javascript
window.addEventListener("LitanyOfActivation", function(event) {
    console.log(event.detail); // Contains the log entry
});
```

## Configuration

The script stores logs in localStorage under the key: `ajax_visit_log`

## Compatibility

- **Domains**: `*://*.merchantos.com/*`
- **Grant**: None (no special permissions required)
- **Version**: 0.6

## How It Works

1. **Initialization**: Script waits up to 10 seconds for `merchantos.account.id` to be available
2. **Navigation Interception**: Wraps browser history methods (pushState/replaceState)
3. **DOM Monitoring**: Uses MutationObserver to detect SPA page changes
4. **Event Handling**: Listens for popstate events (back/forward navigation)
5. **Logging**: Stores visit data with timestamp and account ID
6. **Broadcasting**: Emits custom events for other scripts to consume

## Troubleshooting

If logging isn't working:

1. Check the console for warnings
2. Verify that `merchantos.account.id` is available on the page
3. Ensure the script is enabled in your userscript manager
4. Check that you're on a `*.merchantos.com` domain

## License

This is a userscript intended for personal use on MerchantOS websites.
