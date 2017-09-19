//==============================================================================
var openFile = function(event) {
       var input = event.target;

       var reader = new FileReader();
       reader.onload = function(){
         var text = reader.result;
         //node.innerText =
         parseToJL(text);




         console.log(reader.result.substring(0, 200));
       };
       reader.readAsText(input.files[0]);

       //var block = document.getElementById('output')
      //Prism.highlightElement(block);
};
//==============================================================================
function parseToJL(text){
    // basic remove or replace stuff
    text = text.replace(/\/\//g, '#');
    text = text.replace(/\bvar\b/g, '');
    text = text.replace(/\{/g, '');
    text = text.replace(/\bMath\b\./g, '');
    text = text.replace(/"\buse strict\b\";*/g, '');
    text = text.replace(/\}/g, 'end');
    // for loops: these should really be parsed some other way but we'll use regex for now.
    //text = text.replace(/\bfor\b\(\s*([\w]*)=(\d);\s*(?:[\w]*)<([\w\.]*);\s*(?:[\w]*)\+\+\)/g, 'for $1 in $2:$3');
    text = text.replace(/\bfor\b\(\s*([\w]*)=(\d)\s*;\s*\1<([\w\.]*)\s*;\s*\1\+\+(([^,)]*),*)*\)/g, 'for $1 in $2:$3 \n$4');
    text = text.replace(/\bfor\b\(\s*([\w]*)=(\d)\s*;\s*\1<([\w\.]*)\s*;([^,)]*),*\s*\1\+\+\s*\)/g, 'for $1 in $2:$3 \n$4');
    // some function declaration differences
    text = text.replace(/\btypeof\b *([^)=]*) *=+ *['"]*\bundefined\b'['"]*/g, 'isdefined($1)');
    text = text.replace(/\btypeof\b *\(([^)]*)\) *=+ *['"]*\bundefined\b'['"]*/g, 'isdefined($1)');
    text = text.replace(/\bisdefined\b\(([\w]*)\.([\w]*)/g, 'isdefined($1, $2)');

    text = text.replace(/([\w\.]*)\.\bpush\b\(/g, 'push!( $1, ');
    // functions
    text = text.replace(/[\t ]*([\w]*\.\bprototype\b)\s*=/g, '#==============================================================================\n#= $1 =# ');
    text = text.replace(/[\t ]*(\w+)\s*=+\s*\bfunction\(\b/g, '#==============================================================================\nfunction $1(');
    text = text.replace(/[\t ]*([\w]*)\s*:\s*\bfunction\b\(/g, '#==============================================================================\nfunction $1(');
    text = text.replace(/\bend\b *,/g, 'end');
    // if
    text = text.replace(/\bif\b *\(([^\(\)]*\((?:[^\(\)]*(?:\([^\(\)]*\))*)*\))/g, 'if $1');
    // 1-indexing
    text = text.replace(/(\bfor\b *\w+ *(?:\bin\b|=)) *0(.*)/g, '$1 1$2');
    // make it more pretty...
    text = text.replace(/[\r\n]\t*\s*\bend\b *[\r\n\t\s](#*=*)/g, '\nend\n$1');
    text = text.replace(/(\bfor\b|\if\b.*)[\r\t\n]*/g, '$1');
    text = text.replace(/(\bend\b)\) *\(([^)]*)\);*/g, '$1 ## $2');
    text = text.replace(/\(\bfunction\b\(([^)]*)\)/g, 'function $1()');
    //return text
    var node = document.getElementById('output');
    node.innerText = text
    //var block = document.getElementById('output')
    Prism.highlightElement(node);

}
