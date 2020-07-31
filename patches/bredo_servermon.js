'use strict';

// Bredo's Server Monitoring Patch
// Use this as an example of how patches should work/look.

// Initialise your global variables/libraries HERE. These will scope down to your patches functions.

// It is advised to have these three libraries BY DEFAULT, so your configuration script will function and to allow scoping down.
const Settings = require("../common/Settings");
const fs = require('fs');
const prompt = require('prompt-sync')({sigint: true});

const BOT_CONFIG = Settings.loadConfig();

// Configuration function. Nothing gets passed to it as of yet.
module.exports.config = function() {
    // ServerMon Enabled?

    var bRunning = true;

    while (bRunning) {
        var MON_ENABLE = prompt("Enable Server Monitoring? [Yy/Nn]: ");
        if (MON_ENABLE.toLowerCase() == "y") {
            console.log("\n");
            Settings.writeConfig('bredo_servermon__enable', MON_ENABLE);
            console.log("\n");
            bRunning = false;
        } else {
            console.log("\nServer monitoring not enabled. Returning.");
            bRunning = false;
            return
        }
    }


    // System Operator ID
    var MON_SYSOP = prompt("Insert System Operator Discord ID (e.g. 205419202318696448): ");
    MON_SYSOP = MON_SYSOP || '205419202318696447'
    console.log("\n");
    Settings.writeConfig('bredo_servermon__sysop', MON_SYSOP);
    console.log("\n");

    // System Operator Channel
    var MON_CHAN = prompt("Insert System Operator Discord CHANNEL ID (e.g. 599710801074323497): ");
    MON_CHAN = MON_CHAN || '599710801074323497'
    console.log("\n");
    Settings.writeConfig('bredo_servermon__sysop_log_channel', MON_CHAN);
    console.log("\n");

    // Check Interval (seconds)
    var MON_SECS = prompt("Insert CPU check interval in seconds (e.g. 5): ");
    MON_SECS = parseInt(MON_SECS) || 5
    console.log("\n");
    Settings.writeConfig('bredo_servermon__intervalSeconds', MON_SECS);
    console.log("\n");

    // Check Interval (seconds)
    var MON_THRES = prompt("Insert CPU percentage threshold (e.g. 25): ");
    MON_SECS = parseInt(MON_THRES) || 25
    console.log("\n");
    Settings.writeConfig('bredo_servermon__cpuThreshold', MON_THRES);
    console.log("\n");
}

// This is called when the bot is successfully logged into Discord.
// PLEASE make this an asyncronous function, otherwise you will completely and totally halt other patches.

// Client and Discord objects are both passed down so you can interface as the appropriate bot.
module.exports.run = async function(client, Discord) {
    console.log("Bredo's Server Monitor on bot " + client.user.tag)

    if (BOT_CONFIG.bredo_servermon__enable) {
        if (process.platform != 'darwin' && process.env.APPDATA !== undefined) {
            console.log("You cannot run Server Monitor, because you're on Windows.")
            return
        }
        
        const os = require('os-utils');
        const {exec} = require('child_process');
        
        const cpuThreshold = BOT_CONFIG.bredo_servermon__cpuThreshold
        const intervalSeconds =  BOT_CONFIG.bredo_servermon__intervalSeconds
        const ownerID =  BOT_CONFIG.bredo_servermon__sysop
        const channelID =  BOT_CONFIG.bredo_servermon__sysop_log_channel
    
        let cpuWarning = false
        let ownerAlerted = false
    
    
        function monitorCheck() {
            let channel = client.channels.cache.get(channelID)
            os.cpuUsage(function(v) {
                let currCpuUsage = Math.round(v * 100)
                if (currCpuUsage > cpuThreshold) {
                    if ((!ownerAlerted) && (cpuWarning)) {
    
                        console.log('[MON] High CPU usage lasting over ${intervalSeconds} seconds has been detected. Info:')
    
                        exec("ps aux --sort=-pcpu | head -n 5", (error, stdout, stderr) => {
                            if (error) {
                                console.log(`error: ${error.message}`);
                                return;
                            }
                            if (stderr) {
                                console.log(`stderr: ${stderr}`);
                                return;
                            }
                            console.log(stdout);
                        });
    
                        channel.send('<@' + ownerID + '>, CPU usage has been above threshold of ' + cpuThreshold + '% for more then ' + intervalSeconds + 'seconds (currently at ' + currCpuUsage + '%)')
                        ownerAlerted = true
                    } else if (!cpuWarning && !ownerAlerted) {
                        //console.log('[MON] High CPU usage detected')
                        cpuWarning = true
                    } else {
                        //console.log('[MON] CPU usage is still high, owner has been alerted')
                    }
                } else {
                    if (cpuWarning || ownerAlerted) {
                        //console.log('[MON] CPU usage has returned to normal')
                        cpuWarning = false
                        ownerAlerted = false
                    }
                }
            });
        }
    
        setInterval(monitorCheck, intervalSeconds * 1000)
    }
}