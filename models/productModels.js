const db = require('../db')
const ExpressError = require('../expressError')

const timePurchased = new Date(Date.now())
//precheck for userId
//add error handling
class Product {
    //Both queries add to DB when meal is purchased depending on which choice. (Can be both?)

    //signature meal query
    static async getSignatureMeal() {
        const results = await db.query(`SELECT id, price FROM signature_meal`)
        return results.rows
    }

    //pair meal query
    static async getPairMeal() {
        const results = await db.query(`SELECT id, price FROM pair_meal`)
        return results.rows
    }

    //signature Meal purchase
    static async signatureMealPurchase(userId, mealId) {
        await db.query(
            //must match the exact DB names when inserting
            `INSERT INTO purchases (user_id, signature_meal, purchased_on)
            VALUES ($1, $2, $3)`, [userId, mealId, timePurchased]
        )
    }

    //pair Meal query (wine add on)
    static async pairMealPurchase(userId, mealId, pairId){
        await db.query(
            `INSERT INTO purchases (user_id, signature_meal, pair_meal, purchased_on)
            VALUES ($1, $2, $3, $4)`, [userId, mealId, pairId, timePurchased]
        )
    }
}

module.exports = Product