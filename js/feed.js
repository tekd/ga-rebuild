$.ajax({
    method: "GET",
    url: "http://thegovlab.org/feed/",
    dataType: "xml",
  }).done(function(data) {
    parseXml(data)
  }).fail(function(err) {
    // console.log(err);
  });


function parseXml(xml) {
  console.log(xml);
  var feedArray = $(xml).find("item");
    // APPENDING 1 FOR NOW
  var topFourItems = feedArray.splice(0,1);
  // debugger
  var digestHtml = [];
  topFourItems.forEach(function(item){;
    var title = $(item).find("title").text();
    var author = $(item).find("creator").text();
    var link = $(item).find("link").text();
    var description = $(item).find("description").text();
    $("#slider-div").append('<section id="slide-id" class="b-slide m-purple"><header><h4>The GovLab Digest</h4></header><div class="row e-content"><div class="column medium-6"><h2 class="e-project-name">' + title + '</h2><h3><strong>By: </strong>'+ author +'</h3></div><div class="column medium-6"><p>' + description + '</p></div></div><div class="row e-content"><div class="column medium-6"><div class="e-action"><a class="b-button m-naked" href="http://thegovlab.org/category/govlab-digest/">Read the Digest<i class="material-icons">arrow_forward</i></a></div></div><div class="column medium-6"><div class="e-action"><a class="b-button m-naked" href=\"'+link +'\">Find out more<i class="material-icons">arrow_forward</i></a></div></div></div></section>');
  }); 


}
