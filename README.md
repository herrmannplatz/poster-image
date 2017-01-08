# poster-image

Capture preview image from a video file. Useful when dealing with videos uploaded by the user.

## usage

HTML
```html
<script src="poster.js"></script>
```

Javascript
```js
poster(file).then(function(blob) {
  var image = new Image()
  image.src = URL.createObjectURL(blob)
  document.body.appendChild(image)
})
```

## browser support

Tested with latest Chrome, Firefox, Opera and Edge.

## api

### `poster(file)`

Create a video preview image from the given video file.

* `file` - video of type `File` or `Blob`.

* returns a Promise with the image data as `Blob`

## license

See [License](LICENSE)
