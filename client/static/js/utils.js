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
