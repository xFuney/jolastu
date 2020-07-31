'use strict';

// Stuff for logging.

module.exports.log = function(property, logText, severity) {
    return;
    if (severity == 1) {
        // Warn Severity.
        console.warn("[JOLASTU] [" + property + "] " + logText)
    } else {
        // Standard Severity.
        console.log("[JOLASTU] [" + property + "] " + logText)
    } 
}