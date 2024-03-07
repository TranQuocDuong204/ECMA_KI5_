import admin from "../../views/admin.html?raw";
import manageCateAd from "../../views/manageCateAd.html?raw";
import swal from "sweetalert";
let cartegoris = [];
let currentId = null;
class ManageCateAd {
  static manageCatePage = () => {
    document.getElementById("template").innerHTML = admin;
    document.getElementById("app").innerHTML = manageCateAd;
  };

  static handleAddData() {
    let btnAdd = document.getElementById("add");
    btnAdd.addEventListener("click", function () {
      let getName = document.querySelector('input[name="namecate"]').value;
      if (getName !== cartegoris[1].name) {
        if (getName === "") {
          Toastify({
            text: "Vui lòng điền thông tin để thêm Danh mục!",
            duration: 1000,
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
          let data = {
            name: getName,
          };
          fetch(
            "https://asme-9dff4-default-rtdb.firebaseio.com/categories.json",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            }
          )
            .then(() => {
              ManageCateAd.handleGetDataCate();
              swal("Đã Thêm!", "Thành Công", "success");
              $("#exampleModal").modal("hide");
            })
            .catch(function (error) {
              console.log(error);
            });
          currentId = null;
        }
      } else {
        Toastify({
          text: "Danh mục đang tồn tại . Vui lòng nhập Danh mục khác? ",

          duration: 1000,
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

  static handleBuildData(item, index) {
    return `
        <tr>
        <th scope="row">${index + 1}</th>
        <td>${item.name}</td>
        <td>
        <button id="${
          item.id
        }" type="button" class="btn btn-warning btn-edit"   data-bs-toggle="modal" data-bs-target="#updateModalCate">Sửa</button>
        <button data-id="${
          item.id
        }" type="button" class="btn btn-danger btn-delete-cate" >Xóa</button>
        </td>
      </tr>
      `;
  }

  static handleDeleteData() {
    let getBtnDel = document.querySelectorAll(".btn-delete-cate");

    for (let i = 0; i < getBtnDel.length; i++) {
      getBtnDel[i].addEventListener("click", (e) => {
        let id = e.target.dataset.id;
        fetch(
          `https://asme-9dff4-default-rtdb.firebaseio.com/categories/${id}.json`,
          {
            method: "DELETE",
          }
        )
          .then(() => {
            console.log("check id", id);
            ManageCateAd.handleGetDataCate();
            swal("Đã Xóa!", "Thành Công", "success");
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
  }

  static handleEdit() {
    let getBtnEdit = document.querySelectorAll(".btn-edit");

    getBtnEdit.forEach((btn) => {
      btn.addEventListener("click", () => {
        currentId = btn.id;
        console.log("check btn edit", currentId);
        let currentItem = Object.values(cartegoris).find(
          (item) => item.id === currentId
        );

        if (currentItem) {
          document.querySelector('input[name="namecateup"]').value =
            currentItem.name;
        } else {
          console.log("No data");
        }
      });
    });
  }

  static handleUpdateData() {
    let btnSave = document.getElementById("update-cate");
    btnSave.addEventListener("click", () => {
      let getNames = document.querySelector("input[name='namecateup']").value;

      if (!getNames) {
        console.log("Name is not data");
        return;
      }

      let data = {
        id: currentId,
        name: getNames,
      };

      console.log(data);

      fetch(
        `https://asme-9dff4-default-rtdb.firebaseio.com/categories/${currentId}.json`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      )
        .then(() => {
          console.log("update success");
          currentId = null;
          ManageCateAd.handleGetDataCate();
          swal("Đã Chỉnh Sửa!", "Thành Công", "success");
          $("#updateModalCate").modal("hide");
        })
        .catch(function (error) {
          console.log(error);
        });
    });
  }

  static async handleGetDataCate() {
    try {
      let tableHTML = "";
      let response = await fetch(
        "https://asme-9dff4-default-rtdb.firebaseio.com/categories.json"
      );
      let data = await response.json();
      cartegoris = data;
      if (cartegoris) {
        Object.entries(cartegoris).forEach(([id, item], index) => {
          if (item) {
            item.id = id;
            tableHTML += this.handleBuildData(item, index);
          }
        });
        document.querySelector(".table-data-categori").innerHTML = tableHTML;
        this.handleAddData();
        this.handleDeleteData();
        this.handleEdit();
        this.handleUpdateData();
      }
    } catch (e) {
      console.log(e);
    }
  }
}

export default ManageCateAd;
