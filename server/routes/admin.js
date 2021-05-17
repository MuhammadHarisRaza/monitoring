var express = require("express")
var { adminById, allAdmin, getAdmin, updateAdmin, deleteAdmin } =  require("../controller/admin")
var {requireSignin} = require("../controller/auth")

var router = express.Router();

router.get("/admins", allAdmin)
router.get("/admin/:adminId",requireSignin, getAdmin)
router.put("/admin/:adminId",requireSignin, updateAdmin)
router.delete("/admin/:adminId", requireSignin, deleteAdmin)

router.param("adminId", adminById)

module.exports=router