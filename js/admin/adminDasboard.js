import admin from "../../views/admin.html?raw";

class AdminDasboard {
  static adminPages = () => {
    document.getElementById("template").innerHTML = admin;
    document.getElementById("app").innerHTML = `<h1 style="margin-top: 30px">Quản lý Admin</h1>`;
  };
}

export default AdminDasboard;
