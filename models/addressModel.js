const db = require('../db')
const ExpressError = require('../expressError')

class Address {
    constructor(user_id, street_address, address_number, city, state, zip_code, country){
        this.user_id = user_id;
        this.street_address = street_address;
        this.address_number = address_number;
        this.city = city;
        this.state = state;
        this.zip_code = zip_code;
        this.country = country;
    }

    //add error handling to all
    static async getAllAddress(){
        const res = await db.query(`SELECT 
                                        user_id, street_address, address_number, city, state, zip_code, country
                                    FROM user_address`)
        const address = res.rows.map(a => new Address(a.user_id, a.street_address, a.address_number, a.city, a.state, a.zip_code, a.country))
        return address
    }
    
    //get address by user_id
    static async getAddressId(user_id){
        const res = await db.query(`SELECT 
                                        user_id, street_address, address_number, city, state, zip_code, country 
                                    FROM user_address 
                                    WHERE user_id=$1`, [user_id])
        const a = res.rows[0]
        if(a) {
        return new Address(a.user_id, a.street_address, a.address_number, a.city, a.state, a.zip_code, a.country)
        }
        throw new ExpressError('User not found.', 404)
    }

    //register address when users registers (foreign key constraint)
    static async registerAddress(user_id){
        const res = await db.query(`INSERT INTO user_address (user_id)
                                    VALUES ($1) RETURNING user_id`,
                                    [user_id])
        const ourAddress = res.rows[0]
        return new Address(ourAddress)
    }

    //updates address based on user_id (must search currentUser id first before updates)
    async updateAddress(){
        const res = await db.query(`UPDATE 
                                        user_address    
                                    SET 
                                        street_address=$1, address_number=$2, city=$3, state=$4, zip_code=$5, country=$6
                                    WHERE user_id =$7`,
                                    [this.street_address, this.address_number, this.city, this.state, this.zip_code, this.country, this.user_id])
        if(!res) throw new ExpressError('Must fill out all input', 400)
    }
}

module.exports = Address