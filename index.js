const express = require("express");
const path = require("path");
const db = require("./db");

const app = express();

app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,"views")));
app.use(express.static("public"));

// mở trang login
app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"views/login.html"));
});


// xử lý login
app.post("/login",(req,res)=>{

    const username = req.body.username;
    const password = req.body.password;

    const sql = "SELECT * FROM users WHERE username=? AND password=?";

    db.query(sql,[username,password],(err,result)=>{

        if(err) throw err;

        if(result.length > 0){
            res.redirect("/logic.html");
        }else{
            res.send("Sai tài khoản hoặc mật khẩu");
        }

    });

});

app.post("/register",(req,res)=>{

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    // kiểm tra username đã tồn tại chưa
    const checkSql = "SELECT * FROM users WHERE username = ?";

    db.query(checkSql,[username],(err,result)=>{

        if(err){
            return res.send("Lỗi hệ thống");
        }

        // nếu đã tồn tại username
        if(result.length > 0){
            return res.send("Tài khoản đã tồn tại");
        }

        // nếu chưa tồn tại thì thêm vào database
        const insertSql = "INSERT INTO users (username,email,password) VALUES (?,?,?)";

        db.query(insertSql,[username,email,password],(err,result)=>{

            if(err){
                return res.send("Lỗi đăng ký");
            }

            res.send("success");

        });

    });

});

app.post("/change-password",(req,res)=>{

const {username,oldPassword,newPassword} = req.body

const sql = "SELECT * FROM users WHERE username=?"

db.query(sql,[username],(err,result)=>{

if(result.length === 0){
return res.send("Tài khoản không tồn tại")
}

const check = "SELECT * FROM users WHERE username=? AND password=?"

db.query(check,[username,oldPassword],(err,result2)=>{

if(result2.length === 0){
return res.send("Mật khẩu cũ không đúng")
}

const update = "UPDATE users SET password=? WHERE username=?"

db.query(update,[newPassword,username],(err)=>{
res.send("Đổi mật khẩu thành công")
})

})

})

})

app.get("/users",(req,res)=>{

const sql=`
SELECT users.id, users.username, users.email, roles.role_name
FROM users
JOIN roles ON users.role_id = roles.id
`

db.query(sql,(err,result)=>{
res.json(result)
})

})
app.get("/roles",(req,res)=>{

db.query("SELECT * FROM roles",(err,result)=>{
res.json(result)
})

})
app.post("/update-role",(req,res)=>{

const {id,role_id}=req.body

const sql="UPDATE users SET role_id=? WHERE id=?"

db.query(sql,[role_id,id],(err)=>{

res.send("Cập nhật role thành công")

})

})
app.listen(3000,()=>{
    console.log("Server running at http://localhost:3000");
});