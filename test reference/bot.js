//This script runs the Mastodon-Submissons-Tracker discord bot. Has the basic set up for a discord bot, can add additional commands if required. 
//(Does not use slash commands)
// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions } = require('discord.js');
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const Mastodon = require('mastodon-api');//import masotodn api client
const ENV = require('dotenv');//import env var
const prefix = '!';
ENV.config(); //config env var

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.on("ready", c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Log in to Discord with your client's token
client.login(process.env.bot_token);

 const M = new Mastodon({
    access_token: process.env.ACCESS_TOKEN,
    //client_key: process.env.CLIENT_KEY,
    //client_secret:process.env.CLIENT_SECRET,
    api_url: "https://tinkertofu.com/api/v1/", 
});

client.on('messageCreate', (message)=>{
  console.log('received message');
  if (message.content.startsWith(prefix)){
    if (message.author.bot) return;
    if(message.content === '!hello'){
      message.channel.send('Hello!');
      console.log('sent message');
    }
  }
  
  /*
  if (message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  //Message Array
  const messageArray = message.content.split("");
  const argument = messageArray.slice(1);
  const cmd = messageArray[0];

  //COMMANDS
  if (command === 'hello'){
    message.channel.send('Hello!');
    console.log('sent message');
  }*/

})