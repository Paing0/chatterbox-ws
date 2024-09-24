const format = (username, message) => {
  return {
    username,
    message,
    send_at: Date.now(),
  };
};

export default format;
