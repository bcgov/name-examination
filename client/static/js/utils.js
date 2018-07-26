// read initial values from json file
function readJFile(configUrl, cBack) {
    if (configUrl) {
           var req = new XMLHttpRequest();
           req.open('GET', configUrl, true);
           req.setRequestHeader('Accept', 'application/json');

           req.onreadystatechange = function () {
             if (req.readyState == 4) {
                   if (req.status == 200) {
                         cBack(JSON.parse(req.responseText));
                   } else {
                         cBack(null);
                   }
             }
           };

           req.send();

    } else {
      cBack(null);
    }
    return null;
}

function readCsv(csvFile, callback) {
  console.log('got to readCsv()');

  if (csvFile) {
    var req = new XMLHttpRequest();
    req.open('GET', csvFile, true);

    req.onreadystatechange = function () {
      if (req.readyState == 4) {
        if (req.status == 200) {

          var allTextLines = req.responseText.split(/\r\n|\n/);

          // create what will be a list of objects
          var lines = [];

          // loop through all lines and parse data into object
          for (var i=1; i < allTextLines.length; i++) {
            var data = allTextLines[i].split(',');

            var obj = {
              'request_type': data[0],
              'nwpta_required': data[2]=='TRUE'?true:false,
              'jurisdiction_required': data[3]=='TRUE'?true:false,
              'prev_nr_required': data[4]=='TRUE'?true:false,
              'corp_num_required': data[5]=='TRUE'?true:false,
              'additional_info_template': data[6],
            }

            lines.push(obj);
          }
          callback(lines);
        } else {
          callback(null);
        }
      }
    };

    req.send();

  } else {
    callback(null);
  }
  return null;
}

function findArrValue(needle) {
  // assumes the haystack is an object with attribute "value" to match to
  return function (haystack) {
    return needle == haystack.value;
  }
}

function findArrText(needle) {
  // assumes the haystack is an object with attribute "text" to match to
  return function (haystack) {
    return needle == haystack.text;
  }
}

function findArrValueByAttr(needle, attribute) {
  return function (haystack) {
    return needle == eval('haystack.' + attribute);
  }
}

function getDescFromList(haystack, needle) {
  return haystack.filter(findArrValue(needle))[0].text
}

function getValueFromText(haystack, needle) {
  return haystack.filter(findArrText(needle))[0].value
}

function getTextFromValueMultiple(haystack, needle) {
  // return array of matches, not just single value
  return haystack.filter(findArrValue(needle));
}
