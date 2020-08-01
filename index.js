function multiRequest(urls) {
  if(!urls) {
    throw new TypeError("multiRequest urls parameter is required")
  }

  if(urls.constructor !== Array){
    throw new TypeError("multiRequest first argument should be an array")
  }

  if(urls.length === 0) {
    throw new TypeError("multiRequest urls argument array should contain a list of urls")
  }
  
  const promises = urls.map(url => apiCall(url))
  return Promise.all(promises)
}


function apiCall(url) {
  const promise = new Promise(function(resolve, reject){
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.send()
    
    xhr.onreadystatechange = function () {
      if(xhr.readyState === 4) {
        var status = xhr.status;
        if (status === 0 || (status >= 200 && status < 400)) {
          resolve(JSON.parse(xhr.response))
        } else {
          reject(JSON.parse(xhr.response))
        }
      }
    };
  })

  return promise  
}

module.exports = multiRequest




