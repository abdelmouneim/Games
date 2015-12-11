/*
		This is a Sudoku puzzle grid, with nine rows and nine columns.
		Author = "Abdelmouneim Hanine <sup3rnova.m0nster@gmail.com>"
		URL = https://github.com/abdelmouneim/
		LICENSE = {
	
		Copyright (c) 2015 Abdelmouneim Hanine <sup3rnova.m0nster@gmail.com>
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
/*Parameters*/
var level=10;
$sudokuWidth=450;
$sudokuHeight=450;
$nbrLigne=9;
$nbrColonne=9;
$nbrSqrt=$nbrLigne*$nbrColonne;
$sqrtWidth=46;//2*2px for the  border
$sqrtHeigth=46;//2*2px for the   border
//$level=3;
var $matSudoku={};
var $valRnd={};
//$correctSqrt=0;
id_droppable=0;

/*Handle the Touch event*/
function touchHandler(event) {
    var touch = event.changedTouches[0];
	var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent({
        touchstart: "mousedown",
        touchmove: "mousemove",
        touchend: "mouseup"
    }[event.type], true, true, window, 1,
        touch.screenX, touch.screenY,
        touch.clientX, touch.clientY, false,
        false, false, false, 0, null);

    touch.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

function init() {
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);
}
/***/
init();




$('button').button();

$('#sudoku').css({"width":$sudokuWidth+"px",
 		  "heigth":$sudokuHeight+"px"	
 	             });
/*Initialize The array $valRnd with values 1 2 3 4 5 6 7 8 9*/ 
function initTabByVal($valRnd,n){
	for (cpt=0; cpt<n; cpt++)
         $valRnd[cpt]=cpt+1;
    }//end function initTabByVal  
initTabByVal($valRnd,9);

//Initialize an array 9*9  with 0 
function initMat($matSudoku){
	for($i=0;$i<9;$i++){
		for($j=0;$j<9;$j++){
			$matSudoku[$i][$j]=0;
			            }//end for j
		            }//end for i
	    }//end function initMat

/*Generate random number without repetition*/       
function rand($valRnd , idTabValRand){ 
	n=9;
	idValRand=Math.floor((Math.random()*(n-idTabValRand)));
	rnd=$valRnd[idValRand];
	permute=$valRnd[idValRand];
	$valRnd[idValRand]=$valRnd[n-idTabValRand-1];	
	$valRnd[n-idTabValRand-1]=permute;
	return rnd;
		}//end function rand 
	             
/*Array declaration of a two-dimention, which all cells are initialized to 0*/
function genarateMatSoduko($nbrLigne,$nbrColonne){
	for(i=0;i<$nbrLigne;i++){
		$matSudoku[i]={};
		for(j=0;j<$nbrColonne;j++){
			$matSudoku[i][j]=0;
			                    }//end for j
		             }//end for i
			}//end function genarateMatSoduko

/*Check if a row contains a number*/			
function isInLigne(val,ligne,mat,$nbrColonne,exclusColonne){
	
	for(c=0;c<$nbrColonne;c++){
		if(mat[ligne][c]==val && c!=exclusColonne ){return 1;}
				}//fin for c
	return 0;
	}//end function isInLigne

				
/*Check if a column contains a number*/				
function isInColonne(val,colonne,mat,$nbrLigne,exclusLigne){
	for(l=0;l<$nbrLigne;l++){
		if(mat[l][colonne]==val && l!=exclusLigne){return 1;}
				}//end for l
	return 0;						  
	}//end function isInCulomn
				
/*
To search within a block, First we determine the row of start, the end row is the first row plus 3
NB:ligneFinRecherche < ligneDebutRecherche+3
 */ 
function ligneDebut($i){
	return parseInt($i/3)*3;
	   }//end function ligneDebut

/*
To search within a block, First we determine the column of start, the end column is the start column plus 3 
NB:colonneFinRecherche < colonneDebutRecherche+3
 */ 	    
function colonneDebut($j){
	return parseInt($j/3)*3;
	     } //end function colonneDebut

