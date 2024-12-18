app.service('CRUDServices',
    ['$http', function ($http) {
        /// post,put 
        this.postdata = function (_data, _url, _post_put, user_id0) {
            return $http({
                method: _post_put,
                url: _url,
                data: _data,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        ///get, delete
        this.getdata = function (_param, _url, _delete_get, user_id0) {
            return $http({
                method: _delete_get,
                url: _url,
                params: _param,
                headers: { 'Content-Type': 'application/json' }
            });
        };
        //delete multiple
        this.deleteMultiple = function (_data, _url)
        {
            return $http({
                method: 'DELETE',
                url: _url,
                data: _data, //ids,
                headers: { 'Content-Type': 'application/json' }
            });
        };
    }]);