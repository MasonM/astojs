// astojs standard library
'use strict';

Array.prototype.startsWith = function(arg) {
    if (!Array.isArray(arg)) return this[0] === arg;
    if (arg.length > this.length) return false;
    for (var i = 0; i < Math.min(this.length, arg.length); i++) {
        if (this[i] !== arg[i]) return false;
    }
    return true;
}

Array.prototype.endsWith = function(arg) {
    if (!Array.isArray(arg)) return this[this.length - 1] === arg;
    if (arg.length > this.length) return false;
    var startingIndex = this.length - arg.length;
    for (var i = startingIndex; i < this.length; i++) {
        if (this[i] !== arg[i - startingIndex]) return false;
    }
    return true;
}

Array.prototype.contains = function(searchElement) {
    var isSearchElementAnArray = Array.isArray(searchElement);
    var j = 0, maxSublistMatchCount = 0;
    for (var i = 0; i < this.length; i++) {
        if (isSearchElementAnArray) {
            if (searchElement[j] === this[i]) {
                j++;
                if (j > maxSublistMatchCount) maxSublistMatchCount = j;
            } else {
                j = 0;
            }
        } else if (searchElement === this[i]) {
            return true;
        }
    }
    return isSearchElementAnArray ? maxSublistMatchCount === searchElement.length : false;
}

String.prototype.contains = function() {
    return String.prototype.indexOf.apply(this, arguments) !== -1;
}

// polyfill: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function(str) { return this.indexOf(str) === 0; };
}

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

Record.prototype.contains = function(other) {
    if (!other instanceof Record) {
        throw new TypeError('Called Record.contains() with a non-record');
    }
    var otherProps = Object.getOwnPropertyNames(other);
    for (var i = 0; i < otherProps.length; i++) {
        var propName = otherProps[i];
        if (!this.hasOwnProperty(propName) || this[propName] !== other[propName]) {
            return false;
        }
    }
    return true;
}

module.exports.Record = Record
