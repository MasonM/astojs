{
  var ast = module.require('./ast');
  
  function filledArray(count, value) {
    var result = new Array(count), i;

    for (i = 0; i < count; i++) {
      result[i] = value;
    }

    return result;
  }

  function extractOptional(optional, index) {
    return optional ? optional[index] : null;
  }

  function extractList(list, index) {
    var result = new Array(list.length), i;

    for (i = 0; i < list.length; i++) {
      result[i] = list[i][index];
    }

    return result;
  }

  function buildList(first, rest, index) {
    return [first].concat(extractList(rest, index));
  }

  function buildTree(first, rest, builder) {
    var result = first, i;

    for (i = 0; i < rest.length; i++) {
      result = builder(result, rest[i]);
    }

    return result;
  }

  function buildBinaryExpression(first, rest) {
    return buildTree(first, rest, function(result, element) {
      return insertLocationData(new ast.BinaryExpression(result, element[1], element[3]), text(), line(), column());
    });
  }
  
  function buildLogicalExpression(first, rest) {
    return buildTree(first, rest, function(result, element) {
      return insertLocationData(new ast.LogicalExpression(result, element[1], element[3]), text(), line(), column());
    });
  }
  
  function buildNullCoalescingExpression(first, rest) {
    return buildTree(first, rest, function(result, element) {
      return insertLocationData(new ast.NullCoalescingExpression(result, element[3]), text(), line(), column());
    });
  }
 
  function optionalList(value) {
    return value !== null ? value : [];
  }
  
  function insertLocationData(node, text, line, column) {
    var lines = text.split("\n");
    node.loc = {
      "start": {
        "line": line,
        "column": column - 1
      },
      "end": {
        "line": line + lines.length - 1,
        "column": (lines.length === 1 ? (column - 1) : 0) + 
          lines[lines.length - 1].length
      }
    };
    
    return node;
  }
}

Start
  = __ program:Program __ { return program; }
  
/* ----- A.1 Lexical Grammar ----- */

SourceCharacter
  = .

WhiteSpace "whitespace"
  = "\t"
  / "\v"
  / "\f"
  / " "
  / "\u00A0"
  / "\uFEFF"
  / Zs

LineTerminator
  = [\n\r\u2028\u2029]

LineTerminatorSequence "end of line"
  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028"
  / "\u2029"

Comment "comment"
  = MultiLineComment
  / SingleLineComment

MultiLineComment
  = "/*" (!"*/" SourceCharacter)* "*/"

MultiLineCommentNoLineTerminator
  = "/*" (!("*/" / LineTerminator) SourceCharacter)* "*/"

SingleLineComment
  = "//" (!LineTerminator SourceCharacter)*

Identifier
  = !ReservedWord name:IdentifierName { return name; }

IdentifierName "identifier"
  = first:IdentifierStart rest:IdentifierPart* {
      return insertLocationData(new ast.Identifier(first + rest.join("")), text(), line(), column());
    }

// From https://developer.apple.com/library/mac/documentation/AppleScript/Conceptual/AppleScriptLangGuide/conceptual/ASLR_lexical_conventions.html#//apple_ref/doc/uid/TP40000983-CH214-SW4
// "An identifier must begin with a letter and can contain any of these characters: ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_"
IdentifierStart
  = [a-z]i

IdentifierPart
  = [a-z0-9_]i
  // "AppleScript provides a loophole to the preceding rules: identifiers whose first and last characters are vertical bars (|) can contain any characters. The leading and trailing vertical bars are not considered part of the identifier."
  / "|" body:("\\|" / [^|])+ "|" { return body.join(""); }

ReservedWord
  = Keyword
  / NullLiteral
  / BooleanLiteral
  
