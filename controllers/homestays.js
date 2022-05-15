const Homestay = require('../models/homestay');


module.exports.index = async(req, res) => {
    const homestays = await Homestay.find({});
    res.render('homestays/index', { homestays });
}

module.exports.renderNewForm = (req, res) => {
    res.render('homestays/new');
}

module.exports.createHomestay = async(req, res, next) => {
    const homestay = new Homestay(req.body.homestay);
    homestay.author = req.user._id;
    await homestay.save();
    req.flash('success', 'Successfully made a new homestay!');
    res.redirect(`/homestays/${homestay._id}`);
}

module.exports.showHomestay = async(req, res) => {
    const homestay = await Homestay.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!homestay) {
        req.flash('error', 'Cannot find that homestay!');
        return res.redirect('/homestays');
    }
    res.render('homestays/show', { homestay });
}

module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const homestay = await Homestay.findById(id);
    if (!homestay) {
        req.flash('error', 'Cannot find that homestay!');
        return res.redirect('/homestays');
    }
    res.render('homestays/edit', { homestay });
}

module.exports.updateHomestay = async(req, res) => {
    const { id } = req.params;
    const homestay = await Homestay.findByIdAndUpdate(id, {...req.body.homestay });
    req.flash('success', 'Successfully updated homestay!');
    res.redirect(`/homestays/${homestay._id}`);
}

module.exports.deleteHomestay = async(req, res) => {
    const { id } = req.params;
    await Homestay.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted homestay!');
    res.redirect('/homestays');
}