/*
Check if a block contains a number
NB : a block contains 9 number
*/								
function isInBlock(i,j,val,mat,exlusLigne,exclusColonne){
	$ligneDebut=ligneDebut(i);
	$ligneFin=$ligneDebut+3;
	$colonneDebut=colonneDebut(j);
	$colonneFin=$colonneDebut+3;
	for($i=$ligneDebut;$i<$ligneFin;$i++){
		for($j=$colonneDebut;$j<$colonneFin;$j++){
			if(mat[$i][$j]==val && $i!=exlusLigne && $j!=exclusColonne){return 1;}
						}//end for $j
				}//end for $i
	return 0;
	}//end function isInBlock

//genarateRandMatSoduko					
function genarateRandMatSoduko($matSudoku){
	for(i=0;i<9;i++){
		$matSudoku[i]={};
		initTabByVal($valRnd,9);
		for(j=0;j<9;j++){
			idTabValRand=0;
			initTabByVal($valRnd,9);
			do{ 
				randVal=rand($valRnd , idTabValRand);
				idTabValRand++;
				if(isNaN(randVal)){i=-1; j=9; initMat($matSudoku); idTabValRand=0; break;}//end if isNAaN
								 
			}while(isInLigne(randVal,i,$matSudoku,9,-1)!=0 || 
			       isInColonne(randVal,j,$matSudoku,9,-1)!=0 || 
			       isInBlock(i,j,randVal,$matSudoku,-1,-1)!=0)
				if(i!=-1)
				$matSudoku[i][j]=randVal;
				}//end for j
			}//end for i  	
	}//end function genarateRandMatSoduko

function createSudoku($matSudoku,level){
	initTabByVal($valRnd,9);
	for($i=0;$i<level;$i++){/* level 47*/
		randI=rand($valRnd , 0)-1;
		randJ=rand($valRnd , 0)-1;
		$matSudoku[randI][randJ]=0;
		}//end for $i
	
	           }//end function createSudoku

function handle_drag_stop(event,ui){
	$pos_top_drag=parseInt(ui.position.top)+25;
	$pos_left_drag=parseInt(ui.position.left)+25;	
	$i_drag_recus=parseInt($pos_top_drag/50);
	$j_drag_recus=parseInt($pos_left_drag/50);
	$numbDraggable=$(this).children().html();
	$var='<div>'+$numbDraggable+'</div>';
	idDragable=$(this).attr('id');
	idDragable=parseInt(idDragable);
	if(!isNaN(idDragable)){
		$('#'+idDragable).empty();
		positionEmis=$('#'+idDragable).position();
		$i_drag_emis=parseInt(positionEmis.top/50);
		$j_drag_emis=parseInt(positionEmis.left/50);	
			       }//end if isNaN idDragable
		idDragable=idDragable+"";
		if(id_droppable){
			if($(this).parent().is('#numb')){
				$('#'+id_droppable).empty();
				$('#'+id_droppable).append($var);
				$matSudoku[$i_drag_recus][$j_drag_recus]=parseInt($numbDraggable);
			}else{
				$numbDraggable=parseInt($numbDraggable);
				if(!isNaN($numbDraggable)){
					$('#'+id_droppable).empty();
					$('#'+id_droppable).append($var);
					$matSudoku[$i_drag_emis][$j_drag_emis]=0;
					$matSudoku[$i_drag_recus][$j_drag_recus]=parseInt($numbDraggable);
						            }//end if !isNaN($numbDraggable)
				}//end if $(this).parent().is('#numb')
				}//end if id_droppable
		id_droppable=0;    	
	  		         }//end function handle_drag_stop			   

