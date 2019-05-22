import React, { useState } from 'react';
import { connect } from 'react-redux';
import SW from './Discuss.swiss';
import CardHeader from 'src/react/_components/Card/Header/CardHeader';
import DiscussionList from 'src/react/Discussion/List/DiscussionList';
import DiscussionOverview from 'src/react/Discussion/Overview/DiscussionOverview';
import CardContent from 'src/react/_components/Card/Content/CardContent';
import ModalCreate from 'src/react/Modal/Create/ModalCreate';
import useNav from 'src/react/_hooks/useNav';
import useMyId from 'core/react/_hooks/useMyId';
import CreateTeamModal from '_shared/CreateTeamModal/CreateTeamModal';
import Button from '_shared/Button/Button';

const sizes = [800, 910];
export default connect(state => ({
  teams: state.teams,
  selectedTeamId: state.main.get('selectedTeamId')
}))(Discuss);
function Discuss({ teams, selectedTeamId }) {
  const myId = useMyId();
  const nav = useNav();
  const [tabs, handleChangeTabs] = useState(['Following', 'All other']);
  const [tabIndex, handleChangeTabIndex] = useState(0);
  const [selectedId, handleChangeSelectedId] = useState(null);

  const handleTabChange = i => {
    if (i !== tabIndex) {
      handleChangeTabIndex(i);
      selectDiscussionId(null);
    }
  };
  const handleNewDiscussion = () => {
    nav.openModal(ModalCreate, {
      type: 'discussion'
    });
  };
  const selectDiscussionId = selectedId => {
    handleChangeSelectedId(selectedId);
  };
  const onSelectItemId = id => {
    if (id !== selectedId) {
      selectDiscussionId(id);
    }
  };
  const renderLeftHeader = () => {
    return (
      <SW.LeftHeaderWrapper>
        <CardHeader title="Chat" teamPicker separator showUnreadCounter>
          {selectedTeamId !== myId && (
            <Button onClick={handleNewDiscussion} icon="CircledPlus" />
          )}
        </CardHeader>
      </SW.LeftHeaderWrapper>
    );
  };

  const renderCreateTeamModal = () => {
    nav.openModal(CreateTeamModal, {
      clickDisabled: true
    });
  };

  const openTeamCreate = () => {
    nav.push({
      screenId: 'TeamCreate',
      crumbTitle: 'TeamCreate'
    });
  };

  let type = 'following';
  if (tabIndex === 1) {
    type = 'all other';
  }

  return (
    <SW.ParentWrapper>
      <SW.LeftSide>
        <CardContent header={renderLeftHeader()} noframe>
          <DiscussionList
            key={type}
            type={type}
            selectedId={selectedId}
            onSelectItemId={onSelectItemId}
          />
        </CardContent>
      </SW.LeftSide>
      <SW.RightSide viewWidth={nav.width}>
        {teams.size > 0 && selectedTeamId === myId && (
          <SW.EmptyState
            title={`Chats are better when there's someone to talk to`}
            description={`Create a team and invite your colleagues to start collaborating!`}
          >
            <SW.EmptyStateButtonWrapper>
              <Button
                title="Create team"
                green={true}
                onClick={() => {
                  openTeamCreate();
                }}
              />
            </SW.EmptyStateButtonWrapper>
          </SW.EmptyState>
        )}
        {selectedId && (
          <DiscussionOverview key={selectedId} discussionId={selectedId} />
        )}
      </SW.RightSide>
      {teams.size === 0 ? renderCreateTeamModal() : null}
    </SW.ParentWrapper>
  );
}
