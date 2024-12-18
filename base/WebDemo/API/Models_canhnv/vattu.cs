using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API.Models_canhnv
{
    public class vattu
    {
        public string materialCode { get; set; }
        public string materialName { get; set; }
        public int applicationType { get; set; }
        public string customerCode { get; set; }
        public string customerGroup { get; set; }
        public DateTime startDate { get; set; }
        public DateTime endDate { get; set; }
        public TimeSpan startTime { get; set; }
        public TimeSpan endTime { get; set; }
        public int minQuantity { get; set; }
        public double pricebeforeVAT { get; set; }
        public string taxCode { get; set; }
        public double taxRate { get; set; }
        public double priceAfterVAT { get; set; }
        //

        public string priceListCode;
        public banggia banggia;
    }
}