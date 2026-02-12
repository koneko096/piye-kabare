import React from 'react';
import { Actions } from 'react-native-gifted-chat';
import chatUtils from '../utils/chat';

const ChatActions = (props) => {
    const { roomId, friends, navigation, onAddMember, onKickMember, socket } = props;

    const handleRemoveMember = () => {
        chatUtils.findMember(socket, roomId);
        socket.once('find_member_resp', (resp) => {
            navigation.navigate('ContactList', {
                dataSource: chatUtils.formatFriendList(resp),
                onClick: onKickMember
            });
        });
    };

    const options = {
        'Add member': () => {
            navigation.navigate('ContactList', {
                dataSource: friends,
                onClick: onAddMember
            });
        },
        'Remove member': handleRemoveMember,
        'Cancel': () => { },
    };

    return <Actions {...props} options={options} />;
};

export default ChatActions;
