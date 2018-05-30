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


