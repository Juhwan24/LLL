import { useEffect, useState } from 'react';
import ResponsiveTeamList from '../../../components/ResponsiveTeamList';
import ChatBot from '../../../components/ChatBot';
import ChatBotFloatingButton from '../../../components/ChatBotFloatingButton';
import type { FC } from 'react';

const MOBILE_MAX_WIDTH = 768;

const EmployerMain: FC = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_MAX_WIDTH);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= MOBILE_MAX_WIDTH);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'row', width: '100vw', height: '100vh', background: '#000' }}>
            <div style={{ width: isMobile ? '100vw' : 270, background: '#181818', height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <ResponsiveTeamList onMobileChange={setIsMobile} />
                {isMobile && <div style={{ flex: 1, background: '#000' }} />}
                {isMobile && <ChatBotFloatingButton />}
            </div>
            {!isMobile && (
                <>
                    <div style={{ width: '100%', height: '100vh', background: '#000' }} />
                    <ChatBot />
                </>
            )}
        </div>
    );
};

export default EmployerMain;