{
  var appRoot = require('app-root-path'),
    ast = require(appRoot + '/src/ast');

  function extractOptional(optional, index) {
    return optional ? optional[index] : null;
  }

  function optionalList(value) {
    return value !== null ? value : [];
  }

  function extractList(list, index) {
    return list.map(subList => subList[index]);
  }

  function buildList(first, rest, index) {
    return [first].concat(extractList(rest, index));
  }

  function buildTree(first, rest, nodeFactory) {
    return rest.reduce((result, element) => {
      return insertLocationData(nodeFactory(result, element), text(), location());
    }, first);
  }

  function buildBinaryExpression(first, rest) {
    return buildTree(first, rest, (result, element) => {
      return new ast.BinaryExpression(result, element[1], element[3]);
    });
  }
  
  function insertLocationData(node, text, location) {
    node.loc = {
      "start": {
        "line": location.start.line - 1,
        "column": location.start.column - 1,
        "offset": location.start.offset
      },
      "end": {
        "line": location.end.line - 1,
        "column": location.end.column - 1,
        "offset": location.end.offset
      }
    };
    node.range =  [location.start.offset, location.end.offset];
    return node;
  }
}

Start
  = program:Program { return program; }
  
StartComments
  = comments:(Comment / . { return null; })* { return comments.filter(elem => elem !== null); }


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

SingleLineCommentStart
  = "--"
  / "#"

MultiLineCommentStart
  = "(*"

MultiLineCommentEnd
  = "*)"

Comment
  = MultiLineComment
  / SingleLineComment

MultiLineComment
  = MultiLineCommentStart value:((!(MultiLineCommentEnd / MultiLineCommentStart) SourceCharacter) / MultiLineComment)* MultiLineCommentEnd {
      return insertLocationData(new ast.Comment('Block', extractList(value, 1).join('')), text(), location());
    }

MultiLineCommentNoLineTerminator
  = MultiLineCommentStart value:((!(MultiLineCommentEnd / MultiLineCommentStart / LineTerminator) SourceCharacter) / MultiLineCommentNoLineTerminator)* MultiLineCommentEnd {
      return insertLocationData(new ast.Comment('Block', extractList(value, 1).join('')), text(), location());
    }

SingleLineComment
  = SingleLineCommentStart value:(!LineTerminator SourceCharacter)* {
      return insertLocationData(new ast.Comment('Line', extractList(value, 1).join('')), text(), location());
    }

Identifier
  = !ReservedWord name:IdentifierName { return name; }

IdentifierName "identifier"
  = first:IdentifierStart rest:IdentifierPart* {
      return insertLocationData(new ast.Identifier(first + rest.join("")), text(), location());
    }

// From https://developer.apple.com/library/mac/documentation/AppleScript/Conceptual/AppleScriptLangGuide/conceptual/ASLR_lexical_conventions.html#//apple_ref/doc/uid/TP40000983-CH214-SW4
// "An identifier must begin with a letter and can contain any of these characters: ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_"
// (despite the above, Applescript allows an identifier to start with an underscore too)
IdentifierStart
  = [_a-z]i

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
  = AboutToken
  / AboveToken
  / AfterToken
  / AgainstToken
  / AndToken
  / ApartFromToken
  / AroundToken
  / AsToken
  / AsideFromToken
  / AtToken
  / BackToken
  / BeforeToken
  / BeginningToken
  / BehindToken
  / BelowToken
  / BeneathToken
  / BesideToken
  / BetweenToken
  / ButToken
  / ByToken
  / ConsideringToken
  / ContinueToken
  / CopyToken
  / DivToken
  / DoesToken
  / EighthToken
  / ElseToken
  / EndToken
  / EqualToken
  / EqualsToken
  / ErrorToken
  / EveryToken
  / ExitToken
  / FalseToken
  / FifthToken
  / FirstToken
  / ForToken
  / FourthToken
  / FromToken
  / FrontToken
  / GetToken
  / GivenToken
  / GlobalToken
  / IfToken
  / IgnoringToken
  / InToken
  / InsteadOfToken
  / IntoToken
  / IsToken
  / ItToken
  / ItsToken
  / LastToken
  / LocalToken
  / MeToken
  / MiddleToken
  / ModToken
  / MyToken
  / NinthToken
  / NotToken
  / OfToken
  / OnToken
  / OntoToken
  / OrToken
  / OutOfToken
  / OverToken
  / PropertyToken
  / PutToken
  / RefToken
  / ReferenceToken
  / RepeatToken
  / ReturnToken
  / ScriptToken
  / SecondToken
  / SetToken
  / SeventhToken
  / SinceToken
  / SixthToken
  / SomeToken
  / TellToken
  / TenthToken
  / ThatToken
  / TheToken
  / ThenToken
  / ThirdToken
  / ThroughToken
  / ThruToken
  / TimeoutToken
  / TimesToken
  / ToToken
  / TransactionToken
  / TrueToken
  / TryToken
  / UntilToken
  / UseToken
  / WhereToken
  / WhileToken
  / WhoseToken
  / WithToken
  / WithoutToken
  / ThisToken
  / ThrowToken
  / BreakToken
  / CatchToken
  / DefaultToken
  / NullToken
  / UndefinedToken
  / AsToken

