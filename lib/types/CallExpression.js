'use strict';

var traits = require('../symbol-traits');
var utils  = require('../utils');

exports.parse = (walker, node, container, scope, parentNode) => {
    var name = utils.safeName(node.base);
    var call = traits.symbol(name, traits.SymbolKind.reference, utils.isLocal(node.base));
    call.container = container;
    call.location  = utils.getLocation(node.base);
    call.bases     = utils.extractBases(node.base);

    walker.addSymbol(call);
    utils.parseBase(walker, node.base, container, scope, node, traits);

    node.arguments && walker.walkNodes(node.arguments, container, scope, parentNode);
    node.argument && walker.walkNode(node.argument, container, scope, parentNode);
}