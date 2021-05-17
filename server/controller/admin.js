const _ =require("lodash")
const Admin = require("../model/admin")



exports.adminById = (req,res,next,id) =>{
    Admin.findById(id).exec((err, admin) =>{

        if(err|| !admin){
            return res.status(400).json({
                error:"Admin not found"
            })
        }

        req.profile = admin
        next()

    })
}

exports.hasAuthorization = (req, res, next) =>{
    var authorized = req.profile && req.auth && req.profile._id === req.auth._id
    if(!authorized){
        return res.status(403).json({
            error: "Admin is not authorized to perform this action"
        })
    }
}


exports.allAdmin = (req, res) =>{
    Admin.find((err, admin) =>{
        if(err){
            return res.status(400).json({
                error:err
            })
        }
        res.json({
            admin
        })
    }).select("name email updated created")
}


exports.getAdmin = (req,res) =>{
    console.log(req.body)
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile)
}

exports.updateAdmin = (req,res, next)=>{
    let admin = req.profile
    admin = _.extend(admin, req.body);// extend - mutate the source object
    admin.updated = Date.now();
    admin.save((err)=>{
        if(err){
            console.log(err)
            return res.status(400).json({
                error: "You are not authorized  to perform this action"
    
            })
        }
        admin.hashed_password = undefined;
        admin.salt = undefined;
        res.json({
            admin
        });
    
    })    
};



exports.deleteAdmin = (req,res,next) => {
    let admin = req.profile
    admin.remove((err, admin)=>{
        if(err){
            return res.status(400).json({
                error:err
            })
        }
        admin.hashed_password = undefined
        admin.salt = undefined
        res.json({
            message:"Admin has been deleted"
        })
    })
}