// actions.js
const { exec } = require("child_process");

const openApp = (appName) => {
  // Normalize the app name to handle various inputs
  const normalized = appName.toLowerCase().replace(/\s+/g, "");
  // Map common app names to macOS application names
  const appMappings = {
    // Browsers
    browser: "Safari",
    safari: "Safari",
    chrome: "Google Chrome",
    googlechrome: "Google Chrome",
    firefox: "Firefox",
    edge: "Microsoft Edge",

    // Code editors
    vscode: "Visual Studio Code",
    visualstudiocode: "Visual Studio Code",
    code: "Visual Studio Code",
    sublime: "Sublime Text",
    sublimetext: "Sublime Text",
    atom: "Atom",

    // System apps
    terminal: "Terminal",
    iterm: "iTerm",
    finder: "Finder",
    notes: "Notes",
    mail: "Mail",
    calendar: "Calendar",
    messages: "Messages",

    // Other common apps
    slack: "Slack",
    spotify: "Spotify",
    discord: "Discord",
    zoom: "zoom.us",
    teams: "Microsoft Teams",
  };

  // Get the actual app name
  let actualAppName = appMappings[normalized];

  // If not in mappings, try the provided name as-is
  if (!actualAppName) {
    actualAppName = appName;
  }

  // Special case for Finder
  if (normalized === "finder") {
    exec("open .", (err) => {
      if (err) {
        console.error("Failed to open Finder:", err);
      } else {
        console.log("Successfully opened Finder");
      }
    });
    return `Opening Finder`;
  }

  // Execute the command
  const cmd = `open -a "${actualAppName}"`;
  console.log(`Executing command: ${cmd}`);

  exec(cmd, (err) => {
    if (err) {
      console.error(`Failed to open ${actualAppName}:`, err.message);
    } else {
      console.log(`Successfully opened ${actualAppName}`);
    }
  });

  return `Opening ${actualAppName}`;
};

const openUrl = (url) => {
  // Ensure URL has a protocol
  let fullUrl = url;
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    fullUrl = `https://${url}`;
  }

  console.log(`Opening URL: ${fullUrl} in Google Chrome`);

  // Force open in Google Chrome
  exec(`open -a "Google Chrome" "${fullUrl}"`, (err) => {
    if (err) {
      console.error(`Failed to open URL ${fullUrl}:`, err.message);
    } else {
      console.log(`Successfully opened ${fullUrl} in Google Chrome`);
    }
  });

  return `Opening ${fullUrl} in Google Chrome`;
};

const searchGoogle = (query) => {
  // Encode the search query for URL
  const encodedQuery = encodeURIComponent(query);
  const searchUrl = `https://www.google.com/search?q=${encodedQuery}`;

  console.log(`Searching Google for: "${query}"`);
  console.log(`Search URL: ${searchUrl}`);

  // Open search in Google Chrome
  exec(`open -a "Google Chrome" "${searchUrl}"`, (err) => {
    if (err) {
      console.error(`Failed to search Google for "${query}":`, err.message);
    } else {
      console.log(`Successfully searched Google for "${query}"`);
    }
  });

  return `Searching Google for "${query}"`;
};

module.exports = { openApp, openUrl, searchGoogle };