// Ref: https://developer.apple.com/library/mac/documentation/AppleScript/Conceptual/AppleScriptLangGuide/reference/ASLR_keywords.html#//apple_ref/doc/uid/TP40000983-CH222-SW2
Keyword
  = "about"
  / "above"
  / "after"
  / "against"
  / AndToken
  / "apart from"
  / "around"
  / AsToken
  / "aside from"
  / "at"
  / "back"
  / "before"
  / "beginning"
  / "behind"
  / "below"
  / "beneath"
  / "beside"
  / "between"
  / "but"
  / ByToken
  / "considering"
  / ContinueToken
  / CopyToken
  / DivToken
  / "does"
  / "eighth"
  / ElseToken
  / EndToken
  / "equal"
  / "equals"
  / "error"
  / "every"
  / "exit"
  / FalseToken
  / "fifth"
  / "first"
  / ForToken
  / "fourth"
  / FromToken
  / "front"
  / "get"
  / "given"
  / "gloal"
  / IfToken
  / "ignoring"
  / InToken
  / "instead of"
  / "into"
  / "is"
  / "it"
  / "its"
  / "last"
  / "local"
  / "me"
  / "middle"
  / ModToken
  / "my"
  / "ninth"
  / NotToken
  / OfToken
  / OnToken
  / "onto"
  / OrToken
  / "out of"
  / "over"
  / PropertyToken
  / "put"
  / "ref"
  / "reference"
  / RepeatToken
  / ReturnToken
  / ScriptToken
  / "second"
  / SetToken
  / "seventh"
  / "since"
  / "sixth"
  / "some"
  / "tell"
  / "tenth"
  / "that"
  / TheToken
  / ThenToken
  / "third"
  / "through"
  / "thru"
  / "timeout"
  / TimesToken
  / ToToken
  / "transaction"
  / TrueToken
  / TryToken
  / UntilToken
  / UseToken
  / "where"
  / WhileToken
  / "whose"
  / WithToken
  / "without"
  / ThisToken
  / ThrowToken
  / BreakToken
  / CatchToken
  / DefaultToken
  / NullToken
  / UndefinedToken

Literal
  = NullLiteral
  / UndefinedLiteral
  / BooleanLiteral
  / NumericLiteral
  / StringLiteral
  
NullLiteral
  = NullToken { return insertLocationData(new ast.NullLiteral(), text(), line(), column()); }

UndefinedLiteral
  = UndefinedToken { return insertLocationData(new ast.UndefinedLiteral(), text(), line(), column()); }
  
BooleanLiteral
  = TrueToken  { return insertLocationData(new ast.BooleanLiteral("true"), text(), line(), column()); }
  / FalseToken { return insertLocationData(new ast.BooleanLiteral("false"), text(), line(), column()); }

NumericLiteral "number"
  = literal:DecimalLiteral !(IdentifierStart / DecimalDigit) {
      return literal;
    }
    
DecimalLiteral
  = DecimalIntegerLiteral "." !"." DecimalDigit* ExponentPart? {
      return insertLocationData(new ast.NumberLiteral(text()), text(), line(), column());
    }
  / "." !"." DecimalDigit+ ExponentPart? {
      return insertLocationData(new ast.NumberLiteral(text()), text(), line(), column());
    }
  / DecimalIntegerLiteral ExponentPart? {
      return insertLocationData(new ast.NumberLiteral(text()), text(), line(), column());
    }

DecimalIntegerLiteral
  = "0"
  / NonZeroDigit DecimalDigit*

DecimalDigit
  = [0-9]

NonZeroDigit
  = [1-9]

ExponentPart
  = ExponentIndicator SignedInteger

ExponentIndicator
  = "E+"

SignedInteger
  = [+-]? DecimalDigit+

StringLiteral "string"
  = '"' chars:DoubleStringCharacter* '"' {
      return insertLocationData(new ast.StringLiteral(chars, column()), text(), line(), column());
    }
  / "'" chars:SingleStringCharacter* "'" {
      return insertLocationData(new ast.StringLiteral(chars, column()), text(), line(), column());
    }

DoubleStringCharacter
  = !('"' / "\\" / LineTerminator) SourceCharacter { return text(); }
  / "\\" sequence:EscapeSequence { return sequence; }
  / LineContinuation
  / LineTerminator __ { return new ast.StringLiteral.NewLine(text()); }

