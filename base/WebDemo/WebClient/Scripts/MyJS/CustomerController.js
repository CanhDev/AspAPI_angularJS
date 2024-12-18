//Bên gửi
app.controller('CustomerController', ['$rootScope', '$scope', '$filter', 'CustomFactory', 'CRUDServices',
    function ($rootScope, $scope, $filter, CustomFactory, CRUDServices) {
        //#region khai báo
        $scope.ds_loaiban = [
            { ma_loai_ban: '', ten_loai_ban: 'Tất cả' },
            { ma_loai_ban: '1', ten_loai_ban: 'Bán buôn' },
            { ma_loai_ban: '2', ten_loai_ban: 'Bán lẻ' }
        ];

        $scope.ds_loaibanggia = [
            { ma_loai_bang_gia: '', ten_loai_bang_gia: 'Tất cả' },
           { ma_loai_bang_gia: '1', ten_loai_bang_gia: 'Bảng giá chuẩn' },
           { ma_loai_bang_gia: '2', ten_loai_bang_gia: 'Bảng giá ngày' },
           { ma_loai_bang_gia: '3', ten_loai_bang_gia: 'Bảng giá giờ vàng' },
        ];

        $scope.ds_thue = [
          { ma_thue: '00', ten_thue: 'Không áp dụng thuế', thue_suat: 0 },
          { ma_thue: '10', ten_thue: 'Thuế GTGT 10%', thue_suat: 10 },
          { ma_thue: '20', ten_thue: 'Thuế GTGT 20%', thue_suat: 20 },
          { ma_thue: '30', ten_thue: 'Thuế GTGT 30%', thue_suat: 20 },
          { ma_thue: '50', ten_thue: 'Thuế GTGT 50%', thue_suat: 50 },
        ];

        $scope.ds_loaiad = [
             { ma_loai_ad: '0', ten_loai_ad: 'Tất cả' },
          { ma_loai_ad: '1', ten_loai_ad: 'Khách hàng' },
          { ma_loai_ad: '2', ten_loai_ad: 'Nhóm khách hàng' },
        ];

        $scope.ds_status = [
            { status: '', statusname: 'Tất cả' },
            { status: '1', statusname: 'Sử dụng' },
           { status: '0', statusname: 'Không sử dụng' }
        ];

        $scope.seachDynamic = {
            keyword: '',
            loaiban: $scope.ds_loaiban[0],
            loaibanggia: $scope.ds_loaibanggia[0],
            trangthai: $scope.ds_status[0]
        };

        $scope.ds_banggia = [
            {
                oid: 1,
                ma_bang_gia: 'BB2021',
                ten_bang_gia: 'Bảng giá chuẩn 2021',
                ma_loai_ban: '1',
                ten_loai_ban: 'Bán buôn',
                ma_loai_bang_gia: '1',
                ten_loai_bang_gia: 'Bảng giá chuẩn',
                status: 1,
                statusname: 'Sử dụng',
                ds_vattu: [
                    {
                        oid: 1,
                        ma_vt: 'CT01',
                        ten_vt: 'Chuyên cần',
                        ma_loai_ad: '1',
                        ten_loai_ad: 'Khách hàng',
                        nh_kh: '',
                        ma_kh: '',
                        tu_ngay: '2021-10-01',
                        den_ngay: '2022-10-01',
                        sl_min: 1,
                        gia0: 10000,
                        ma_thue: '00',
                        thue_suat: 0,
                        gia: 10000
                    }
                ]
            },
            {
                oid: 2,
                ma_bang_gia: 'BL2021',
                ten_bang_gia: 'Bảng giá bán lẻ 2021',
                ma_loai_ban: '2',
                ten_loai_ban: 'Bán lẻ',
                ma_loai_bang_gia: '1',
                ten_loai_bang_gia: 'Bảng giá chuẩn',
                status: 1,
                statusname: 'Sử dụng',
                ds_vattu: [
                    {
                        oid: 1,
                        ma_vt: 'CT01',
                        ten_vt: 'Chuyên cần',
                        ma_loai_ad: '1',
                        ten_loai_ad: 'Khách hàng',
                        nh_kh: '',
                        ma_kh: '',
                        tu_ngay: '2021-10-01',
                        den_ngay: '2022-10-01',
                        sl_min: 1,
                        gia0: 10000,
                        ma_thue: '00',
                        thue_suat: 0,
                        gia: 10000
                    }
                ]
            },
            {
                oid: 3,
                ma_bang_gia: 'GV2021',
                ten_bang_gia: 'Bảng giá giờ vàng 2021',
                ma_loai_ban: '1',
                ten_loai_ban: 'Bán buôn',
                ma_loai_bang_gia: '3',
                ten_loai_bang_gia: 'Bảng giá giờ vàng',
                status: 1,
                statusname: 'Sử dụng',
                ds_vattu: [
                    {
                        oid: 1,
                        ma_vt: 'CT01',
                        ten_vt: 'Chuyên cần',
                        ma_loai_ad: '1',
                        ten_loai_ad: 'Khách hàng',
                        nh_kh: '',
                        ma_kh: 'KH0001',
                        tu_ngay: '2021-10-01',
                        den_ngay: '2022-10-01',
                        tu_gio: '06:00:00',
                        den_gio: '23:00:00',
                        sl_min: 1,
                        gia0: 10000,
                        ma_thue: '00',
                        thue_suat: 0,
                        gia: 10000
                    }
                ]
            }
        ];
        var ct_temp;

        var ds_banggia_init = angular.copy($scope.ds_banggia);

        var ds_banggia_temp = angular.copy($scope.ds_banggia);
        //#endregion 


        //#region  tìm kiếm
        $scope.Search = function (search_params) {
            Search(search_params);
        }

        function Search(search_params) {
            var ds_tknhanh = $filter('filter')(ds_banggia_temp,
                {
                    ma_loai_ban: search_params.loaiban.ma_loai_ban,
                    ma_loai_bang_gia: search_params.loaibanggia.ma_loai_bang_gia,
                    status: search_params.trangthai.status,
                    $: search_params.keyword
                });
            $scope.ds_banggia = ds_tknhanh;
        }

        $scope.Reload = function () {
            $scope.ds_banggia = ds_banggia_init;
        }

        $scope.OnClick = function (item, index) {
            item.checked = !item.checked;
        }
        //#endregion 


        //#region FORM mmodal
        $scope.Add = function () {
            $scope.add_yn = true;
            //gán thông tin mặc định
            InitData();

            //show modal
            $("#addItemModal").modal('show');
            //focus vào trường đầu tiên
            setTimeout(function () {
                angular.element('#addItemModal input').first().focus();
            }, 200);
        }

        $scope.Edit = function (ctdm) {
            //trường hợp click btn Sửa trên dòng
            if (ctdm != null) {
                EditModal(ctdm);

            } else {
                //kiểm tra xem đã có dòng nào đc chọn chưa
                var selecteds = $scope.ds_banggia.filter(function (item)
                { return item.checked });
                if (selecteds.length === 0) {
                    alert("Chưa có dòng nào đc chọn");
                }
                else if (selecteds.length === 1) {
                    EditModal(selecteds[0]);
                }
                else {
                    alert("Chỉ được sửa 1 dòng");
                }
            }
        }

        function EditModal(ctdm) {
            $scope.add_yn = false;
            var nv = angular.copy(ctdm);
            //format lại kiểu date
            nv.ngay_dg = new Date(nv.ngay_dg);
            nv.tu_ngay = new Date(nv.tu_ngay);
            nv.den_ngay = new Date(nv.den_ngay);
            //gán lại loại bán
            for (var i = 0; i < $scope.ds_loaiban.length; i++) {
                if ($scope.ds_loaiban[i].ma_loai_ban == nv.ma_loai_ban) {
                    nv.loaiban = $scope.ds_loaiban[i];
                    break;
                }
            }
            //gán lại bảng giá
            for (var i = 0; i < $scope.ds_loaibanggia.length; i++) {
                if ($scope.ds_loaibanggia[i].ma_loai_bang_gia == nv.ma_loai_bang_gia) {
                    nv.loaibanggia = $scope.ds_loaibanggia[i];
                    break;
                }
            }
            //gán lại trạng thái
            for (var i = 0; i < $scope.ds_status.length; i++) {
                if ($scope.ds_status[i].status == nv.status) {
                    nv.trangthai = $scope.ds_status[i];
                    break;
                }
            }
            $scope.ctdm = nv;
            //copy 
            ct_temp = angular.copy($scope.ctdm);

            $("#addItemModal").modal('show');
            setTimeout(function () {
                angular.element('#addItemModal input').first().focus();
            }, 200);

        }

        $scope.Delete = function (index) {
            if (index > -1) {
                var r = confirm("Bạn có chắc chắn muốn xóa");
                if (r == true) {
                    $scope.ds_banggia.splice(index, 1);
                    ds_banggia_temp = angular.copy($scope.ds_banggia);
                }
            } else {
                var selecteds = $scope.ds_banggia.filter(function (item)
                { return item.checked });
                if (selecteds.length === 0) {
                    alert("Chưa có dòng nào đc chọn");
                }
                else {
                    var r = confirm("Bạn có chắc chắn muốn xóa");
                    if (r == true) {
                        //lấy ra ds các dòng k đc chọn
                        var notSelected = $scope.ds_banggia.filter(function (item) {
                            return !item.checked;
                        });
                        //dữ liệu còn lại là các dòng k đc chọn
                        $scope.ds_banggia = notSelected;
                        ds_banggia_temp = angular.copy($scope.ds_banggia);

                    }
                }
            }
        }

        $scope.Save = function (item, add_more) {
            if ($scope.adduserform.$valid) {
                if (item.ds_vattu.length == 0) {
                    alert("Chưa nhập chi tiết");
                } else {
                    item.ma_loai_ban = item.loaiban.ma_loai_ban;
                    item.ten_loai_ban = item.loaiban.ten_loai_ban;
                    item.ma_loai_bang_gia = item.loaibanggia.ma_loai_bang_gia;
                    item.ten_loai_bang_gia = item.loaibanggia.ten_loai_bang_gia;
                    item.status = item.trangthai.status;
                    item.statusname = item.trangthai.statusname;

                    var check_dup = false;
                    if ($scope.add_yn) {
                        for (var i = 0; i < $scope.ds_banggia.length; i++) {
                            if ($scope.ds_banggia[i].ma_bang_gia === item.ma_bang_gia) {
                                check_dup = true;
                                break;
                            }
                        }
                        if (!check_dup) {
                            $scope.ds_banggia.push(item);
                        } else {
                            $scope.submitted = true;
                            alert("Dữ liệu đã tồn tại trong hệ thống");
                            return false;
                        }

                    } else {
                        var index_edit;
                        //check trùng mã bảng giá khi sửa
                        for (var i = 0; i < $scope.ds_banggia.length; i++) {
                            //kiểm tra cùng mã bg, nếu khác oid => trùng
                            if ($scope.ds_banggia[i].ma_bang_gia === item.ma_bang_gia
                                && $scope.ds_banggia[i].oid != item.oid) {
                                check_dup = true;
                                break;
                            } else if ($scope.ds_banggia[i].oid == item.oid) {
                                index_edit = i;
                            }
                        }
                        if (!check_dup) {
                            $scope.ds_banggia[index_edit] = item;
                        } else {
                            $scope.submitted = true;
                            alert("Dữ liệu đã tồn tại trong hệ thống");
                            return false;
                        }
                    }
                    $scope.submitted = false;
                    // gán lại mảng temp để sử dụng khi tìm kiếm
                    ds_banggia_temp = angular.copy($scope.ds_banggia);
                    //Nhấn lưu và thêm => reset data
                    if (add_more) {
                        InitData();
                    } else {
                        $("#addItemModal").modal('hide');
                    }

                }

            }
            else {
                $scope.submitted = true;
                angular.element('#addItemModal input.ng-invalid').first().focus();
            }
        }

        $scope.Close = function (id) {
            InitData();

            //gán lại dữ liệu cũ trong trường hợp sửa
            if (ct_temp != null) {
                for (var i = 0; i < $scope.ds_banggia.length; i++) {
                    if ($scope.ds_banggia[i].ma_bang_gia === ct_temp.ma_bang_gia) {
                        $scope.ds_banggia[i] = ct_temp;
                        break;
                    }
                }
            }
            //gán lại ct_temp
            ct_temp = null;
        }

        function InitData() {
            $scope.ctdm = {
                oid: CustomFactory.GetOID($scope.ds_banggia),
                ma_bang_gia: '',
                ten_bang_gia: '',
                loaiban: $scope.ds_loaiban[1],
                loaibanggia: $scope.ds_loaibanggia[1],
                trangthai: $scope.ds_status[1],
                ds_vattu: []
            };
            $scope.submitted = false;
        }

        $scope.ChangeCombobox = function (type, object) {
            switch (type) {
                case 'loaiban': {
                    $scope.ctdm.tu_ngay = new Date(object.tu_ngay);
                    $scope.ctdm.den_ngay = new Date(object.den_ngay);
                    break;
                }
                case 'thue': {
                    $scope.ctdmct.thue_suat = object.thue_suat;

                    TinhGiaSauVAT();
                    break;
                }
            }
        }

        //#endregion

        //#region FORM chi tiết vật tư
        var ctdmct_temp = null;
        $scope.AddCT = function () {
            $scope.addct_yn = true;
            //gán thông tin mặc định
            InitDataCT();

            //show modal
            $("#addItemCT").modal('show');

            setTimeout(function () {
                angular.element('#addItemCT input').first().focus();
            }, 200);
        }

        $scope.EditCT = function (ct) {
            //trường hợp click btn Sửa trên dòng
            if (ct != null) {
                $scope.addct_yn = false;
                $scope.ctdmct = angular.copy(ct);

                //format lại kiểu date/time
                $scope.ctdmct.tu_ngay = new Date($scope.ctdmct.tu_ngay);
                $scope.ctdmct.den_ngay = new Date($scope.ctdmct.den_ngay);
                if ($scope.ctdm.ma_loai_bang_gia == "3") {
                    $scope.ctdmct.tu_gio = GetDateFromHours($scope.ctdmct.tu_gio);
                    $scope.ctdmct.den_gio = GetDateFromHours($scope.ctdmct.den_gio);
                }
                //gán lại loại áp dụng
                for (var i = 0; i < $scope.ds_loaiad.length; i++) {
                    if ($scope.ds_loaiad[i].ma_loai_ad == $scope.ctdmct.ma_loai_ad) {
                        $scope.ctdmct.loai_ad = $scope.ds_loaiad[i];
                        break;
                    }
                }
                //gán lại thuế
                for (var i = 0; i < $scope.ds_thue.length; i++) {
                    if ($scope.ds_thue[i].ma_thue == $scope.ctdmct.ma_thue) {
                        $scope.ctdmct.thue = $scope.ds_thue[i];
                        break;
                    }
                }
                //lưu ra đây tránh trường hợp sửa rồi nhưng k lưu sẽ bị mất giá trị cũ
                ctdmct_temp = angular.copy($scope.ctdmct);
                $("#addItemCT").modal('show');
                setTimeout(function () {
                    angular.element('#addItemCT input').first().focus();
                }, 200);
            }
        }

        $scope.DeleteCT = function (index) {
            if (index > -1) {
                $scope.ctdm.ds_vattu.splice(index, 1);
            }
        }

        $scope.SaveCT = function (item, copy_yn) {
            if ($scope.CTform.$valid) {
                //gán lại các trường combobox
                item.ma_loai_ad = item.loai_ad.ma_loai_ad;
                item.ten_loai_ad = item.loai_ad.ten_loai_ad;
                item.ma_thue = item.thue.ma_thue;
                item.ten_thue = item.thue.ten_thue;
                //set lại mã khách/mã nhóm.. AD theo khách => nhóm = ""
                if (item.ma_loai_ad == "1") {
                    item.nh_kh = "";
                } else {
                    item.ma_kh = "";
                }

                var check_dup = false;
                if ($scope.addct_yn) {
                    for (var i = 0; i < $scope.ctdm.ds_vattu.length; i++) {
                        if ($scope.ctdm.ds_vattu[i].ma_vt === item.ma_vt
                            && $scope.ctdm.ds_vattu[i].ma_loai_ad === item.ma_loai_ad
                            && $scope.ctdm.ds_vattu[i].ma_kh === item.ma_kh
                            && $scope.ctdm.ds_vattu[i].nh_kh === item.nh_kh
                            && FormatDateToE($scope.ctdm.ds_vattu[i].tu_ngay) == FormatDateToE(item.tu_ngay)
                            && FormatDateToE($scope.ctdm.ds_vattu[i].den_ngay) == FormatDateToE(item.den_ngay)
                            && $scope.ctdm.ds_vattu[i].sl_min == item.sl_min) {
                            check_dup = true;
                            break;
                        }
                    }
                    //set lại trường giờ:
                    if ($scope.ctdm.ma_loai_bang_gia == "3") {
                        item.tu_gio = new Date(item.tu_gio).getHours() + ":" + new Date(item.tu_gio).getMinutes() + ":" + new Date(item.tu_gio).getMilliseconds();
                        item.den_gio = new Date(item.den_gio).getHours() + ":" + new Date(item.den_gio).getMinutes() + ":" + new Date(item.den_gio).getMilliseconds();
                    }
                    if (!check_dup) {
                        $scope.ctdm.ds_vattu.push(angular.copy(item));
                    } else {
                        $scope.submitted = true;
                        alert("Dữ liệu đã tồn tại trong hệ thống");
                        return false;
                    }

                } else {
                    var index_edit;
                    //check trùng mã bảng giá khi sửa
                    for (var i = 0; i < $scope.ctdm.ds_vattu.length; i++) {
                        //kiểm tra khác oid, nếu trùng các trường khóa => trùng
                        if ($scope.ctdm.ds_vattu[i].ma_vt === item.ma_vt
                                && $scope.ctdm.ds_vattu[i].ma_loai_ad === item.ma_loai_ad
                                && $scope.ctdm.ds_vattu[i].ma_kh === item.ma_kh
                                && $scope.ctdm.ds_vattu[i].nh_kh === item.nh_kh
                                && FormatDateToE($scope.ctdm.ds_vattu[i].tu_ngay) == FormatDateToE(item.tu_ngay)
                                && FormatDateToE($scope.ctdm.ds_vattu[i].den_ngay) == FormatDateToE(item.den_ngay)
                                && $scope.ctdm.ds_vattu[i].sl_min == item.sl_min
                                && $scope.ctdm.ds_vattu[i].oid != item.oid) {
                            check_dup = true;
                            break;
                        } else if ($scope.ctdm.ds_vattu[i].oid == item.oid) {
                            index_edit = i;
                        }
                    }
                    //set lại trường giờ:
                    if ($scope.ctdm.ma_loai_bang_gia == "3") {
                        item.tu_gio = new Date(item.tu_gio).getHours() + ":" + new Date(item.tu_gio).getMinutes() + ":" + new Date(item.tu_gio).getMilliseconds();
                        item.den_gio = new Date(item.den_gio).getHours() + ":" + new Date(item.den_gio).getMinutes() + ":" + new Date(item.den_gio).getMilliseconds();
                    }

                    if (!check_dup) {
                        $scope.ctdm.ds_vattu[index_edit] = angular.copy(item);
                    } else {
                        $scope.submitted = true;
                        alert("Dữ liệu đã tồn tại trong hệ thống");
                        angular.element('#addItemCT input').first().focus();
                        return false;
                    }
                }

                $scope.submittedCT = false;
                //Nhấn lưu và copy => reset data
                if (copy_yn) {
                    InitDataCT(copy_yn);
                    angular.element('#addItemCT input').first().focus();
                } else {
                    $("#addItemCT").modal('hide');
                }
            }
            else {
                $scope.submittedCT = true;
                angular.element('#addItemCT input.ng-invalid').first().focus();
            }
        }

        $scope.CloseCT = function (id) {
            InitDataCT();
            //gán lại dữ liệu cũ
            if (ctdmct_temp != null) {
                for (var i = 0; i < $scope.ctdm.ds_vattu.length; i++) {
                    if ($scope.ctdm.ds_vattu[i].ma_chi_tieu === ctdmct_temp.ma_chi_tieu) {
                        $scope.ctdm.ds_vattu[i] = ctdmct_temp;
                        break;
                    }
                }
            }
            ctdmct_temp = null;
        }

        function InitDataCT(copy_yn) {
            if (!copy_yn) {
                $scope.ctdmct = {
                    oid: $scope.ctdm.ds_vattu.length > 0 ? CustomFactory.GetOID($scope.ctdm.ds_vattu) : 1,
                    ma_bang_gia: $scope.ctdm.ma_bang_gia,
                    ma_vt: '',
                    ten_vt: '',
                    loai_ad: $scope.ds_loaiad[0],
                    nh_kh: '',
                    ma_kh: '',
                    tu_ngay: new Date(),
                    den_ngay: new Date(),
                    tu_gio: new Date(2021, 0, 1, 0, 1, 0),
                    den_gio: new Date(2021, 0, 1, 23, 59, 0),
                    sl_min: 1,
                    gia0: 0,
                    thue: $scope.ds_thue[0],
                    thue_suat: 0,
                    gia: 0
                }
            } else {
                $scope.ctdmct.oid = $scope.ctdm.ds_vattu.length > 0 ? CustomFactory.GetOID($scope.ctdm.ds_vattu) : 1
            }
            $scope.submittedCT = false;
        }

        $scope.TinhGiaSauVAT = function () {
            TinhGiaSauVAT();
        }

        function TinhGiaSauVAT() {
            $scope.ctdmct.gia = CustomFactory.ComputeVAT($scope.ctdmct.gia0, $scope.ctdmct.thue_suat);
        }
        //#endregion

        //#region REFERENCES
        function GetDateFromHours(time) {
            time = time.split(':');
            let now = new Date();
            return new Date(now.getFullYear(), now.getMonth(), now.getDate(), time[0], time[1], time[2]);
        }

        function FormatDateToE(date, separator, type) {
            var n_date = new Date(date);
            var day = n_date.getDate() < 10 ? '0' + n_date.getDate() : n_date.getDate();
            var month = (n_date.getMonth() + 1) < 10 ? '0' + (n_date.getMonth() + 1) : (n_date.getMonth() + 1);
            var year = n_date.getFullYear();
            separator = separator ? separator : '-';
            if (angular.isUndefined(type) || type == 'E')
                return year + separator + month + separator + day;
            else return day + separator + month + separator + year;
        }
        //#endregion 

        var datatest = [];
        //#region Gọi API
        $scope.GetData = function () {
                var res = CRUDServices.getdata('', '/API/api/CustomerAPI/GetData/', 'GET');
                res.then(function (value) {
                    console.log(value.data);
                    alert(value.data.Message);
                    datatest = value.data.Result;
                });

                console.log(datatest);
        }
        $scope.DeleteData = function () {
            var res = CRUDServices.getdata({ma_nv: 1}, '/API/api/CustomerAPI/Delete/', 'DELETE');
            res.then(function (value) {
                console.log(value.data);
                alert(value.data.Message);
            })
        }

        $scope.PostData = function () {
            var res = CRUDServices.postdata({ma_nv: 1, ten_nv: "NGuyễn Văn A"}, '/API/api/CustomerAPI/PostData/', 'POST');
            res.then(function (value) {
                console.log(value.data);
                alert(value.data.Message);
            })
        }

        $scope.PutData = function () {
            var res = CRUDServices.postdata({ ma_nv: 1, ten_nv: "NGuyễn Văn A" }, '/API/api/CustomerAPI/PutData/', 'PUT');
            res.then(function (value) {
                console.log(value.data);
                alert(value.data.Message);
            })
        }
        //#endregion

    }]);


