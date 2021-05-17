const express = require("express")
const { 
    signup,
    signin, 
    signout,
    employeeSignup,
    employeeRequireSignin,
    employeeSignout,
    requireSignin, 
    employeeSignin
} = require("../controller/auth")
const { adminSignupValidator } = require("../validator/index")
const { adminById } = require("../controller/admin")
const { employeeById } = require("../controller/employee")


var router = express.Router()


//admin
router.post("/signup", adminSignupValidator, signup)
router.post("/signin", signin)
router.get("/signout", signout)

router.param("adminId", adminById)

//client

router.post("/employeeSignup",requireSignin, adminSignupValidator, employeeSignup)
router.post("/employeeSignin", employeeSignin)
router.get("/employeeSignout", employeeSignout)

router.param("employeeId", employeeById)


module.exports = router;