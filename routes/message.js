const router = require('express').Router();
const Message = require('../models/message');

router.route('/add').post((req, res) => {
    const { from, to, message } = req.body;
    const newMessage = new Message({
        from: from,
        to: to,
        message: message
    })

    newMessage.save((err, message) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error: Server error'
            })
        } else {
            return res.send({
                success: true,
                message: 'Successfully sent message'
            })
        }
    })
})

router.route('/get').post((req, res) => {
    const { from, to, limit} = req.body;
    Message.find({
        from: {$in: [from, to]},
        to: {$in: [from, to]}
    }).limit(limit).sort({"createdAt": -1})
    .exec((err, messages) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Error: Server error'
            })
        } else {
            return res.send({
                success: true,
                message: 'Successfully got messages',
                results: messages
            })
        }
    })

})

module.exports = router;