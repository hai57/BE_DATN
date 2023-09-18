const {Notification} = require('../models/notificationModels')

const createNotification = async (req, res) => {
  try {
    const newNotification = new Notification({
      user: req.userId,
      title : req.body.title,
      content: req.body.content,
    });
    await newNotification.save();
    res.status(200).json(newNotification);
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error at createNotification' });
  }
};
const getNotificationsForUser = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.userId });
    res.status(200).json(notifications);
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error at getNotificationsForUser' });
  }
};
const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.notiId;
    const notification = await Notification.findById(notificationId);
    if(!notification) {
      return res.status(404).json({message: 'Notification not found'})
    }
    notification.isRead = true;
    await notification.save();
    res.status(200).json(notification);
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error at markNotificationAsRead' });
  }
};
module.exports = {createNotification,getNotificationsForUser,markNotificationAsRead}
