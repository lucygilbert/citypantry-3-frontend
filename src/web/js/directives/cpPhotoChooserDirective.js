// TODO: Refactor controller into seperate file after module stucture has been refactored.

angular.module('cp').directive('cpPhotoChooser', ($filter, $q, PhotoFactory) => {
    return {
        restrict: 'E',
        require: 'ngModel',
        priority: 1,
        transclude: true,
        scope: { width: '&', height: '&', thumbnailSize: '&' },
        templateUrl: '/dist/templates/directives/cp-photo-chooser.html',
        controller: ($scope, PhotoFactory, PromiseFactory) => {
            $scope.album = [];
            $scope.presentingDuplicateWarning = false;
            $scope.presentingSizeError = false;

            $scope.dismissDuplicateWarning = () => $scope.presentingDuplicateWarning = false;

            $scope.dismissSizeError = () => $scope.presentingSizeError = false;

            $scope.selectCoverPhoto = index => {
                $scope.album = PhotoFactory.setAlbumCover($scope.album, index);
            };

            $scope.presentSizeErrorIfAnyPhotosAreTooSmall = photos => {
                $scope.presentingSizeError = false;

                $q.all(photos).catch(reason => {
                    $scope.presentingSizeError = reason === 'Photo too small';
                });
            };

            $scope.addPhotos = dataUris => {
                const photoPromises = dataUris.map(PhotoFactory($scope.width(), $scope.height()));

                $scope.presentSizeErrorIfAnyPhotosAreTooSmall(photoPromises);

                PromiseFactory.allResolved(photoPromises).then(photos => {
                   const photosNotInAlbum = PhotoFactory.photosNotInAlbum($scope.album, photos),
                         album = $scope.album.concat(photosNotInAlbum);

                   $scope.presentingDuplicateWarning = !angular.equals(photosNotInAlbum, photos);

                   if (PhotoFactory.albumHasACover(album)) {
                       $scope.album = album;
                   } else {
                       $scope.album = PhotoFactory.setAlbumCover(album, 0);
                   }
                });
            };

            $scope.removePhoto = index => {
                const photosBeforePhotoToRemove = $scope.album.slice(0, index),
                      photoToRemove = $scope.album.slice(index, index + 1),
                      photosAfterPhotoToRemove = $scope.album.slice(index + 1, $scope.album.length),
                      album = photosBeforePhotoToRemove.concat(photosAfterPhotoToRemove);

                if (PhotoFactory.albumHasACover(photoToRemove)) {
                    $scope.album = PhotoFactory.setAlbumCover(album, 0);
                } else {
                    $scope.album = album;
                }
            };

            $scope.$watch('photoDataUris', photoDataUris => {
                return $scope.addPhotos(PhotoFactory.safeArray(photoDataUris));
            });
        },
        link: (scope, element, attrs, ngModel) => {
            scope.$watch('album', album => {
                const isCoverPhoto = photo => photo.isCover ? 1 : -1,
                      safeAlbum = PhotoFactory.safeArray(album),
                      sortedAlbum = $filter('orderBy')(safeAlbum, isCoverPhoto),
                      sortedDataUris = sortedAlbum.map(photo => photo.dataUri);
                ngModel.$setViewValue(sortedDataUris);
            });

            ngModel.$render = () => {
                scope.addPhotos(PhotoFactory.safeArray(ngModel.$modelValue));
            };
        }
    };
});
