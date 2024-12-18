using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebClient.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }    

        public ActionResult Contact()
        {
             return PartialView("Contact");
        }
        public ActionResult ChiTiet()
        {
            return PartialView("ChiTiet");
        }
        public ActionResult List()
        {
            return PartialView("List");
        }

        public ActionResult ListDM()
        {
            return PartialView("ListDM");
        }
    }
}