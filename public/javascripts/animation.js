/************************************************/
/*****************LOADING ICON******************/ 
/**********************************************/


document.onreadystatechange = function () {
  var state = document.readyState
  if (state == 'interactive') {
       document.getElementById('content').style.visibility="hidden";
  } else if (state == 'complete') {
      setTimeout(function(){
         document.getElementById('interactive');
         document.getElementById('load').style.visibility="hidden";
         document.getElementById('content').style.visibility="visible";
      });
  }
}


/***************************************************/
/*****************ARROW UP & DOWN******************/ 
/*************************************************/



$(function() {
    $("#toggle1").on('click', function() {   
       $(".icon-rotate1").toggleClass('rotate2').css('color', '#ffc107');
			
		if($ (".icon-rotate1").hasClass('rotate2') ){
			 $(".icon-rotate2").addClass('rotate11');
		     	$(".icon-rotate2").removeClass('rotate2').css('color', '#fff');	
					
		}	
    });
});

$(function() {
    $("#toggle2").on('click', function() {   
       $(".icon-rotate2").toggleClass('rotate2').css('color', '#ffc107');
		
		if( $(".icon-rotate2").hasClass('rotate2') ){
			$(".icon-rotate1").addClass('rotate11');
			 $(".icon-rotate1").removeClass('rotate2').css('color', '#fff');	 
		}
    });
});






/***************************************************/
/*************ABOUT ME & SKILLS PAGES**************/ 
/*************************************************/

$(function() {
        $('.demo1').click(function() {
                $('.row.row-skillspage').toggle("slow");
				$('.row-aboutmepage').hide();
				
			
			
        });
	
		 $('.demo2').click(function() {
                $('.row.row-aboutmepage').toggle("slow");
			 	$('.row-skillspage').hide();
        });
    });




/****************************************************************/
/******************MARLEN AWWAD ANIMATION***********************/
/**************************************************************/

$.fn.letterDrop = function() {
  var obj = this;
  
  var drop = {
    arr : obj.text().split( '' ),
    
    range : {
      min : 1,
      max : 9
    },
    
    styles : function() {
      var dropDelays = '\n', addCSS;
      
       for ( i = this.range.min; i <= this.range.max; i++ ) {
         dropDelays += '.ld' + i + ' { animation-delay: 1.' + i + 's; }\n';  
       }
      
        addCSS = $( '<style>' + dropDelays + '</style>' );
        $( 'head' ).append( addCSS );
    },
    
    main : function() {
      var dp = 0;
      obj.text( '' );
      
      $.each( this.arr, function( index, value ) {

        dp = dp.randomInt( drop.range.min, drop.range.max );
        
        if ( value === ' ' )
          value = '&nbsp';
        
          obj.append( '<span class="letterDrop ld' + dp + '">' + value + '</span>' );
        
      });
          
    }
  };
   
  Number.prototype.randomInt = function ( min, max ) {
    return Math.floor(Math.random() * ( max - min + 0 ) + min);
  };
  
  
  // Create styles
  drop.styles();

  // Initiate
  drop.main();  
};

$( 'h1' ).letterDrop();


/***************************************************/
/*****************MY SKILLS PAGE*******************/ 
/*************************************************/

$(document).ready(function(){
	$('.skillbar').each(function(){
		$(this).find('.skillbar-bar').animate({
			width:$(this).attr('data-percent')
		},3000);
	});
});


