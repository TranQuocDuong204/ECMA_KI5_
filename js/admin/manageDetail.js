import admin from "../../views/admin.html?raw";
import manageDetail from "../../views/manageDetail.html?raw";




class Detail {
    static orderData; // Static variable to store orderData

    static manageDetailPage = () => {
        document.getElementById("template").innerHTML = admin;
        document.getElementById("app").innerHTML = manageDetail;
       
        this.buildDataDetail();
    };

    static storeOrderData(data) {
        this.orderData = data;
    }

    static buildDataDetail() {
        if (this.orderData && this.orderData.idPro && this.orderData.idPro.length > 0) {
            console.log(this.orderData.idPro);
            this.orderData.idPro.forEach((idPro, index) => {
                fetch(
                    `https://asme-9dff4-default-rtdb.firebaseio.com/products/${idPro.product_id}.json`
                )
                .then((response) => response.json())
                .then((idProData) => {
                    console.log("detail:", idProData);
                    this.handleBuildData(idProData);
                })
                .catch((error) => {
                    console.error(
                        `error ok ${
                            index + 1
                        }:`,
                        error
                    );
                });
            });
        }
    }

    static handleBuildData(details) {
        console.log(details);
        let tableElement = document.querySelector('.table-data-orders-detail');
        if (!tableElement) {
            console.error("Table element not found.");
            return;
        }

        Object.values(details).forEach((detail) => {
            tableElement.innerHTML += `
                <tr>
                    <th scope="row">${detail.id}</th>
                    <td>${detail.name}</td>
                    <td>${detail.price}</td>
                    <td>@mdo</td>
                </tr>
            `;
        });
    }
}

export default Detail;