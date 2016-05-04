'use strict';

class Comment {
    constructor(type, value) {
        if (type !== 'Block' && type !== 'Line') {
            throw "invalid type: " + type;
        }
        this.type = type;
        this.value = value;
    }
}

module.exports.Comment = Comment;
