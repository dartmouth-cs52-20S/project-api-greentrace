import Message from '../models/message-model';

// for testing with POST /api/user/:id/messages
export const addMessageAPI = (req, res) => {
  const newMessage = new Message();
  newMessage.covid = req.body.covid;
  newMessage.tested = req.body.tested;
  newMessage.contactDate = req.body.contactDate;
  newMessage.userID = req.params.id;
  newMessage.save()
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const addMessage = (req, res) => {
  console.log('in ADDMESSAGE', req);
  const newMessage = new Message();
  newMessage.covid = req.covid;
  newMessage.tested = req.tested;
  newMessage.contactDate = Number(req.contactDate);
  newMessage.userID = req.userID;
  newMessage.save()
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      // res.status(500).json({ error });
    });
};

export const getMessages = (req, res) => {
  return Message.find({ userID: req.params.id })
  // eslint-disable-next-line consistent-return
    .then((messages) => {
      return res.send(messages);
    })
    .catch((error) => {
      return res.status(500).send({ error });
    });
};
