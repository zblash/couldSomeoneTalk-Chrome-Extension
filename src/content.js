function ParticipantsDOM() {
  this.participants = Array.from(
    document.getElementsByClassName("displayName")
  );
}

ParticipantsDOM.prototype = {
  constructor: ParticipantsDOM,
  getTextFromDOM: function () {
    this.participants = this.participants.map((p) => p.innerHTML);
    return this;
  },

  clearText: function () {
    this.participants = this.participants.map((p) => p.replace("(me)", ""));
    return this;
  },

  send: function () {
    return this.participants;
  },
};

function WriteToRoom(str) {
  this.textBtn = Array.from(
    document.getElementsByClassName("toolbox-button")
  ).find((d) => d.ariaLabel === "Toggle chat window");
  this.textBox;
  this.str = str;
}

WriteToRoom.prototype = {
  constructor: WriteToRoom,
  click: function () {
    this.textBtn.click();
    return this;
  },

  getTextBox: function () {
    this.textBox = document.getElementById("usermsg");
    return this;
  },

  write: function () {
    console.log(this);
    this.textBox.value = this.str;
  },
};

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.type === "GET_PARTICIPANTS_DOM") {
    const getParticipantsDOM = new ParticipantsDOM();
    sendResponse(getParticipantsDOM.getTextFromDOM().clearText().send());
  }

  if (msg.type === "WRITE_ROOM") {
    console.log(msg.str);
    const writeResult = new WriteToRoom(msg.str);
    writeResult.click().getTextBox().write();
  }
});
