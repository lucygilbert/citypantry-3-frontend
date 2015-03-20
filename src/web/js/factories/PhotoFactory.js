angular.module('cp.factories').factory('PhotoFactory', $q => {
    const Photo = (fullWidth, fullHeight) => dataUri => {
        const dataUriToImage = dataUri => {
                return $q((resolve, reject) => {
                    const image = new Image();

                    image.onload = () => {
                        resolve(Object.freeze(image));
                    };
                    image.onerror = reject;
                    image.src = dataUri;
                });
            },
            canvasToDataUri = canvas => {
                return $q.when(canvas).then(canvas => canvas.toDataURL('image/jpeg', 1));
            },
            imageToCanvas = image => {
                const canvas = document.createElement('canvas');

                canvas.width = image.width;
                canvas.height = image.height;
                canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);

                return Object.freeze(canvas);
            },
            resizeCanvas = (width, height) => canvas => {
                const resizingCanvas = document.createElement('canvas'),
                      ratio = Math.min(width / canvas.width, height / canvas.height),
                      context = resizingCanvas.getContext('2d');

                if (canvas.width < width || canvas.height < height) {
                    return $q.reject('Photo too small');
                }

                resizingCanvas.width = canvas.width * ratio;
                resizingCanvas.height = canvas.height * ratio;

                context.drawImage(canvas, 0, 0, resizingCanvas.width, resizingCanvas.height);

                return Object.freeze(resizingCanvas);
            },
            cropCanvasSquare = canvas => {
                const croppingCanvas = document.createElement('canvas'),
                      shortestEdge = Math.min(canvas.width, canvas.height),
                      context = croppingCanvas.getContext('2d'),
                      xPosition = Math.min(-(canvas.width - canvas.height) / 2, 0),
                      yPosition = Math.min(-(canvas.height - canvas.width) / 2, 0);

                croppingCanvas.width = shortestEdge;
                croppingCanvas.height = shortestEdge;
                context.drawImage(canvas, xPosition, yPosition, canvas.width, canvas.height);

                return Object.freeze(croppingCanvas);
            },
            resizeDataUri = dataUri => {
                const image = dataUriToImage(dataUri),
                      canvas = image.then(imageToCanvas),
                      resizedCanvas = canvas.then(resizeCanvas(fullWidth, fullHeight));

                return resizedCanvas.then(canvasToDataUri);
            },
            thumbnailDataUri = dataUri => {
               const image = dataUriToImage(dataUri),
                     canvas = image.then(imageToCanvas),
                     squareCanvas = canvas.then(cropCanvasSquare),
                     thumbnailCanvas = squareCanvas.then(resizeCanvas(350, 350));

               return thumbnailCanvas.then(canvasToDataUri);
            };

        return $q.all([resizeDataUri(dataUri), thumbnailDataUri(dataUri)]).then(values => {
            return Object.freeze({
                dataUri: values[0],
                thumbnailDataUri: values[1],
                isCover: false
            });
        });
    };

    Photo.albumHasACover = album => album.filter(photo => photo.isCover).length === 1;

    Photo.setAlbumCover = (album, index) => {
        const makeCover = photo => angular.extend({}, photo, { isCover: true }),
              makeNotCover = photo => angular.extend({}, photo, { isCover: false }),
              albumWithNoCover = album.map(makeNotCover),
              photoForCover = albumWithNoCover.slice(index, index + 1),
              photosBeforeCover = albumWithNoCover.slice(0, index),
              photosAfterCover = albumWithNoCover.slice(index + 1, albumWithNoCover.length),
              cover = photoForCover.map(makeCover);

        return Object.freeze(photosBeforeCover.concat(cover).concat(photosAfterCover))
    };

    Photo.photosNotInAlbum = (album, photos) => {
        const albumThumbnails = album.map(photo => photo.thumbnailDataUri),
              thumbIsNotInAlbum = thumbnail => albumThumbnails.indexOf(thumbnail) === -1;

        return Object.freeze(photos.filter(photo => thumbIsNotInAlbum(photo.thumbnailDataUri)));
    };

    Photo.safeArray = (album) => angular.isArray(album) ? album : [];

    return Photo;
});
