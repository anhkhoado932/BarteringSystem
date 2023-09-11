const Feedback = require('../models/feedback');

exports.postFeedback = async (req, res) => {
    try {
        const feedback = new Feedback(req.body);
        await feedback.save();

        res.render('feedback-success');
    } catch (error) {
        console.error('Error saving feedback:', error);
        res.status(500).send('Internal Server Error');
    }
};
