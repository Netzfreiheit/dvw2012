$("section:not('.page')").hide();

$('#overlay').overlay({
	fixed: false,
	top: 0,
	left: 0,
	onClose: function(){
		var o = this.getOverlay();		
		o.find('.inner').remove();
		clearHash();
	}
});

$(".standpoint a, .summary td a").click(function(e){
	
	var d = $( '<div class="inner">' ); // wrapper
	var t = $(e.target).attr('href');  // id / anchor
	var questions, answers; 
	
	$(t).closest('section').find('h1').clone().appendTo(d);
	$(t).closest('section').find('aside').clone().appendTo(d);
	
	if ((t + '').indexOf('-description') !== -1) {  // only topic description and questions
		$(t).closest('section').find('h2:first').clone().appendTo(d);
		$(t).closest('section').find('ol:first').clone().appendTo(d);	
	}
	else {  // party answers
		$(t).clone().appendTo(d); // header 

		// questions and answers
		questions = $(t).closest('section').find('ol:first > li').clone();
		answers = $(t).next().find('ol > li').clone();

		if (answers.length === questions.length) {  // display questions with answers
			for (var i = 0; i < questions.length; i++) {
				$(d).append('<h3 class="question">' + $(questions[i]).html() + '</h3>');
				$(d).append('<p class="answer">' + $(answers[i]).html() + '</p>');
			}	
		}
		else {  // display only questions
			$(t).closest('section').find('h2:first').clone().appendTo(d);
			$(t).closest('section').find('ol:first').clone().appendTo(d);	
			$(d).append('<h3>Antwort der Partei</h3>');
		}
		
		 // appendix // append whatever answer we got
		if (t.indexOf('-summary') === -1) {
			$(t).next().find('.appendix').clone().appendTo(d);
		}
		else {
			$(t).next().clone().appendTo(d);
		}	
	}
	
	$(t).closest('section').find('a.back').clone().appendTo(d).click(function(e) {
		$('#overlay').overlay().close();
		clearHash();
		e.preventDefault();
		$('#overlay').scrollTop(0);
	});
	
	$('#overlay').append(d);	
	$('#overlay').overlay().load();	
});	

$("nav.sub a").click(function(e){
	
	var d = $( '<div class="inner">' );
	var t = $(e.target).attr('href');
	
	$(t).clone().contents().appendTo(d);	
	$('#overlay').append(d);
	$('#overlay').find('a.back').click(function() {
		$('#overlay').overlay().close();
		e.preventDefault();
		$('#overlay').scrollTop(0);
	});	
	$('#overlay').overlay().load();	
});

//table cell behaviors	
$('#overview td[class!=topic]').bind("mouseenter",function() {
	
	// highlight headers on cell over
	$('#overview th').removeClass('highlight'); 
		
	var index = $(this).parent().children().index(this);	
	 $('#overview').each(function() {
	  $(':nth-child(' + (index + 1) + ')' ,this).addClass('highlight');
	});
	
	//remove highlights when not needed
	}).bind("mouseleave",function(){
		  var index = $(this).parent().children().index(this);	
			$('#overview').each(function() {
				  $(':nth-child(' + (index + 1) + ')' ,this).removeClass('highlight');
			})
});
	
//fake click to load page with relevant section open if hash in URL	
if (document.location.hash != '') {
	var targ = 'a[href*='+document.location.hash+']';
	if($(targ).length>0) {
		$(targ).click();				
	}
}

/**
 * clears the hash out of address bar in case of closed dialog
 **/
function clearHash () { 
	window.location.hash = '';
	history.pushState('', document.title, window.location.pathname);
}