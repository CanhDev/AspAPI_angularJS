app.service("vatTu_service", function () {
    var data = JSON.parse(localStorage.getItem('vattu_list_root')) || [];

    // Lấy dữ liệu
    this.getData = function () {
        data.forEach(function (item) {
            if (item.StartDate) {
                item.StartDate = new Date(item.StartDate);
            }
            if (item.EndDate) {
                item.EndDate = new Date(item.EndDate);
            }
            if (item.StartTime) {
                item.StartTime = new Date(item.StartTime);
            }
            if (item.EndTime) {
                item.EndTime = new Date(item.EndTime);
            }
        });
        return data;
    };

    this.handleDelete_vt_cascade = function (bangGia_id) {
        data = data.filter(function (item) {
            return item.PriceListCode !== bangGia_id;
        });
        localStorage.setItem('vattu_list_root', JSON.stringify(data));
    };

    // Validate unique identifier
    this.validate_id = function (item, old_item, dataList) {
        old_item = old_item || null;
        var PriceListCode = item.PriceListCode,
            MaterialCode = item.MaterialCode,
            ApplicationType = item.ApplicationType,
            CustomerCode = item.CustomerCode,
            CustomerGroup = item.CustomerGroup,
            StartDate = item.StartDate,
            EndDate = item.EndDate,
            StartTime = item.StartTime,
            EndTime = item.EndTime,
            MinQuantity = item.MinQuantity;

        return !dataList.some(function (existingItem) {
            // Skip comparison with the old item during edit
            if (old_item &&
                existingItem.PriceListCode === old_item.PriceListCode &&
                existingItem.MaterialCode === old_item.MaterialCode &&
                existingItem.ApplicationType === old_item.ApplicationType &&
                existingItem.CustomerCode === old_item.CustomerCode &&
                existingItem.CustomerGroup === old_item.CustomerGroup &&
                existingItem.StartDate === old_item.StartDate &&
                existingItem.EndDate === old_item.EndDate &&
                existingItem.StartTime === old_item.StartTime &&
                existingItem.EndTime === old_item.EndTime &&
                existingItem.MinQuantity === old_item.MinQuantity) {
                return false;
            }

            // Check for duplicate entries
            return (
                existingItem.PriceListCode === PriceListCode &&
                existingItem.MaterialCode === MaterialCode &&
                existingItem.ApplicationType === ApplicationType &&
                existingItem.CustomerCode === CustomerCode &&
                existingItem.CustomerGroup === CustomerGroup &&
                existingItem.StartDate === StartDate &&
                existingItem.EndDate === EndDate &&
                existingItem.StartTime === StartTime &&
                existingItem.EndTime === EndTime &&
                existingItem.MinQuantity === MinQuantity
            );
        });
    };

    this.find = function (vt_item, list) {
        var PriceListCode = vt_item.PriceListCode,
            MaterialCode = vt_item.MaterialCode,
            ApplicationType = vt_item.ApplicationType,
            CustomerCode = vt_item.CustomerCode,
            CustomerGroup = vt_item.CustomerGroup,
            StartDate = vt_item.StartDate,
            EndDate = vt_item.EndDate,
            StartTime = vt_item.StartTime,
            EndTime = vt_item.EndTime,
            MinQuantity = vt_item.MinQuantity;

        return list.findIndex(function (item) {
            // So sánh các trường không phải ngày và giờ
            var baseComparison =
                item.PriceListCode === PriceListCode &&
                item.MaterialCode === MaterialCode &&
                item.ApplicationType === ApplicationType &&
                item.CustomerCode === CustomerCode &&
                item.CustomerGroup === CustomerGroup &&
                item.MinQuantity === MinQuantity;

            // So sánh ngày
            var dateComparison =
                (!StartDate && !item.StartDate) ||
                (StartDate && item.StartDate &&
                 new Date(StartDate).getTime() === new Date(item.StartDate).getTime()) &&
                (!EndDate && !item.EndDate) ||
                (EndDate && item.EndDate &&
                 new Date(EndDate).getTime() === new Date(item.EndDate).getTime());

            // Kết hợp tất cả các so sánh
            return baseComparison && dateComparison;
        });
    };

    // Sync data
    this.syncData_v2 = function (vattu_list_selected, vattu_list_display, old_PriceListCode) {
        if (vattu_list_selected && Array.isArray(vattu_list_selected)) {
            // Remove items with old PriceListCode
            data = data.filter(function (item) {
                return !vattu_list_selected.some(function (v) {
                    return v.PriceListCode === item.PriceListCode;
                });
            });

            // Add new items
            data = data.concat(vattu_list_display || []);

            // Save to localStorage
            this.saveData(data);
        }
    };

    this.saveData = function (data) {
        // Trước khi lưu vào localStorage, chuyển các đối tượng Date thành chuỗi ISO
        data.forEach(function (item) {
            if (item.StartDate instanceof Date) {
                item.StartDate = item.StartDate.toISOString();
            }
            if (item.EndDate instanceof Date) {
                item.EndDate = item.EndDate.toISOString();
            }
            if (item.StartTime instanceof Date) {
                item.StartTime = item.StartTime.toISOString();
            }
            if (item.EndTime instanceof Date) {
                item.EndTime = item.EndTime.toISOString();
            }
        });

        // Lưu dữ liệu vào localStorage
        localStorage.setItem('vattu_list_root', JSON.stringify(data));
    };

    // Get application types
    this.getApplicationType = function () {
        return [
            { value: 0, key: "Tất cả" },
            { value: 1, key: "Khách hàng" },
            { value: 2, key: "Nhóm khách hàng" },
        ];
    };

    // Get tax codes
    this.getTaxCode = function () {
        return [
            { value: '00', key: "Không áp dụng" },
            { value: '10', key: "Thuế 10%" },
            { value: '20', key: "Thuế 20%" },
            { value: '30', key: "Thuế 30%" },
        ];
    };
});
