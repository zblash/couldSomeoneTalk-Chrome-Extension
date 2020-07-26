import React from "react";
import styled from "styled-components";

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;
const StyledParticipantWrapper = styled.div`
  width: 100%;
`;
const StyledExcludedCheckBox = styled.input`
  margin: 6px 0 6px 6px;
  width: 18px;
  height: 18px;
`;
const StyledGetUsersBtn = styled.button`
  background-color: #1ed760;
  border: none;
  color: #fff;
  font-size: 12px;
  line-height: 1;
  border-radius: 500px;
  cursor: pointer;
  width: 40%;
  height: 30px;
  :disabled {
    background-color: #ddd;
    color: #000;
  }
`;

const IndexPage = () => {
  const [port, setPort] = React.useState();
  const [participants, setParticipants] = React.useState([]);
  const [excludedParticipants, setExcludedParticipants] = React.useState([]);

  const onBackgroundMessage = React.useCallback((message) => {
    if (message.type === "PARTICIPANT_LIST") {
      setParticipants(message.participants);
    }
  }, []);

  const handleGetParticipants = React.useCallback(() => {
    port.postMessage({ type: "GET_PARTICIPANTS" });
  }, [port]);

  const handleSelect = React.useCallback(
    (e) => {
      const { id } = e.target;
      if (e.target.checked) {
        setExcludedParticipants((oldArray) => [...oldArray, id]);
      } else {
        setExcludedParticipants(
          excludedParticipants.filter((item) => item !== id)
        );
      }
    },
    [excludedParticipants]
  );

  const handleGetTalkOrder = React.useCallback(() => {
    console.log(participants);
    port.postMessage({
      type: "ORDER_TALK",
      excludedParticipants,
      participants,
    });
  }, [port, participants, excludedParticipants]);

  React.useEffect(() => {
    setPort(window.chrome.extension.connect({ name: "couldSomeoneTalk" }));
  }, []);

  React.useEffect(() => {
    if (port) {
      port.onMessage.addListener(onBackgroundMessage);
    }
  }, [port]);

  return (
    <StyledWrapper>
      {(!participants || participants.length < 1) && (
        <StyledGetUsersBtn onClick={handleGetParticipants}>
          Get Participants
        </StyledGetUsersBtn>
      )}
      {participants &&
        participants.map((participant) => (
          <StyledParticipantWrapper key={`${participant}-wrp`}>
            <StyledExcludedCheckBox
              onChange={handleSelect}
              id={participant}
              type="checkbox"
            />
            <label htmlFor={`${participant}-exc`}>{participant}</label>
          </StyledParticipantWrapper>
        ))}
      {participants && participants.length > 0 && (
        <StyledGetUsersBtn onClick={handleGetTalkOrder}>
          Get Talk Order
        </StyledGetUsersBtn>
      )}
    </StyledWrapper>
  );
};

export default React.memo(IndexPage);
