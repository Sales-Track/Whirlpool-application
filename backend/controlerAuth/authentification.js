
const User  = require('../models/Users.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userr=require('./userController.js')


const generateToken = (userId, userName) => {
  const expiresIn = 60 * 60 * 24 * 7; // 7 day
  return jwt.sign({ userId, userName }, 'secretKey', { expiresIn: expiresIn });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      const token = generateToken(user.id, user.fullName);
      res.json({ token, userId: user.id });
    } else {
      res.status(401).json({ message: 'Invalid Password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};


const checkPass = async(req, res) => {
  const{email,password}=req.body;
  try {
       const result= await User.findOne({ where :{email:email}})
       if(result ===null) res.send("user not found")
       else {
        const verif=result.dataValues.password
        const passwordMatch = await bcrypt.compare(password,verif)
        if(passwordMatch){
           const token=generateToken(result.dataValues.id,result.dataValues.username)  
           result.dataValues.token=token
          res.send(true)
        }
        else{
          res.send(false)
        }
       }
      }
      catch (error) {res.status(500).json(error)}
  }
  
  

module.exports = {
  loginUser,
  checkPass
}; 

