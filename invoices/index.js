const builder = require('botbuilder');
const sagebuilder = require('../../../libraries/sage-botlibraries-botbuilder');
const fetch = require('node-fetch');
const jsonfile = require('jsonfile');
const file = 'data.json'
const config = require('../config');

module.exports = function (parent) {
    return {
        //library Export. This allows us to register the library with the bot
        libraryExport: function () {
            //register the library.
            let library = sagebuilder.library(parent.botName(), 'invoices');
            //Define the dialogs that will be called
            library.dialog('not_posted', [
                function (session, results) {
                    builder.Prompts.text(session, session.localizer.gettext(session.preferredLocale(), "invoices-bp"));
                },
                function (session, results, next) {
                    session.sendTyping();
                    let url;
                    if (results.response.toLowerCase() == "no"){
                        url = config['apiUrl'] + '/sdata/x3/erp/LOCALDEV/SINVOICEV?representation=SINVOICEV.$query'
                    } else {
                        url = config['apiUrl'] + '/sdata/x3/erp/LOCALDEV/SINVOICEV?representation=SINVOICEV.' +
                                                 '$query&where=(BPCINV%20eq%20%22' + results.response + '%22)'
                    }
                    let cookie;
                    let responseSuccess = false;
                    try {
                      cookie = jsonfile.readFileSync(file)["cookie"];
                    } catch(err){}

                    fetch(url, {
                      method: 'GET',
                      headers: {
                        'Accept': 'text/plain',
                        'Cookie': cookie
                      }
                    }).then(response => response.text())
                      .then((responseData) => {
                        let bodyJson = JSON.parse(responseData.replace(/\\%/g, '%'));
                        if(bodyJson.hasOwnProperty('$diagnoses')) {
                          let authCode = new Buffer(config['user'] + ':' + config['password']).toString('base64');
                          authCode = 'Basic ' + authCode
                          return fetch(url, {
                            method: 'GET',
                            headers: {
                              'Accept': 'text/plain',
                              'Authorization': authCode
                            }
                          }).then(response2 => {
                              cookie = response2.headers.get("set-cookie");
                              cookie = cookie.substring(0, cookie.indexOf(';'));
                              const sessionX3 = {cookie: cookie};
                              jsonfile.writeFile(file, sessionX3, {spaces: 2, EOL: '\r\n'});
                              return response2.text();})
                            .then((responseData2) => {
                              bodyJson = JSON.parse(responseData2.replace(/\\%/g, '%'));
                              responseSuccess = true;
                            }).catch((error2) => session.send(session.localizer.gettext(session.preferredLocale(),
                                                                                        "woops")));
                        } else {
                          responseSuccess = true;
                        }
                        if (responseSuccess) {
                          const invoicesNum = bodyJson.$resources.length
                          session.send(session.localizer.gettext(session.preferredLocale(),"invoices-number"),
                                       invoicesNum);
                        }

                 	  }).catch((error) => session.send(session.localizer.gettext(session.preferredLocale(), "woops")));
                    session.endDialog();
                },

            ]).triggerAction({
                matches: /not posted invoice/i
            })
            return library;
        }
    };
}
