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

exports.deleteFeedback = async (req, res) => {
    const feedbackId = req.params.id;
    try {
        await Feedback.findByIdAndDelete(feedbackId);
        res.status(200).json({ message: 'Feedback deleted successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while deleting feedback.' });
    }
};
