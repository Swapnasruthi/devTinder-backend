const adminAuth = (req,res,next)=>{
                        const token = "xyz";
                        const isTokenTrue = token === "xyz";
                        if(!isTokenTrue){
                            res.status(404).send("user unauthorized");
                        }
                        else{
                            next();
                        }
                    }

module.exports = {
    adminAuth,
}