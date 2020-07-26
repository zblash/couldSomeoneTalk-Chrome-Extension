let port;

const shuffle = (array) => {
  let i = array.length;
  while (i--) {
    const ri = Math.floor(Math.random() * (i + 1));
    [array[i], array[ri]] = [array[ri], array[i]];
  }
  return array;
};

const getParticipantsDom = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: "GET_PARTICIPANTS_DOM" },
      function (response) {
        port.postMessage({
          type: "PARTICIPANT_LIST",
          participants: response,
        });
      }
    );
  });
};

const writeToRoom = (participantsStr) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: "WRITE_ROOM", str: participantsStr },
      function (response) {
        console.log(response);
      }
    );
  });
};

chrome.runtime.onConnect.addListener((messagePort) => {
  port = messagePort;
  port.onMessage.addListener((msg) => {
    if (msg.type === "GET_PARTICIPANTS") {
      getParticipantsDom();
    }

    if (msg.type === "ORDER_TALK") {
      const participants = shuffle(
        msg.participants.filter((p) => !msg.excludedParticipants.includes(p))
      );

      writeToRoom(participants.join("\n"));
    }
  });
});
