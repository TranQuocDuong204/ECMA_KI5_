import shop_detail from "../views/shop_detail.html?raw";
import header_footer from "../views/header_footer.html?raw";

class ShopDetails {
  static shopDetailPages = () => {
    document.getElementById("template").innerHTML = header_footer;
    document.getElementById("app").innerHTML = shop_detail;
  };
}

export default ShopDetails;
