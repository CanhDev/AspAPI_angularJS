using API.Models;
using Dapper;
using Npgsql;
using System;
using System.Collections.Generic;
using System.Data;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Linq;

namespace API.Controllers
{
    public class CustomerAPIController : ApiController
    {

        //public const List<nhanvien> list = new List<nhanvien>();
       static List<nhanvien> list = new List<nhanvien> {
    new nhanvien { ma_nv = 1, ten_nv = "Nguyễn Văn A" },   
    new nhanvien { ma_nv = 2, ten_nv = "Nguyễn Văn B" },  
    new nhanvien { ma_nv = 3, ten_nv = "Nguyễn Văn C" },    
    new nhanvien { ma_nv = 4, ten_nv = "Nguyễn Văn D" }   ,
    new nhanvien { ma_nv = 5, ten_nv = "Nguyễn Văn E" },
    new nhanvien { ma_nv = 6, ten_nv = "Nguyễn Văn F" }
};

        [HttpGet]
        [ActionName("GetData")]
        public HttpResponseMessage GetData()
        {
            return Request.CreateResponse(HttpStatusCode.OK, new
            {
                Message = "Đây là kết quả trả về",
                Result = list
            });
        }
        [HttpPost]
        [ActionName("PostData")]
        public HttpResponseMessage PostData(nhanvien data)
        {
            list.Add(data);
            return Request.CreateResponse(HttpStatusCode.OK, new
            {
                Message = "Cập nhật thành công",
                Result = list
            });
        }
        //chỉnh sửa phần tử
        [HttpPut]
        [ActionName("PutData")]
        public HttpResponseMessage PutData(nhanvien data)
        {
            list.Where(a => a.ma_nv == data.ma_nv).Select(ctl =>
            {
                ctl.ten_nv = data.ten_nv;
                return ctl;
            }).ToList();

            return Request.CreateResponse(HttpStatusCode.OK, new
            {
                Message = "Cập nhật thành công",
                Result = list
            });
        }
        //xóa phần tử
        [HttpDelete]
        [ActionName("Delete")]
        public HttpResponseMessage Delete(int ma_nv)
        {
            list.RemoveAll(a => a.ma_nv == ma_nv);
            return Request.CreateResponse(HttpStatusCode.OK, new
            {
                Message = "Xóa thành công",
                Result = list
            });
        }
    }
}
