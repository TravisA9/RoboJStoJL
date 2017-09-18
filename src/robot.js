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
    // for loops
    text = text.replace(/\bfor\b\(\s*([\w]*)=(\d);\s*(?:[\w]*)<([\w\.]*);\s*(?:[\w]*)\+\+\)/g, 'for $1 in $2:$3');
    // some function declaration differences
    text = text.replace(/\btypeof\b\s*([\w\.]*)/g, 'typeof($1)');
    text = text.replace(/([\w\.]*)\.\bpush\b\(/g, 'push!( $1, ');
    // functions
    text = text.replace(/(\w+)\s*=+\s*\bfunction\(\b/g, '$1(');
    text = text.replace(/([\w]*)\s*:\s*\bfunction\b\(/g, '$1(');



    //return text
    var node = document.getElementById('output');
    node.innerText = text
    //var block = document.getElementById('output')
    Prism.highlightElement(node);

}
