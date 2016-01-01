/*
		The aim of this puzzle is to reconstruct an image.
		Author = "Abdelmouneim Hanine <sup3rnova.m0nster@gmail.com>"
		URL = https://github.com/abdelmouneim/
		LICENSE = {
	
		Copyright (c) 2016 Abdelmouneim Hanine <sup3rnova.m0nster@gmail.com>
		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restriction, including without limitation the rights
		to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:
		The above copyright notice and this permission notice shall be included in
		all copies or substantial portions of the Software.
		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
		THE SOFTWARE.	
			}	
		
*/

/*parameters*/
$img_width=500;
$img_heigth=500;
$puzzle_width=500;
$puzzle_height=500;
$nbr_ligne=5;
$nbr_colonne=5;
$nbr_puzzle=$nbr_ligne*$nbr_colonne;
$sqrt_puzzle_width=96;//2*2px for the  border
$sqrt_puzzle_heigth=96;//2*2px for the   border
$level = 1
$correct_sqrt_puzzle=0;
$('button').button();
$('#success_msg').hide();
$('#cache').hide();


var $pos_clicked_sqrt_puzzle;// pos of clicked sqrt puzzle object ['top','left' ]
var $id_droppable=0;//  id of droppable sqrt_puzzle

$('#puzzle').css({"width":$puzzle_width+"px",
 				"heigth":$puzzle_height+"px"	
 	             });
var image=$('<img src="img/motor.jpg"/>');
				 
/*create original puzzle*/				 
function create_original_puzzle(image){
	$('#puzzle').append(image);
	image = $('#puzzle img');
	k=1;//To identify sqrt_puzzle
	for(i=0;i<$nbr_ligne;i++){
		for(j=0;j<$nbr_colonne;j++){
			$var="<div id="+k+" class='sqrt_puzzle'></div>";
			$('#puzzle').append($var);		   
			$('#'+k).css({"background-position":"top "+i*100*(-1)+"px left "+j*100*(-1)+"px"});
			$('#'+k).css({"top":i*100+"px","left":j*100+"px"});
			k++;
		}// end for j
	}//end for i
	$('.sqrt_puzzle').css({"background-image":"url("+image.attr('src')+")"});
	$('.sqrt_puzzle').css({"width":$sqrt_puzzle_width+"px", 
			       "height":$sqrt_puzzle_heigth +"px"});
	/*make element dragable*/ 
	$('.sqrt_puzzle').draggable({'containment':'parent',
	 			     'cursor':'move',
				     'helper':'clone',
				     'stack':'z-index:40',
				     'stop':handle_drag_stop});
	/*make element droppable*/ 
 	$('.sqrt_puzzle').droppable({
				     'drop':function(event,ui){$id_droppable=$(this).attr("id");}
		                         });							  
	 
}//end function create_original_puzzle

