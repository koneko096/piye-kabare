import React from 'react';
import { Bubble } from 'react-native-gifted-chat';

const ChatBubble = (props) => (
    <Bubble
        {...props}
        wrapperStyle={{
            left: {
                backgroundColor: '#f0f0f0',
            }
        }}
    />
);

export default ChatBubble;
