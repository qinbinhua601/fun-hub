var uuid = require('uuid')
var superagent = require('superagent')

function noop(){}

var callbackWrapper = function(data) {
    var err = null;
    var res = {
        body: data
    }

  this._jspCleanup()
    this._jspCallback.apply(this, [err, res])
}

var end = function(callback){
    this._jspCallback = callback

  var query = this._query.join('&')
  query = superagent.serializeObject(query)
  this.url += ~this.url.indexOf('?')? '&' + query : '?' + query

  var target = document.getElementsByTagName('script')[0] || document.head

  var script = document.createElement('script')
  script.src = this.url
  target.parentNode.insertBefore(script, target)


  this._jspCleanup = () => {
    if (script.parentNode) script.parentNode.removeChild(script)
    window[this._jspCallbackId] = noop
    if (this._timer) clearTimeout(this._timer)
  }
  if (this._timeout && !this._timer) {
    this._timer = setTimeout(function(){
      this._jspCleanup()
      self.timedout = true
      self.abort()
    }, timeout)
  }
}

export default function(request) {
  request._jspCallbackId = "__jsp" + uuid.v4().replace(/-/g, '')
  window[request._jspCallbackId] = callbackWrapper.bind(request)
  request.end = end.bind(request)
  request.query({ callback : request._jspCallbackId })
  return request
}