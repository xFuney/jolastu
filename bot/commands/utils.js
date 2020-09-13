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
        "archive-pins": {
            pretty_name: "archive-pins",
            description: "Archive pins from the channel where this mesage is posted in the provided channel ID.",
            execute: async function(message, Args, client, Discord) {
                if (!Args[1]) {
                    message.channel.send("Error: Please provide a channel ID.")
                    return;
                }
                //console.log(message)
                
                if (message.guild.members.cache.get(message.author.id).hasPermission('KICK_MEMBERS')) {
                    // Valid. Now start archival.
                    const archiveChannel = message.guild.channels.cache.find(channel => channel.id === Args[1]);
                    message.channel.messages.fetchPinned().then(function(pinnedMessages){
                        let pinnedArray = pinnedMessages.array()
                        for ( const n in pinnedArray ) {
                            var img = "no";
                            var attachments = "";
                            var embeds = "";
                            var attachmentsI = 1;
                            var embedsI = 1;

                            //if (message.attachments) {
                                pinnedArray[n].attachments.forEach(attachment => {
                                    // do something with the attachment
                                    attachments += "[Attachment " + attachmentsI + " - " + attachment.name + "](" + attachment.url + ")\n"
                                });
                                
                                //console.log(message)
                                pinnedArray[n].embeds.forEach(embed => {
                                    // do something with the attachment
                                    if (embed.type == "image") {
                                        embeds += "[Embed " + embedsI + " (Image)](" + embed.url + ")\n"
                                    } else if (embed.type == "gifv") {
                                        embeds += "[Embed " + embedsI + " (GIF)](" + embed.url + ")\n"
                                    } else if (embed.type == "article") {
                                        embeds += "[Embed " + embedsI + " (Article)](" + embed.url + ")\n"
                                    } else if (embed.type == "video") {
                                        embeds += "[Embed " + embedsI + " (Video)](" + embed.url + ")\n"
                                    } else if (embed.type == "link") {
                                        embeds += "[Embed " + embedsI + " (Link)](" + embed.url + ")\n"
                                    }
                                });


                            //}

                            //console.log(pinnedArray[n].content)
                            var msgEmbed = new Discord.MessageEmbed()
                            .setColor('0000ff')
                            .setAuthor(pinnedArray[n].author.tag, pinnedArray[n].author.avatarURL())
                            .setDescription(pinnedArray[n].content)
                            .setTimestamp(pinnedArray[n].createdTimestamp)
                            .addField('Attachments', attachments || "*None*")
                            .addField('Embeds', embeds || "*None*")
                            .setFooter('Brought to you by ' + BOT_CONFIG.bot_name);

                            //if (pinnedArray[n].embeds.array().length > 1) {
                                //msgEmbed.setImage(img)
                            //}

                            archiveChannel.send(msgEmbed)
                        }
                    })
                }
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