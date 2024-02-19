import header_footer from "../views/header_footer.html?raw";
import chackout from "../views/chackout.html?raw";

class Chackouts {
  static chackoutPages = () => {
    document.getElementById("template").innerHTML = header_footer;
    document.getElementById("app").innerHTML = chackout;
  };
}

export default Chackouts;
