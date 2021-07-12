const DB_URI = (process.env.NODE_ENV === "test") 
? "postgresql:///Pickout_test" 
: "postgresql:///Pickout";

const PORT = +process.env.PORT || 5001

const SECRET_KEY = process.env.SECRET_KEY || "our_secret_key"

const BCRYPT_WORK_FACTOR = 12;

const STRIPE_SECRET_KEY = "sk_test_51HscgAHbmlANNp9nAXqMZGzMbxSYJeCMqYUytQZX4rhSVr0NzNDIUQJtDesZFMtd2qEcji78KzgVzCfZH68FV9H200bBeMqptT"

module.exports = {
    DB_URI,
    PORT,
    SECRET_KEY,
    BCRYPT_WORK_FACTOR,
    STRIPE_SECRET_KEY
}