//= ../../bower_components/jquery/dist/jquery.js

function urlEncode(obj) {
  var s = '';
  for (var key in obj) {
    s +=encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]) + '&';
  }

  if (s.length > 0) {
    s = s.substr(0, s.length - 1);
  }

  // replace '%2520' with '+' (spaces)
  for (var i = 0; i < s.length; i++) {
    s = s.replace('%2520', '+');
  }

  return s;
}

function performSearch() {
  var params = {
    term: jQuery('#search-text').val(),
    country: encodeURIComponent(jQuery('#search-country .selected').attr('data-value')),
    entity: 'software',
    limit: 1,
    callback: 'handleTunesSearchResults'
  };


  
  var params = urlEncode(params);
  console.log(params);
  // var url = 'http://ax.itunes.apple.com/WebObjects/MZStoreServices.woa/wa/wsSearch?' + params;
  var url = 'https://itunes.apple.com/search?' + params;
  console.log(url);
  var html = '<script src="' + url + '"><\/script>';
  jQuery('head').append(html);
}

function handleTunesSearchResults(arg) {
  var results = arg.results;
  console.log(results);
  for (var i = 0; i < results.length; i++) {
    var item = results[i];
    var obj = {
      source: 0,
      track_name: item.trackCensoredName,
      artist_name: item.artistName,
      artwork: item.artworkUrl512,
      content_advisory_rating: item.contentAdvisoryRating,
      artist_url: item.artistViewUrl,
      price: item.formattedPrice,
      screenshots: item.screenshotUrls,
      genre: item.primaryGenreName,
      description: item.description,
      release_date: item.currentVersionReleaseDate,
      release_notes: item.releaseNotes
    };

    results[i] = obj;
  }

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

function render(obj) {
  var html = '';
  $('.app-name h2').html(obj.track_name);
  $('.age-limit').html(obj.content_advisory_rating);
  $('.author').html(obj.artist_name + '<i class="angle right icon"></i>');
  $('#artwork').attr('src', obj.artwork);

  for (var i = 0; i < obj.screenshots.length; i++) {
    html += "<div class='screenshot'><img src='" + obj.screenshots[i] + "' alt='screenshot'></div>";
  }
  $('#screenshots').html(html);

  $('.description-text').html(obj.description);

  var date = convertDate(obj.release_date);
  $('.release-date').html(date['day'] + ' ' + date['month'] + ' ' + date['year'] + ' г.');
  $('.release-notes').html(obj.release_notes);
}