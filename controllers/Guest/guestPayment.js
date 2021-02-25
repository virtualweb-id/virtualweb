const { snap } = require('../../helpers')

module.exports = async (req, res, next) => {
  const { firstName, lastName, email, phone, amount } = req.body
    try {
      let parameter = {
        'transaction_details': {
          'order_id': `${Math.ceil(Math.random() * 1e9)}`,
          'gross_amount': +amount
        },
        'credit_card': {
          'secure': true
        },
        'customer_details': {
          'first_name': firstName,
          'last_name': lastName,
          'email': email,
          'phone': phone
        }
      };
      const transaction = await snap.createTransaction(parameter)
      res.status(200).json({ redirect_url: transaction.redirect_url });
    } catch (err) {
      next(err)
    }
}