SingleStringCharacter
  = !("'" / "\\" / LineTerminator) SourceCharacter { return text(); }
  / "\\" sequence:EscapeSequence { return sequence; }
  / LineContinuation
  / LineTerminator __ { return new ast.StringLiteral.NewLine(text()); }

LineContinuation
  = "\\" LineTerminatorSequence { return ""; }
  
EscapeSequence
  = ExpressionSequence
  / CharacterEscapeSequence
  / "0" !DecimalDigit { return "\0"; }

CharacterEscapeSequence
  = SingleEscapeCharacter
  / NonEscapeCharacter

SingleEscapeCharacter
  = "'"
  / '"'
  / "\\"
  / "b"  { return "\b";   }
  / "f"  { return "\f";   }
  / "n"  { return "\n";   }
  / "r"  { return "\r";   }
  / "t"  { return "\t";   }
  / "v"  { return "\x0B"; }
  
NonEscapeCharacter
  = !(EscapeCharacter / LineTerminator) SourceCharacter { return text(); }

EscapeCharacter
  = SingleEscapeCharacter
  / DecimalDigit
  / "x"
  / "u"

ExpressionSequence
  = "(" expression:Expression ")" {
      return expression;
    }

// Separator, Space
Zs = [\u0020\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]

/* Tokens */

AndToken          = "and"           !IdentifierPart
OrToken           = "or"            !IdentifierPart
ReturnToken       = "return"        !IdentifierPart
SetToken          = "set"           !IdentifierPart
IfToken           = "if"            !IdentifierPart
TheToken          = "the"           !IdentifierPart
ThenToken         = "then"          !IdentifierPart
ElseToken         = "else"          !IdentifierPart
EndToken          = "end"           !IdentifierPart
ForToken          = "for"           !IdentifierPart
TrueToken         = "true"          !IdentifierPart
FalseToken        = "false"         !IdentifierPart
NullToken         = "null"          !IdentifierPart
MissingValueToken = "missing value" !IdentifierPart
UseToken          = "use"           !IdentifierPart
ThisToken         = "this"          !IdentifierPart
ThrowToken        = "throw"         !IdentifierPart
BreakToken        = "break"         !IdentifierPart
ContinueToken     = "continue"      !IdentifierPart
WhileToken        = "while"         !IdentifierPart
RepeatToken       = "repeat"        !IdentifierPart
TimesToken        = "times"         !IdentifierPart
UntilToken        = "until"         !IdentifierPart
InToken           = "in"            !IdentifierPart
OfToken           = "of"            !IdentifierPart
TryToken          = "try"           !IdentifierPart
OnToken           = "on"            !IdentifierPart
ToToken           = "to"            !IdentifierPart
CatchToken        = "catch"         !IdentifierPart
DefaultToken      = "default"       !IdentifierPart
NotToken          = "not"           !IdentifierPart
FromToken         = "from"          !IdentifierPart
WithToken         = "with"          !IdentifierPart
AsToken           = "as"            !IdentifierPart
ByToken           = "by"            !IdentifierPart
DoToken           = "do"            !IdentifierPart
UndefinedToken    = "undefined"     !IdentifierPart
DivToken          = "div"           !IdentifierPart
ModToken          = "mod"           !IdentifierPart
CopyToken         = "copy"          !IdentifierPart
StartsWithToken   = ("start with" / "starts with" / "begin with" / "begins with") !IdentifierPart
EndsWithToken     = ("end with" / "ends with") !IdentifierPart
PropertyToken     = ("property" / "prop") !IdentifierPart
ScriptToken       = "script"
__
  = (WhiteSpace / LineTerminatorSequence / Comment / TheToken)*

_
  = (WhiteSpace / MultiLineCommentNoLineTerminator / TheToken)*
  
EOS
  = __ (LineTerminatorSequence / EOF)

EOF
  = !.

Program
  = body:StatementList? {
      return insertLocationData(new ast.Program(optionalList(body)), text(), line(), column());
    }
   
