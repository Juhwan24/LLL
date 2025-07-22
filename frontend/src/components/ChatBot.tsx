import React, { useState } from 'react';

const ChatBot: React.FC = () => {
    const [input, setInput] = useState('');
    // 채팅 메시지 상태 등은 필요시 추가

    return (
        <div
            style={{
                width: 480,
                height: '100vh',
                background: '#181818',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                borderLeft: '1.5px solid #222',
                position: 'relative',
            }}
        >
            {/* 채팅 내용 영역 (추후 메시지 리스트 등 추가) */}
            <div style={{ width: '100%', flex: 1 }} />
            {/* 입력창 영역 */}
            <div
                style={{
                    width: '100%',
                    padding: 16,
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    background: 'transparent',
                }}
            >
                <input
                    style={{
                        flex: 1,
                        height: 48,
                        borderRadius: 10,
                        border: '2px solid #444',
                        background: '#222',
                        color: '#ccc',
                        fontSize: 20,
                        paddingLeft: 16,
                        marginRight: 8,
                        outline: 'none',
                    }}
                    placeholder="Ask me anything"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                />
                <button
                    style={{
                        width: 48,
                        height: 48,
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#222',
                    }}
                    // onClick={handleSend} // 추후 전송 기능 구현
                >
                    ▶
                </button>
            </div>
        </div>
    );
};

export default ChatBot;
