//CRUDServices
app.service('CRUDServices',
    ['$http', function ($http) {
        /// post,put 
        this.postdata = function (_data, _url, _post_put, user_id0) {
            return $http({
                method: _post_put,
                url: _url,
                data: _data,
            });
        }

        ///get, delete
        this.getdata = function (_param, _url, _delete_get, user_id0) {
            return $http({
                method: _delete_get,
                url: _url,
                params: _param,
            });
        };
    }]);

//1 cách viết filter để không cần khai báo 2 array
app.filter('LoaiBanFilter', function () {
    return function (items) {
        var filtered = items.filter(function (item) {
            return item.ma_loai_ban != "";
        });
        return filtered;
    };
});

app.filter('LoaiBangGiaFilter', function () {
    return function (items) {
        var filtered = items.filter(function (item) {
            return item.ma_loai_bang_gia != "";
        });
        return filtered;
    };
});

app.filter('StatusFilter', function () {
    return function (items) {
        var filtered = items.filter(function (item) {
            return item.status != "";
        });
        return filtered;
    };
});

app.directive('numberInput', ['$filter', function ($filter) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            number: '=ngModel'
        },
        link: function (scope, el, attrs, ngModelCtrl) {
            var NUMBER_REGEXP = /^\s*[-+]?(\d+|\d*\.\d*)\s*$/,
                min = 0,
                max,
                lastValidValue,
                dotSuffix,
                positiveInteger = true,
                minNotEqual,
                maxNotEqual,
                maxLength = 32,
                decimals = 0,
                precision = 0;
            //var value = ngModelCtrl.$modelValue;
            if (attrs.maxLength >= 1) {
                maxLength = attrs.maxLength;
            }

            if (attrs.allowDecimal) {
                positiveInteger = false;
                precision = attrs.decimals;
                decimals = attrs.decimals;
                min = 0;
            }

            if (attrs.minNotEqual) {
                minNotEqual = true;
            }

            if (attrs.maxNotEqual) {
                maxNotEqual = true;
            }

            function round(value) {
                var num = parseFloat(value);
                var d = Math.pow(10, precision);
                return Math.round(num * d) / d;
            }


            function formatPrecision(value) {
                return parseFloat(value).toFixed(precision);
            }

            function getCommaCount(value) {
                var length = 0;
                var matchResult = (value + '').match(/,/g);
                if (matchResult) {
                    length = matchResult.length;
                }
                return length;
            }

            //Convert to String
            function formatViewValue(value) {
                return ngModelCtrl.$isEmpty(value) ? '' : '' + value;
            }

            function formatToNumber(value, decimals) {
                if (angular.isUndefined(decimals)) {
                    if (attrs.allowDecimal) {
                        decimals = attrs.decimals;
                    }
                }

                return $filter('number')(value, decimals);
            }

            function numberLength(value) {
                var length = 0;
                var matchResult = (value + '').match(/\d/g);
                if (matchResult) {
                    length = matchResult.length;
                }
                return length;
            }

            function minValidator(value) {
                var invalid = minNotEqual ? value <= min : value < min;
                if (!ngModelCtrl.$isEmpty(value) && invalid) {
                    ngModelCtrl.$setValidity('min', false);
                } else {
                    ngModelCtrl.$setValidity('min', true);
                }
                return value;
            }

            function maxValidator(value) {
                var invalid = maxNotEqual ? value >= max : value > max;
                if (!ngModelCtrl.$isEmpty(value) && invalid) {
                    ngModelCtrl.$setValidity('max', false);
                } else {
                    ngModelCtrl.$setValidity('max', true);

                }
                return value;
            }

            ngModelCtrl.$parsers.push(function (input) {
                //check undefined and NaN
                //http://adripofjavascript.com/blog/drips/the-problem-with-testing-for-nan-in-javascript.html
                if (angular.isUndefined(input) || (input !== input)) {
                    input = '';
                }

                var value = input.replace(/\,/g, '');
                var lastChar = value.substr(value.length - 1);
                if (!positiveInteger) {
                    dotSuffix = lastChar === '.' ? true : false;
                }

                // Handle leading decimal point, like ".5"
                if (value.indexOf('.') === 0) {
                    value = '0' + value;
                }

                var empty = ngModelCtrl.$isEmpty(value);
                if (empty || (NUMBER_REGEXP.test(value) && numberLength(value) <= maxLength)) {
                    lastValidValue = (value === '') ? null : (empty ? value : round(value));
                } else {
                    // Render the last valid input in the field
                    ngModelCtrl.$setViewValue(formatViewValue(lastValidValue));
                    ngModelCtrl.$render();
                }
                ngModelCtrl.$setValidity('numeric', !dotSuffix);
                return lastValidValue;
            });

            ngModelCtrl.$formatters.push(formatToNumber);

            // Min validation (optional)
            attrs.$observe('min', function (value) {
                min = parseFloat(value || min);
                minValidator(ngModelCtrl.$modelValue);
            });

            ngModelCtrl.$parsers.push(minValidator);
            ngModelCtrl.$formatters.push(minValidator);

            // Max validation (optional)
            if (angular.isDefined(attrs.max)) {
                attrs.$observe('max', function (val) {
                    max = parseFloat(val);
                    maxValidator(ngModelCtrl.$modelValue);
                });
                ngModelCtrl.$parsers.push(maxValidator);
                ngModelCtrl.$formatters.push(maxValidator);
            }

            ngModelCtrl.$formatters.push(function (value) {
                return value ? formatPrecision(value) : value;
            });

            //Formatting must be the last of $parser pipeline
            ngModelCtrl.$parsers.push(function (value) {
                //console.log(value);
                //This section is for decimal values if positiveInteger flag is false
                var viewValue = formatToNumber(value, decimals);

                if (!positiveInteger && dotSuffix) {
                    viewValue += '.';
                }
                //This logic is used to preserve cursor position after formatting
                var start = el[0].selectionStart,
                    end = el[0].selectionEnd,
                    oldViewValue = ngModelCtrl.$viewValue;

                if (getCommaCount(oldViewValue) > getCommaCount(viewValue)) {
                    start--;
                    end--;
                }
                if (getCommaCount(oldViewValue) < getCommaCount(viewValue)) {
                    start++;
                    end++;
                }
                //Do not use $setViewValue to set viewValue here, because it will trigger $parse pipeline.
                ngModelCtrl.$viewValue = viewValue;
                ngModelCtrl.$render();
                //console.log(start + "   " + end)

                el[0].setSelectionRange(start, end);
                return value;
            });

            scope.$watch('number', function (value) {
                if (!angular.isUndefined(value)) {
                    //console.log(formatToNumber(value, attrs.decimals));
                    formatToNumber(value, attrs.decimals);
                }
            });
        }
    };
}]);

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});

app.directive('uppercased', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (input) {
                return input ? input.toUpperCase() : "";
            });
            element.css("text-transform", "uppercase");
        }
    };
});

app.factory('CustomFactory', ['$timeout',
    function ($timeout) {
        return {
            ComputeVAT: function (gia0, thue_suat) {
                return parseFloat(gia0) + parseFloat(gia0) * parseFloat(thue_suat) / 100;
            },
            GetOID: function (arr) {
                var max = arr.reduce(function (prev, current) {
                    return (prev.oid > current.oid) ? prev : current;
                });

                return max.oid + 1;
            }
        }
    }]);