StatementList
  = first:Statement rest:(__ Statement)* {
      return buildList(first, rest, 1);
    }

Statement
  = VariableStatement
  / ScriptDeclaration
  / FunctionDeclaration
  / IfStatement
  / ReturnStatement
  / ThrowStatement
  / TryStatement
  / BreakStatement
  / RepeatStatement
  / ExpressionStatement
    
ExpressionStatement
  = !OnToken expression:Expression {
      return insertLocationData(new ast.ExpressionStatement(expression), text(), line(), column());
    }

Block
  = body:(StatementList __)? {
      return insertLocationData(new ast.BlockStatement(optionalList(extractOptional(body, 0))), text(), line(), column());
    }
    
VariableStatement
  = SetToken __ id:Identifier __ ToToken __ init:Expression {
      return insertLocationData(new ast.VariableDeclarationStatement(id, init), text(), line(), column());
    }
  / CopyToken __ init:Expression __ ToToken __ id:Identifier {
      return insertLocationData(new ast.VariableDeclarationStatement(id, init), text(), line(), column());
    }
 
FunctionDeclaration
  = (OnToken / ToToken) __ id:Identifier __
    "(" __ params:(ParameterList __)? ")" __
    __ body:Block __ 
    EndToken _ Identifier?
    {
      return insertLocationData(
          new ast.SubroutinePositionalDeclarationStatement(id, optionalList(extractOptional(params, 0)), body), 
       text(), line(), column());
    }
    
ParameterList
  = first:Parameter rest:(__ "," __ Parameter)* {
      return buildList(first, rest, 3);
    }
    
Parameter
  = label:Identifier __ ":" __ id:Identifier{
    return insertLocationData(new ast.Parameter(label, id), text(), line(), column());
  }
  / id:Identifier {
    return insertLocationData(new ast.Parameter(null, id), text(), line(), column());
  }
  
ScriptDeclaration
  = ScriptToken __ id:Identifier
    __ properties:ScriptPropertyList? __
    __ handlers:FunctionDeclaration* __
    __ statements:Block __ 
    EndToken _ ScriptToken?
    {
      return insertLocationData(
        new ast.ScriptDeclarationStatement(id, optionalList(properties), optionalList(handlers), optionalList(statements)),
        text(), line(), column()
      );
    }

ScriptPropertyList
  = first:ScriptProperty rest:(__ ScriptProperty)* { return buildList(first, rest, 1); }

ScriptProperty
  = PropertyToken __ label:Identifier __ ":" __ initialValue:Expression __ {
      return insertLocationData(new ast.ScriptProperty(label, initialValue), text(), line(), column());
  }

IfStatement
  = IfToken __ test:Expression __ ThenToken? __
    consequent:Block __
    alternate:(ElseToken __ Block __)?
    (EndToken _ IfToken? / EOS)
    {
      return insertLocationData(new ast.IfStatement(test, consequent, extractOptional(alternate, 2)), text(), line(), column());
    }
  / IfToken _ test:Expression _ ThenToken? _ consequent:Statement _ (EndToken _ IfToken)? {
      return insertLocationData(new ast.IfStatement(test, consequent, null), text(), line(), column());
    }
    
ReturnStatement
  = ReturnToken _ argument:Expression {
      return insertLocationData(new ast.ReturnStatement(argument), text(), line(), column());
    }
  / ReturnToken {
      return insertLocationData(new ast.ReturnStatement(null), text(), line(), column());
    }

ThrowStatement
  = ThrowToken _ argument:Expression EOS {
      return insertLocationData(new ast.ThrowStatement(argument), text(), line(), column());
    }
    
TryStatement
  = TryToken __ block:Block __ handler:Catch {
      return insertLocationData(new ast.TryStatement(block, handler, null), text(), line(), column());
    }
    
Catch
  = CatchToken __ param:Identifier __ body:Block {
      return insertLocationData(new ast.CatchClause(param, body), text(), line(), column());
    }

BreakStatement
  = BreakToken EOS {
      return insertLocationData(new ast.BreakStatement(), text(), line(), column());
    }

