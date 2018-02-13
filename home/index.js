var builder = require('botbuilder');
var sagebuilder = require('../../../libraries/sage-botlibraries-botbuilder')

module.exports = function (parent) {
    return {
        //library Export. This allows us to register the library with the bot
        libraryExport : function(){
            //register the library. 
            var library = sagebuilder.library(parent.botName(),'home');
            //Define the dialogs that will be called
            library.dialog('options', [
                function (session, results) {
                    builder.Prompts.choice(session, session.localizer.gettext(session.preferredLocale(), "home-selection"),
                        session.localizer.gettext(session.preferredLocale(), "home-invoices") + '|' +
                        session.localizer.gettext(session.preferredLocale(), "home-orders"));
                },
                function (session, results){
                    if(results.response.index == 0){
                        session.beginDialogSafe('invoices:unpaid', parent);
                    }
                    else{
                        session.send(session.localizer.gettext(session.preferredLocale(), "placeholder"));
                        session.beginDialogSafe('home:options', parent);
                    }
                }
            ])

            return library;
        }
    };
}