Literal
  = NullLiteral
  / UndefinedLiteral
  / BooleanLiteral
  / NumericLiteral
  / StringLiteral
  
NullLiteral
  = NullToken { return insertLocationData(new ast.NullLiteral(), text(), location()); }

UndefinedLiteral
  = UndefinedToken { return insertLocationData(new ast.UndefinedLiteral(), text(), location()); }
  
BooleanLiteral
  = TrueToken  { return insertLocationData(new ast.BooleanLiteral("true"), text(), location()); }
  / FalseToken { return insertLocationData(new ast.BooleanLiteral("false"), text(), location()); }

NumericLiteral "number"
  = literal:DecimalLiteral !(IdentifierStart / DecimalDigit) {
      return literal;
    }
    
DecimalLiteral
  = DecimalIntegerLiteral "." !"." DecimalDigit* ExponentPart? {
      return insertLocationData(new ast.NumberLiteral(text()), text(), location());
    }
  / "." !"." DecimalDigit+ ExponentPart? {
      return insertLocationData(new ast.NumberLiteral(text()), text(), location());
    }
  / DecimalIntegerLiteral ExponentPart? {
      return insertLocationData(new ast.NumberLiteral(text()), text(), location());
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
      return insertLocationData(new ast.StringLiteral(chars, location().start.column), text(), location());
    }
  / "'" chars:SingleStringCharacter* "'" {
      return insertLocationData(new ast.StringLiteral(chars, location().start.column), text(), location());
    }

DoubleStringCharacter
  = !('"' / "\\" / LineTerminator) SourceCharacter { return text(); }
    / "\\" sequence:EscapeSequence { return sequence; }
    / LineContinuation
    / LineTerminator __ {
      return insertLocationData(new ast.StringLiteral.NewLine(text()), text(), location());
    }

SingleStringCharacter
  = !("'" / "\\" / LineTerminator) SourceCharacter { return text(); }
  / "\\" sequence:EscapeSequence { return sequence; }
  / LineContinuation
  / LineTerminator __ {
      return insertLocationData(new ast.StringLiteral.NewLine(text()), text(), location());
    }

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

