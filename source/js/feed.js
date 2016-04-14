$(document).ready(function() {

  // $.ajax({
  //     method: "GET",
  //     url: "http://thegovlab.org/feed/",
  //     dataType: "xml",
  //   }).done(function(data) {
  //     parseXml(data)
  //   }).fail(function(err) {
  //     console.log(err);
  //   });

  // function parseXml(xml) {
  //   console.log(xml);
  //   var feedArray = $(xml).find("item");
  //   // one for now until slider is fixed
  //   var topFourItems = feedArray.splice(0,1);
  //   var digestHtml = [];
    
  //   topFourItems.forEach(function(item, idx){;
  //     var title = $(item).find("title").text();
  //     var author = $(item).find("creator").text();
  //     var link = $(item).find("link").text();
  //     var description = $(item).find("description").text();

      // digestHtml +='<section id="slide-id-' + idx + '" class="b-slide m-purple"><header><h4>The GovLab Digest</h4></header><div class="row e-content"><div class="column medium-6"><h2 class="e-project-name">' + title + '</h2><h3><strong>By: </strong>'+ author +'</h3></div><div class="column medium-6"><p>' + description + '</p></div></div><div class="row e-content"><div class="column medium-6"><div class="e-action"><a class="b-button m-naked" href="http://thegovlab.org/category/govlab-digest/">Read the Digest<i class="material-icons">arrow_forward</i></a></div></div><div class="column medium-6"><div class="e-action"><a class="b-button m-naked" href=\"'+link +'\">Find out more<i class="material-icons">arrow_forward</i></a></div></div></div></section>';
    
  //   }); 
  //    $(".b-slider").append(digestHtml);
  // }


var render = function(posts) {
    posts.forEach(function (element, index) {
        var title = element.title,
            content = element.content;

        if (title.length > 100) {
            title = title.substr(0, 100) + '...';
        }

        if (content.length > 500) {
            content = content.substr(0, 500) + '...';
        }

        $('.js-article-' + (index + 1) + '-title').text(title);
        $('.js-article-' + (index + 1) + '-author').text(element.author);
        $('.js-article-' + (index + 1) + '-content').html(content);
        $('.js-article-' + (index + 1) + '-link').attr('href', element.link);
    });

    $('.e-banner-container').each(function() {
        var $wraps = $(this).find('.b-featured-content > div.e-wrap'),
            max = Math.max.apply(
                null,
                $wraps.map(function() {
                    return $(this).outerHeight(true);
                }).get()
            );

        $wraps.height(max);
    });
};

// Note that this assumes that thegovlab.org has CORS headers.
$.get('http://thegovlab.org/feed/', function(xml) {
    var posts = [];
    $('item', xml).each(function() {
        posts.push({
            title: $('title', this).text(),
            author: $('dc\\:creator', this).text() /* Firefox */ ||
                    $('creator', this).text() /* Webkit */,
            content: $('description', this).text(),
            link: $('link', this).text()
        });
    });
    render(posts);

  });
});