RepeatStatement
  = RepeatToken __ body:Block __ EndToken _ RepeatToken? {
        return insertLocationData(new ast.RepeatForeverStatement(body), text(), line(), column());
    }
  / RepeatToken __ num:DecimalLiteral __ TimesToken? __ body:Block __ EndToken _ RepeatToken? {
        return insertLocationData(new ast.RepeatNumTimesStatement(num, body), text(), line(), column());
    }
  / RepeatToken __ WhileToken __ test:Expression __ body:Block __ EndToken _ RepeatToken? {
        return insertLocationData(new ast.RepeatWhileStatement(test, body), text(), line(), column());
  }
  / RepeatToken __ UntilToken __ test:Expression __ body:Block __ EndToken _ RepeatToken? {
        return insertLocationData(new ast.RepeatUntilStatement(test, body), text(), line(), column());
  }
  / RepeatToken __ WithToken __ loopVariable:Identifier __
    FromToken __ start:DecimalLiteral __
    ToToken __ end:DecimalLiteral __
    step:(ByToken __ DecimalLiteral)? __
    body:Block __
    EndToken _ RepeatToken? {
        return insertLocationData(new ast.RepeatRangeStatement(loopVariable, start, end, extractOptional(step, 2), body), text(), line(), column());
  }
  / RepeatToken __ WithToken __ loopVariable:Identifier __ InToken __ list:Expression __ body:Block __ EndToken _ RepeatToken? {
        return insertLocationData(new ast.RepeatListStatement(loopVariable, list, body), text(), line(), column());
  }

LogicalORExpression
  = first:LogicalANDExpression
    rest:(__ LogicalOROperator __ LogicalANDExpression)*
    { return buildLogicalExpression(first, rest); }
    
LogicalOROperator
  = OrToken { return "||"; }
  
LogicalANDExpression
  = first:EqualityExpression
    rest:(__ LogicalANDOperator __ EqualityExpression)*
    { return buildLogicalExpression(first, rest); }
    
LogicalANDOperator
  = AndToken { return "&&"; }
  
EqualityExpression
  = first:RelationalExpression
    rest:(__ EqualityOperator __ RelationalExpression)*
    { return buildBinaryExpression(first, rest); }
    
EqualityOperator
  = "="
  / "!="
  / "equals"
  / "equal to"
  / "equal"
  / "is equal to"
  / "is equal"
  / "≠"
  / "does not equal"
  / "doesn't equal"
  / "is not equal to"
  / "is not equal"  
  / "is not"
  / "isn't equal to"
  / "isn't equal"
  / "isn't"
  / "doesn't equal"
  / "does not equal"

RelationalExpression
  = first:StartsWithExpression
    rest:(__ RelationalOperator __ StartsWithExpression)*
    { return buildBinaryExpression(first, rest); }

RelationalOperator
  = $("<" !"=")
  / $(">" !"=")
  / "<="
  / "≤"
  / ">="
  / "≥"
  / "comes before"
  / "comes after"
  / "is less than or equal to"
  / "is less than or equal"
  / "is less than"
  / "is not greater than or equal to"
  / "is not greater than or equal"
  / "isn't greater than or equal to"
  / "isn't greater than or equal"
  / "greater than or equal to"
  / "greater than or equal"
  / "greater than"
  / "is greater than or equal to"
  / "is greater than or equal"
  / "is greater than"
  / "is not less than or equal to"
  / "is not less than or equal"
  / "isn't less than or equal to"
  / "isn't less than or equal"
  / "does not come after"
  / "doesn't come after"
  / "is not greater than"
  / "isn't greater than"
  / "less than or equal to"
  / "less than or equal"
  / "does not come before"
  / "doesn't come before"
  / "is not less than"
  / "isn't less than"
  / "less than"
  / "contains"
  / "does not contain"
  / "doesn't contain"
  / "is in"
  / "is contained by"
  / "is not in"
  / "is not contained by"
  / "isn't contained by"