AndToken          = "and"              !IdentifierPart
OrToken           = "or"               !IdentifierPart
ReturnToken       = "return"           !IdentifierPart
SetToken          = "set"              !IdentifierPart
IfToken           = "if"               !IdentifierPart
TheToken          = "the"              !IdentifierPart
ThenToken         = "then"             !IdentifierPart
ElseToken         = "else"             !IdentifierPart
EndToken          = "end"              !IdentifierPart
ForToken          = "for"              !IdentifierPart
TrueToken         = "true"             !IdentifierPart
FalseToken        = "false"            !IdentifierPart
NullToken         = "null"             !IdentifierPart
MissingValueToken = "missing value"    !IdentifierPart
UseToken          = "use"              !IdentifierPart
ThisToken         = "this"             !IdentifierPart
ThrowToken        = "throw"            !IdentifierPart
BreakToken        = "break"            !IdentifierPart
ContinueToken     = "continue"         !IdentifierPart
WhileToken        = "while"            !IdentifierPart
RepeatToken       = "repeat"           !IdentifierPart
TimesToken        = "times"            !IdentifierPart
UntilToken        = "until"            !IdentifierPart
InToken           = "in"               !IdentifierPart
OfToken           = "of"               !IdentifierPart
TryToken          = "try"              !IdentifierPart
OnToken           = "on"               !IdentifierPart
ToToken           = "to"               !IdentifierPart
CatchToken        = "catch"            !IdentifierPart
DefaultToken      = "default"          !IdentifierPart
NotToken          = "not"              !IdentifierPart
FromToken         = "from"             !IdentifierPart
WithToken         = "with"             !IdentifierPart
AsToken           = "as"               !IdentifierPart
ByToken           = "by"               !IdentifierPart
DoToken           = "do"               !IdentifierPart
UndefinedToken    = "undefined"        !IdentifierPart
DivToken          = "div"              !IdentifierPart
ModToken          = "mod"              !IdentifierPart
CopyToken         = "copy"             !IdentifierPart
WithoutToken      = "without"          !IdentifierPart
WhoseToken        = "whose"            !IdentifierPart
WhereToken        = "where"            !IdentifierPart
TransactionToken  = "transaction"      !IdentifierPart
TimeoutToken      = "timeout"          !IdentifierPart
AboutToken        = "about"            !IdentifierPart
AboveToken        = "above"            !IdentifierPart
AfterToken        = "after"            !IdentifierPart
AgainstToken      = "against"          !IdentifierPart
ApartFromToken    = "apart from"       !IdentifierPart
AroundToken       = "around"           !IdentifierPart
AsideFromToken    = "aside from"       !IdentifierPart
AtToken           = "at"               !IdentifierPart
BackToken         = "back"             !IdentifierPart
BeforeToken       = "before"           !IdentifierPart
BeginningToken    = "beginning"        !IdentifierPart
BehindToken       = "behind"           !IdentifierPart
BelowToken        = "below"            !IdentifierPart
BeneathToken      = "beneath"          !IdentifierPart
BesideToken       = "beside"           !IdentifierPart
BetweenToken      = "between"          !IdentifierPart
ButToken          = "but"              !IdentifierPart
ConsideringToken  = "considering"      !IdentifierPart 
DoesToken         = "does"             !IdentifierPart
EighthToken       = "eighth"           !IdentifierPart
EqualToken        = "equal"            !IdentifierPart 
EqualsToken       = "equals"           !IdentifierPart
ErrorToken        = "error"            !IdentifierPart
EveryToken        = "every"            !IdentifierPart
ExitToken         = "exit"             !IdentifierPart
FifthToken        = "fifth"            !IdentifierPart
FirstToken        = "first"            !IdentifierPart
FourthToken       = "fourth"           !IdentifierPart
FrontToken        = "front"            !IdentifierPart
GlobalToken       = "global"           !IdentifierPart
GetToken          = "get"              !IdentifierPart
IgnoringToken     = "ignoring"         !IdentifierPart
InsteadOfToken    = "instead of"       !IdentifierPart
IntoToken         = "into"             !IdentifierPart
IsToken           = "is"               !IdentifierPart
ItToken           = "it"               !IdentifierPart
ItsToken          = "its"              !IdentifierPart
LastToken         = "last"             !IdentifierPart
LocalToken        = "local"            !IdentifierPart
MeToken           = "me"               !IdentifierPart
MiddleToken       = "middle"           !IdentifierPart
MyToken           = "my"               !IdentifierPart
OntoToken         = "onto"             !IdentifierPart
NinthToken        = "ninth"            !IdentifierPart
ThruToken         = "thru"             !IdentifierPart
OutOfToken        = "out of"           !IdentifierPart
OverToken         = "over"             !IdentifierPart
PutToken          = "put"              !IdentifierPart 
ThroughToken      = "through"          !IdentifierPart
ThirdToken        = "third"            !IdentifierPart
ThatToken         = "that"             !IdentifierPart
TenthToken        = "tenth"            !IdentifierPart
TellToken         = "tell"             !IdentifierPart
SomeToken         = "some"             !IdentifierPart
SixthToken        = "sixth"            !IdentifierPart
SinceToken        = "since"            !IdentifierPart
SeventhToken      = "seventh"          !IdentifierPart
SecondToken       = "second"           !IdentifierPart
ReferenceToken    = "reference"        !IdentifierPart
RefToken          = "ref"              !IdentifierPart
StartsWithToken   = ("start" / "begin") "s"? " with" !IdentifierPart
EndsWithToken     = "end" "s"? " with" !IdentifierPart
PropertyToken     = "prop" "erty"?     !IdentifierPart
ScriptToken       = "script"           !IdentifierPart
GivenToken        = "given"            !IdentifierPart
AsToken           = "as"               !IdentifierPart
ListToken         = "list"             !IdentifierPart
TextToken         = "Unicode "? "text" !IdentifierPart
IntegerToken      = "integer"          !IdentifierPart
RealToken         = "real"             !IdentifierPart
__
  = (WhiteSpace / LineTerminatorSequence / Comment / TheToken / "¬")*

