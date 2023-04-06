const router = require("express").Router();
const User = require("../models/User");
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

// REGISTRO DE USUÁRIO


// Rota "register" fará o método "post" passando os atributos de um novo registro


router.post("/register", async (req,res) =>{
      const newUser =  await new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJs.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });

try{
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
   }
    catch  (err) {
    res.status(500).json(err);    
   }                                                                                                                                         
});


// construindo a rota de loginm


router.post("/login", async (req, res) => {
    try{
        const user = await User.findOne(
            {
                username: req.body.username,
                password:req.body.password,
            }
        );

// tratamento de erro no login 

        const inputPassword = user.password;
        if (!inputPassword ){
            res.status(401).json("usuário ou senha incorretas");
                return
        }

        if (!user) {
            res.status(401).json("usuario nao existe")
                return ;
        }

        if (password !== req.body.password) {
            res.status(401).json("senha errada")
                return;
        }

        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );

       
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        

        
        
        if ( ! inputPassword ){ 
            res.status(401).json("Wrong Password")
                return 
            };

        const accessToken = jwt.sign(
        {
            id: user._id,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_SEC,
            {expiresIn:"3d"}
        );
  
        const { password , ... others } = user._doc;  
            res.status(200).json({...others, accessToken});

    }catch(err){
            res.status(500).json("sla");
    }

});


module.exports = router