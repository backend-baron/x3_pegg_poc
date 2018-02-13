var builder = require('botbuilder');
var sagebuilder = require('../../libraries/sage-botlibraries-botbuilder')
var config = require('./config');
var request = require('sync-request');

module.exports = function (bot) {
    return {
        /*
        Required
        Name of the of the bot. This should match the directory name and package name
        */
        botName: function () {
            return 'X3-bot';
        },

        /*
        Required
        Friendly name of the of the bot. May be seen by the end user
        */
        friendlyName: function () {
            return 'X3 Bot';
        },

        /*
        Required
        Message to send when the bot starts
        */
        start: function (session) {
            // if (!session.userData.sessionCookie) {
            //     res = request('GET',
            //         "http://scmx3-dev-mja.sagefr.adinternal.com:8124/auth/login/page",
            //         {headers:{
            //                 'Authorization':  config.get('Auth'),
            //                 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
            //             }});
            //     session.userData.sessionCookie = res.headers['set-cookie'][0]
            // }
            if (!session.privateConversationData.welcomeInit) {
                session.send(session.localizer.gettext(session.preferredLocale(), "welcome"));
                session.privateConversationData.welcomeInit = true
            }
            session.send(session.localizer.gettext(session.preferredLocale(), "main"));
            // session.sendTyping();
            //Start the first dialog, beginDialogSafe must be used
            // session.beginDialogSafe('home:options', this);
        },

        /*
        Required
        Register the bot and any libraries with the proxy bot
        */
        registerLibraries: function () {
            //this is required to register the bot with the proxy
            bot.library(sagebuilder.library(this.botName()));
            //we're registering our home library here. This allows us to break the bot into
            //managable parts
            bot.library(require('./home')(this).libraryExport());
            bot.library(require('./invoices')(this).libraryExport());
            bot.library(require('./help')(this).libraryExport());
            bot.localePath(__dirname + "/locale");
        },

        /*
        Optional
        Method for an Auth Callback
        authCallback : function(){
             
        },
        */

        /*
        Optional
        Middleware registry
        middleware : function () {
            return {
                botbuilder: function (session, next) {
                
                }
            }
        }
        */
    };
}