_
  = (WhiteSpace / MultiLineCommentNoLineTerminator / TheToken / "¬")*
  
EOS
  = __ (LineTerminatorSequence / EOF)

EOF
  = !.

Program
  = __ body:StatementList? __ EOF {
      return insertLocationData(new ast.Program(optionalList(body)), text(), location());
    }
   
StatementList
  = first:Statement rest:(__ Statement)* {
      return buildList(first, rest, 1);
    }

Statement
  = VariableStatement
  / ScriptPropertyStatement
  / ScriptDeclarationStatement
  / FunctionDeclarationStatement
  / IfStatement
  / ReturnStatement
  / ThrowStatement
  / TryStatement
  / BreakStatement
  / RepeatStatement
  / ExpressionStatement
    
ExpressionStatement
  = !OnToken expression:Expression {
      return insertLocationData(new ast.ExpressionStatement(expression), text(), location());
    }

Block
  = body:(StatementList __)? {
      return insertLocationData(new ast.BlockStatement(optionalList(extractOptional(body, 0))), text(), location());
    }
    
VariableStatement
  = SetToken __ id:Identifier __ ToToken __ init:Expression {
      return insertLocationData(new ast.VariableDeclarationStatement(id, init), text(), location());
    }
  / CopyToken __ init:Expression __ ToToken __ id:Identifier {
      return insertLocationData(new ast.VariableDeclarationStatement(id, init), text(), location());
    }
 
FunctionDeclarationStatement
  = (OnToken / ToToken) __ id:Identifier __
    "(" __ params:(PositionalParameterList __)? ")" __
    __ body:Block __ 
    EndToken _ Identifier?
    {
      return insertLocationData(
          new ast.SubroutinePositionalDeclarationStatement(id, optionalList(extractOptional(params, 0)), body), 
       text(), location());
    }
  / (OnToken / ToToken) __ id:Identifier __
    direct:DirectLabelledParameter? __
    aslabelled:ASLabelledParameterList? __
    userlabelled:(GivenToken UserLabelledParameterList)? __
    body:Block __
    EndToken _ Identifier?
    {
      return insertLocationData(
        new ast.SubroutineLabelledDeclarationStatement(id, direct, aslabelled, optionalList(extractOptional(userlabelled, 1)), body),
       text(), location());
    }

PositionalParameterList
  = first:Identifier rest:(__ "," __ Identifier)* {
      return buildList(first, rest, 3);
    }

DirectLabelledParameter
  = label:("of" / "in") __ id:Identifier {
      return insertLocationData(new ast.LabelledParameter(label, id), text(), location());
    }

ASLabelledParameterList
  = first:ASLabelledParameter rest:(__ ASLabelledParameter)* {
      return buildList(first, rest, 1);
    }

ASLabelledParameter
  = label:ASLabel _ id:Identifier {
      return insertLocationData(new ast.LabelledParameter(label, id), text(), location());
    }

ASLabel
  = "about"
  / "above"
  / "against"
  / "apart from"
  / "around"
  / "aside from"
  / "at"
  / "below"
  / "beneath"
  / "beside"
  / "between"
  / "by"
  / "for"
  / "from"
  / "instead of"
  / "into"
  / "onto"
  / "on"
  / "out of"
  / "over"
  / "since"
  / "thru"
  / "through"
  / "under"
  
UserLabelledParameterList
  = first:UserLabelledParameter rest:(__ "," __ UserLabelledParameter)* {
      return buildList(first, rest, 3);
    }

UserLabelledParameter
  = label:Identifier __ ":" __ id:Identifier{
      return insertLocationData(new ast.Parameter(label, id), text(), location());
    }

