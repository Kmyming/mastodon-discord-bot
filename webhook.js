import fetch from 'node-fetch';
import Mastodon from 'mastodon-api';
import ENV from 'dotenv';
//const fetch = require("node-fetch");
//const Mastodon = require("mastodon-api");

ENV.config();

//MastoTracker: Swift #Mastodon Channel Webhook URL: https://discordapp.com/api/webhooks/1088334454990307329/I62CJyU76An4O1N5uw3d3-c4TUGoUnVHGhefEyn7v1S-Y4g8vEJ2M8rhEclgwbgtPpp0
//Mastotracker: private server Webhook URL: https://discordapp.com/api/webhooks/1087649219327840257/ck7sDxpEAQGv020lEmCrCJ8BT9Vwu8fFOa_wFHXy4YawSctKY5_5i9kD84vvjqtKqT_k

// Replace the following variables with your own values
const webhookURL = "https://discordapp.com/api/webhooks/1088334454990307329/I62CJyU76An4O1N5uw3d3-c4TUGoUnVHGhefEyn7v1S-Y4g8vEJ2M8rhEclgwbgtPpp0";
const mastodonInstance = "tinkertofu.com";
const mastodonAccessToken = process.env.ACCESS_TOKEN;

// Create a Mastodon API client with the access token
const mastodonClient = new Mastodon({
  access_token: mastodonAccessToken,
 // timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  api_url: `https://tinkertofu.com/api/v1/`,
});
console.log('Running script. Connecting to Mastodon streaming API...');
// Start listening to the Mastodon API stream
const listener = mastodonClient.stream('streaming/user');
//listener.on('message', msg => console.log(msg));
//listener.on('error', err => console.log(err));

listener.on("message", async (message) => {
  try {
    console.log();
    console.log('New event on timeline.');
    if (message.event === 'update' && message.data && message.data.content) {
      // Check if the message is a new status
      console.log('New status posted!');
      // Get the status message and author
      const status = message.data.content;
      const author = message.data.account.display_name;
      const statusUrl = message.data.url;

      // Create a Discord webhook payload
      const payload = {
        content: 'Status Received!',
        content: `New Submission Posted! **@${author}** just posted a new status on ${mastodonInstance}.\n${statusUrl}`,
      };
    
      // Send the payload to the Discord webhook
      const response = await fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status !== 204) {
        console.error(
          `Received status ${response.status} from webhook API: ${await response.text()}`
        );
      } else {
        console.log(`Message sent to Discord: ${payload.content}`);
      }
    }
  } catch (error) {
    console.error(`Error processing message: ${error}`);
  }
});

mastodonClient.stream("streaming/user").on("error", (error) => {
  console.error(`Mastodon API stream error: ${error}`);
}); 