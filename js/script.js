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

	window.document.title = getWindowTitle(t);
	
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
			if (!$(t + ' span.nb').length) {
				$(d).append('<h3>Antwort der Partei</h3>');	
			}
		}
		
		// appendix // append whatever answer we got
		if (t.indexOf('-summary') === -1) {
			if (answers.length !== questions.length) {
				$(t).next().find(':not(ul,ol,li,.appendix)').clone().appendTo(d);
			}
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

	$(d).append('<div id="disqus_thread"></div>');
	
	$('#overlay').append(d);	
	$('#overlay').overlay().load();	
	resetThread(t);
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
	var targ = 'a[href*='+(document.location.hash || '').replace('!','')+']';
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
	window.document.title = "Netzpolitik Wahlmonitor 2013 | Initiative für Netzfreiheit";
}

function getWindowTitle (ref) {
	ref = ref.split('-');
	var party = $('th#' + ref[0]).html()
		  , topic = $('td#' + ref[1] + ' a').html();
	return "Netzpolitik Wahlmonitor 2013 | Initiative für Netzfreiheit".replace('|', '| ' + party + '»' + topic + ' |')
}

function resetThread (id) {
  id = (id || '').replace('#','');

  if (typeof DISQUS === 'undefined') {
  	loadDisqus(id);
  }
  else if (typeof DISQUS !== 'undefined') {
    DISQUS.reset({
      reload: true,
      config: function () {  
        this.page.identifier = id;
        this.page.url = 'https://wahlmonitor.at/beta#!' + id;
        this.page.title = getWindowTitle (id);
        this.language = "de";
      }
    });  
  }
}

function loadDisqus (id) {
	/* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
       // required: replace example with your forum shortname

  var disqus_shortname = 'netzpolitikwahlmonitor2013';
  var disqus_identifier = id || 'main';
  var disqus_url = 'https://wahlmonitor.at/beta/#!' + (id |'');
  var disqus_developer = '1';
  
var disqus_config = function () { 
  this.language = "de";
  this.callbacks.onNewComment = [function() { return 0; }];
};
  /* * * DON'T EDIT BELOW THIS LINE * * */
  (function() {
      var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
      dsq.src = 'https://' + disqus_shortname + '.disqus.com/embed.js';
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
  })();
}
