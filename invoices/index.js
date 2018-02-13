var builder = require('botbuilder');
var sagebuilder = require('../../../libraries/sage-botlibraries-botbuilder');
var request = require('request');
var config = require('../config');

module.exports = function (parent) {
    return {
        //library Export. This allows us to register the library with the bot
        libraryExport: function () {
            //register the library. 
            var library = sagebuilder.library(parent.botName(), 'invoices');
            //Define the dialogs that will be called
            library.dialog('not_posted', [
                function (session, results) {
                    builder.Prompts.text(session, session.localizer.gettext(session.preferredLocale(), "invoices-bp"));
                },
                function (session, results, next) {
                    session.sendTyping();
                    if (results.response.toLowerCase() == "no"){
                        var url = "http://admin:admin@scmx3-dev-mja.sagefr.adinternal.com:8124/sdata/x3/erp/LOCALDEV/SINVOICEV?representation=SINVOICEV.$query"
                    } else {
                        var url = 'http://admin:admin@scmx3-dev-mja.sagefr.adinternal.com:8124/sdata/x3/erp/LOCALDEV/SINVOICEV?representation=SINVOICEV.$query&where=(BPCINV%20eq%20%22' + results.response + '%22)'
                    }
                    // console.log(session.userData.sessionCookie)
                    var options = {
                        url: url,
                        headers: {
                            'Authorization':  config.get('Auth'),
                            // 'Cookie': session.userData.sessionCookie,
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'}
                    };
                    request(options, function (err, response, body) {
                        if (response.statusCode == 200) {
                            var body_json = JSON.parse(body.replace(/\\%/g, '%'));
                            var invoices_num = body_json.$resources.length
                            session.send(session.localizer.gettext(session.preferredLocale(), "invoices-number"), invoices_num);
                        } else {
                            session.send(session.localizer.gettext(session.preferredLocale(), "woops"));
                        }
                        session.endDialog();
                    });
                },

            ]).triggerAction({
                matches: /not posted invoice/i
            })
            return library;
        }
    };
}
