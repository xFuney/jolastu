'use strict';

// Initialise everything we're going to use.

// Internal libraries.
const Logging = require('../../common/Logging')
const Settings = require('../../common/Settings')
const Command = require('../../common/Command')

var BOT_CONFIG = Settings.loadConfig();
var commands = [];

// Category Name and Descripton
module.exports.categoryName = "Utilities"
module.exports.version = "0.0.1"
module.exports.categoryDescription = "Utilities that the bot has (including help and ping)."

// Commands
module.exports.commands = {
        "ping": {
            pretty_name: "ping",
            description: "Ping the bot.",
            execute: async function(MesgElement, Args, client, Discord) {
                MesgElement.reply("Ping received.")
                //let test = api_db.get("101", "user_warns", {user_id: 10101})
            }
        },
        "help": {
            pretty_name: "help",
            description: "Get help.",
            execute: async function(MesgElement, Args, client, Discord) {
                BOT_CONFIG = Settings.loadConfig();
                commands = Command.loadCommands();
                if (!Args[1]) {
                    // No argument specified, list categories.
                    const exampleEmbed = new Discord.MessageEmbed()
                        .setColor('7289da')
                        .setAuthor(BOT_CONFIG.bot_name + ' List of Command Categories', BOT_CONFIG.bot_image)
                        .setTimestamp()
                        .setFooter('Brought to you by ' + BOT_CONFIG.bot_name);
                
                    for (const catName in commands) {
                        exampleEmbed.addField(commands[catName].categoryName + " (" + catName + ")", commands[catName].categoryDescription, false)
                    }
                    
                    MesgElement.channel.send(exampleEmbed)
                    return;
                }
    
                var found = false
                var foundNumber = 0
    
                for (const catName in commands) {
                    if (catName== Args[1]) {
                        found = commands[catName].categoryName
                        foundNumber = i
                    }
                }
    
                if (found === false) {
                    MesgElement.channel.send("Category doesn't exist." )
                    return;
                }
    
                const exampleEmbed = new Discord.MessageEmbed()
                    .setColor('7289da')
                    .setAuthor(BOT_CONFIG.bot_name + ' Commands in Category ' + found, BOT_CONFIG.bot_image)
                    .setTimestamp()
                    .setFooter('Brought to you by ' + BOT_CONFIG.bot_name);
                
                for (const catName in commands) {
                    //console.log(catName)
                    if (catName == Args[1]) {
                        // This is the category we seek.
                        //console.log("found")
                        var i;
                        for (const commandName in commands[catName].commands) {
                            //console.log(commandName)
                            exampleEmbed.addField(BOT_CONFIG.bot_prefix + commands[catName].commands[commandName].pretty_name, commands[catName].commands[commandName].description, false)
                        }
                    }
                }
    
          
                MesgElement.channel.send(exampleEmbed)
            }
        }

    }