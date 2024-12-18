using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API.Models_canhnv
{
    public class fakeData
    {
        public static List<banggia> GetBangGiaList()
        {
            return new List<banggia>
            {
                new banggia
                {
                    code = "BG2020",
                    name = "Bảng giá chuẩn 2020",
                    saleType = 1,
                    priceType = 1,
                    status = 1,
                    vattuList = new List<vattu>()
                },
                new banggia
                {
                    code = "BG2022",
                    name = "Bảng giá ngày 2022",
                    saleType = 2,
                    priceType = 2,
                    status = 2,
                    vattuList = new List<vattu>()
                },
                new banggia
                {
                    code = "BG2023",
                    name = "Bảng giá giờ vàng 2023",
                    saleType = 2,
                    priceType = 3,
                    status = 2,
                    vattuList = new List<vattu>()
                }
            };
        }
    }
}