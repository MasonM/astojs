function Node() {
  this.codeGenerated = false;
  this.definedIdentifiers = [];

  Object.defineProperty(this, 'parent', {
    value: null,
    writable: true,
    configurable: true,
    enumerable: false
  });
}

Node.prototype.codegen = function() {
  if (this.codeGenerated) {
    return false;
  }

  this.codeGenerated = true;
  return true;
};

exports.Node = Node;
