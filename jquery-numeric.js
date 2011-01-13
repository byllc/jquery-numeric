/* Author: Bill Chapman
   Desc:  extension to limit numeric input of a form element
   Version: 0.1 
*/


 //generate a an array that holds an array of integers
 function numericRange(start,stop){
    range = []
    for(var n=start;n<stop;n++){ range.push(n) }
    return range;
 }

//Should allow noConflict compatibility
( function( $ ) { 
  
  $.fn.numerical = function(options) {
    var wrapped_input = $(this);
    var numeric_codes = [8,9,37,39,48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,110];
    var alpha_codes =   numericRange(65,90);
    var decimal_codes = [190]
    var default_border = wrapped_input.css("border");
    var default_bg     = wrapped_input.css("background-color");
    
    // all options should be initialized here for reference
    options = $.extend( {
       min: 40,        //smallest numeric value allowed
       max: 800,       //largest numeric value allowed
       alpha: false,   //allow letters
       decimal: false, //allow decimal characters
       badClass: 'bad_numeric_input', //what to call an element with invalid input
       goodClass: 'good_numeric_input', //what to call an element with good input
      
       //What happens to the input when something is wrong
       warning: function(target){  target.addClass(options.badClass).removeClass(options.goodClass);},
       //what happens to the input when something is not wrong
       allow:  function(target){  target.removeClass(options.badClass).addClass(options.goodClass);},
       //callback taht should happen before any other blur actions are called, it must return true or false
       before_blur: function(){ return true } 

    }, options || {});

   //what characters can be displayed
   var valid_codes = numeric_codes
   if(options.decimal){ valid_codes = valid_codes.concat(decimal_codes) }
   
   //functions to stop event propagation 
   var cancelEvent = function(e){  (e.preventDefault) ? e.preventDefault() : e.returnValue = false; } 
	 var stopEvent   = function(e){ (e.stopPropagation) ? e.stopPropagation() : e.cancelBubble = true;  }
  

   //actions to add to the blur event of the target input
   wrapped_input.bind("blur", function(e){
     var this_input = $(this);
     if(this_input.val() > options.max){ options.warning(this_input);  cancelEvent(e); stopEvent(e)}
     else if(this_input.val() < options.min){	options.warning(this_input); cancelEvent(e); stopEvent(e)}   
     else if(!options.before_blur()){ options.warning(this_input); cancelEvent(e); stopEvent(e) }
     else { options.allow(this_input); }  
   });
   
    //grab the keydown action don't allow disallowed keys to be written in the first place
   wrapped_input.bind("keydown", function(e){
      var code = Number((e.keyCode ? e.keyCode : e.which));
      var found_index = $.inArray( code, valid_codes );
      if((found_index == -1)){
       cancelEvent(e);
      }
   });  

	 //grab the keydown action don't allow non numeric keys to persist
   wrapped_input.bind("change", function(e){
     var this_input = $(this);
     if(this_input.val() > options.max){ stopEvent(e); cancelEvent(e); return false;}
     else if(this_input.val() < options.min){	 stopEvent(e); cancelEvent(e); return false;}   
   });
   
  }


})( jQuery );