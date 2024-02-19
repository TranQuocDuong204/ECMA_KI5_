// cart.js
import header_footer from "../views/header_footer.html?raw";
import cart from "../views/cart.html?raw";

class Carts {
  static CartPages = () => {
    document.getElementById("template").innerHTML = header_footer;
    document.getElementById("app").innerHTML = cart;
  }

  
}

export default Carts;
