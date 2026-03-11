const mysql = require("mysql2");

// tạo kết nối database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1111",
    database: "hrm_database"
});

// kiểm tra kết nối
db.connect((err) => {
    if (err) {
        console.log("Lỗi kết nối MySQL:", err);
    } else {
        console.log("Kết nối MySQL thành công");
    }
});

module.exports = db;