import fetch from 'node-fetch';
import Mastodon from 'mastodon-api';
import ENV from 'dotenv';

ENV.config();

//MastoTracker: Swift #Mastodon Channel Webhook URL: https://discordapp.com/api/webhooks/1088334454990307329/I62CJyU76An4O1N5uw3d3-c4TUGoUnVHGhefEyn7v1S-Y4g8vEJ2M8rhEclgwbgtPpp0
//Mastotracker: private server Webhook URL: https://discordapp.com/api/webhooks/1087649219327840257/ck7sDxpEAQGv020lEmCrCJ8BT9Vwu8fFOa_wFHXy4YawSctKY5_5i9kD84vvjqtKqT_k

// Replace the following variables with your own values
const webhookURL = "https://discordapp.com/api/webhooks/1088334454990307329/I62CJyU76An4O1N5uw3d3-c4TUGoUnVHGhefEyn7v1S-Y4g8vEJ2M8rhEclgwbgtPpp0";
const mastodonInstance = "tinkertofu.com";
const mastodonAccessToken = process.env.ACCESS_TOKEN;
let role ='';
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

//listen to the streaming API for a new message event on the local timeline and checks for a new status posted
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
      const id = message.data.account.id;
      const statusUrl = message.data.url;
      
      const params = {
        id: id,
      };
      const role = await mastodonClient.get('admin/accounts/:id', params, (error,data) => {
            if (error){
              console.error(error);
            }else{
              console.log("User id: " + id);
            }
          }); 

      console.log("User role: " + role.data.role.name); 
      if (role.data.role.name == "Administrator" || role.data.role.name == "Moderator"){
        // Create a Discord webhook payload
        const payload = {
          content: 'Status Received!',
          content: `Annoucement from **@${author}**, **Role: ${role.data.role.name}**: on ${mastodonInstance}.\n${statusUrl}`,
        };
        
        // Send the payload to the Discord webhook
        const response = await fetch(webhookURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        //send error messages for diagnostics for Discord API error
        if (response.status !== 204) {
          console.error(
            `Received status ${response.status} from webhook API: ${await response.text()}`
          );
        } else {
          console.log(`Message sent to Discord: ${payload.content}`);
        }
      }else {
        // Create a Discord webhook payload
        const payload = {
          content: 'Status Received!',
          content: `New Submission Posted! **@${author}** from **Group: ${role.data.role.name}** just posted a new status on ${mastodonInstance}.\n${statusUrl}`,
        };

        // Send the payload to the Discord webhook
        const response = await fetch(webhookURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        //send error messages for diagnostics for Discord API error
        if (response.status !== 204) {
          console.error(
            `Received status ${response.status} from webhook API: ${await response.text()}`
          );
        } else {
          console.log(`Message sent to Discord: ${payload.content}`);
        }
      } 
    }
  } catch (error) {
    console.error(`Error processing message: ${error}`);
  }
});
//send error message for diagnostics for Mastodon API error
mastodonClient.stream("streaming/user").on("error", (error) => {
  console.error(`Mastodon API stream error: ${error}`);
}); 