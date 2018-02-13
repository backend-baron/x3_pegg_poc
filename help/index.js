var builder = require('botbuilder');
var sagebuilder = require('../../../libraries/sage-botlibraries-botbuilder')

module.exports = function (parent) {
    return {
        //library Export. This allows us to register the library with the bot
        libraryExport : function(){
            //register the library.
            var library = sagebuilder.library(parent.botName(),'home');
            //Define the dialogs that will be called
            library.dialog('basic', [
                (session, results) => {
                    session.send(session.localizer.gettext(session.preferredLocale(), "help-basic"));
                    session.endDialog();
                }
            ]
            ).triggerAction({
                matches: /help/i
            })

            return library;
        }
    };
}
