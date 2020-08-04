'use strict';

// Invite Tracking System

// Initialise your global variables/libraries HERE. These will scope down to your patches functions.

// It is advised to have these three libraries BY DEFAULT, so your configuration script will function and to allow scoping down.
const Settings = require("../common/Settings");
const fs = require('fs');
const prompt = require('prompt-sync')({sigint: true});

const BOT_CONFIG = Settings.loadConfig();

// Global constants!

const invites = {};

const wait = require('util').promisify(setTimeout);

// Configuration function. Nothing gets passed to it as of yet.
module.exports.config = function() {
    console.log("Invite Tracking System doesn't require configuration.\n")
}

// This is called when the bot is successfully logged into Discord.
// PLEASE make this an asyncronous function, otherwise you will completely and totally halt other patches.

// Client and Discord objects are both passed down so you can interface as the appropriate bot.
module.exports.run = async function(client, Discord) {
  // "ready" isn't really ready. We need to wait a spell.
  wait(1000);   

  // Load all invites for all guilds and save them to the cache.
  client.guilds.cache.forEach(g => {
    g.fetchInvites().then(guildInvites => {
      console.log(g.name)
      invites[g.id] = guildInvites;
    })
    .catch( (err) => {
        // Do no shit.
    });
  });

  client.on('guildMemberAdd', member => {
    // To compare, we need to load the current invite list.
    member.guild.fetchInvites().then(guildInvites => {
      // This is the *existing* invites for the guild.
      const ei = invites[member.guild.id];
      // Update the cached invites for the guild.
      invites[member.guild.id] = guildInvites;
      // Look through the invites, find the one for which the uses went up.
      const invite = guildInvites.find(i => ei.get(i.code).uses < i.uses);
      // This is just to simplify the message being sent below (inviter doesn't have a tag property)
      const inviter = client.users.get(invite.inviter.id);
      // Get the log channel (change to your liking)
      const logChannel = member.guild.channels.find(channel => channel.name === "test-log-test-log");
      // A real basic message with the information we need. 
      logChannel.send(`${member.user.tag} joined using invite code ${invite.code} from ${inviter.tag}. Invite was used ${invite.uses} times since its creation.`);
    });
  });

}