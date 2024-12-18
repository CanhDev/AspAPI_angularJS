using API.Models_canhnv;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace API.Controllers
{
    public class FormAPIController : ApiController
    {
        static List<banggia> bangGiaList = fakeData.GetBangGiaList();

        [HttpGet]
        [ActionName("GetData")]
        public HttpResponseMessage GetData(
            string searchInput = null,
            int? saleType = null,
            int? priceType = null,
            int? status = null)
        {
            try
            {
                var model = new searchModel
                {
                    searchInput = searchInput,
                    saleType = saleType ?? 0,
                    priceType = priceType ?? 0,
                    status = status ?? 0
                };

                var filteredData = hanlldFilter(bangGiaList, model);

                return Request.CreateResponse(HttpStatusCode.OK, new
                {
                    success = true,
                    result = filteredData
                });
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        // Hàm lọc dữ liệu
        public List<banggia> hanlldFilter(List<banggia> data, searchModel model)
        {
            if (!string.IsNullOrWhiteSpace(model.searchInput))
            {
                string searchWord = model.searchInput.Trim().ToLower();
                data = data.Where(d =>
                    (!string.IsNullOrEmpty(d.code) && d.code.ToLower().Contains(searchWord)) ||
                    (!string.IsNullOrEmpty(d.name) && d.name.ToLower().Contains(searchWord))
                ).ToList();
            }

            if (model.saleType > 0)
            {
                data = data.Where(d => d.saleType == model.saleType).ToList();
            }

            if (model.priceType > 0)
            {
                data = data.Where(d => d.priceType == model.priceType).ToList();
            }

            if (model.status > 0)
            {
                data = data.Where(d => d.status == model.status).ToList();
            }

            return data;
        }

        [HttpGet]
        [ActionName("GetById")]
        public HttpResponseMessage GetById(string id)
        {
            try
            {
                banggia bangGiaItem = bangGiaList.FirstOrDefault(i => i.code == id);
                return Request.CreateResponse(HttpStatusCode.OK, new
                {
                    success = true,
                    result = bangGiaItem
                });
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, new
                {
                    Message = ex.Message,
                    success = false
                });
            }
        }

        [HttpPost]
        [ActionName("PostData")]
        public HttpResponseMessage PostData([FromBody] banggia banggiaItem)
        {
            try
            {
                if (bangGiaList.Any(i => i.code == banggiaItem.code))
                {
                    return Request.CreateResponse(HttpStatusCode.OK, new { success = false, message = "Bảng giá đã tồn tại" });
                }
                if (banggiaItem.vattuList != null && banggiaItem.vattuList.Any())
                {
                    banggiaItem.vattuList.AddRange(banggiaItem.vattuList);
                }
                bangGiaList.Add(banggiaItem);

                return Request.CreateResponse(HttpStatusCode.Created, new { success = true, result = banggiaItem });
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, new
                {
                      success = false,
                      message = ex.Message
                });
            }
        }

        [HttpPut]
        [ActionName("PutData")]
        [Route("API/api/FormAPI/PutData/{oldId}")]
        public HttpResponseMessage PutData(string oldId, [FromBody] banggia bangGiaItem)
        {
            try
            {
                if (bangGiaItem.code != oldId && bangGiaList.Any(i => i.code == bangGiaItem.code))
                {
                    return Request.CreateResponse(HttpStatusCode.OK, new { success = false, message = "Mã bảng giá đã tồn tại" });
                }

                var updateBangGia = bangGiaList.FirstOrDefault(i => i.code == oldId);
                if (updateBangGia == null)
                {
                    return Request.CreateResponse(HttpStatusCode.OK, new { success = false, message = "Mã bảng giá không tồn tại" });
                }

                bangGiaList.Remove(updateBangGia);
                bangGiaList.Add(bangGiaItem);

                return Request.CreateResponse(HttpStatusCode.OK, new { success = true });
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }


        [HttpDelete]
        [ActionName("DeleteData")]
        public HttpResponseMessage DeleteData(string id)
        {
            try
            {
                var deleteBangGia = bangGiaList.FirstOrDefault(i => i.code == id);
                if (deleteBangGia == null)
                {
                    return Request.CreateResponse(HttpStatusCode.NotFound, new
                    {
                        success = false,
                        message = "Bảng giá không tồn tại"
                    });
                }
                bangGiaList.Remove(deleteBangGia);
                return Request.CreateResponse(HttpStatusCode.OK, new { success = true, result = id });
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, new
                {
                    success = false,
                    message = ex.Message
                });
            }
        }

        [HttpDelete]
        [ActionName("DeleteDatas")]
        public HttpResponseMessage DeleteDatas([FromBody] List<string> ids)
        {
            try
            {
                if (ids == null || !ids.Any())
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { success = false, message = "Danh sách id bảng giá không hợp lệ" });
                }
                var deleteBangGias = bangGiaList.Where(i => ids.Contains(i.code)).ToList();
                if (!deleteBangGias.Any())
                {
                    return Request.CreateResponse(HttpStatusCode.BadRequest, new { success = false, message = "Không tồn tại bản ghi nào" });
                }
                foreach (var item in deleteBangGias)
                {
                    bangGiaList.Remove(item);
                };
                return Request.CreateResponse(HttpStatusCode.OK, new {success = true, result = ids});

            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, new { success = false, message = ex.Message });
            }
        }

    }
}
