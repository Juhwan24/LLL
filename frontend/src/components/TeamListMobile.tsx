import React, { useEffect, useRef } from 'react';

type Team = {
    id: number;
    name: string;
};

type Props = {
    onBottomChange?: (bottom: number) => void;
    backgroundColor?: string;
};

const TeamListMobile: React.FC<Props> = ({ onBottomChange, backgroundColor = '#181818' }) => {
    const [teams, setTeams] = React.useState<Team[]>([]);
    const [selectedTeamId, setSelectedTeamId] = React.useState<number | null>(1);
    const [hoverId, setHoverId] = React.useState<number | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // 테스트용 더미 데이터
        const dummyTeams = [
            { id: 1, name: "개발팀" },
            { id: 2, name: "디자인팀" },
            { id: 3, name: "마케팅팀" }
        ];
        setTeams(dummyTeams);
    }, []);

    // 하단 위치 계산 및 전달
    useEffect(() => {
        function reportBottom() {
            if (ref.current && onBottomChange) {
                const rect = ref.current.getBoundingClientRect();
                onBottomChange(rect.bottom);
            }
        }
        reportBottom();
        window.addEventListener('resize', reportBottom);
        return () => window.removeEventListener('resize', reportBottom);
    }, [onBottomChange]);

    const selectedTeam = teams.find(t => t.id === selectedTeamId);

    return (
        <div
            ref={ref}
            style={{
                width: '100%',
                height: 72,
                background: backgroundColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 16px',
                boxSizing: 'border-box',
                position: 'relative',
                borderBottom: '1px solid #222',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'left', width: '100%', justifyContent: 'left' }}>
                {teams.map((team) => {
                    const isSelected = selectedTeamId === team.id;
                    let circleBg = isSelected ? '#ffce99' : (hoverId === team.id ? '#666' : '#222');
                    let textColor = '#fff';
                    let fontWeight = isSelected ? 700 : 500;
                    let border = isSelected ? '2px solid #FF9931' : '2px solid transparent';
                    return (
                        <button
                            key={team.id}
                            onClick={() => setSelectedTeamId(team.id)}
                            onMouseEnter={() => setHoverId(team.id)}
                            onMouseLeave={() => setHoverId(null)}
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                background: circleBg,
                                color: textColor,
                                fontWeight: fontWeight,
                                fontSize: 22,
                                margin: '0 8px',
                                border: border,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                outline: 'none',
                                transition: 'background 0.2s, border 0.2s',
                            }}
                        >
                            {team.name[0]}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default TeamListMobile; 