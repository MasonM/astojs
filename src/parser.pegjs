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
  
Keyword
  = AndToken
  / OrToken
  / ReturnToken
  / ToToken
  / SetToken
  / IfToken
  / EndIfToken
  / ThenToken
  / ElseToken
  / ForToken
  / FnToken
  / NewToken
  / UseToken
  / ThisToken
  / SuperToken
  / ThrowToken
  / BreakToken
  / ContinueToken
  / DebuggerToken
  / WhileToken
  / RepeatToken
  / EndRepeatToken
  / TimesToken
  / UntilToken
  / TypeofToken
  / InToken
  / OfToken
  / TryToken
  / CatchToken
  / FinallyToken
  / InstanceofToken
  / SwitchToken
  / CaseToken
  / DefaultToken
  / FallthroughToken
  / NotToken
  / ImportToken
  / FromToken
  / AsToken
  / ExportToken
  / DeleteToken
  / AsyncToken
  / AwaitToken
  / GoToken
  / NullToken
  / UndefinedToken
  / DivToken
  / ModToken

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
FnToken           = "fn"            !IdentifierPart
SetToken          = "set"           !IdentifierPart
IfToken           = "if"            !IdentifierPart
ThenToken         = "then"          !IdentifierPart
ElseToken         = "else"          !IdentifierPart
EndIfToken        = "end" " if"?    !IdentifierPart
ForToken          = "for"           !IdentifierPart
TrueToken         = "true"          !IdentifierPart
FalseToken        = "false"         !IdentifierPart
NullToken         = "null"          !IdentifierPart
MissingValueToken = "missing value" !IdentifierPart
NewToken          = "new"           !IdentifierPart
UseToken          = "use"           !IdentifierPart
ThisToken         = "this"          !IdentifierPart
SuperToken        = "super"         !IdentifierPart
ThrowToken        = "throw"         !IdentifierPart
BreakToken        = "break"         !IdentifierPart
ContinueToken     = "continue"      !IdentifierPart
DebuggerToken     = "debugger"      !IdentifierPart
WhileToken        = "while"         !IdentifierPart
RepeatToken       = "repeat"        !IdentifierPart
EndRepeatToken    = "end" " repeat"? !IdentifierPart
TimesToken        = "times"         !IdentifierPart
UntilToken        = "until"         !IdentifierPart
TypeofToken       = "typeof"        !IdentifierPart
InToken           = "in"            !IdentifierPart
OfToken           = "of"            !IdentifierPart
TryToken          = "try"           !IdentifierPart
ToToken           = "to"            !IdentifierPart
FinallyToken      = "finally"       !IdentifierPart
CatchToken        = "catch"         !IdentifierPart
InstanceofToken   = "instanceof"    !IdentifierPart
SwitchToken       = "switch"        !IdentifierPart
CaseToken         = "case"          !IdentifierPart
DefaultToken      = "default"       !IdentifierPart
FallthroughToken  = "fallthrough"   !IdentifierPart
NotToken          = "not"           !IdentifierPart
ImportToken       = "import"        !IdentifierPart
FromToken         = "from"          !IdentifierPart
WithToken         = "with"          !IdentifierPart
AsToken           = "as"            !IdentifierPart
ByToken           = "by"            !IdentifierPart
ExportToken       = "export"        !IdentifierPart
DeleteToken       = "delete"        !IdentifierPart
DoToken           = "do"            !IdentifierPart
AsyncToken        = "async"         !IdentifierPart
AwaitToken        = "await"         !IdentifierPart
GoToken           = "go"            !IdentifierPart
UndefinedToken    = "undefined"     !IdentifierPart
DivToken          = "div"           !IdentifierPart
ModToken          = "mod"           !IdentifierPart

__
  = (WhiteSpace / LineTerminatorSequence / Comment)*

_
  = (WhiteSpace / MultiLineCommentNoLineTerminator)*
  
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
  / IfStatement
  / PushStatement  
  / ExpressionStatement
  / ReturnStatement
  / UseStatement
  / ThrowStatement
  / TryStatement
  / BreakStatement
  / ContinueStatement
  / DebuggerStatement
  / RepeatStatement
  / SwitchStatement
  / FallthroughStatement
  / ImportDeclarationStatement
  / ExportDeclarationStatement
  / GoStatement

