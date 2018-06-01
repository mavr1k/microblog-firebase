class FirestoreService {
  static getBlogs(db) {
    return db.collection('blogs')
      .orderBy('timeStamp', 'desc')
      .get()
      .then(array => array.docs.map(el => el.data()));
  }
  static onBlogsChange(db) {
    return db.collection('blogs').orderBy('timeStamp', 'desc');
  }
  static onBlogsChangeByEmail(db, email) {
    return db.collection('blogs')
      .where('author', '==', email)
      .orderBy('timeStamp', 'desc');
  }
  static getUsers(db) {
    return db.collection('users').get().then(array => array.docs.map(el => el.data()));
  }
  static postMessage(db, message, reply, email) {
    const obj = {
      timeStamp: new Date(),
      body: message,
      author: email
    };
    if (reply) {
      obj.replyTo = db.collection('blogs').doc(reply);
    }
    return db.collection('blogs').add(obj);
  }
  static addUser(db, user) {
    return db.collection('users').add(user);
  }
  static findUserByEmail(db, email) {
    return db.collection('users')
      .where('email', '==', email)
      .get()
      .then(el => (el.docs[0] ? el.docs[0].data() : null));
  }
  static deleteMessage(db, id) {
    return db.collection('blogs').doc(id).delete();
  }
  static onReplyChange(db, postId) {
    return db.collection('blogs')
      .where('replyTo', '==', db.collection('blogs').doc(postId))
      .orderBy('timeStamp', 'desc');
  }
  static likePost(db, currentEmail, id) {
    return db.collection('blogs')
      .doc(id)
      .get()
      .then((post) => {
        const data = post.data();
        if (!Array.isArray(data.likes)) {
          data.likes = [];
        }
        const likeIndex = data.likes.findIndex(el => el === currentEmail);
        if (likeIndex > -1) {
          data.likes.splice(likeIndex, 1);
        } else {
          data.likes.push(currentEmail);
        }
        return post.ref.set(data);
      });
  }
}

export default FirestoreService;
