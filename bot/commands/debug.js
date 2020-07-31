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

module.exports.commands = {
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
