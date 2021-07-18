const db = require('../db')
const ExpressError = require('../expressError')

const timePurchased = new Date(Date.now())
//add error handling
class Product {
    //Both queries add to DB when meal is purchased depending on which choice. (Can be both?)

    //signature meal query
    static async getSignatureMeal() {
        const results = await db.query(`SELECT id, price FROM signature_meal`)
        return results.rows[0]
    }

    //pair meal query
    static async getPairMeal() {
        const results = await db.query(`SELECT id, price FROM pair_meal`)
        return results.rows[0]
    }

    //signature Meal purchase
    static async signatureMealPurchase(userId, mealId) {
        const signatureMeal = await db.query(
            //must match the exact DB names when inserting
            `INSERT INTO purchases (user_id, signature_meal, purchased_on)
            VALUES ($1, $2, $3) RETURNING id`, [userId, mealId, timePurchased]
        )
        return signatureMeal.rows[0]
    }

    //pair Meal query (wine add on)
    static async pairMealPurchase(userId, mealId, pairId){
        const pairMeal = await db.query(
                `INSERT INTO purchases (user_id, signature_meal, pair_meal, purchased_on)
                VALUES ($1, $2, $3, $4) RETURNING id`, [userId, mealId, pairId, timePurchased])
        return pairMeal.rows[0]
    }
}

module.exports = Product