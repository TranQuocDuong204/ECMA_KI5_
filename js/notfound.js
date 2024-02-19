import notFound from "../views/404.html?raw";
import header_footer from "../views/header_footer.html?raw";

class Notfound {
  static notFoundPages = () => {
    document.getElementById("template").innerHTML = header_footer;
    document.getElementById("app").innerHTML = notFound;
  };
}

export default Notfound;