ScriptDeclarationStatement
  = ScriptToken __ id:Identifier
    __ properties:ScriptPropertyStatementList? __
    __ handlers:FunctionDeclarationStatement* __
    __ implicitrun:Block __ 
    EndToken _ ScriptToken?
    {
      return insertLocationData(
        new ast.ScriptDeclarationStatement(id, optionalList(properties), optionalList(handlers), implicitrun),
        text(), location()
      );
    }

ScriptPropertyStatementList
  = first:ScriptPropertyStatement rest:(__ ScriptPropertyStatement)* { return buildList(first, rest, 1); }

ScriptPropertyStatement
  = PropertyToken __ label:Identifier __ ":" __ initialValue:Expression __ {
      return insertLocationData(new ast.ScriptPropertyStatement(label, initialValue), text(), location());
    }

IfStatement
  = IfToken __ test:Expression __ ThenToken? __
    consequent:Block __
    alternate:(ElseToken __ Block __)?
    (EndToken _ IfToken? / EOS)
    {
      return insertLocationData(new ast.IfStatement(test, consequent, extractOptional(alternate, 2)), text(), location());
    }
  / IfToken _ test:Expression _ ThenToken? _ consequent:Statement _ (EndToken _ IfToken)? {
      return insertLocationData(new ast.IfStatement(test, consequent, null), text(), location());
    }
    
ReturnStatement
  = ReturnToken _ argument:Expression {
      return insertLocationData(new ast.ReturnStatement(argument), text(), location());
    }
  / ReturnToken {
      return insertLocationData(new ast.ReturnStatement(null), text(), location());
    }

ThrowStatement
  = ThrowToken _ argument:Expression EOS {
      return insertLocationData(new ast.ThrowStatement(argument), text(), location());
    }
    
TryStatement
  = TryToken __ block:Block __ handler:Catch {
      return insertLocationData(new ast.TryStatement(block, handler, null), text(), location());
    }
    
Catch
  = CatchToken __ param:Identifier __ body:Block {
      return insertLocationData(new ast.CatchClause(param, body), text(), location());
    }

BreakStatement
  = BreakToken EOS {
      return insertLocationData(new ast.BreakStatement(), text(), location());
    }

RepeatStatement
  = RepeatToken __ body:Block __ EndToken _ RepeatToken? {
        return insertLocationData(new ast.RepeatForeverStatement(body), text(), location());
    }
  / RepeatToken __ num:DecimalLiteral __ TimesToken? __ body:Block __ EndToken _ RepeatToken? {
        return insertLocationData(new ast.RepeatNumTimesStatement(num, body), text(), location());
    }
  / RepeatToken __ WhileToken __ test:Expression __ body:Block __ EndToken _ RepeatToken? {
        return insertLocationData(new ast.RepeatWhileStatement(test, body), text(), location());
  }
  / RepeatToken __ UntilToken __ test:Expression __ body:Block __ EndToken _ RepeatToken? {
        return insertLocationData(new ast.RepeatUntilStatement(test, body), text(), location());
  }
  / RepeatToken __ WithToken __ loopVariable:Identifier __
    FromToken __ start:DecimalLiteral __
    ToToken __ end:DecimalLiteral __
    step:(ByToken __ DecimalLiteral)? __
    body:Block __
    EndToken _ RepeatToken? {
        return insertLocationData(new ast.RepeatRangeStatement(loopVariable, start, end, extractOptional(step, 2), body), text(), location());
    }
  / RepeatToken __ WithToken __ loopVariable:Identifier __ "in" __ list:Expression __ body:Block __ EndToken _ RepeatToken? {
        return insertLocationData(new ast.RepeatListStatement(loopVariable, list, body), text(), location());
    }

LogicalORExpression
  = first:LogicalANDExpression
    rest:(__ LogicalOROperator __ LogicalANDExpression)* {
      return buildTree(first, rest, (result, element) => {
        return new ast.LogicalExpression(result, element[1], element[3]);
      });
    }
    
LogicalOROperator
  = OrToken { return "||"; }
  
LogicalANDExpression
  = first:EqualityExpression
    rest:(__ LogicalANDOperator __ EqualityExpression)* {
      return buildTree(first, rest, (result, element) => {
        return new ast.LogicalExpression(result, element[1], element[3]);
      });
    }
    
LogicalANDOperator
  = AndToken { return "&&"; }
  
EqualityExpression
  = first:RelationalExpression
    rest:(__ EqualityOperator __ RelationalExpression)*
    { return buildBinaryExpression(first, rest); }
    
