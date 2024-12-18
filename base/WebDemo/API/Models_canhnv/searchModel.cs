using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API.Models_canhnv
{
    public class searchModel
    {
        public string searchInput { get; set; }
        public int saleType { get; set; }
        public int priceType { get; set; }
        public int status { get; set; }
    }
}