/*generate random puzzle*/ 
function generate_rand_puzzle($level){
	for(i=1;i<3*$level;i++){	 	
		$id_sqrt_puzzle_st=Math.floor((Math.random()*$nbr_puzzle)+1);
		$id_sqrt_puzzle_nd=Math.floor((Math.random()*$nbr_puzzle)+1);	 
		$pos_sqrt_puzzle_st=$('#'+$id_sqrt_puzzle_st).position();
		$pos_sqrt_puzzle_nd=$('#'+ $id_sqrt_puzzle_nd).position();	 	 
		$('#'+$id_sqrt_puzzle_st).css({"top":$pos_sqrt_puzzle_nd.top+"px","left":$pos_sqrt_puzzle_nd.left+"px"});
		$('#'+ $id_sqrt_puzzle_nd).css({"top":$pos_sqrt_puzzle_st.top+"px","left":$pos_sqrt_puzzle_st.left+"px"});
	}//end for i
}// end function generate_rand_puzzle
/*get the position of the dragged element when drag is stopped*/	 
function handle_drag_stop(event,ui){
	$id_draggable=$(this).attr('id');
	if($id_droppable==0){$id_droppable=$id_draggable;}
	$pos_sqrt_puzzle_drag=$('#'+$id_draggable).position();
	$pos_sqrt_puzzle_drop=$('#'+$id_droppable).position();	 
		 
	$i_drag=parseInt($pos_sqrt_puzzle_drag.top/100);
	$j_drag=parseInt($pos_sqrt_puzzle_drag.left/100);
	// id correct puzzle should be placed at dragged_puzzle place 
	$id_correct_puzzle_drag=($i_drag+1)*$nbr_colonne-($nbr_colonne-($j_drag+1));
	$i_drop=parseInt($pos_sqrt_puzzle_drop.top/100);
	$j_drop=parseInt($pos_sqrt_puzzle_drop.left/100);
	// id correct puzzle should be placed at draopped_puzzle place
	$id_correct_puzzle_drop=($i_drop+1)*$nbr_colonne-($nbr_colonne-($j_drop+1));
		 
	if($id_correct_puzzle_drag==$id_draggable && $id_droppable!=$id_draggable){$drag_is_correct=true;}else{$drag_is_correct=false;}
	
	if($id_correct_puzzle_drop==$id_droppable && $id_droppable!=$id_draggable){$drop_is_correct=true;}else{$drop_is_correct=false;}
		 
	$('#'+$id_draggable).css({"top":$pos_sqrt_puzzle_drop.top+"px","left":$pos_sqrt_puzzle_drop.left+"px"});
	$('#'+$id_droppable).css({"top":$pos_sqrt_puzzle_drag.top+"px","left":$pos_sqrt_puzzle_drag.left+"px"});
		
	if($drag_is_correct==true){
		$correct_sqrt_puzzle--;
	}else{
		if($id_droppable==$id_correct_puzzle_drag && $id_droppable!=$id_draggable){
			$correct_sqrt_puzzle++;}//end if $id_droppable
	}// end if $drag_is_correct==true
												
	if($drop_is_correct==true){
		$correct_sqrt_puzzle--;
	}else{
		if($id_draggable==$id_correct_puzzle_drop && $id_droppable!=$id_draggable){					
			$correct_sqrt_puzzle++;}//end if $id_draggable
	}//end if $drop_is_correct==true							 
		
	//console.log('$correct_sqrt_puzzle');			   
	//console.log($correct_sqrt_puzzle);	
	success_msg($correct_sqrt_puzzle);	   
	$id_droppable=0;		   
}// end function handle_drag_stop
	 
/*increment $correct_sqrt_puzzle by 1 if sqrt_puzzle at the correct place*/
function increment_correct_sqrt_puzzle(){	
	for(i=1;i<=$nbr_puzzle;i++){
		$pos_i=$('#'+i).position();				
		$i=parseInt(($pos_i.top+50)/100);
		$j=parseInt(($pos_i.left+50)/100);
		$correct_id=($i+1)*$nbr_colonne-($nbr_colonne-($j+1));
		if(i==$correct_id) {$correct_sqrt_puzzle++;}
				 
	}//end for i
	//console.log('$correct_sqrt_puzzle increment_correct_sqrt_puzzle');		   
	//console.log($correct_sqrt_puzzle);
}// end function increment_correct_sqrt_puzzle

/*if all the element are placed at the correct place then show the success message*/
function success_msg($correct_puzzle){
	if($correct_puzzle==$nbr_puzzle){
		$('#cache').show();
		$('#success_msg').animate({
					   left: '35%',
					   top: '20%',
					   width: '400px',
					   height: '150px',
					   opacity: 1});
	}//end if $correct_puzzle==$nbr_puzzle
}//end function success_msg

/*Handle level changes*/
$('#level').change(function(){
	var level=$(this).children(':selected').val();
	var new_image=$('#puzzle img');
	$('#puzzle').empty();
	create_original_puzzle(new_image);
	//$('.sqrt_puzzle').css({"background-image":"url("+new_image.attr('src')+")"});
	$correct_sqrt_puzzle=0;
	generate_rand_puzzle(level);
	increment_correct_sqrt_puzzle();
	console.log($correct_sqrt_puzzle);
});

/* show/hide picture*/
$('#show_picture').click(function(){
	$('#generate').toggle();
	$('.sqrt_puzzle').toggle('clip');
});

/*generate puzzle*/
$('#generate').click(function(){
	var level=$('#level').children(':selected').val();
	var new_image=$('#puzzle img');
	$('#puzzle').empty();
	create_original_puzzle(new_image);
	$correct_sqrt_puzzle=0;
	generate_rand_puzzle(level);
	increment_correct_sqrt_puzzle();
});	

/*play again*/	
$('#play_again').live('click',function(){
	$correct_sqrt_puzzle=0;
	$('#success_msg').hide();
	$('#cache').hide();
	generate_rand_puzzle($level);
	increment_correct_sqrt_puzzle();
});//end play_again
	 
$('#close').live('click',function(){
	$('#success_msg').hide();
	$('#cache').hide();
});//end close		 

create_original_puzzle(image);
generate_rand_puzzle($level);		
increment_correct_sqrt_puzzle();











		   
