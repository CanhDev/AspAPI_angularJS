using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API.Models_canhnv
{
    public class banggia
    {
        public string code { get; set; }
        public string name { get; set; }
        public int saleType { get; set; }
        public int priceType { get; set; }
        public int status { get; set; }
        //
        public List<vattu> vattuList = new List<vattu>();
    }
}