const client = new Discord.Client();
import Discord from "discord.js";
import Mastodon from "mastodon-api";//import masotodn api client
import { createInterface } from "readline"; //importing CLI input
import ENV from "dotenv";//import env var
import chalk from "chalk";

ENV.config(); //config env var

client.login('MTA4NjIzNzY2MjU2ODAwOTgwOA.GIP7Rd.3vSW2foReATjhl-8XmWfdo6kQ26M3D2kAMrEvo');

const M = new Mastodon({
    access_token: process.env.ACCESS_TOKEN,
    //client_key: process.env.CLIENT_KEY,
    //client_secret:process.env.CLIENT_SECRET,
    api_url: "https://tinkertofu.com/api/v1/", 
});

client.on('message', message => {
    if (message.content === '!latesttoots') {
      M.get('accounts/verify_credentials').then(res => {
        M.get(`accounts/${res.data.id}/statuses`).then(res => {
          const latestToot = res.data[0];
          message.channel.send(latestToot.content);
        });
      });
    }
  });