StartsWithExpression
  = left:EndsWithExpression
    rest:(__ StartsWithToken __ EndsWithExpression)* {
      return buildTree(left, rest, function(result, element) {
        return insertLocationData(new ast.StartsWithExpression(result, element[3]), text(), line(), column());
      });
    }

EndsWithExpression
  = left:ConcatenativeExpression
    rest:(__ EndsWithToken __ ConcatenativeExpression)* {
      return buildTree(left, rest, function(result, element) {
        return insertLocationData(new ast.EndsWithExpression(result, element[3]), text(), line(), column());
      });
    }

ConcatenativeExpression
  = first:AdditiveExpression
    rest:(__ ConcatenativeOperator __ AdditiveExpression)*
    { return buildBinaryExpression(first, rest); }

ConcatenativeOperator
    = $("&" !"&")

AdditiveExpression
  = first:MultiplicativeExpression
    rest:(__ AdditiveOperator __ MultiplicativeExpression)*
    { return buildBinaryExpression(first, rest); }
    
AdditiveOperator
  = "+"
  / "-"

MultiplicativeExpression
  = first:ExponentiativeExpression
    rest:(__ MultiplicativeOperator __ UnaryExpression)*
    { return buildBinaryExpression(first, rest); }

MultiplicativeOperator
  = $("*" !"*")
  / "/"
  / "÷"
  / "^"
  / $ModToken
  / $DivToken

ExponentiativeExpression
  = first:UnaryExpression
    rest:(__ ExponentiativeOperator __ UnaryExpression)*
    { return buildBinaryExpression(first, rest); }

ExponentiativeOperator
  = "**"
  
UnaryExpression
  = operator:UnaryOperator __ argument:PrimaryExpression {
      return insertLocationData(new ast.UnaryExpression(operator, argument), text(), line(), column());
    }
  / PrimaryExpression

UnaryOperator
  = $NotToken { return "!" }
  / "+"
  / "-"

PrimaryExpression
  = ThisExpression
  / Identifier
  / Literal
  / ArrayLiteral
  / RecordLiteral
  / "(" __ expression:Expression __ ")" { return expression; }

ThisExpression
  = ThisToken {
      return insertLocationData(new ast.ThisExpression(), text(), line(), column());
    }
  
Expression
  = LogicalORExpression
      
ArrayLiteral
  = "{" __ "}" { 
       return new ast.ArrayExpression([]); 
     }
  / "{" __ elements:ElementList __ "}" {
      return insertLocationData(new ast.ArrayExpression(elements), text(), line(), column());
    }

ElementList
  = first:Expression rest:(
      __ "," __ element:Expression { return element; }
    )*
    { return Array.prototype.concat.apply(first, rest); }
    
ArrayPattern
  = "{" __ "}" { 
       return  new ast.ArrayPattern([]); 
     }
  / "{" __ elements:PatternElementList __ "}" {
      return insertLocationData(new ast.ArrayPattern(elements), text(), line(), column());
    }

PatternElementList
  = first:PatternElement rest:(
      __ "," __ element:PatternElement { return element; }
    )*
    { return Array.prototype.concat.apply(first, rest); }

PatternElement
  = Identifier
  / ArrayPattern

RecordLiteral
  = "{" __ properties:RecordPropertyNameAndValueList __ "}" {
       return insertLocationData(new ast.RecordExpression(properties), text(), line(), column());
     }
  / "{" __ properties:RecordPropertyNameAndValueList __ "," __ "}" {
       return insertLocationData(new ast.RecordExpression(properties), text(), line(), column());
     }
     
RecordPropertyNameAndValueList
  = first:RecordPropertyAssignment rest:(__ "," __ RecordPropertyAssignment)* {
      return buildList(first, rest, 3);
    }

RecordPropertyAssignment
  = key:RecordPropertyName __ ":" __ value:Expression {
      return insertLocationData(new ast.RecordProperty(key, value, false, false), text(), line(), column());
    }

RecordPropertyName
  = IdentifierName
  / StringLiteral
  / NumericLiteral
