import contact from "../views/contact.html?raw";
import header_footer from "../views/header_footer.html?raw";

class Contacts {
  static contactPages = () => {
    document.getElementById("template").innerHTML = header_footer;
    document.getElementById("app").innerHTML = contact;
  };
}

export default Contacts;
