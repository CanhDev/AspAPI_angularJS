app.service("bangGia_Service",['CRUDServices', function (CRUDServices) {
    var data = [];
    var baseApi = '/API/api/FormAPI'


    //region-callapi
    // Lấy dữ liệu
    this.getData = function () {
        return CRUDServices.getdata('', baseApi + '/GetData', 'GET')
            .then(function (res) {
                if (res && res.data && res.data.result)
                {
                    console.log(res.data.result);
                    return res.data.result; // Trả về kết quả cuối cùng
                } else {
                    console.error("Dữ liệu không hợp lệ hoặc rỗng");
                    return [];
                }
            })
            .catch(function (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
                return [];
            });
    };

    //tìm kiếm

    this.search = function (options)
    {
        options = options || {};
        var params = {
            searchInput: options.searchInput || null,
            saleType: options.saleType || 0,
            priceType: options.priceType || 0,
            status: options.status || 0
        };
        return CRUDServices.getdata(params, baseApi + '/GetData', 'GET')
            .then(function (res)
            {
                if (res && res.data && res.data.result) {
                    return res.data.result; // Trả về kết quả cuối cùng
                } else {
                    console.error("Dữ liệu không hợp lệ hoặc rỗng");
                    return [];
                }
            })
            .catch(function (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
                return [];
            });
    };

    this.create = function (bangGiaItem)
    {
        return CRUDServices.postdata(bangGiaItem, baseApi + '/PostData', 'POST')
            .then(function (res)
            {
                if (res)
                {
                    return res.data;
                }
                else
                {
                    console.error(res.data.message);
                    return {};
                }
            })
              .catch(function (error)
              {
                  console.error("Lỗi khi thêm dữ liệu:", error);
                  return {};
              });
    };

    this.delete = function (idBangGia, mode) // 0. xóa 1, 1: xóa nhiều
    {
        if (mode === 0)
        {
            var params = {id : idBangGia}
            return CRUDServices.getdata(params, baseApi + '/DeleteData', 'DELETE')
                .then(function (res)
                {
                    if (res) return res.data;
                    else return null;
                })
                .catch(function (error)
                {
                    console.error("Lỗi khi xóa", error);
                    return null;
                });
        }
        else if(mode === 1)
        {
            return CRUDServices.deleteMultiple(idBangGia, baseApi + '/DeleteDatas')
                .then(function (res)
                {
                    if (res) return res.data;
                    else return null;
                })
                .catch(function (error)
                {
                    console.error("Lỗi khi xóa nhiều: ", error);
                    return null;
                });
        }
    };

    //getbyid
    this.GetById = function (idBangGia)
    {
        var params = { id: idBangGia };
        return CRUDServices.getdata(params, baseApi + '/GetById', 'GET')
            .then(function (res)
            {
                if (res)
                {
                    return res.data;
                }
                else return null;
            })
        .catch(function (error)
        {
            console.error("Lỗi khi getbyid: ", error);
            return null;
        });
    };


    this.edit = function (new_item, old_code)
    {
        return CRUDServices.postdata(new_item, baseApi + '/PutData/' + old_code, 'PUT')
                .then(function (res)
                {
                    if (res) return res.data;
                    else return null;
                })
                .catch(function (error)
                {
                    console.error("Lỗi khi sửa: ", error);
                    return null;
                });
    };


    //end-callapi

    this.find = function (vt, list) {
        var index = -1;
        for (var i = 0; i < list.length; i++) {
            if (list[i].code == vt.code) {
                index = i;
                break;
            }
        }
        return index;
    };

    // Thêm dữ liệu
    this.addData = function (newItem) {
        data.push(newItem);
        this.syncData();
    };

    // Cập nhật dữ liệu
    this.updateData = function (code, updatedItem) {
        var index = -1;
        for (var i = 0; i < data.length; i++) {
            if (data[i].code === code) {
                index = i;
                break;
            }
        }
        if (index !== -1) {
            data[index] = updatedItem;
            this.syncData();
        } else {
            throw new Error("Không tìm thấy bảng giá với mã: " + code);
        }
    };

    // Xóa dữ liệu
    this.deleteData = function (code) {
        data = data.filter(function (item) {
            return item.code !== code;
        });
        this.syncData();
    };

    // Đồng bộ dữ liệu
    this.syncData = function () {
        localStorage.setItem("bang_giaList_root", JSON.stringify(data));
    };

    // Lấy các loại bán hàng
    this.getSaleTypes = function () {
        return [
            { value: 0, key: "Tất cả" },
            { value: 1, key: "Bán buôn" },
            { value: 2, key: "Bán lẻ" },
        ];
    };

    // Lấy các loại bảng giá
    this.getPriceTypes = function () {
        return [
            { value: 0, key: "Tất cả" },
            { value: 1, key: "Bảng giá chuẩn" },
            { value: 2, key: "Bảng giá ngày" },
            { value: 3, key: "Bảng giá giờ vàng" },
        ];
    };

    // Lấy trạng thái
    this.getStatuses = function () {
        return [
            { value: 0, key: "Tất cả" },
            { value: 1, key: "Sử dụng" },
            { value: 2, key: "Không sử dụng" },
        ];
    };

    // Kiểm tra mã trùng
    this.validate_id = function (id, excludeId) {
        var isValid = true;
        for (var i = 0; i < data.length; i++) {
            if (data[i].code === id && id !== excludeId) {
                isValid = false;
                break;
            }
        }
        return isValid;
    };

}]);
