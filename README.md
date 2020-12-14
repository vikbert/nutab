# Chrome Extension for a better new tab


add conent scripts to `manifest.json`
```
  "content_scripts": [
    {
      "matches": ["http://*/*", "<all_urls>"],
      "js": ["contentScript.bundle.js"],
      "css": ["content.styles.css"]
    }
  ],
  "web_accessible_resources": ["content.styles.css", "icon-34.png"]
```