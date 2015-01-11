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
  / "copy"
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
  / "prop"
  / "property"
  / "put"
  / "ref"
  / "reference"
  / RepeatToken
  / ReturnToken
  / "script"
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
  / FunctionDeclaration
  / IfStatement
  / ReturnStatement
  / UseStatement
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
  = SetToken __ declaration:VariableDeclaration __ {
      return insertLocationData(new ast.VariableDeclarationStatement([declaration]), text(), line(), column());
    }
    
VariableDeclaration
  = id:Identifier init:(__ Initialiser)? {
      return insertLocationData(new ast.VariableDeclarator(id, extractOptional(init, 1)), text(), line(), column());
    }
  / id:Pattern init:(__ Initialiser)? {
      return insertLocationData(new ast.VariableDeclarator(id, extractOptional(init, 1)), text(), line(), column());
    }

Initialiser
  = ToToken __ expression:AssignmentExpression { return expression; }
  
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

UseStatement
  = UseToken __ identifiers:UseIdentifierList EOS
    { return new ast.UseStatement(identifiers) }

UseIdentifierList
  = first:UseIdentifier rest:(__ "," __ UseIdentifier)* {
      return buildList(first, rest, 3);
    }
    
UseIdentifier
  = Identifier
  / ":" id:Identifier {
    return id.asPredefinedCollection();
  }

AssignmentExpression
  = left:Pattern __ "=" !"=" __ right:AssignmentExpression {
      return insertLocationData(new ast.AssignmentExpression(
        left, "=", right), text(), line(), column()); 
  }
  / left:ConditionalExpression 
    assignment:(__ operator:AssignmentOperator __
    right:AssignmentExpression)? { 
      if (!assignment) {
        return left;
      }
      
      return insertLocationData(new ast.AssignmentExpression(
        left, 
        extractOptional(assignment, 1), 
        extractOptional(assignment, 3)), text(), line(), column()); 
    } 
  
AssignmentOperator
  = "=" !"=" { return "=" }
  / "*="
  / "/="
  / "%="
  / "+="
  / "-="
  / "<<="
  / ">>="
  / ">>>="
  / "&="
  / "^="
  / "|="

