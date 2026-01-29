# EchoesintotheGloam

A companion Tampermonkey/Greasemonkey userscript that listens for navigation events broadcasted by AjaxTracker.

## Description

EchoesintotheGloam is a listener script that receives navigation events from the AjaxTracker userscript. It demonstrates how to consume the custom events emitted by AjaxTracker and access the logged navigation data.

## Features

- **Event Listening**: Listens for custom `LitanyOfActivation` events
- **Log Access**: Reads from the same localStorage used by AjaxTracker
- **Real-time Updates**: Receives notifications for each page navigation
- **Console Output**: Logs received data to the console

## Installation

1. Install a userscript manager:
   - [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Safari, Edge)
   - [Greasemonkey](https://www.greasespot.net/) (Firefox)
   - [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Firefox, Edge)

2. **Note**: This script is designed to work alongside AjaxTracker. Install AjaxTracker first!

3. Click on the raw EchoesintotheGloam.js file in this repository
4. Your userscript manager should prompt you to install it
5. Confirm the installation

## Usage

Once both scripts are installed, EchoesintotheGloam automatically runs on any `*.merchantos.com` page and listens for navigation events.

### What It Does

When a page navigation occurs (tracked by AjaxTracker):

1. AjaxTracker logs the navigation and dispatches a `LitanyOfActivation` event
2. EchoesintotheGloam receives the event
3. The script logs the event data to the console
4. The script also reads and displays the entire log from localStorage

### Console Output

You'll see messages like:
```
⚠️ Receiving the Machine God's truth...
{url: "...", pathOnly: "...", time: "...", how: "pushState", rad: "..."}
[Array of all logged visits]
```

## Event Structure

The `LitanyOfActivation` event contains:

```javascript
{
    detail: {
        url: String,        // Full URL
        pathOnly: String,   // Cleaned path
        time: String,       // ISO timestamp
        how: String,        // Navigation method
        rad: String         // MerchantOS account ID
    }
}
```

## Customization

You can extend this script to:

- Send navigation data to an external API
- Filter specific navigation types
- Trigger custom actions based on page visits
- Integrate with analytics tools
- Monitor user behavior patterns

### Example: Send to External API

```javascript
window.addEventListener("LitanyOfActivation", function (message) {
    let data = message.detail;
    
    // Send to your API
    fetch('https://your-api.com/track', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
});
```

### Example: Filter Specific Pages

```javascript
window.addEventListener("LitanyOfActivation", function (message) {
    let data = message.detail;
    
    // Only log dashboard visits
    if (data.pathOnly.includes('dashboard')) {
        console.log('Dashboard visit:', data);
    }
});
```

## Compatibility

- **Domains**: `*://*.merchantos.com/*`
- **Grant**: None (no special permissions required)
- **Version**: 2025-08-01
- **Requires**: AjaxTracker userscript (or any script that emits `LitanyOfActivation` events)

## How It Works

1. Sets up an event listener for the `LitanyOfActivation` custom event
2. When an event is received, extracts the detail payload
3. Logs the individual event data to console
4. Reads the complete log from localStorage (`ajax_visit_log`)
5. Displays the full log array in console

## Storage

This script reads from localStorage key: `ajax_visit_log` (shared with AjaxTracker)

## Troubleshooting

If you're not seeing events:

1. Ensure AjaxTracker is installed and running
2. Check that both scripts are enabled in your userscript manager
3. Verify you're on a `*.merchantos.com` domain
4. Check the console for any error messages
5. Navigate between pages to trigger events

## License

This is a userscript intended for personal use on MerchantOS websites.
