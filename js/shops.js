import shop from "../views/shop.html?raw";
import header_footer from "../views/header_footer.html?raw";
import axios from "axios";
import Toastify from "toastify-js";
import swal from "sweetalert";
let products = [];
let carts = [];

class Shops {
  static products = [];
  static carts = [];

  static shopPages = () => {
    document.getElementById("template").innerHTML = header_footer;
    document.getElementById("app").innerHTML = shop;
  };
  //show product
  static showProducts(productsToShow = products) {
    document.querySelector(".buil-data-products").innerHTML = "";
    if (productsToShow.length > 0) {
      productsToShow.forEach((pro) => {
        let formattedPrice = Number(pro.price).toLocaleString("en");
        document.querySelector(".buil-data-products").innerHTML += `
          <div class="col-md-6 col-lg-6 col-xl-4">
            <div class="rounded position-relative fruite-item-${pro.id}">
              <img class="img-fluid w-100 rounded-top" src="${pro.img}"
                class="card-img-top" alt="...">
              <div class="card-body">
                <h5 class="card-title">${pro.name}</h5>
                <p class="card-text">${pro.detail}</p>
                <p class="text-dark fs-5 fw-bold mb-0">${formattedPrice} / kg</p>
                <button data-id =${pro.id}  class="btn btn-primary btn-cart">Add To Cart</button>
              </div>
            </div>    
          </div>
        `;
      });
    }
    this.getId();
  }
  //get id from showProduct
  static getId() {
    let btn_id = document.querySelectorAll(".btn-cart");
    for (var i = 0; i < btn_id.length; i++) {
      btn_id[i].addEventListener("click", function (e) {
        let id = e.target.dataset.id;
        id = Number(id, 10);
        Shops.addToCart(id);
      });
    }
  }
  //get id from getId() handle add to cart
  static addToCart(id) {
    let product = products.find((product) => product.id === id);
    let positionThisProductInCart = carts.findIndex(
      (cart) => cart.product.id === id
    );
    if (positionThisProductInCart < 0) {
      carts.push({
        product: product,
        quantity: 1,
      });
    } else {
      carts[positionThisProductInCart].quantity++;
    }
    console.log(carts);
    Shops.addCartToHtml();
    Shops.addCartToMemory();
  }
  static addCartToMemory() {
    localStorage.setItem("cart", JSON.stringify(carts));
  }
  //handle render cart html to  addToCart();
  static addCartToHtml() {
    document.querySelector(".cart-items").innerHTML = "";
    let total = 0;

    if (carts.length > 0) {
      carts.forEach((cart) => {
        let newCart = document.createElement("div");
        newCart.classList.add("item");

        let totalOnePro = cart.product.price * cart.quantity;
        total += totalOnePro;
        newCart.innerHTML = `
          <div class="d-flex align-items-center justify-content-start cart-items">
            <div class="rounded me-4" style="width: 100px; height: 100px">
              <img
                src="${cart.product.img}"
                class="img-fluid rounded"
                alt=""
              />
            </div>
            <div>
              <h6 class="mb-2">${cart.product.name}</h6>
              <div class="d-flex mb-2">
              </div>
              <div class="d-flex mb-2">
                <h5 class="fw-bold me-2">${totalOnePro} /kg</h5>
                <input type="text" id="quantity" name="quantity" class="form-control input-number mr-5" style="margin-right: 8px;" value="${cart.quantity}" min="1" max="100">
                <button data-id ="${cart.product.id}" type="button" class="btn btn-danger delete-cart" style="padding: 0 15px;"><i class="fa-solid fa-square-xmark"></i></button>
              </div>
              
            </div>
          </div>
        `;
        document.querySelector(".cart-items").appendChild(newCart);
        this.handleGetIdBtnDel();
      });
    }
    document.querySelector("#total").textContent = "Tổng Tiền :" + total;
  }

  //handle get id button click delete
  static handleGetIdBtnDel() {
    let getBtnDel = document.querySelectorAll(".delete-cart");

    getBtnDel.forEach((btn_id) => {
      btn_id.addEventListener("click", (e) => {
        let id = e.currentTarget.dataset.id;
        id = Number(id, 10);
        this.removeFromCart(id);
      });
    });
  }

