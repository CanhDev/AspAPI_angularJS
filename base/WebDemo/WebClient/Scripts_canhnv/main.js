var app = angular.module("crudForm", []);
app.controller("crudCtrl", function ($scope, bangGia_Service, vatTu_service, VATFactory, CRUDServices) {

    $scope.errors = {};
    //parent
    $scope.bang_giaItem = {};
    $scope.bang_giaList_display = [];

    bangGia_Service.getData().then(function (data) {
        $scope.bang_giaList_display = angular.copy(data);
    });

    $scope.saleTypes = bangGia_Service.getSaleTypes();
    $scope.saleType_search = $scope.saleTypes[0].value;

    $scope.priceTypes = bangGia_Service.getPriceTypes();
    $scope.priceType_search = $scope.priceTypes[0].value;

    $scope.statuss = bangGia_Service.getStatuses();
    $scope.status_search = $scope.statuss[0].value;

    //get in UI
    $scope.getSaleType = function (item) {
        return $scope.saleTypes.find(function (s) { return s.value == item.saleType }).key;
    };

    $scope.getPriceType = function (item) {
        return $scope.priceTypes.find(function(p){return p.value == item.priceType}).key;
    };

    $scope.getStatus = function (item) {
        return $scope.statuss.find(function (s) { return s.value == item.status }).key;
    };
    //set default value for select
    $scope.bang_giaItem.saleType = $scope.saleTypes[1].value;
    $scope.bang_giaItem.priceType = $scope.priceTypes[1].value;
    $scope.bang_giaItem.status = $scope.statuss[1].value;

    var reset_parentForm = function () {
        $scope.bang_giaItem = {};
        $scope.bang_giaItem.saleType = $scope.saleTypes[1].value;
        $scope.bang_giaItem.priceType = $scope.priceTypes[1].value;
        $scope.bang_giaItem.status = $scope.statuss[1].value;
        $scope.vattu_list_display = [];
        vattu_list_selected = [];
        $scope.errors = {};
    }


    

    //event
    //1. search
    $scope.handleSearch = function (event, searchInput) {
        if (!event || (event.type === 'keypress' && event.keyCode === 13))
        {
            bangGia_Service.search({
                searchInput: $scope.searchInput,
                saleType: $scope.saleType_search,
                priceType: $scope.priceType_search,
                status: $scope.status_search
            }).then(function (data)
            {
                $scope.bang_giaList_display = angular.copy(data);
            });
        }
    };

    // 2. refresh
    $scope.refresh = function () {
        $scope.searchInput = '';
        $scope.saleType_search = $scope.saleTypes[0].value;
        $scope.priceType_search = $scope.priceTypes[0].value;
        $scope.status_search = $scope.statuss[0].value;
        bangGia_Service.getData().then(function (data)
        {
            $scope.bang_giaList_display = angular.copy(data);
        });
    };

    //3. delete
    $scope.handleDelete_bangGiaItem = function (item, mode) {
        //0. remove one, 1. remove many
        let confirm = window.confirm("Bạn có chắc chắn muốn xóa không?");
        if (!confirm) return;
        if (mode == 0) {
            bangGia_Service.delete(item.code, mode).then(function (data)
            {
                if (data.success)
                {
                    $scope.bang_giaList_display = $scope.bang_giaList_display.filter(function (item) { return item.code !== data.result });
                    setTimeout(function ()
                    {
                        alert("Xóa thành công");
                    }, 0)
                }
                else
                {
                    window.alert("Xóa thất bại: " + data.message);
                }
                
            });

        }
        else if (mode == 1) {
            delete_bangGiaItems();
        }
    };
    /*var delete_bangGiaItem_UI = function (code) {
        $scope.bang_giaList_display = $scope.bang_giaList_display.filter(function (item) { return item.code != code });
        bangGia_Service.deleteData(code);
        //vatTu_service.handleDelete_vt_cascade(code);
    };*/
    var delete_bangGiaItems = function () {
        if ($scope.selectedItems_banggia && Object.keys($scope.selectedItems_banggia).length > 0) {
            let codes = Object.keys($scope.selectedItems_banggia);
            bangGia_Service.delete(codes, 1).then(function (data)
            {
                if (data.success)
                {
                    bangGia_Service.getData().then(function (data)
                    {
                        $scope.bang_giaList_display = angular.copy(data);
                    });
                    window.alert("Xóa thành công");
                }
                else
                {
                    window.alert("Xóa thất bại" + data.message);
                }
            });
        }
    };
    //end-delete
    //4. edit
    $scope.isEdit_parent = false;
    let old_code = '';
    $scope.handleEdit = function (item_edit) { //xử lý fill data lên và check mở modal
        item_edit = item_edit || '';
        //parent-form
        if (($scope.selectedItems_banggia && Object.keys($scope.selectedItems_banggia).length == 1) || item_edit.code) {
            $scope.openModal('edit', 'parent');
            old_code = fillData_Banggia(item_edit);
        }
        else {
            alert("Vui lòng chọn 1 bản ghi để sửa");
            resetSelected_item_banggia();
            return;
        }
    };
    $scope.edit_banggia = function () { // edit event
        let new_item = angular.copy($scope.bang_giaItem);
        if (validate_parentForm(old_code)) {
            
            //api
            bangGia_Service.edit(new_item, old_code).then(function (data)
            {
                if (data && data.success)
                {
                    bangGia_Service.getData().then(function (data)
                    {
                        $scope.bang_giaList_display = angular.copy(data);
                    });
                    //
                    setTimeout(function ()
                    {
                        alert("Sửa thành công");
                        $scope.closeModal('parent');
                        reset_parentForm();
                    }, 0);
                }
                else
                {
                    alert("Lỗi khi sửa bảng giá: " + data.message);
                }
            });


            //handleSave_vt(old_code);
            
        };
    };

    var fillData_Banggia = function (item_edit) { // filldata

        
        if (item_edit) old_code = item_edit.code;
        else old_code = Object.keys($scope.selectedItems_banggia);
        //

        bangGia_Service.GetById(old_code).then(function (data)
        {
            if (data && data.success)
            {
                $scope.bang_giaItem = data.result;
            }
            else
            {
                $scope.bang_giaItem = null;
                console.error("Lỗi khi fill data: ", data.message);
            }
        });

        //fill data_vattu
        //$scope.vattu_list_display = angular.copy(vatTu_service.getData()).filter(function (item) { return item.PriceListCode == old_code });
        //vattu_list_selected = angular.copy(vatTu_service.getData()).filter(function (item) { return item.PriceListCode == old_code });
        return old_code;
    };

    //end-edit

    //5. add
    $scope.handleAdd = function (typeModal, mode) {
        if (typeModal == 'parent') {
            add_bangGiaItem(mode);
        }
    };

    var add_bangGiaItem = function (mode) {
        if (validate_parentForm()) {
            let item = angular.copy($scope.bang_giaItem);
            bangGia_Service.create(item).then(function (data)
            {
                if (data.success)
                {
                    $scope.bang_giaList_display.push(data.result);
                    //handleSave_vt();
                    window.alert("Thêm thành công");
                    reset_parentForm();
                    if (mode == 1) $scope.closeModal('parent');
                }
                else
                {
                    window.alert("Thêm thất bại: " + data.message);
                    console.error(data.message);
                }
            });
            
        }
    };
    //validate


    var validate_parentForm = function (excludeValue) {
        let valid = true;

        const fields_checkempty = ['code', 'name'];
        const fields_checkformat = ['code'];
        $scope.errors = {};

        fields_checkempty.forEach(function (field) {
            if (!$scope.validate_empty(field, $scope.bang_giaItem[field])) {
                valid = false;
            }
        });

        fields_checkformat.forEach(function (field) {
            if (!$scope.validate_format(field, $scope.bang_giaItem[field])) {
                valid = false;
            }
        });
        if (valid) {
            valid = bangGia_Service.validate_id($scope.bang_giaItem.code, excludeValue);
            if (!valid) $scope.errors['code'] = "Giá trị đã tồn tại, hãy nhập giá trị khác";
            else $scope.errors['code'] = "";
        }
        return valid;
    };


    $scope.validate_empty = function (field, value) {
        if (!value) {
            $scope.errors[field] = "Không được để trống";
            return false;
        }
        $scope.errors[field] = "";
        return true;
    };

    $scope.validate_format = function (field, value) {
        const regex = /^[A-Z0-9-_]+$/;
        if (!value) {
            $scope.errors[field] = "Không được để trống";
            return false;
        }
        if (!regex.test(value)) {
            $scope.errors[field] = "Chỉ được nhập chữ in hoa, số, gạch ngang (-), gạch dưới (_)";
            return false;
        }
        $scope.errors[field] = "";
        return true;
    };

    $scope.validate_date = function (field, value) {
        const dateRegex = /^(19|20)\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
        if (!value) {
            $scope.errors[field] = "Không được để trống";
            return false;
        }
        if (!dateRegex.test(value)) {
            $scope.errors[field] = "hãy nhập đúng định dạng(yyyy-MM-dd): 2024-01-01";
            return false;
        }
        $scope.errors[field] = "";
        return true;

    };


    //end-parent

    //child
    $scope.vattu_list_display = [];
    var vattu_list_selected = [];
    $scope.vattu_item = {};
    $scope.isEdit_child = false;

    $scope.ApplicationTypes = vatTu_service.getApplicationType();
    $scope.TaxCodes = vatTu_service.getTaxCode();

    $scope.vattu_item.ApplicationType = $scope.ApplicationTypes[0].value;
    $scope.vattu_item.TaxCode = $scope.TaxCodes[0].value;

    $scope.getApplicationType = function (type) {
        switch (type) {
            case 0: return "Tất cả";
            case 1: return "Khách hàng";
            case 2: return "Nhóm khách hàng"
            default: return "";
        }
    };

    $scope.getTaxCode = function (taxcode) {
        switch (taxcode) {
            case '00': return "Không áp dụng";
            case '10': return "Thuế 10%";
            case '20': return "Thuế 20%";
            case '30': return "Thuế 30%";
        }
    };
    var resetChildForm = function () {
        $scope.vattu_item = {};
        $scope.vattu_item.ApplicationType = $scope.ApplicationTypes[0].value;
        $scope.vattu_item.TaxCode = $scope.TaxCodes[0].value;
        $scope.errors = {};
    }
    var validate_childForm = function (old_item) {
        old_item = old_item || null;
        var valid = true;
        $scope.errors = {};
        var fields_checkempty = ['MaterialCode', 'MaterialName', 'CustomerCode', 'CustomerGroup',
            'StartDate', 'EndDate', 'StartTime', 'EndTime', 'MinQuantity', 'PriceBeforeVAT'];
        var fields_checkformat = ['MaterialCode', 'CustomerCode', 'CustomerGroup'];

        fields_checkformat.forEach(function (field) {
            if ($scope.isFieldVisible(field)) {
                if (!$scope.validate_format(field, $scope.vattu_item[field])) {
                    valid = false;
                }
            }
        });

        fields_checkempty.forEach(function (field) {
            if ($scope.isFieldVisible(field)) {
                if (!$scope.validate_empty(field, $scope.vattu_item[field])) {
                    valid = false;
                }
            }
        });

        if (valid) {
            valid = vatTu_service.validate_id($scope.vattu_item, old_item, $scope.vattu_list_display);
            if (!valid) alert("Giá trị đã tồn tại, hãy nhập giá trị khác");
        }
        return valid;
    };

    // add in displayList
    $scope.handleAdd_vt = function () {
        $scope.vattu_item.PriceListCode = $scope.bang_giaItem.code;
        $scope.openModal('add', 'child');
    };

    $scope.add_vt_Display = function (mode) {
        fixTypes_vt();
        if (validate_childForm()) {
            $scope.vattu_item.StartTime = $scope.vattu_item.StartTime ? $scope.vattu_item.StartTime : '00:00';
            $scope.vattu_item.EndTime = $scope.vattu_item.EndTime ? $scope.vattu_item.EndTime : '23:59';
            $scope.vattu_list_display.push(angular.copy($scope.vattu_item));
            if (mode == 1) $scope.closeModal('child');
        }
    };

    var handleSave_vt = function (old_PriceListCode) {
        $scope.vattu_list_display.forEach(function (item) {
            item.PriceListCode = $scope.bang_giaItem.code;
        });
        vatTu_service.syncData_v2(vattu_list_selected, $scope.vattu_list_display, old_PriceListCode);
    };

    $scope.isFieldVisible = function (fieldName) {
        switch (fieldName) {
            case 'MaterialCode':
                return true; // Always show MaterialCode field
            case 'CustomerCode':
                return $scope.vattu_item.ApplicationType != 2;
            case 'CustomerGroup':
                return $scope.vattu_item.ApplicationType != 1;
            case 'StartTime':
            case 'EndTime':
                return $scope.bang_giaItem.priceType == 3;
            default:
                return true; // Default behavior to show other fields
        }
    };

    // delete
    $scope.handleDelete_vt = function (item) {
        var confirm = window.confirm("Bạn có chắc chắn muốn xóa không?");
        if (!confirm) return;
        var index_displayList = vatTu_service.find(item, $scope.vattu_list_display);
        if (index_displayList != -1) {
            $scope.vattu_list_display.splice(index_displayList, 1);
        }
    };

    // edit
    var old_vattuItem = {};
    // filldata
    $scope.fillData_vt = function (item) {
        fixTypes_vt(item);
        $scope.vattu_item.PriceListCode = $scope.bang_giaItem.code;
        $scope.vattu_item = angular.copy(item);
        old_vattuItem = angular.copy(item);
    };

    $scope.Edit_vt = function () {
        fixTypes_vt();
        $scope.vattu_item.StartTime = $scope.vattu_item.StartTime ? $scope.vattu_item.StartTime : '00:00';
        $scope.vattu_item.EndTime = $scope.vattu_item.EndTime ? $scope.vattu_item.EndTime : '23:59';
        var new_item = angular.copy($scope.vattu_item);
        // Skip checking for duplicate if primary key changes
        if (validate_childForm(old_vattuItem)) {
            var index_displayList = vatTu_service.find(old_vattuItem, $scope.vattu_list_display);
            if (index_displayList != -1) {
                $scope.vattu_list_display[index_displayList] = angular.copy(new_item);
            }
            else {
                alert("Vật tư không tồn tại");
            }
            $scope.closeModal('child');
        }
    };

    // fix datatype
    var fixTypes_vt = function (item) {
        // Handle date for $scope.vattu_item
        if ($scope.vattu_item.StartDate) {
            $scope.vattu_item.StartDate = new Date($scope.vattu_item.StartDate);
            $scope.vattu_item.EndDate = new Date($scope.vattu_item.EndDate);
        }

        // Handle item passed in (if exists)
        if (item) {
            item.StartDate = new Date(item.StartDate);
            item.EndDate = new Date(item.EndDate);
        }

        return item;
    };

    // calculate VAT
    $scope.calVAT = function () {
        $scope.vattu_item.TaxRate = Number($scope.vattu_item.TaxCode);
        $scope.vattu_item.PriceAfterVAT =
            VATFactory.calculator_BeforeVAT($scope.vattu_item.PriceBeforeVAT, $scope.vattu_item.TaxRate);
    };

    // modal
    $scope.isModal_parent = false;
    $scope.isModal_child = false;

    $scope.openModal = function (action, typeModal) {
        if (typeModal == "parent") {
            $scope.isModal_parent = true;
            if (action == "add") {
                $scope.isEdit_parent = false;
            }
            else if (action == "edit") {
                $scope.isEdit_parent = true;
            }
        }
        else if (typeModal == "child") {
            $scope.isModal_child = true;
            if (action == "add") {
                $scope.isEdit_child = false;
            }
            else if (action == "edit") {
                $scope.isEdit_child = true;
            }
        }
    };

    $scope.closeModal = function (typeModal) {
        if (typeModal == 'parent') {
            $scope.isModal_parent = false;
            $scope.isEdit_parent = false;
            reset_parentForm();
            resetSelected_item_banggia();
        }
        else if (typeModal == 'child') {
            $scope.isModal_child = false;
            $scope.isEdit_child = false;
            resetChildForm();
        }
    };

    // UI handling: checkbox, filter
    // select row
    $scope.isAnySelectedRow_banggia = false;
    $scope.selectedItems_banggia = {};
    $scope.updateSelection_banggia = function ($event, item) {
        if ($event) $event.stopPropagation();
        $scope.isAnySelectedRow_banggia = Object.values($scope.selectedItems_banggia).some(function (selected) {
            return selected;
        });
    };

    $scope.selectAll_banggia = function (event) {
        var isSelected = event.target.checked;
        $scope.bang_giaList_display.forEach(function (item) {
            $scope.selectedItems_banggia[item.code] = isSelected;
        });
        $scope.updateSelection_banggia(event);
    };

    $scope.isAllSelected_banggia = function () {
        if ($scope.bang_giaList_display) {
            return $scope.bang_giaList_display.every(function (item) {
                return $scope.selectedItems_banggia[item.code];
            });
        }
        return false;
    };

    $scope.toggleSelection_banggia = function (item) {
        $scope.selectedItems_banggia[item.code] = !$scope.selectedItems_banggia[item.code];
        $scope.updateSelection_banggia();
        console.log($scope.selectedItems_banggia);
    };

    $scope.isSelected_banggia = function (item) {
        return $scope.selectedItems_banggia[item.code];
    };

    var resetSelected_item_banggia = function () {
        if ($scope.selectedItems_banggia && Object.keys($scope.selectedItems_banggia).length > 0) {
            $scope.selectedItems_banggia = {};
            $scope.isAnySelectedRow_banggia = false;
        }
    };

    $scope.filterVisible = false;
    $scope.toggleFilter = function () {
        $scope.filterVisible = !$scope.filterVisible;
        $scope.modeSearch = !$scope.modeSearch;
        console.log($scope.modeSearch);
    };

});

