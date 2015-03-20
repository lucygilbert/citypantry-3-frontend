angular.module("cp").directive("cpFileInput", $q => {
    return {
        restrict: "A",
        require: "ngModel",
        link: (scope, element, attr, ngModel) => {
            element.on("change", e => {
                var readFile = file => {
                    return $q((resolve, reject) => {
                        var reader = new FileReader();

                        reader.onload = e => {
                            resolve(e.target.result);
                            element.val("");
                        };

                        reader.onerror = e => {
                            reject(e);
                            element.val("");
                        };

                        reader.readAsDataURL(file);
                    });
                },
                    toArray = object => Array.prototype.slice.call(object, 0),
                    files = toArray(e.target.files),
                    dataUriPromises = files.map(readFile);

                $q.all(dataUriPromises).then(dataUris => ngModel.$setViewValue(dataUris));
            });
        }
    };
});
