//This script tries to use masto.js and discord.js to run the Discord webhook
import Discord from'discord.js';
import { login } from 'masto';

// Discord webhook URL
const webhookUrl = 'https://discordapp.com/api/webhooks/1088334454990307329/I62CJyU76An4O1N5uw3d3-c4TUGoUnVHGhefEyn7v1S-Y4g8vEJ2M8rhEclgwbgtPpp0';

// Mastodon instance URL
const instanceUrl = 'https://tinkertofu.com';

// Mastodon access token
const accessToken = '';

// Initialize Discord webhook client
const webhookClient = new Discord.WebhookClient("");

// Initialize Mastodon client
const masto = new login({
  access_token: accessToken,
  api_url: `${instanceUrl}/api/v1/`,
  streaming_api_url: `${instanceUrl}/api/v1/streaming/`,
});

// Listen for new status updates
masto.stream('public/local', (status) => {
  try {
    // Post the latest status to the Discord channel
    const message = `New status update on Mastodon: ${status.url}`;
    webhookClient.send(message);
  } catch (error) {
    console.error(error);
  }
});