ConditionalExpression
  = consequent:LogicalORExpression __
    condition:(IfToken __ LogicalORExpression __
    ElseToken __ LogicalORExpression)? {
      if (condition) {
        var test = extractOptional(condition, 2);
        var alternate = extractOptional(condition, 6);
        
        return insertLocationData(new ast.ConditionalExpression(test, consequent, alternate), text(), line(), column()); 
      } else {
        return consequent;
      }
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
  = "=="
  / "!="

RelationalExpression
  = first:InExpression
    rest:(__ RelationalOperator __ InExpression)*
    { return buildBinaryExpression(first, rest); }

RelationalOperator
  = "<="
  / ">="
  / $("<" !"<")
  / $(">" !">")

InExpression
  = left:NullCoalescingExpression
    right:(__ InToken __ NullCoalescingExpression)? {
      if (!right) {
        return left;
      }
      return insertLocationData(new ast.InExpression(left, extractOptional(right, 3)), text(), line(), column());
    }
    
NullCoalescingExpression
  = first:ShiftExpression
    rest:(__ "??" __ ShiftExpression)*
    { return buildNullCoalescingExpression(first, rest); }
    
ShiftExpression
  = first:ConcatenativeExpression
    rest:(__ ShiftOperator __ ConcatenativeExpression)*
    { return buildBinaryExpression(first, rest); }

ShiftOperator
  = $("<<"  !"=")
  / $(">>>" !"=")
  / $(">>"  !"=")

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
  = $("+" ![+=])
  / $("-" ![-=])  

MultiplicativeExpression
  = first:ExponentiativeExpression
    rest:(__ MultiplicativeOperator __ UnaryExpression)*
    { return buildBinaryExpression(first, rest); }

MultiplicativeOperator
  = $("*" ![*=])
  / $("/" !"=")
  / $("÷" !"=")
  / $("^" !"=")
  / $ModToken
  / $DivToken

ExponentiativeExpression
  = first:UnaryExpression
    rest:(__ ExponentiativeOperator __ UnaryExpression)*
    { return buildBinaryExpression(first, rest); }

ExponentiativeOperator
  = $("**" !"=")
  
UnaryExpression
  = operator:UnaryOperator __ argument:PostfixExpression {
      if (operator === "++" || operator === "--") {
        return insertLocationData(new ast.UpdateExpression(argument, operator, true), text(), line(), column());
      } else {
        return insertLocationData(new ast.UnaryExpression(operator, argument), text(), line(), column());
      }
    }
  / PostfixExpression

UnaryOperator
  = $NotToken { return "!" }
  / "<-"
  / "++"
  / "--"
  / $("+" !"=")
  / $("-" !"=")
  / "!"
  
PostfixExpression
  = argument:GlobalIdentifierExpression _ operator:PostfixOperator? {
      if (operator) {
        return insertLocationData(new ast.UpdateExpression(argument, operator, false), text(), line(), column());
      } else {
        return argument;
      }
    }

PostfixOperator
  = "++"
  / "--"
    
Arguments
  = "(" __ args:(ArgumentList __)? ")" {
      return optionalList(extractOptional(args, 0));
    }
    
ArgumentList
  = first:Argument rest:(__ "," __ Argument)* {
      return buildList(first, rest, 3);
    }
    
Argument
  = expression:AssignmentExpression __ "..." {
    return insertLocationData(new ast.SplatExpression(expression), text(), line(), column()); 
  }
  / AssignmentExpression

GlobalIdentifierExpression
  = "::" __ id:Identifier
    { return id.asGlobal(); }
  / PrimaryExpression
  
PrimaryExpression
  = ThisExpression
  / Identifier
  / Literal
  / ArrayLiteral
  / ObjectLiteral
  / "(" __ expression:Expression __ ")" { return expression; }

ThisExpression
  = ThisToken {
      return insertLocationData(new ast.ThisExpression(), text(), line(), column());
    }
  
Expression
  = expression:AssignmentExpression {
      return expression;
    }
      
ArrayLiteral
  = "{" __ "}" { 
       return new ast.ArrayExpression([]); 
     }
  / "{" __ elements:ElementList __ "}" {
      return insertLocationData(new ast.ArrayExpression(elements), text(), line(), column());
    }

ElementList
  = first:(
      elision:(Elision __)? element:AssignmentExpression {
        return optionalList(extractOptional(elision, 0)).concat(element);
      }
    )
    rest:(
      __ "," __ elision:(Elision __)? element:AssignmentExpression {
        return optionalList(extractOptional(elision, 0)).concat(element);
      }
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
  = first:(
      elision:(Elision __)? element:PatternElement {
        return optionalList(extractOptional(elision, 0)).concat(element);
      }
    )
    rest:(
      __ "," __ elision:(Elision __)? element:PatternElement {
        return optionalList(extractOptional(elision, 0)).concat(element);
      }
    )*
    { return Array.prototype.concat.apply(first, rest); }

PatternElement
  = Identifier
  / ArrayPattern
  
Elision
  = "," commas:(__ ",")* { return filledArray(commas.length + 1, null); }

ObjectLiteral
  = "{" __ properties:PropertyNameAndValueList __ "}" {
       return insertLocationData(new ast.ObjectExpression(properties), text(), line(), column());
     }
  / "{" __ properties:PropertyNameAndValueList __ "," __ "}" {
       return insertLocationData(new ast.ObjectExpression(properties), text(), line(), column());
     }
     
PropertyNameAndValueList
  = first:PropertyAssignment rest:(__ "," __ PropertyAssignment)* {
      return buildList(first, rest, 3);
    }

PropertyAssignment
  = key:PropertyName __ ":" __ value:AssignmentExpression {
      return insertLocationData(new ast.Property(key, value, false, false), text(), line(), column());
    }
  / key:PropertyName __ 
    "(" __ params:(ParameterList __)? ")"
    __ body:Block __
    {
      return insertLocationData(new ast.Property(key, new ast.FunctionExpression(
        null, 
        optionalList(extractOptional(params, 0)),
        body,
        null
      ), false, true), text(), line(), column());
    }    
  / key:IdentifierName {
    return insertLocationData(new ast.Property(key, key, true, false), text(), line(), column());
  }

PropertyName
  = IdentifierName
  / StringLiteral
  / NumericLiteral
  
ObjectPattern
  = "{" __ properties:PatternPropertyNameAndValueList __ "}" {
       return insertLocationData(new ast.ObjectPattern(properties), text(), line(), column());
     }
  / "{" __ properties:PatternPropertyNameAndValueList __ "," __ "}" {
       return insertLocationData(new ast.ObjectPattern(properties), text(), line(), column());
     }
     
PatternPropertyNameAndValueList
  = first:PatternPropertyAssignment rest:(__ "," __ PatternPropertyAssignment)* {
      return buildList(first, rest, 3);
    }

PatternPropertyAssignment
  = key:IdentifierName __ ":" __ value:IdentifierName {
      return insertLocationData(new ast.Property(key, value, false, false), text(), line(), column());
    }
  / key:IdentifierName __ ":" __ value:ObjectPattern {
      return insertLocationData(new ast.Property(key, value, false, false), text(), line(), column());
    }
  / key:IdentifierName {
    return insertLocationData(new ast.Property(key, key, true, false), text(), line(), column());
  }    

Pattern
  = ObjectPattern
  / ArrayPattern
