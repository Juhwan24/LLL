import React, { useEffect, useState } from 'react';

type Team = {
    id: number;
    name: string;
};

const BUTTON_HEIGHT = 64;
const BUTTON_MARGIN = 24;

const TeamList: React.FC = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState<number | null>(1);
    const [hoverId, setHoverId] = useState<number | null>(null);

    useEffect(() => {
        // 테스트용 더미 데이터
        const dummyTeams = [
            { id: 1, name: "개발팀" },
            { id: 2, name: "디자인팀" },
            { id: 3, name: "마케팅팀" }
        ];
        setTeams(dummyTeams);
    }, []);

    const selectedIndex = teams.findIndex(t => t.id === selectedTeamId);
    const listHeight = teams.length * BUTTON_HEIGHT + (teams.length - 1) * BUTTON_MARGIN;

    return (
        <div
            style={{
                width: 270,
                height: '100vh',
                background: '#181818',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: 24,
                paddingLeft: 24,
                paddingRight: 24,
                boxSizing: 'border-box',
            }}
        >
            <div style={{ position: 'relative', width: 230, height: listHeight }}>
                {selectedIndex !== -1 && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: 230,
                            height: BUTTON_HEIGHT,
                            borderRadius: 10,
                            background: '#FF9931',
                            transform: `translateY(${selectedIndex * (BUTTON_HEIGHT + BUTTON_MARGIN)}px)`,
                            zIndex: 1,
                        }}
                    />
                )}
                {teams.map((team) => {
                    let bg = 'transparent';
                    let circleBg = '#222';
                    let textColor = '#fff';
                    let fontWeight = 500;
                    if (hoverId === team.id && selectedTeamId !== team.id) {
                        bg = '#333';
                        circleBg = '#666';
                        textColor = '#FFF';
                        fontWeight = 600;
                    } else if (selectedTeamId === team.id) {
                        bg = '#FF9931';
                        circleBg = '#ffce99';
                        textColor = '#fff';
                        fontWeight = 500;
                    }
                    return (
                        <button
                            key={team.id}
                            onClick={() => setSelectedTeamId(team.id)}
                            onMouseEnter={() => setHoverId(team.id)}
                            onMouseLeave={() => setHoverId(null)}
                            style={{
                                width: 230,
                                height: BUTTON_HEIGHT,
                                marginBottom: BUTTON_MARGIN,
                                borderRadius: 10,
                                border: 'none',
                                background: bg,
                                color: textColor,
                                fontSize: 28,
                                fontWeight: fontWeight,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'left',
                                cursor: 'pointer',
                                outline: 'none',
                                paddingLeft: 12,
                                position: 'relative',
                                opacity: selectedTeamId === team.id ? 1 : 0.4,
                                zIndex: 2,
                            }}
                        >
                            <span
                                style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    background: circleBg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#fff',
                                    fontWeight: 700,
                                    fontSize: 22,
                                    marginRight: 12,
                                    flexShrink: 0,
                                    overflow: 'hidden',
                                }}
                            >
                                {team.name[0]}
                            </span>
                            <span
                                style={{
                                    flex: 1,
                                    textAlign: 'center',
                                    fontSize: 24,
                                    fontWeight: 400,
                                }}
                            >
                                {team.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default TeamList;