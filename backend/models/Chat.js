import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  subject: String,
  messages: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      sentAt: { type: Date, default: Date.now },
      metadata: mongoose.Schema.Types.Mixed,
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

chatSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
