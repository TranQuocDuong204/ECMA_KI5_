import admin from "../../views/admin.html?raw";
import manageProducts from "../../views/manageProducts.html?raw";
import swal from "sweetalert";
let products = [];
let idEdit = null;
class ManageProducts {
  static manageProPage = () => {
    document.getElementById("template").innerHTML = admin;
    document.getElementById("app").innerHTML = manageProducts;
  };

  static handleBuildProduct(item, index) {
    let formattedPrice = Number(item.price).toLocaleString("vi");
    return `
      <tr>
      <th scope="row">${index + 1}</th>
      <td><img class="img-fluid  rounded-top" src="${item.img}"
      class="card-img-top" alt="Ảnh Sản Phẩm" style= "width:100px;"></td>
      <td>${item.name}</td>
      <td>${formattedPrice}</td>
      <td>${item.detail}</td>
      <td>
      <button id="${
        item.id
      }" type="button" class="btn btn-warning btn-edit" data-bs-toggle="modal" data-bs-target="#update-pro1">Sửa</button>
      <button data-id="${
        item.id
      }" type="button" class="btn btn-danger btn-delete-pro" >Xóa</button>
      </td>
    </tr>
    `;
  }

  static handleAddProduct() {
    let btnAdd = document.getElementById("add-pro");
    const fileInput = document.getElementById("updateFile");
    let globalURL = "";
    fileInput.addEventListener("change", (e) => {
      e.preventDefault();
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target.result;
        globalURL = url;
        console.log(url);
      };
      reader.readAsDataURL(file);
    });
    btnAdd.addEventListener("click", () => {
      let idpro = Math.floor(Math.random() * 1000);
      let namePro = document.querySelector('input[name="namepro"]').value;
      let price = document.querySelector('input[name="price"]').value;
      let detail = document.querySelector('input[name="detail"]').value;
      let priceRangeElement = document.querySelector(".price-range-class");
      let priceRange = priceRangeElement.value.split("-");
      console.log(globalURL);
      let data = {
        id: Number(idpro),
        name: namePro,
        price: price,
        detail: detail,
        img: globalURL,
        cate_id: Number(priceRange),
      };
      fetch(`https://asme-9dff4-default-rtdb.firebaseio.com/products.json`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(() => {
          this.getDataProductsAll();
          swal("Đã Thêm!", "Thành Công", "success");
          $("#exampleModal").modal("hide");
        })
        .catch((e) => {
          console.log("error", e);
        });
      idEdit = null;
    });
  }
  static handleDeleteProducts() {
    let getBtnDel = document.querySelectorAll(".btn-delete-pro");

    for (let i = 0; i < getBtnDel.length; i++) {
      getBtnDel[i].addEventListener("click", (e) => {
        console.log("check btn delete", getBtnDel[i]);
        console.log("check btn i", i);
        let id = e.target.dataset.id;
        console.log("check id", id);
        fetch(
          `https://asme-9dff4-default-rtdb.firebaseio.com/products/${id}.json`,
          {
            method: "DELETE",
          }
        )
          .then(() => {
            console.log("delete success");
            this.getDataProductsAll();
            swal("Đã Xóa!", "Thành Công", "success");
          })
          .catch((e) => {
            console.log("check error", e);
          });
      });
    }
  }

  static handleGetIdProduct() {
    let getBtnEdit = document.querySelectorAll(".btn-edit");
    getBtnEdit.forEach((btn) => {
      btn.addEventListener("click", async () => {
        console.log("check btn edit", btn.id);
        idEdit = btn.id;
        console.log(idEdit);
        console.log(products[1]);
        let currentItem = products.find((item) => item.id === idEdit);
        console.log("current", currentItem);
        if (currentItem) {
          document.querySelector("input[name='nameproup']").value =
            currentItem.name;
          document.querySelector('input[name="priceup"]').value =
            currentItem.price;
          document.querySelector('input[name="detailup"]').value =
            currentItem.detail;
          let selectElement = document.querySelector(".price-range-class-up");
          selectElement.value = currentItem.cate_id;
        } else {
          console.error("Không tìm thấy sản phẩm");
        }
      });
    });
  }

  static handleUpdateProduct() {
    let btnUpdate = document.getElementById("update-pro");

    const fileInput = document.getElementById("fileInput");
    let globalURL = "";
    fileInput.addEventListener("change", (e) => {
      e.preventDefault();
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target.result;
        globalURL = url;
        console.log(url);
      };
      reader.readAsDataURL(file);
    });
    btnUpdate.addEventListener("click", () => {
      let namePro = document.querySelector("input[name='nameproup']").value;
      let idpro = Math.floor(Math.random() * 1000);
      let price = document.querySelector('input[name="priceup"]').value;
      let detail = document.querySelector('input[name="detailup"]').value;
      let priceRangeElement = document.querySelector(".price-range-class-up");
      let priceRange = priceRangeElement.value.split("-");
      console.log(globalURL);
      console.log(namePro, idpro, price, detail, priceRange);
      console.log(idpro);
      let data = {
        id: Number(idpro),
        name: namePro,
        price: price,
        detail: detail,
        img: globalURL,
        cate_id: Number(priceRange),
      };
      fetch(
        `https://asme-9dff4-default-rtdb.firebaseio.com/products/${idEdit}.json`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      )
        .then(() => {
          console.log("update sucess");
          idEdit = null;
          this.getDataProductsAll();
          swal("Đã Chỉnh Sửa!", "Thành Công", "success");
          $("#update-pro1").modal("hide");
        })
        .catch((e) => {
          console.log("check error", e);
        });
    });
  }
  static async getDataProductsAll() {
    try {
      let tableHTML = "";
      let response = await fetch(
        `https://asme-9dff4-default-rtdb.firebaseio.com/products.json`
      );
      let data = await response.json();
      products = data;

      if (products) {
        Object.entries(products).forEach(([id, item], index) => {
          if (item) {
            item.id = id;
            tableHTML += this.handleBuildProduct(item, index);
          }
        });
        document.querySelector(".table-data-product").innerHTML =  tableHTML;
        this.handleAddProduct();
        this.handleDeleteProducts();
        this.handleGetIdProduct();
        this.handleUpdateProduct();
      }
    } catch (e) {
      console.log(e);
    }
  }
}

export default ManageProducts;
