'use strict';

// Initialise everything we're going to use.

// Internal libraries.
const Logging = require('../../common/Logging')
const Settings = require('../../common/Settings')
const Command = require('../../common/Command')
const Patches = require('../../common/Patches')


var BOT_CONFIG = Settings.loadConfig();


// Category Name and Descripton
module.exports.categoryName = "Debug"
module.exports.version = "0.0.1"
module.exports.categoryDescription = "Commands for debugging."


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
    "eval": {
        pretty_name: "eval",
        description: "OWNER-ONLY: Run some JavaScript. Highly powerful, don't mess with this.",
        execute: async function(message, args, client, Discord) {
            if(message.author.id !== BOT_CONFIG.bot_owner_id) return;

            try {
                var link = ""
                var i;
                var query = ""

                for (i = 1; i < args.length; i++) {
                    query = query + args[i] + " "
                }
              let evaled = eval(query);
         
              if (typeof evaled !== "string")
                evaled = require("util").inspect(evaled);
         
              message.channel.send(clean(evaled), {code:"xl"});
            } catch (err) {
                message.channel.send("**FAILED: " + clean(err) + "**")
            }
        }
    },
    "about": {
        pretty_name: "about",
        description: "Get information about the bot.",
        execute: async function(message, args, client, Discord) {
            // Bot about.

            BOT_CONFIG = Settings.loadConfig();

            const exampleEmbed = new Discord.MessageEmbed()
                .setColor('7289da')
                .setAuthor('About ' + BOT_CONFIG.bot_name, BOT_CONFIG.bot_image)
                .setThumbnail(BOT_CONFIG.bot_image)
                .setTimestamp()
                .setFooter('Brought to you by ' + BOT_CONFIG.bot_name);

            exampleEmbed.addField("Framework", client.versions.framework, true)
            exampleEmbed.addField("Bot Discord ID", client.user.id, true)
            exampleEmbed.addField("Bot Discord Tag", client.user.tag, false)
            exampleEmbed.addField("Uptime:", millisToMinutesAndSeconds(client.uptime),true)

            message.channel.send(exampleEmbed);
        }
    },
    "about-cmds": {
        pretty_name: "about-cmds",
        description: "Get information about the bot's command modules.",
        execute: async function(message, args, client, Discord) {
            // Bot about.

            BOT_CONFIG = Settings.loadConfig();

            const exampleEmbed = new Discord.MessageEmbed()
                .setColor('7289da')
                .setAuthor('About ' + BOT_CONFIG.bot_name + "'s Commands", BOT_CONFIG.bot_image)
                .setThumbnail(BOT_CONFIG.bot_image)
                .setTimestamp()
                .setFooter('Brought to you by ' + BOT_CONFIG.bot_name);


            var test = Command.getVersions();

            var i;
            for (i=0;i<test.length;i++) {
                exampleEmbed.addField(test[i].categoryName, "Version: v" + test[i].version)
            }
            message.channel.send(exampleEmbed);
        }
    }
}
