'use strict';

// Initialise everything we're going to use.

// Internal libraries.
const Logging = require('../../common/Logging')
const Settings = require('../../common/Settings')
const Command = require('../../common/Command')
const Patches = require('../../common/Patches');
const { Guild } = require('discord.js');


var BOT_CONFIG = Settings.loadConfig();


// Category Name and Descripton
module.exports.categoryName = "Staging"
module.exports.version = "0.0.1"
module.exports.categoryDescription = "Commands which are in staging - are either unfinished, untested or generally broken."


// Fns

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
  }

// Commands

module.exports.commands = {
    "profile": {
        pretty_name: "profile",
        description: "Get information about someone's profile.",
        execute: async function(message, args, client, Discord) {
            // Profile.

            BOT_CONFIG = Settings.loadConfig();

            var userid;

            if (!args[1]) {
                userid = message.author.id
            } else {
                
            }

            if (message.mentions.members.first()) {
                // Is mention.
                userid = message.mentions.members.first().id
            } else {
                // Check if user ID is the message author first, otherwise don't do anything
                if (userid != message.author.id) {
                    // Is a standard args[1] id. but check first.
                    if (args[1].length != 18) {
                        userid = message.author.id
                    } else {
                        // Is an actual ID!
                        userid = args[1]
                    }
                }
            }

            if (!message.guild.member(userid)) {
                // User not a member of guild. Kick it.
                message.channel.send("User not a member of this guild - please use https://discord.id to get more information.")
                return false;
            }

            var user = message.guild.member(userid);

            console.log(user);
            
            const exampleEmbed = new Discord.MessageEmbed()
                .setColor('7289da')
                .setAuthor('About ' + user.user.username + '#' + user.user.tag, BOT_CONFIG.bot_image)
                .setThumbnail(user.user.displayAvatarURL())
                .setTimestamp()
                .setFooter('Brought to you by ' + BOT_CONFIG.bot_name);

            //exampleEmbed.addField("Framework", client.versions.framework, true)
            //exampleEmbed.addField("Bot Discord ID", client.user.id, true)
            //exampleEmbed.addField("Bot Discord Tag", client.user.tag, false)
            //exampleEmbed.addField("Uptime:", millisToMinutesAndSeconds(client.uptime),true)

            message.channel.send(exampleEmbed);
            
        }
    }
}
