//==============================================================================
var openFile = function(event) {
       var input = event.target;

       var reader = new FileReader();
       reader.onload = function(){
         var text = reader.result;
         parseToJL(text);
         console.log(reader.result.substring(0, 200));
       };
       reader.readAsText(input.files[0]);

};
//==============================================================================
function parseToJL(text){
    // objects
    text = text.replace(/(\w*\[*\w*\]*) *= *{ *};*/g, '$1 = new() # some object');
    text = text.replace(/(\w*\[*\w*\]*) *= *{((?:[\n\r\s\t]*\w*:.*)*)[\n\r\s\t]*};*/g, '$1 = new($2)');
    //text = text.replace(//g, '$1 = new($2)');

    // basic remove or replace stuff
    text = text.replace(/\bend\b/g, '_end_'); // when "end" is a variable
    text = text.replace(/\bnew\b (\w*)/g, '$1'); // when "end" is a variable
    text = text.replace(/\belse\b \bif\b/g, 'elseif');
    text = text.replace(/\/\//g, '#');
    text = text.replace(/\/\*/g, '#=');
    text = text.replace(/\*\//g, '=#');
    text = text.replace(/\bvar\b/g, '');
    text = text.replace(/\{/g, '');
    text = text.replace(/\bMath\b\./g, '');
    text = text.replace(/\brandom\b\(\)/g, 'rand()'); //TODO: random()*(b-a)+a;
    text = text.replace(/"\buse strict\b\";*/g, '');
    text = text.replace(/\}/g, 'end');

    //text = text.replace(/\bnew\b *(\w+) *\(/g, '$1(');
    // for loops: these should really be parsed some other way but we'll use regex for now.
    //text = text.replace(/\bfor\b\(\s*([\w]*)=(\d);\s*(?:[\w]*)<([\w\.]*);\s*(?:[\w]*)\+\+\)/g, 'for $1 in $2:$3');
    text = text.replace(/\bfor\b *\( *([\w\.]*) *= *([\d\w\.]*) *; *\1 *< *([\w\.]*) *;\s*\1\+\+(([^,)]*),*)* *\)/g, 'for $1 in $2:$3 \n$4');
    text = text.replace(/\bfor\b *\( *([\w\.]*) *= *([\d\w\.]*) *; *\1 *< *([\w\.]*) *; *([^,)]*) *,* *\1\+\+ *\)/g, 'for $1 in $2:$3 \n$4');
    text = text.replace(/\bfor\b *\( *([\w]*)=([\d\w]*) *; *\1<([\w\.]*) *; *\+\+\1(([^,)]*),*)*\)/g, 'for $1 in $2:$3  # WARNING: was ++$1\n$4');
    // some function declaration differences
    text = text.replace(/\btypeof\b *([^)=]*) *=+ *['"]*\bundefined\b'['"]*/g, 'isdefined($1)');
    text = text.replace(/\btypeof\b *\(([^)]*)\) *=+ *['"]*\bundefined\b'['"]*/g, 'isdefined($1)');
    text = text.replace(/\bisdefined\b\(([\w]*)\.([\w]*)/g, 'isdefined($1, $2)');

    text = text.replace(/([\w\.]*)\.\bpush\b\(/g, 'push!( $1, ');
    // functions
    text = text.replace(/[\t ]*([\w]*\.\bprototype\b)\s*=/g, '#==============================================================================\n#= $1 =# \n');
    text = text.replace(/[\t ]*([\w]*\.\bprototype\b)\.(\w*) *= *\bfunction\b/g, '#==============================================================================\n#= $1 =# \nfunction $2');
    text = text.replace(/[\t ]*(\w+)\s*=+\s*\bfunction\(\b/g, '#==============================================================================\nfunction $1(');
    text = text.replace(/[\t ]*([\w]*)\s*:\s*\bfunction\b\(/g, '#==============================================================================\nfunction $1(');
    text = text.replace(/\bend\b *,/g, 'end');
    // if
    // text = text.replace(/\bif\b *\(([^\(\)]*\((?:[^\(\)]*(?:\([^\(\)]*\))*)*\))/g, 'if $1');
    text = text.replace(/(\bif\b|\bwhile\b) *\((.*)\)/g, '$1 $2\n');
    // 1-indexing
    text = text.replace(/(\bfor\b *\w+ *(?:\bin\b|=)) *0(.*)/g, '$1 1$2');
    text = text.replace(/(\bfor\b *\w+ *(?:\bin\b|=)) *0(.*)/g, '$1 1$2 # WARNING: was ++$1');
    text = text.replace(/\bfor\b *\((.*)\)/g, 'for $1 # WARNING: spacial case of "for", please fix!\n');
       
       
       
       
       
       
       
       
       
       
       
    // The following line was giving me problems when served but not locally on my computer
       //text = text.replace(/\bfor\b *([\w\.]* (?:\bin\b|=) *[\d\w\.]*:[\d\w\.]*:*[\d\w\.]*)[\r\n\t\s]*\bfor\b *([\w\.]* (?:\bin\b|=) *[\d\w\.]*:[\d\w\.]*:*[\d\w\.]*)/g, 'for $1, $2 # Warning: there\'s probably an extra "end" below due to for-concatination.\n');
    // make it more pretty...
    text = text.replace(/[\r\n]\t*\s*\bend\b *[\r\n\t\s](#*=*)/g, '\nend\n$1');
    text = text.replace(/((?:\bfor\b|\bif\b).*)[\r\t\n]*/g, '$1');
    text = text.replace(/(\bend\b)\) *\(([^)]*)\);*/g, '$1 ## $2');
    text = text.replace(/\(\bfunction\b\(([^)]*)\)/g, '\n#==============================================================================\n# This was an object and could possibly be be converted to a struct\n#==============================================================================\nfunction $1()');

    text = text.replace(/end\)*;*/g, 'end');
    text = text.replace(/\+ *\n*(['"])/g, '* $1');
    text = text.replace(/(['"])[\t\n ]*\+/g, '$1 *');
    //return text
    var node = document.getElementById('output');
    node.innerText = text
    //var block = document.getElementById('output')
    Prism.highlightElement(node);

}
