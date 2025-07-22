import React, { useEffect, useState } from 'react';
import TeamList from './TeamList';
import TeamListMobile from './TeamListMobile';

const MOBILE_MAX_WIDTH = 768;

const ResponsiveTeamList: React.FC<{ onMobileChange?: (isMobile: boolean) => void }> = ({ onMobileChange }) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_MAX_WIDTH);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth <= MOBILE_MAX_WIDTH;
            setIsMobile(mobile);
            if (onMobileChange) onMobileChange(mobile);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, [onMobileChange]);

    return isMobile ? (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100%' }}>
            <TeamListMobile backgroundColor="#181818" />
            <div style={{ flex: 1, background: '#000', width: '100%' }} />
        </div>
    ) : (
        <TeamList />
    );
};

export default ResponsiveTeamList; 