// https://developer.apple.com/library/mac/documentation/AppleScript/Conceptual/AppleScriptLangGuide/reference/ASLR_operators.html
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
  / "is" // Not in operator list, but accepted by Applescript (seems to be only for "is null" and instanceof checks)

RelationalExpression
  = first:StartsWithExpression
    rest:(__ RelationalOperator __ StartsWithExpression)*
    { return buildBinaryExpression(first, rest); }

// https://developer.apple.com/library/mac/documentation/AppleScript/Conceptual/AppleScriptLangGuide/reference/ASLR_operators.html
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
      return buildTree(left, rest, (result, element) => {
        return new ast.StartsWithExpression(result, element[3]);
      });
    }

EndsWithExpression
  = left:ConcatenativeExpression
    rest:(__ EndsWithToken __ ConcatenativeExpression)* {
      return buildTree(left, rest, (result, element)  => {
        return new ast.EndsWithExpression(result, element[3]);
      });
    }

// Docs: https://developer.apple.com/library/mac/documentation/AppleScript/Conceptual/AppleScriptLangGuide/reference/ASLR_operators.html#//apple_ref/doc/uid/TP40000983-CH5g-BAJEGEEC
ConcatenativeExpression
  = first:CoercionExpression
    rest:(__ ConcatenativeOperator __ CoercionExpression)*
    { return buildBinaryExpression(first, rest); }

ConcatenativeOperator
  = $("&" !"&")

// Docs: https://developer.apple.com/library/mac/documentation/AppleScript/Conceptual/AppleScriptLangGuide/reference/ASLR_operators.html#//apple_ref/doc/uid/TP40000983-CH5g-SW5
// @TODO support coercion to a list of classes
CoercionExpression
  = argument:AdditiveExpression __ AsToken __ coercionClass:CoerceToClass {
    return insertLocationData(new ast.CoercionExpression(argument, coercionClass), text(), location());
  }
  / AdditiveExpression

CoerceToClass
  = ListToken
  / TextToken
  / IntegerToken
  / RealToken

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
  = operator:UnaryOperator __ argument:PositionalCallExpression {
      return insertLocationData(new ast.UnaryExpression(operator, argument), text(), location());
    }
  / PositionalCallExpression

UnaryOperator
  = $NotToken { return "!" }
  / "+"
  / "-"

PositionalCallExpression
  = callee:Identifier _ args:Arguments {
      return insertLocationData(new ast.PositionalCallExpression(callee, args), text(), location());
  }
  / PrimaryExpression

Arguments
  = "(" __ args:(ArgumentList __)? ")" {
      return optionalList(extractOptional(args, 0));
    }

ArgumentList
  = first:Expression rest:(__ "," __ Expression)* {
      return buildList(first, rest, 3);
    }

PrimaryExpression
  = ThisExpression
  / Identifier
  / Literal
  / ListLiteral
  / RecordLiteral
  / "(" __ expression:Expression __ ")" { return expression; }

ThisExpression
  = ThisToken {
      return insertLocationData(new ast.ThisExpression(), text(), location());
    }
  
Expression
  = LogicalORExpression
      
ListLiteral
  = "{" __ "}" { 
    return insertLocationData(new ast.ListExpression([]), text(), location()); 
  }
  / "{" __ elements:ItemList __ "}" {
    return insertLocationData(new ast.ListExpression(elements), text(), location());
  }

ItemList
  = first:Expression rest:(
      __ "," __ element:Expression { return element; }
    )*
    { return Array.prototype.concat.apply(first, rest); }
    
RecordLiteral
  = "{" __ properties:RecordPropertyNameAndValueList __ "}" {
       return insertLocationData(new ast.RecordExpression(properties), text(), location());
     }
  / "{" __ properties:RecordPropertyNameAndValueList __ "," __ "}" {
       return insertLocationData(new ast.RecordExpression(properties), text(), location());
     }
     
RecordPropertyNameAndValueList
  = first:RecordPropertyAssignment rest:(__ "," __ RecordPropertyAssignment)* {
      return buildList(first, rest, 3);
    }

RecordPropertyAssignment
  = key:RecordPropertyName __ ":" __ value:Expression {
      return insertLocationData(new ast.RecordProperty(key, value, false, false), text(), location());
    }

RecordPropertyName
  = IdentifierName
  / StringLiteral
  / NumericLiteral
