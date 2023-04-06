const User = require("../models/User");


const {verifyToken, authToken , authTokenAdmin} = require("./verifyToken");

const router = require("express").Router();

router.put("/:id", authToken, async (req,res)=>{
    if (req.body.password) {
        req.body.password = Crypto.AES.encrypt(
            req.body.password,
            req.env.PASS_SEC
        ).toString();
    }
try{
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body
     }, {new:true}
    ); res.status(200).json(updatedUser)
    }catch(err){
        res.status(500).json(err)
    }
}) 

router.delete("/:id", authToken, async (req,res) =>{
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("Usuário deletado com sucesso");
    }catch(err){
        res.status(500).json(err)
    }
} )

router.get("/find/:id", authTokenAdmin, async (req,res) => {
    try{
    const user = await User.findById(req.params.id)
    const { password , ...others } = user._doc;
    res.status(200).json(others)
    }catch(err){
        res.status(500).json(err)
    }
} )

router.get("/",  async (req,res) => {
    const query = req.query.new;    
    try{
    const users = query
    ? await User.find().sort({ _id: -1}).limit(5)
    : await User.find();
    res.status(200).json(users)
    }catch(err){
        res.status(500).json(err)
    }
} )

router.get("stats", authTokenAdmin, async (req,res) => {
    const date = new Date();
    const leastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    try{

        const data = await  User.aggregate([
            { $match: { createAt: {$gte: lastYear } } },
            {
              $project : {
                month: { $month: "$createdAt" },
              },
            },
            {
                $group:{
                    _id: "$month",
                    total: {$sum: 1},
                }
            }
        ]);
        res.status(200).json(data)

    }catch(Err){
        res.status(500).json(err)
    }
    
})





module.exports = router