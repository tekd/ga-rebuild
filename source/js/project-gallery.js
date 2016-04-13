$(document).ready(function() {

  // ISOTOPES for Project Gallery
  var $container = $('.b-card-isotopes');
  // init
  $container.isotope({
    // options
    itemSelector: '.b-card',
    layoutMode: 'fitRows',
    sortBy: 'category'
  });

  // ISOTOPES FILTERS

  $('.e-filter').click(function() {
    var key = $(this).attr('data-filter');
    var filter = '[data-filter*="' + key + '"]';
    var rest = $('.e-filter');

    if (key === 'all') {
      $container.isotope({ filter: '*' });
      rest.removeClass('m-active');
      $(this).addClass('m-active');
    } else {
      $container.isotope({ filter: filter });
      rest.removeClass('m-active');
      $(this).addClass('m-active');
    }
  });


  $container = $('.b-library-isotopes');
  // init
  $container.isotope({
    // options
    itemSelector: '.b-library-item',
    layoutMode: 'fitRows',
    sortBy: 'category'
  });

  // ISOTOPES FILTERS

  // $('.e-filter').click(function() {
  //  var key = $(this).attr('data-filter');
  //  console.log(key);
  //  var filter = '[data-filter*="' + key + '"]';
  //  var rest = $('.e-filter');

  //  if (key === 'all') {
  //    $container.isotope({ filter: '*' });
  //    rest.removeClass('m-active');
  //    $(this).addClass('m-active');
  //  } else {
  //    $container.isotope({ filter: filter });
  //    rest.removeClass('m-active');
  //    $(this).addClass('m-active');

  //    console.log(rest);
  //  }

  // });

  $('.e-faq-trigger').click(function() {
    $('.b-faqs').toggleClass('m-active');
  });

  $('.e-filters-trigger').click(function() {
    var panel = $('.b-filters');

    if (panel.hasClass('m-active')) {
      $('.b-filters').removeClass('m-active');
      $('#overlay').removeClass('m-active');
    } else {
      $('.b-filters').addClass('m-active');
      $('#overlay').addClass('m-active');
    }
  });

  $('#overlay').click(function() {
    $(this).removeClass('m-active b-lightbox');
    $(this).children('.js-image-gallery-item').remove();
    $('.b-filters').removeClass('m-active');
  });

  // RSS from Digest
  // $('#digest-container').rssfeed('http://thegovlab.org/govlab-digest/feed/',
  // {
  //   limit: 5,
  //   linktarget: '_blank'
  // });

// Multiple SwipeJS Galleries
// var swipes = []
// $('.swipe').each(function(i, obj) {
//      swipes[i] = new Swipe(obj);
//  });

// Modal for Project Gallery - Image Gallery
$('.js-image-gallery-item').click(function() {
  var clone = $(this).clone();
  $('#overlay').append(clone).addClass('m-active b-lightbox');
});


// Initialize isotope grid
var $grid = $('.b-filter').isotope({
  // options
  itemSelector: '.b-filter-item',
  layoutMode: 'fitRows'
});

var singleSelectFilter = function () {
  $('.b-filter-ui select').on('change', function () {
    var filterValue = this.value;
    // console.log (filterValue);
    //$grid.isotope({ filter: filterValue });
    updateHash(filterValue);
  });
};

var setSingleFilter = function (val) {
  $('.b-filter-ui select').val(val);
};

var multipleSelectFilter = function () {
  // Functionality for filter UI buttons
  $('.b-filter-ui').on( 'click', 'button', function() {

    var filterValue = '';

    // Clicking 'All' filter
    if ($(this).hasClass('m-clear-filters')) {

      // Deselect all others
      $('.b-filter-ui').children().each(function() {
        $(this).removeClass('m-selected');
      });

      // Can only select, not deselect 'All'
      $(this).addClass('m-selected');

      filterValue = '*';

      // Clicking any other filter
    } else {

    $('.b-filter-ui .m-clear-filters').removeClass('m-selected');

      // Swap selection state of button
      if (!$(this).hasClass('m-selected')) {
        $(this).addClass('m-selected');
      } else {
        $(this).removeClass('m-selected');
      }

      // Build filter string from all selected filters
      $('.b-filter-ui').children().each(function() {
        if ($(this).hasClass('m-selected')) {
          filterValue += $(this).attr('data-filter');
        }
      });

    }

    //console.log(filterValue); //debug
    selectDefaultFilter();
    //$grid.isotope({ filter: filterValue });
    updateHash(filterValue);
  });
};

// Used for multipleSelect() only
// If nothing is selected, select 'All' filter
var selectDefaultFilter = function () {
    var noneSelected = true;

    $('.b-filter-ui').children().each(function() {
      if ($(this).hasClass('m-selected')) {
        noneSelected = false;
      }
    });

    if (noneSelected) {
      $('.b-filter-ui .m-clear-filters').addClass('m-selected');
    }
};

// update the url hash to a single value
var updateHash = function (val) {
  // replace current history state and trigger a custom event so we don't create history items on change
  history.replaceState(undefined, undefined, '#' + val.replace('.', ''));
  $(window).trigger('hashreplace');
};

var filterOnHash = function () {
  var filterValue = document.location.hash.replace('#', '');
  if (filterValue !== '*') { filterValue = '.' + filterValue; }
  $grid.isotope({ filter: filterValue });
};

// uncomment to switch to multiple select
//multipleSelectFilter();
//selectDefaultFilter();

// uncomment to switch to single select
singleSelectFilter();

// watch for hash changes
$(window).on('hashreplace', function() {
  filterOnHash();
});

// 1st time page is visited update filter from hash
if (document.location.hash) {
  // set the value of the select control
  var filterValue = document.location.hash.replace('#', '');
  if (filterValue !== '*') { filterValue = '.' + filterValue; }
  setSingleFilter(filterValue);
  // then filter on it, because setting it via .val() is this way doesn't pop a change event
  filterOnHash();
// or use * if no hash in url
} else {
  $grid.isotope({ filter: '*' });
}

}); // Closes Document.ready



function getQuery(param) {
    var query = location.search.substr(1),
        result = false;

    query.split('&').forEach(function(part) {
        var item = part.split('=');

        if (item[0] == param) {
            result = decodeURIComponent(item[1]);

            if (result.slice(-1) == '/') {
                result = result.slice(0, -1);
            }
        }
    });

    return result;
}


