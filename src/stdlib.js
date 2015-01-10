// astojs standard library
"use strict";

function Record(items) {
    this.class = 'record';
    this.setFromObject(items);
}

Record.prototype.setFromObject = function(arg) {
    var keysArray = Object.keys(Object(arg));
    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
        var nextKey = keysArray[nextIndex];
        var desc = Object.getOwnPropertyDescriptor(arg, nextKey);
        if (desc !== undefined && desc.enumerable) this[nextKey] = arg[nextKey];
    }
}

// Ref: https://developer.apple.com/library/mac/documentation/AppleScript/Conceptual/AppleScriptLangGuide/reference/ASLR_operators.html#//apple_ref/doc/uid/TP40000983-CH5g-BAJEGEEC
Record.prototype.concat = function(arg) {
    var concatenated = new Record(this);
    concatenated.setFromObject(arg);
    return concatenated;
}

// Ref: https://developer.apple.com/library/mac/documentation/AppleScript/Conceptual/AppleScriptLangGuide/reference/ASLR_operators.html#//apple_ref/doc/uid/TP40000983-CH5g-124095
Record.prototype.equals = function(other) {
    var thisProps = Object.getOwnPropertyNames(this);
    var otherProps = Object.getOwnPropertyNames(other);

    if (thisProps.length != otherProps.length) {
        return false;
    }

    for (var i = 0; i < thisProps.length; i++) {
        var propName = thisProps[i];
        if (this[propName] !== other[propName]) {
            return false;
        }
    }

    return true;
}

module.exports.Record = Record
