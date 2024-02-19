import header_footer from "../views/header_footer.html?raw";
import home from "../views/home.html?raw";

class Homes {
  static homePages = () => {
    document.getElementById("template").innerHTML = header_footer;
    document.getElementById("app").innerHTML = home;
  };
}

export default Homes;
