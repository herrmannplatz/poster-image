(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory)
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory()
  } else {
    root.poster = factory()
  }
}(this, function () {
  'use strict'

  var supportedEncodings = ['jpg', 'png', 'webp']

  var defaults = {
    encoding: 'png',
    dataURI: false
  }

  var captureFrame = function (video, mimeType, asDataURI) {
    return new Promise(function(resolve) {
      var canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
      
      if (asDataURI === true) {
        resolve(canvas.toDataURL(mimeType))
      } else {
        canvas.toBlob(function(blob) {
          resolve(blob)
        }, mimeType)
      }
    })
  }

  var loadVideoFromFile = function(file) {
    return loadVideoSrc(URL.createObjectURL(file)).then(function(video) {
      URL.revokeObjectURL(video.src)
      return video
    })
  }

  var loadVideoSrc = function (videoSrc) {
    return new Promise(function(resolve) {
      var video = document.createElement('video')
      video.src = videoSrc

      video.addEventListener('loadedmetadata', function(event) {
        video.currentTime = 1
      });

      video.addEventListener('seeked', function() {
        resolve(video)
      });

      video.addEventListener('error', function(error) {
        reject(error)
      });
    })
  }

  var api = function(file, options) {
    if (!(file instanceof Blob)) {
      throw new TypeError('Expected file to be of type Blob')
    }

    var settings = Object.assign({}, defaults, options)

    if (supportedEncodings.indexOf(settings.encoding) === -1) {
      throw new TypeError('Supported encodings are jpg, png or webp')
    }

    var mimeType = 'image/' + settings.encoding

    return loadVideoFromFile(file).then(function(video) {
      return captureFrame(video, mimeType, settings.dataURI)
    }).catch(function(error) {
      throw new Error('Failed to capture poster frame: ' + error.message)
    })
  }

  return api
}))