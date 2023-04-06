const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next) =>{
    const authHeader = req.header.token;
    if (authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err,user) => {
            if(err) res.status(403).json("token inválido");
            req.user = user;
            next()

        })
    }else {
        return res.status(401).json("Falha na autênticação")     
    }
};

const authToken = (req,res,next) =>{
    verifyToken(req,res, () =>{
        if (req.user.id === req.params.id || req.user.isAdmin){
            next()
        }else{
            res.status(403).json("Você não tem permissão")
        }
    })
}

const authTokenAdmin = (req,res,next) =>{
    verifyToken(req,res, () =>{
        if (req.user.isAdmin){
            next()
        }else{
            res.status(403).json("Você não tem permissão")
        }
    })
}

module.exports = {verifyToken, authToken, authTokenAdmin}