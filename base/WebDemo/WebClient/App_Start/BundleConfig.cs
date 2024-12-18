using System.Web;
using System.Web.Optimization;

namespace WebClient
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {

            bundles.Add(new StyleBundle("~/Content_canhnv/css").Include(
                 "~/Content_cannnv/bootstrap.min.css",
                 "~/Content_canhnv/style.css"
                ));

            #region AngularJS

            bundles.Add(new ScriptBundle("~/bundles/js").Include(
                "~/Content/bootstrap/js/bootstrap.min.js",
                "~/Scripts/angular.js",
                "~/Scripts/angular-ui-router.js",
                "~/Scripts/angular-messages.js"
            ));
            #endregion

            bundles.Add(new ScriptBundle("~/bundles/MyApp").Include(

                       "~/Scripts/MyJS/ModuleMain.js",
                      "~/Scripts/MyJS/CustomerController.js",
                      "~/Scripts/Services/extension.js"
            ));

            bundles.Add(new ScriptBundle("~/bundles/canhnv").Include(

                       "~/Scripts_canhnv/angular.min.js",
                       "~/Scripts_canhnv/main.js",
                      "~/Scripts_canhnv/services/CRUDServices.js",
                      "~/Scripts_canhnv/services/bangGia_service.js",
                      "~/Scripts_canhnv/services/vatTu_service.js",
                      "~/Scripts_canhnv/services/VATFactory.js"
            ));

        }
    }
}
