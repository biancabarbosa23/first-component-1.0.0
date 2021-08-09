"use strict";

use(['/libs/sightly/js/3rd-party/q.js'], function (Q) {
    var childPropeties = Q.defer();
    granite.resource.resolve(granite.resource.path + '/' + this.multifieldName)
        .then(function (currentResource) {
            currentResource.getChildren()
                .then(function (child) {
                    childPropeties.resolve(child);
                });
        });


    return childPropeties.promise;
});