  // function delete product from carts
  static removeFromCart(id) {
    let positionThisProductInCart = carts.findIndex(
      (cart) => cart.product.id === id
    );
    if (positionThisProductInCart >= 0) {
      carts.splice(positionThisProductInCart, 1);
    }
    this.addCartToHtml();
    this.addCartToMemory();
  }
  //get api product from firebase with axios method get
  static async getApi() {
    try {
      let res = await axios.get(
        "https://asme-9dff4-default-rtdb.firebaseio.com/products.json"
      );
      let datas = res.data;
      products = datas;
      this.showProducts();
      Shops.addCartToHtml();

      // add memory
      if (localStorage.getItem("cart")) {
        carts = JSON.parse(localStorage.getItem("cart"));
        Shops.addCartToHtml();
      }
    } catch (e) {
      console.log(e);
    }
  }
  //get api categories from firebase with axios method get
  static async getApiCate() {
    try {
      let renders = "";
      let response = await axios.get(
        "https://asme-9dff4-default-rtdb.firebaseio.com/categories.json"
      );
      let idData = response.data;
      if (idData) {
        Object.values(idData).forEach((items, index) => {
          renders += this.builDb_Cate(items, index);
        });
      }
      document.querySelector(".category").innerHTML = renders;
      this.getIdCate();
    } catch (e) {
      console.log(e);
    }
  }
  //render categories to getapicate();
  static builDb_Cate({ id, name }, index) {
    return ` <li class="cate_li">
          <div class="d-flex justify-content-between fruite-name" id=${id}>
              <a href="#"><i class="fas fa-apple-alt me-2"></i>${name}</a>
              <span>${index + 1}</span>
          </div>
      </li>`;
  }
  // get id cate from function buildb_cate() transmit showProductBycategory(id cate);
  static getIdCate() {
    let idCa = document.querySelectorAll(".cate_li");
    for (let i = 0; i < idCa.length; i++) {
      idCa[i].addEventListener("click", () => {
        let categoryId = parseInt(idCa[i].firstElementChild.id);
        Shops.showProductsByCategory(categoryId);
      });
    }
  }
  // handle id of api product with id of api categories === handle Display the corresponding product from the category id
  static showProductsByCategory(categoryId) {
    let productsInCategory = products.filter(
      (product) => product.cate_id === categoryId
    );

    this.showProducts(productsInCategory);
  }
  //get id input search and button click
  static handleIdSearch() {
    let inputElement = document.querySelector(".input-search");
    let searchIcon = document.querySelector(".search-icon");

    searchIcon.addEventListener("click", () => {
      let searchKeyword = inputElement.value;
      if (searchKeyword) {
        Shops.handleSearchProduct(searchKeyword);
        inputElement.value = "";
      } else {
        Toastify({
          text: "Vui lòng nhập từ khóa để tìm kiếm!! ",

          duration: 5000,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "center",
          className: "info",

          backgroundColor: "#81c408",

          offset: {
            x: 0, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
            y: 65, // vertical axis - can be a number or a string indicating unity. eg: '2em'
          },
        }).showToast();
      }
    });
  }
  //handle even search in input
  static handleSearchProduct(idSearch) {
    let productSearch = products.filter((product) =>
      product.name.toLowerCase().includes(idSearch.toLowerCase())
    );
    if (productSearch.length === 0) {
      Toastify({
        text: "Không tìm thấy sản phẩm nào trong Shop! ",

        duration: 5000,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "center",
        className: "info",

        backgroundColor: "#81c408",

        offset: {
          x: 0, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
          y: 65, // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },
      }).showToast();
    } else {
      this.showProducts(productSearch);
    }
  }
  //handle get value from input range
  static handleGetValuePrice() {
    let priceRangeElement = document.querySelector(".price-range-class");
    let searchBtn = document.querySelector(".search-button");

    searchBtn.addEventListener("click", () => {
      let priceRange = priceRangeElement.value.split("-");
      let minPrice = priceRange[0];
      let maxPrice = priceRange[1];

      Shops.handleSearchPrice(minPrice, maxPrice);
    });
  }
  //handle function search products according to price range
  static handleSearchPrice(minPrice, maxPrice) {
    let searchRangePrice = products.filter(
      (product) =>
        parseInt(product.price) >= parseInt(minPrice) &&
        parseInt(product.price) <= parseInt(maxPrice)
    );
    if (searchRangePrice.length === 0) {
      Toastify({
        text: " Vui lòng chọn khoảng giá !",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "center",
        className: "info",

        backgroundColor: "#81c408",

        offset: {
          x: 0, // horizontal axis - can be a number or a string indicating unity. eg: '2em'
          y: 65, // vertical axis - can be a number or a string indicating unity. eg: '2em'
        },
      }).showToast();
    } else {
      this.showProducts(searchRangePrice);
    }
  }
  //handle checkout cart
  static handleCheckout() {
    let btnCheckout = document.querySelector(".check-out");
    const toasOptions = {
      duration: 5000,
      close: true,
      gravity: "top",
      position: "center",
      className: "info",
      backgroundColor: "#ef4444",
      offset: {
        x: 0,
        y: 65,
      },
    };
    btnCheckout.addEventListener("click", () => {
      if (carts.length > 0) {
        swal(`Bạn có chắc mua sản phẩm này ???`).then(() => {
          carts = [];
          document.querySelector(".cart-items").innerHTML = "";
          this.removeFromCart();
          swal("Đã Duyệt!", "Vui lòng chờ nhận hàng!", "success");
        });
      } else {
        Toastify({
          text: "Vui lòng chọn sản phẩm để thanh toán!",
          ...toasOptions,
        }).showToast();
      }
    });
  }
}

export default Shops;
