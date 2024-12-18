using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API.Models
{
    public class nhanvien
    {
        public int ma_nv { get; set; }
        public string ten_nv { get; set; }
        public int tuoi { get; set; }
        public string diachi { get; set; }
        public string sdt { get; set; }
        public DateTime date0 { get; set; }
        public TimeSpan time0 { get; set; }
        public string status { get; set; }
        public DateTime date2 { get; set; }
        public TimeSpan time2 { get; set; }

    }
}