/*Show sudoku*/				 
function showSudoku(){
	k=1;//To identify sqrt_puzzle
	for(i=0;i<$nbrLigne;i++){
		for(j=0;j<$nbrColonne;j++){
			$var="<div id="+k+" class='sqrt'><div>"+$matSudoku[i][j]+"</div></div>";
			$('#sudoku').append($var);	
			if($matSudoku[i][j]!=0) $('#'+k).addClass("sqrtValide");
			else $('#'+k).empty();
			$('#'+k).css({"top":i*50+"px","left":j*50+"px"});
			k++;
		   }
	 }
	$separateurVerRight='#3,#12,#21,#30,#39,#48,#57,#66,#75,#6,#15,#24,#33,#42,#51,#60,#69,#78';
	$separateurVerLeft='#4,#13,#22,#31,#40,#49,#58,#67,#76,#7,#16,#25,#34,#43,#52,#61,#70,#79';
	$($separateurVerRight).css('border-right-color','#000') ;
	$($separateurVerRight).css('border-right-width','2px') ;
	$($separateurVerLeft).css('border-left-color','#000') ; 
	$($separateurVerLeft).css('border-left-width','2px') ;  
	$separateurHorBottom='#19,#20,#21,#22,#23,#24,#25,#26,#27,#46,#47,#48,#49,#50,#51,#52,#53,#54';
	$separateurHorTop='#28,#29,#30,#31,#32,#33,#34,#35,#36,#55,#56,#57,#58,#59,#60,#61,#62,#63'; 
	$($separateurHorBottom).css('border-bottom-color','#000') ;
	$($separateurHorBottom).css('border-bottom-width','2px') ;
	$($separateurHorTop).css('border-top-color','#000') ;
	$($separateurHorTop).css('border-top-width','2px') ; 
/*make element dragable*/ 
$('#sudoku .sqrt:not(".sqrtValide")').draggable({'containment':'parent',
						 'cursor':'move',
						 'helper':'clone',
						 'stack':'z-index:100',
						 'stop':handle_drag_stop
								  });	
$('#numb .sqrt:not(".sqrtValide")').draggable({'containment':'#sudoku',
					       'cursor':'move',
					       'helper':'clone',
					       'stack':'z-index:100',
					       'stop':handle_drag_stop
								  }); 
/*make element droppable*/ 
$('#sudoku .sqrt:not(".sqrtValide")').droppable({
						'drop':function(event,ui){id_droppable=$(this).attr("id");}
		                         });	 
	 }

//button close : dialogBox	 
$('#close').live('click',function(){
				
	$('#success_msg').toggle( "clip" );
	$('#cache').fadeOut();
	});//end close	 
	 
//function successMsg	 
function successMsg(){
	$('#cache').fadeIn('slow');
	$('#success_msg').fadeIn('slow').animate( {
						left: '35%',
						top: '20%',
						width: '400px',
						height: '150px',
						opacity: 1
    								} );//end animate
					
	 }//end function successMsg	 
	 
	 
//button valider : if the sudoku grid is correct then show success message, otherwise show failed message

$('#valider').live('click',function(){
	  
	$sudokuValide=true;       
	for(i=0;i<9;i++){
		for(j=0;j<9;j++){
			if(isInLigne($matSudoku[i][j],i,$matSudoku,9,j)!=0 ||
				     isInColonne($matSudoku[i][j],j,$matSudoku,9,i)!=0 || 
				     isInBlock(i,j,$matSudoku[i][j],$matSudoku,i,j)!=0 || 
				     $matSudoku[i][j]==0){
	
				$sudokuValide=false;
				break;
			}//end if
		}//end for j
	}//end for i
								
	successMsg();						
	if($sudokuValide==true){
			
		$('#success_msg h1').empty();
		$('#success_msg h1').append('Congratulations, you win :)');
	}else{
		$('#success_msg h1').empty();
		$('#success_msg h1').append('Oops, you lose :(');
		}//end $sudokuValide==true	   
	    
		
	
	});

function generateSudoku(){
	var level=$('#level').children(':selected').val();
	$('#sudoku').empty();
	initMat($matSudoku);
	genarateRandMatSoduko($matSudoku);	
	createSudoku($matSudoku,level);
	showSudoku();
}

$('#generate').live('click',function(){
	generateSudoku()
});

$('#play_again').live('click',function(){
	$('#success_msg').toggle( "clip" );
	$('#cache').fadeOut();
	generateSudoku()
});

//-----------------------------Handle the levels-----------------
$('#level').change(function(){
	
	var level=$(this).children(':selected').val();
	$('#sudoku').empty();
	initMat($matSudoku);
	genarateRandMatSoduko($matSudoku);	
	createSudoku($matSudoku,level);
	showSudoku();
	                
	});


genarateMatSoduko($nbrLigne,$nbrColonne);								             
genarateRandMatSoduko($matSudoku);	
createSudoku($matSudoku,level);
showSudoku();
