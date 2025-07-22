import React, { useState } from 'react';

interface ChatBotFloatingButtonProps {
    buttonColor?: string;
    bottomOffset?: number;
}

const ChatBotFloatingButton: React.FC<ChatBotFloatingButtonProps> = ({ buttonColor, bottomOffset = 24 }) => {
    const [open, setOpen] = useState(false);
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

    return (
        <>
            {open && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: bottomOffset + 66, // 버튼 위에 뜨도록
                        right: isMobile ? 24 : 24,
                        left: isMobile ? 24 : 'auto',
                        width: isMobile ? 'calc(100vw - 48px)' : 320,
                        maxWidth: isMobile ? 'calc(100vw - 48px)' : 320,
                        height: isMobile ? '60vh' : 420,
                        background: '#222',
                        borderRadius: isMobile ? '20px 20px 0 0' : 20,
                        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                        zIndex: 1001,
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        animation: 'fadeIn 0.2s',
                    }}
                >
                    {/* 여기에 챗봇 대화 UI 삽입 */}
                    <div style={{ flex: 1, padding: 16, color: '#fff' }}>
                        <div style={{ fontWeight: 700, marginBottom: 8 }}>챗봇</div>
                        <div style={{ fontSize: 14, color: '#ccc' }}>[여기에 대화 내용이 표시됩니다]</div>
                    </div>
                </div>
            )}
            <button
                onClick={() => setOpen(o => !o)}
                style={{
                    position: 'fixed',
                    bottom: bottomOffset,
                    right: 24,
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: buttonColor || '#FF9931',
                    color: '#fff',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 32,
                    cursor: 'pointer',
                    zIndex: 1002,
                }}
                aria-label="챗봇 열기"
            >
                💬
            </button>
        </>
    );
};

export default ChatBotFloatingButton; 