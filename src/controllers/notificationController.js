import { Notification } from '@/models/notificationModels.js';
import { status } from '@/constant/status.js';
import { message } from '@/constant/message.js';

const createNotification = async (req, res) => {
  try {
    const newNotification = new Notification({
      user: req.userId,
      title : req.body.title,
      content: req.body.content,
    });
    await newNotification.save();
    res.status(status.CREATED).json(newNotification);
  } catch (err) {
    console.error(err)
    res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

const getNotificationsForUser = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.userId });
    res.status(status.OK).json({ message: message.OK, notifications });
  } catch (err) {
    console.error(err)
    res.status(status.ERROR).json({ message: 'Server error at getNotificationsForUser' });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.notiId;
    const notification = await Notification.findById(notificationId);
    if(!notification) {
      return res.status(status.NOT_FOUND).json({ message: message.ERROR.NOT_FOUND })
    }
    notification.isRead = true;
    await notification.save();
    res.status(status.OK).json({ message: message.OK, notification });
  } catch (err) {
    res.status(status.ERROR).json({ message: message.ERROR.SERVER });
  }
};

export { createNotification,getNotificationsForUser,markNotificationAsRead }
