var appRoot = require('app-root-path');

function Node() {
  this.codeGenerated = false;
  this.definedIdentifiers = [];

  Object.defineProperty(this, 'parent', {
    value: null,
    writable: true,
    configurable: true,
    enumerable: false
  });

  var self = this;
  this.blockWrap = function() {
    if (self.type == 'BlockStatement') {
      return self;
    }

    var myParent = self.parent;
    var blockStatement = require(appRoot + '/src/ast/statements/BlockStatement');

    var block = new blockStatement.BlockStatement([self]);
    block.parent = myParent;

    return block;
  };
}

Node.prototype.codegen = function() {
  if (this.codeGenerated) {
    return false;
  }

  this.codeGenerated = true;
  return true;
};

exports.Node = Node;