Block
  = "{" __ body:(StatementList __)? "}" {
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
  = AsyncToken __ FnToken __ id:Identifier __
    "(" __ params:(FormalParameterList __)? ")" __
    inheritsFrom:InheritsFrom?
    __ body:Block __ 
    {
      return insertLocationData(
          new ast.VariableDeclarationStatement(
            [new ast.VariableDeclarator(id, 
              new ast.UnaryExpression("async", 
                new ast.FunctionExpression(
                  null, 
                  optionalList(extractOptional(params, 0)),
                  body,
                  inheritsFrom
                )
              )
            )]
          ), 
        text(), line(), column());
    }
  / FnToken __ id:Identifier __
    "(" __ params:(FormalParameterList __)? ")" __
    inheritsFrom:InheritsFrom?
    __ body:Block __ 
    {
      return insertLocationData(
          new ast.FunctionDeclarationStatement(id, optionalList(extractOptional(params, 0)), body, inheritsFrom), 
        text(), line(), column());
    }

InheritsFrom
  = "extends" __ call:CallExpression __ {
      return call;
    }
    
FormalParameterList
  = first:FormalParameter rest:(__ "," __ FormalParameter)* {
      return buildList(first, rest, 3);
    }
    
FormalParameter
  = id:Identifier __ "=" __ defaultValue:Expression {
    return insertLocationData(new ast.Parameter(id, defaultValue, false), text(), line(), column());
  }
  / id:Identifier __ "..." {
    return insertLocationData(new ast.Parameter(id, null, true), text(), line(), column());
  }
  / id:Identifier {
    return insertLocationData(new ast.Parameter(id, null, false), text(), line(), column());
  }
  
IfStatement
  = IfToken __ test:Expression __ ThenToken? __
    consequent:Statement __
    ElseToken __
    alternate:Statement __
    (EndIfToken / EOS)
    {
      return insertLocationData(new ast.IfStatement(test, consequent, alternate), text(), line(), column());
    }
  / IfToken _ test:Expression _ ThenToken? _ consequent:Statement EndIfToken? {
      return insertLocationData(new ast.IfStatement(test, consequent, null), text(), line(), column());
    }
    
ReturnStatement
  = ReturnToken EOS {
      return insertLocationData(new ast.ReturnStatement(null), text(), line(), column());
    }
  / ReturnToken _ argument:Expression EOS {
      return insertLocationData(new ast.ReturnStatement(argument), text(), line(), column());
    }
    
ThrowStatement
  = ThrowToken _ argument:Expression EOS {
      return insertLocationData(new ast.ThrowStatement(argument), text(), line(), column());
    }
    
TryStatement
  = TryToken __ block:Block __ handler:Catch __ finalizer:Finally {
      return insertLocationData(new ast.TryStatement(block, handler, finalizer), text(), line(), column());
    }
  / TryToken __ block:Block __ handler:Catch {
      return insertLocationData(new ast.TryStatement(block, handler, null), text(), line(), column());
    }
  / TryToken __ block:Block __ finalizer:Finally {
      return insertLocationData(new ast.TryStatement(block, null, finalizer), text(), line(), column());
    }
    
Catch
  = CatchToken __ param:Identifier __ body:Block {
      return insertLocationData(new ast.CatchClause(param, body), text(), line(), column());
    }

Finally
  = FinallyToken __ block:Block { return block; }

BreakStatement
  = BreakToken EOS {
      return insertLocationData(new ast.BreakStatement(), text(), line(), column());
    }
    
ContinueStatement
  = ContinueToken EOS {
      return insertLocationData(new ast.ContinueStatement(), text(), line(), column());
    }
    
FallthroughStatement
  = FallthroughToken EOS {
      return insertLocationData(new ast.FallthroughStatement(), text(), line(), column());
    }  
    
ImportDeclarationStatement
  = ImportToken __ specifiers:ImportSpecifierList __ FromToken __ source:StringLiteral EOS {
    return insertLocationData(new ast.ImportDeclarationStatement(specifiers, source, "named"), text(), line(), column());
  }
  / ImportToken __ "*" __ AsToken __ id:Identifier __ FromToken __ source:StringLiteral EOS {
    return insertLocationData(new ast.ImportDeclarationStatement([
      new ast.ImportNamespaceSpecifier(id)
    ], source, "named"), text(), line(), column());
  }  
  / ImportToken __ source:StringLiteral __ AsToken __ id:Identifier EOS {
    return insertLocationData(new ast.ImportDeclarationStatement([
      new ast.ImportDefaultSpecifier(id)
    ], source, "default"), text(), line(), column());
  }
  
ImportSpecifierList
  = first:ImportSpecifier rest:("," __ ImportSpecifier)* { 
      return buildList(first, rest, 2); 
    }

ImportSpecifier
  = id:Identifier __ AsToken __ alias:Identifier {
    return insertLocationData(new ast.ImportSpecifier(id, alias), text(), line(), column());
  }
  / id:Identifier {
    return insertLocationData(new ast.ImportSpecifier(id, null), text(), line(), column());
  }
  
ExportDeclarationStatement
  = ExportToken __ specifiers:ExportSpecifierList source:(__ FromToken __ StringLiteral)? EOS {
    return insertLocationData(new ast.ExportDeclarationStatement(specifiers, extractOptional(source, 3), null, false), text(), line(), column());
  }
  / ExportToken __ "*" __ FromToken __ source:StringLiteral EOS {
    return insertLocationData(new ast.ExportDeclarationStatement([
      new ast.ExportBatchSpecifier()
    ], source, null, false), text(), line(), column());
  }
  / ExportToken __ statement:VariableStatement {
    return insertLocationData(new ast.ExportDeclarationStatement(null, null, statement, false), text(), line(), column());
  }
  / ExportToken __ statement:FunctionDeclaration {
    return insertLocationData(new ast.ExportDeclarationStatement(null, null, statement, false), text(), line(), column());
  }
  / ExportToken __ DefaultToken __ expression:Expression EOS {
    return insertLocationData(new ast.ExportDeclarationStatement(null, null, expression, true), text(), line(), column());
  }    
  
ExportSpecifierList
  = first:ExportSpecifier rest:("," __ ExportSpecifier)* { 
      return buildList(first, rest, 2); 
    }

ExportSpecifier
  = id:Identifier __ AsToken __ alias:Identifier {
    return insertLocationData(new ast.ExportSpecifier(id, alias), text(), line(), column());
  }
  / id:Identifier {
    return insertLocationData(new ast.ExportSpecifier(id, null), text(), line(), column());
  }
    
PushStatement
  = left:LeftHandSideExpression __ "<-" __ right:AssignmentExpression EOS {
      return insertLocationData(new ast.PushStatement(left, right), text(), line(), column()); 
  }
  
GoStatement 
  = GoToken __ body:Block EOS {
    return insertLocationData(new ast.GoStatement(body), text(), line(), column());
  }
  
DebuggerStatement
  = DebuggerToken EOS {
      return insertLocationData(new ast.DebuggerStatement(), text(), line(), column());
    }    

RepeatStatement
  = RepeatToken __ body:Statement __ EndRepeatToken {
        return insertLocationData(new ast.RepeatForeverStatement(body), text(), line(), column());
    }
  / RepeatToken __ num:DecimalLiteral __ TimesToken? __ body:Statement __ EndRepeatToken {
        return insertLocationData(new ast.RepeatNumTimesStatement(num, body), text(), line(), column());
    }
  / RepeatToken __ WhileToken __ test:Expression __ body:Statement __ EndRepeatToken {
        return insertLocationData(new ast.RepeatWhileStatement(test, body), text(), line(), column());
  }
  / RepeatToken __ UntilToken __ test:Expression __ body:Statement __ EndRepeatToken {
        return insertLocationData(new ast.RepeatUntilStatement(test, body), text(), line(), column());
  }
  / RepeatToken __ WithToken __ loopVariable:Identifier __
    FromToken __ start:DecimalLiteral __
    ToToken __ end:DecimalLiteral __
    step:(ByToken __ DecimalLiteral)? __
    body:Statement __
    EndRepeatToken {
        return insertLocationData(new ast.RepeatRangeStatement(loopVariable, start, end, extractOptional(step, 2), body), text(), line(), column());
  }
  / RepeatToken __ WithToken __ loopVariable:Identifier __ InToken __ list:Expression __ body:Statement __ EndIfToken {
        return insertLocationData(new ast.RepeatListStatement(loopVariable, list, body), text(), line(), column());
  }

SwitchStatement
  = SwitchToken __ discriminant:Expression __ "{" __
    cases:CaseClauseList __ 
    "}" {
      return insertLocationData(new ast.SwitchStatement(discriminant, cases), text(), line(), column());
    }
    
CaseClauseList
  = first:CaseClause rest:(__ ","? __ CaseClause)* { 
      return buildList(first, rest, 3); 
    }
    
CaseClause
  = CaseToken __ tests:CaseClauseTestList __ ":" __ body:Statement {
      return insertLocationData(new ast.CaseClause(tests, body), text(), line(), column());
    }
  / DefaultToken __ ":" __ body:Statement {
      return insertLocationData(new ast.CaseClause(null, body), text(), line(), column());
    }

CaseClauseTestList
  = first:CaseClauseTest rest:("," __ CaseClauseTest)* { 
      return buildList(first, rest, 2); 
    }

CaseClauseTest
  = Expression

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
    
ExpressionStatement
  = !FnToken expression:Expression {
      return insertLocationData(new ast.ExpressionStatement(expression), text(), line(), column());
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
  / $InstanceofToken

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
  = $DeleteToken
  / $TypeofToken
  / $AsyncToken
  / $AwaitToken
  / $NotToken { return "!" }
  / "<-"
  / "++"
  / "--"
  / $("+" !"=")
  / $("-" !"=")
  / "!"
  
PostfixExpression
  = argument:LeftHandSideExpression _ operator:PostfixOperator? {
      if (operator) {
        return insertLocationData(new ast.UpdateExpression(argument, operator, false), text(), line(), column());
      } else {
        return argument;
      }
    }

PostfixOperator
  = "++"
  / "--"

LeftHandSideExpression
  = CallExpression

CallExpression
  = first:(
      callee:MemberExpression call:(__ CallExpressionOperator? __ args:Arguments)? {
        if (!call) {
          return callee;
        }
        
        var op = extractOptional(call, 1);
        if (op === "?") {
          return insertLocationData(new ast.NullCheckCallExpression(callee, extractOptional(call, 3)), text(), line(), column());
        } else if (op === "^") {
          return insertLocationData(new ast.CurryCallExpression(callee, extractOptional(call, 3)), text(), line(), column());
        } else {
          return insertLocationData(new ast.CallExpression(callee, extractOptional(call, 3)), text(), line(), column());
        }
      }
    )
    rest:(
        __ operator:CallExpressionOperator? __ args:Arguments {
          var type = "CallExpression";
          if (operator === "?") {
            type = "NullCheckCallExpression";
          } else if (operator === "^") {
            type = "CurryCallExpression";
          }
          
          return { 
            type: type, 
            arguments: args 
          };
        }    
      / __ "[" __ property:Expression __ "]" {
          return {
            type:     "MemberExpression",
            property: property,
            computed: true
          };
        }
      / __ nullPropagatingOperator:"?"? __ "." !"." __ property:IdentifierName {
          return {
            type:     nullPropagatingOperator === "?" ? "NullPropagatingExpression" : "MemberExpression",
            property: property,
            computed: false
          };
        }
    )*
    {      
      return buildTree(first, rest, function(result, element) {
        if (element.type === "MemberExpression") {
          return insertLocationData(new ast.MemberExpression(result, element.property, element.computed), text(), line(), column());
        } if (element.type === "NullPropagatingExpression") {
          return insertLocationData(new ast.NullPropagatingExpression(result, element.property, element.computed), text(), line(), column());
        } else if (element.type === "CallExpression") {
          return insertLocationData(new ast.CallExpression(result, element.arguments), text(), line(), column());
        } else if (element.type === "CurryCallExpression") {
          return insertLocationData(new ast.CurryCallExpression(result, element.arguments), text(), line(), column());
        } else if (element.type === "NullCheckCallExpression") {
          return insertLocationData(new ast.NullCheckCallExpression(result, element.arguments), text(), line(), column());
        }
      });
    }
    
CallExpressionOperator
  = "?"
  / "^"

MemberExpression
  = first:( 
        FunctionExpression
      / NewToken __ callee:MemberExpression __ args:Arguments {
          return insertLocationData(new ast.NewExpression(callee, args), text(), line(), column());
        }
    )
    rest:(
        __ "[" __ property:Expression __ "]" {
          return { 
            type: "MemberExpression",
            property: property, 
            computed: true
          };
        }    
      / __ nullPropagatingOperator:"?"? __ "." !"." __ property:IdentifierName {
          return { 
            type: nullPropagatingOperator === "?" ? "NullPropagatingExpression" : "MemberExpression",
            property: property, 
            computed: false 
          };
        }
    )*
    {
      return buildTree(first, rest, function (result, element) {
        if (element.type === "NullPropagatingExpression") {
          return insertLocationData(new ast.NullPropagatingExpression(result, element.property, element.computed), text(), line(), column());
        } else if (element.type === "MemberExpression") {
          return insertLocationData(new ast.MemberExpression(result, element.property, element.computed), text(), line(), column());
        }
      });
    }
    
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

FunctionExpression
  = FnToken __ id:(Identifier __)?
    "(" __ params:(FormalParameterList __)? ")" __
    inheritsFrom:InheritsFrom?
    __ body:Block __
    {
      return insertLocationData(new ast.FunctionExpression(
        extractOptional(id, 0), 
        optionalList(extractOptional(params, 0)),
        body,
        inheritsFrom
      ), text(), line(), column());
    }
  / "(" __ params:(FormalParameterList __)? ")" 
    __ operator:FunctionExpressionOperator
    __ body:Block __
    {      
      return insertLocationData(new ast.FunctionExpression(
        null,
        optionalList(extractOptional(params, 0)),
        body,
        null,
        operator
      ), text(), line(), column());
    }    
  / "(" __ params:(FormalParameterList __)? ")" 
    __ operator:FunctionExpressionOperator
    __ body:Expression __
    {
      return insertLocationData(new ast.FunctionExpression(
        null, 
        optionalList(extractOptional(params, 0)),
        body,
        null,
        operator
      ), text(), line(), column());
    }
  / ForInExpression

FunctionExpressionOperator
  = "->"
  / "=>"

ForInExpression
  = "[" __ 
    expression:Expression __
    ForToken __
    item:Identifier __
    index:("," __ Identifier __)?
    InToken __
    array:Expression __
    condition:(IfToken __ Expression __)? 
    "]" {
      return insertLocationData(new ast.ForInExpression(
        expression,
        item,
        index ? extractOptional(index, 2) : null,
        array,
        condition ? extractOptional(condition, 2) : null
      ), text(), line(), column());
    }
  / GlobalIdentifierExpression
    
GlobalIdentifierExpression
  = "::" __ id:Identifier
    { return id.asGlobal(); }
  / PrimaryExpression
  
PrimaryExpression
  = ThisExpression
  / SuperExpression
  / Identifier
  / Literal
  / ArrayLiteral
  / ObjectLiteral
  / "(" __ expression:Expression __ ")" { return expression; }

ThisExpression
  = ThisToken {
      return insertLocationData(new ast.ThisExpression(), text(), line(), column());
    }
    
SuperExpression
  = SuperToken {
      return insertLocationData(new ast.SuperExpression(), text(), line(), column());
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
    "(" __ params:(FormalParameterList __)? ")"
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
