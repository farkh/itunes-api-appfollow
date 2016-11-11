//= ../../bower_components/jquery/dist/jquery.js

$(function() {
  $('#search-button, #search-country .menu').on('click', function() {
    showPhone();
  });
});

$(function() {
  $('#search-text').on('focusout', function() {
    showPhone();
  });
});

function showPhone() {
  if ($('#search-text').val() != '') {
    $('.toggler').show();
    performChoose();
  }
}

function urlEncode(obj) {
  var s = '';
  for (var key in obj) {
    s +=encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]) + '&';
  }

  if (s.length > 0) {
    s = s.substr(0, s.length - 1);
  }

  for (var i = 0; i < s.length; i++) {
    s = s.replace('%2520', '+');
  }

  return s;
}

function performChoose() {
  var search = $('#search-text').val();

  if (isItunesLink(search)) {
    performLookup();
  } else {
    performSearch();
  }
}

function performSearch() {
  var country = 'us';
  if (encodeURIComponent($('#search-country .selected').attr('data-value')) != 'undefined') {
    country = encodeURIComponent($('#search-country .selected').attr('data-value'));
  }
  var params = {
    term: $('#search-text').val(),
    country: country,
    entity: 'software',
    limit: 1,
    callback: 'handleSearchRes'
  };
  
  var params = urlEncode(params);
  var url = 'https://itunes.apple.com/search?' + params;
  var html = '<script src="' + url + '"><\/script>';
  jQuery('head').append(html);
}

function performLookup() {
  var link = $('#search-text').val();
  var startPoint = link.indexOf('/id');
  var endPoint = link.indexOf('?');
  var id = '';

  for (var i = startPoint + 3; i < endPoint; i++) {
    id += link[i];
  }

  var params = {
    id: id,
    country: encodeURIComponent($('#search-country .selected').attr('data-value')),
    entity: 'software',
    limit: 1,
    callback: 'handleSearchRes'
  }

  var params = urlEncode(params);
  var url = 'https://itunes.apple.com/lookup?' + params;
  var html = '<script src="' + url + '"><\/script>';
  jQuery('head').append(html);
}

function isItunesLink(string) {
  if (string.indexOf('itunes.apple.com') + 1) {
    return true;
  }

  return false;
}

function handleSearchRes(arg) {
  var results = arg.results;

  var obj = {
    source: 0,
    track_name: results[0].trackCensoredName,
    artist_name: results[0].artistName,
    artwork: results[0].artworkUrl512,
    content_advisory_rating: results[0].contentAdvisoryRating,
    artist_url: results[0].artistViewUrl,
    price: results[0].formattedPrice,
    screenshots: results[0].screenshotUrls,
    genre: results[0].primaryGenreName,
    description: results[0].description,
    release_date: results[0].currentVersionReleaseDate,
    release_notes: results[0].releaseNotes,
    version: results[0].version,
    size: results[0].fileSizeBytes,
    minimum_version: results[0].minimumOsVersion,
    rating: results[0].averageUserRating,
    rating_count: results[0].userRatingCount
  };

  render(obj);
}

var months = {
  '01': 'янв.',
  '02': 'фев.',
  '03': 'мар.',
  '04': 'апр.',
  '05': 'май',
  '06': 'июн.',
  '07': 'июл.',
  '08': 'авг.',
  '09': 'сен.',
  '10': 'окт.',
  '11': 'ноя.',
  '12': 'дек.'
};

function convertDate(string) {
  var string = string;
  var dateArr = string.split('-');
  var date = {};

  date['month'] = months[dateArr[1]];
  date['day'] = dateArr[2].substr(0, 1) == '0' ? dateArr[2].substr(1, 1) : dateArr[2].substr(0, 2);
  date['year'] = dateArr[0];

  return date;
}

function checkPrice(string) {
  if (string.match(/[0-9]/)) {
    return true;
  }

  return false;
}

function bytesToSize(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

var ratings = {
  '0': 'rating-0',
  '0.5': 'rating-5',
  '1': 'rating-10',
  '1.5': 'rating-15',
  '2': 'rating-20',
  '2.5': 'rating-25',
  '3': 'rating-30',
  '3.5': 'rating-35',
  '4': 'rating-40',
  '4.5': 'rating-45',
  '5': 'rating-50'
};

function render(obj) {
  var html = '';
  $('.app-name h2').html(obj.track_name);
  $('.age-limit, #limitations').html(obj.content_advisory_rating);
  $('.author').html(obj.artist_name + '<i class="angle right icon"></i>');
  $('#artwork').attr('src', obj.artwork);

  for (var i = 0; i < obj.screenshots.length; i++) {
    html += "<div class='screenshot'><img src='" + obj.screenshots[i] + "' alt='screenshot'></div>";
  }
  $('#screenshots').html(html);

  $('.description-text').html(obj.description);

  var date = convertDate(obj.release_date);
  $('.release-date, #release-date').html(date['day'] + ' ' + date['month'] + ' ' + date['year'] + ' г.');
  $('.release-notes').html(obj.release_notes);

  if (checkPrice(obj.price)) {
    $('.download').html(obj.price);
  } else {
    $('.download').html('Загрузить');
  }

  // Info
  $('#developer').html(obj.artist_name);
  $('#category').html(obj.genre);
  $('#version').html(obj.version);
  $('#size').html(bytesToSize(obj.size));

  $('#compatibility').html('Требуется iOS ' + obj.minimum_version + ' или более поздняя версия.')
  
  if (obj.rating_count != undefined) {
    $('.rating').css('display', 'block');
    $('.rating-count').html('(' + obj.rating_count + ')');
    $('.rating-stars').html('<span id="rating-static" class="' + ratings[obj.rating] + '"></span>');
  } else {
    $('.rating').css('display', 'none');
  }
}