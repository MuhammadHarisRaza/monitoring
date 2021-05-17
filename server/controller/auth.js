const Admin = require("../model/admin");
const Employee = require("../model/employee")
const jwt =require('jsonwebtoken');
const expressJWT = require("express-jwt")
require('dotenv').config()

exports.signup = async (req, res) => {
    var adminExist = await Admin.findOne({email:  req.body.email})
    if(adminExist) return res.status(403).json({
        error: "Email is already taken!"
    })

    var admin = await new Admin(req.body)
    await admin.save();
    res.status(200).json({
        message:"Signup succesfully! Please Login"
    })
}

exports.signin = (req, res) => {
    //find the user based on email
    const { email, password } = req.body;
    console.log(req.body);
    Admin.findOne({ email }, (err, admin) => {
        //if error or no user
        if (err || !admin) {
            return res.status(401).json({
                error:
                    "Admin with this email does not exists.Please sign in with registered email.",
            });
        }
        // if user is found authenticate email and password
        if (!admin.authenticate(password)) {
            console.log(password);
            return res.status(401).json({
                error: "Email and Password doesn't match",
            });
        }
        //generate a token with user id and secret

        const token = jwt.sign({ _id: admin.id }, process.env.JWT_SECRET);
        console.log(token)

        //persist the token as 't' in cookie with expiry date
        res.cookie("t", token, { expire: new Date() + 9999, httpOnly: true });
        
        //return response with user and token to frontend client
        const { _id, name, email } = admin;
        admin.hashed_password = undefined;
        admin.salt = undefined;
        return res.json({
            token,
            admin: admin,
        });
    });
}

exports.signout = (req,res) =>{
    res.clearCookie("t")
    return res.json({
        message:"Signout Succesfully"
    })
}

exports.requireSignin = expressJWT({
    secret: process.env.JWT_SECRET,
    userProperty: "auth",
    algorithms: ["HS256"]
})


//Client 

exports.employeeSignup = async (req, res) => {
    console.log(req.body);
    console.log(req.auth);
    const employeeExists = await Employee.findOne({ email: req.body.email });

    if (employeeExists) {
        return res.status(403).json({
            error: "Employee is already registered",
        });
    }
    const employee = await new Employee(req.body);
    employee.createdBy = req.auth._id;
    await employee.save();
    res.status(200).json({
        message: "Employee Registered succesfully",
    });
};


exports.employeeSignin = (req, res) => {
    //find the user based on email
    const { email, password } = req.body;
    console.log(req.body);
    Employee.findOne({ email }, (err, employee) => {
        //if error or no user
        if (err || !employee) {
            return res.status(401).json({
                error:
                    "Employee with this email does not exists.Please sign in with registered email.",
            });
        }
        // if user is found authenticate email and password
        if (!employee.authenticate(password)) {
            console.log(password);
            return res.status(401).json({
                error: "Email and Password doesn't match",
            });
        }
        //generate a token with user id and secret

        const token = jwt.sign({ _id: employee.id }, process.env.JWT_SECRET);
        console.log(token)

        //persist the token as 't' in cookie with expiry date
        res.cookie("t", token, { expire: new Date() + 9999, httpOnly: true });
        
        //return response with user and token to frontend client
        const { _id, name, email } = employee;
        employee.hashed_password = undefined;
        employee.salt = undefined;
        return res.json({
            token,
            employee,
        });
    });
}


exports.employeeSignout = (req,res) =>{
    res.clearCookie("t")
    return res.json({
        message:"Signout Succesfully"
    })
}

exports.employeeRequireSignin = expressJWT({
    secret: process.env.JWT_SECRET,
    userProperty: "auth",
    algorithms: ["HS256"]
})
