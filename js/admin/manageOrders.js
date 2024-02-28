import admin from "../../views/admin.html?raw";
import manageOrders from "../../views/manageOrders.html?raw";
import swal from "sweetalert";

let orders = [];

class ManageOrders {
  static manageOrderPages = () => {
    document.getElementById("template").innerHTML = admin;
    document.getElementById("app").innerHTML = manageOrders;
  };

  static handleBuilData(order, index) {
    return `
          <tr>
              <th scope="row">${index + 1}</th>
              <td>${order.customer_name}</td>
              <td>${order.customer_email}</td>
              <td>${order.customer_address}</td>
              <td>${order.customer_phone_number}</td>
              <td>
              <button  data-id="${
                order.id
              }" type="button" class="btn btn-success btn-edit" >Duyệt</button>
              <button data-id="${
                order.id
              }" type="button" class="btn btn-info btn-detail-order" data-bs-toggle="modal" data-bs-target="#exampleModal">Chi Tiết</button>
              </td>
            </tr>
          `;
  }

  static handleBrowser() {
    let getBtnDel = document.querySelectorAll(".btn-edit");

    for (let i = 0; i < getBtnDel.length; i++) {
      getBtnDel[i].addEventListener("click", (e) => {
        let id = e.target.dataset.id;
        fetch(
          `https://asme-9dff4-default-rtdb.firebaseio.com/orders/${id}.json`,
          {
            method: "DELETE",
          }
        )
          .then(() => {
            console.log("check id", id);
            this.getDataOrder();
            swal("Duyệt!", "Đơn Đã Được Chuyển Cho Người Bán", "success");
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
  }
  static handleOrderDetail() {
    let btnDetail = document.querySelectorAll(".btn-detail-order");

    btnDetail.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        let id = e.target.dataset.id;

        fetch(
          `https://asme-9dff4-default-rtdb.firebaseio.com/orders/${id}.json`
        )
          .then((response) => response.json())
          .then((orderData) => {
            console.log("Order Data:", orderData);

            let tbodyElement = document.querySelector(".detail-data");
            tbodyElement.innerHTML = "";

            if (orderData.idPro && orderData.idPro.length > 0) {
              console.log(orderData.idPro);
              orderData.idPro.forEach((idPro, index) => {
                fetch(
                  `https://asme-9dff4-default-rtdb.firebaseio.com/products/${idPro.product_id}.json`
                )
                  .then((response) => response.json())
                  .then((idProData) => {
                    console.log("detail:", idProData);
                    Object.values(idProData).forEach((data) => {
                      this.handleBuilDataDetail(data);
                    });
                  })
                  .catch((error) => {
                    console.error(`error ok ${index + 1}:`, error);
                  });
              });
            }
          });
      });
    });
  }

  static handleBuilDataDetail(details) {
    let tbodyElement = document.querySelector(".detail-data");

    if (!tbodyElement) {
      console.error("Tbody element not found.");
      return;
    }

    let newRow = document.createElement("tr");

    newRow.innerHTML = `
        <th scope="row">${details.id}</th>
        <td>${details.name}</td>
        <td>${details.price}</td>
        <td>${details.name}</td>
    `;

    tbodyElement.appendChild(newRow);
  }

  static async getDataOrder() {
    let tableHTML = "";
    try {
      let response = await fetch(
        `https://asme-9dff4-default-rtdb.firebaseio.com/orders.json`
      );
      let data = await response.json();
      orders = data;
      if (orders) {
        Object.entries(orders).forEach(([id, item], index) => {
          if (item) {
            item.id = id;
            tableHTML += this.handleBuilData(item, index);
          }
        });
        document.querySelector(".table-data-orders").innerHTML = tableHTML;
      }
    } catch (e) {
      console.log("check error", e);
    }
    this.handleBrowser();
    this.handleOrderDetail();
  }
}

export default ManageOrders;
