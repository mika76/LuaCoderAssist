/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';
const ldoc_1 = require('./commands/ldoc');
const showMetricDetails = require('./commands/codemetrics-details');
const path = require("path");
const vscode = require("vscode");
const languageclient = require("vscode-languageclient");
const logger_1 = require('./lib/logger');
const CodeMetricsProvider = require('./providers/codemetrics-provider');

function activate(context) {
    let serverModule = context.asAbsolutePath(path.join('server', 'server.js'));
    let debugOptions = { execArgv: ["--nolazy", "--debug=6004"] };
    let serverOptions = {
        run: { module: serverModule, transport: languageclient.TransportKind.ipc },
        debug: { module: serverModule, transport: languageclient.TransportKind.ipc, options: debugOptions }
    };

    let clientOptions = {
        documentSelector: ['lua'],
        synchronize: {
            configurationSection: 'LuaCoderAssist',
            fileEvents: [vscode.workspace.createFileSystemWatcher('**/*.lua', false, true, false)]
        }
    };

    logger_1.Logger.configure();

    let connection = new languageclient.LanguageClient('LuaCoderAssist', serverOptions, clientOptions);
    context.subscriptions.push(connection.start());

    context.subscriptions.push(
        vscode.commands.registerCommand(ldoc_1.LDocCommandName, () => {
            let ldoc = new ldoc_1.LDocCommand(connection);
            ldoc.onRequest();
        })
    );

    context.subscriptions.push(
        vscode.languages.registerCodeLensProvider('lua',
            new CodeMetricsProvider.CodeMetricsProvider()
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand(showMetricDetails.ShowMetricsDetailsCommand, (params) => {
            let showDetails = new showMetricDetails.ShowMetricsDetails();
            showDetails.showDetails(params);
        })
    );
}

exports.activate = activate;


