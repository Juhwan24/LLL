"""
마스터 태그 시스템
HR 역량 모델 기반 표준화된 태그 정의 및 관리
"""
from typing import Dict, List, Optional
from dataclasses import dataclass
from enum import Enum

class TagCategory(Enum):
    """태그 카테고리"""
    TASK_EXECUTION = "업무수행"
    INTERPERSONAL = "대인관계"
    PERSONAL_ATTRIBUTES = "개인성향"
    LEADERSHIP = "리더십"

@dataclass
class TagDefinition:
    """태그 정의 클래스"""
    keyword: str
    category: TagCategory
    definition: str
    positive_keywords: List[str]
    negative_keywords: List[str]
    examples_positive: List[str]
    examples_negative: List[str]

class MasterTagSystem:
    """마스터 태그 시스템 관리 클래스"""
    
    def __init__(self):
        self._tags = self._initialize_master_tags()
        self._keyword_to_tag = {tag.keyword: tag for tag in self._tags}
    
    def _initialize_master_tags(self) -> List[TagDefinition]:
        """마스터 태그 리스트 초기화"""
        return [
            # ===== 업무 수행 (Task Execution) =====
            TagDefinition(
                keyword="#문제해결능력",
                category=TagCategory.TASK_EXECUTION,
                definition="복잡한 문제의 원인을 파악하고 효과적인 해결책을 제시하는 역량",
                positive_keywords=["문제해결", "분석", "원인파악", "해결방안", "대안제시", "체계적", "논리적"],
                negative_keywords=["문제파악못함", "해결책부족", "분석부족", "논리부족"],
                examples_positive=[
                    "복잡한 이슈를 체계적으로 분석해서 해결 방안을 제시했습니다",
                    "문제의 근본 원인을 찾아내어 효과적으로 해결했어요",
                    "어려운 상황에서도 논리적으로 접근해서 대안을 만들어냈습니다"
                ],
                examples_negative=[
                    "문제 상황에서 원인 분석이 부족했습니다",
                    "해결 방안을 제시하는데 어려움이 있었어요"
                ]
            ),
            
            TagDefinition(
                keyword="#실행력",
                category=TagCategory.TASK_EXECUTION,
                definition="계획된 일을 끝까지 책임지고 완수해내는 능력",
                positive_keywords=["완수", "끝까지", "책임", "실행", "추진력", "완료", "성취"],
                negative_keywords=["미완료", "중도포기", "실행부족", "마무리부족"],
                examples_positive=[
                    "맡은 업무를 끝까지 책임지고 완수했습니다",
                    "어려운 상황에서도 포기하지 않고 목표를 달성했어요",
                    "계획한 일을 확실하게 실행해내는 추진력이 뛰어납니다"
                ],
                examples_negative=[
                    "업무 마무리가 아쉬운 부분이 있었습니다",
                    "실행력 측면에서 보완이 필요해 보입니다"
                ]
            ),
            
            TagDefinition(
                keyword="#꼼꼼함",
                category=TagCategory.TASK_EXECUTION,
                definition="디테일을 놓치지 않고 업무의 완성도를 높이는 성향",
                positive_keywords=["세심", "정확", "체크", "확인", "디테일", "완벽", "꼼꼼", "세밀"],
                negative_keywords=["실수", "누락", "대충", "부정확", "실수많음"],
                examples_positive=[
                    "세부사항까지 놓치지 않고 꼼꼼하게 체크했습니다",
                    "정확한 작업으로 완성도 높은 결과물을 만들어냈어요",
                    "디테일한 부분까지 신경써서 업무를 처리합니다"
                ],
                examples_negative=[
                    "가끔 실수나 누락이 있어서 아쉬웠습니다",
                    "세심함 부분에서 조금 더 신경쓰면 좋겠어요"
                ]
            ),
            
            TagDefinition(
                keyword="#업무속도",
                category=TagCategory.TASK_EXECUTION,
                definition="주어진 시간 안에 효율적으로 과업을 처리하는 능력",
                positive_keywords=["빠른", "신속", "효율적", "속도", "빠름", "신속처리", "효율"],
                negative_keywords=["느린", "지연", "늦음", "비효율", "속도부족"],
                examples_positive=[
                    "업무 처리 속도가 빠르고 효율적입니다",
                    "주어진 데드라인 내에 신속하게 처리해냈어요",
                    "빠른 업무 속도로 팀 전체 일정에 도움이 되었습니다"
                ],
                examples_negative=[
                    "업무 속도 측면에서 개선이 필요해 보입니다",
                    "좀 더 빠른 처리가 가능할 것 같아요"
                ]
            ),
            
            TagDefinition(
                keyword="#기획력",
                category=TagCategory.TASK_EXECUTION,
                definition="목표 달성을 위한 체계적인 계획과 전략을 수립하는 역량",
                positive_keywords=["기획", "계획", "전략", "체계적", "설계", "구상", "계획수립"],
                negative_keywords=["계획부족", "기획력부족", "전략부족", "체계부족"],
                examples_positive=[
                    "체계적인 계획을 세워서 프로젝트를 성공적으로 이끌었습니다",
                    "전략적 사고로 효과적인 기획안을 만들어냈어요",
                    "목표 달성을 위한 구체적인 실행 계획을 잘 수립합니다"
                ],
                examples_negative=[
                    "기획력 측면에서 좀 더 체계적인 접근이 필요해요",
                    "계획 수립 부분에서 보완이 필요합니다"
                ]
            ),
            
            TagDefinition(
                keyword="#전문성",
                category=TagCategory.TASK_EXECUTION,
                definition="자신의 직무에 대한 깊이 있는 지식과 기술",
                positive_keywords=["전문", "숙련", "전문지식", "기술력", "노하우", "경험", "깊이"],
                negative_keywords=["전문성부족", "지식부족", "경험부족", "기술부족"],
                examples_positive=[
                    "해당 분야의 전문 지식이 뛰어납니다",
                    "깊이 있는 기술력으로 고품질 결과물을 만들어냅니다",
                    "전문성을 바탕으로 팀에 도움이 되는 조언을 해줍니다"
                ],
                examples_negative=[
                    "전문성 향상을 위한 학습이 더 필요해 보입니다",
                    "기술적 깊이 부분에서 성장이 필요합니다"
                ]
            ),
            
            # ===== 대인 관계 (Interpersonal Skills) =====
            TagDefinition(
                keyword="#소통능력",
                category=TagCategory.INTERPERSONAL,
                definition="자신의 생각과 정보를 명확하고 논리적으로 전달하는 역량",
                positive_keywords=["소통", "의사소통", "설명", "전달", "커뮤니케이션", "명확", "이해하기쉽게"],
                negative_keywords=["소통부족", "설명부족", "전달력부족", "의사소통문제"],
                examples_positive=[
                    "복잡한 내용도 이해하기 쉽게 설명해줍니다",
                    "원활한 의사소통으로 팀 업무가 수월했어요",
                    "명확한 커뮤니케이션으로 오해를 방지합니다"
                ],
                examples_negative=[
                    "의사소통 부분에서 좀 더 명확하게 전달하면 좋겠어요",
                    "소통 스타일 개선이 필요해 보입니다"
                ]
            ),
            
            TagDefinition(
                keyword="#협업능력",
                category=TagCategory.INTERPERSONAL,
                definition="공동의 목표를 위해 다른 팀원들과 원활하게 협력하는 능력",
                positive_keywords=["협업", "협력", "팀워크", "함께", "공동", "협조", "조화"],
                negative_keywords=["협업부족", "개인주의", "협력부족", "팀워크부족"],
                examples_positive=[
                    "팀원들과의 협업이 매우 원활합니다",
                    "공동 목표를 위해 적극적으로 협력해줍니다",
                    "좋은 팀워크로 시너지를 만들어냅니다"
                ],
                examples_negative=[
                    "협업 측면에서 좀 더 적극적이면 좋겠어요",
                    "팀워크 부분에서 개선이 필요합니다"
                ]
            ),
            
            TagDefinition(
                keyword="#피드백",
                category=TagCategory.INTERPERSONAL,
                definition="건설적인 피드백을 주고받으며 함께 성장하려는 태도",
                positive_keywords=["피드백", "조언", "개선점", "건설적", "성장", "수용", "개방적"],
                negative_keywords=["피드백거부", "폐쇄적", "조언무시", "개선거부"],
                examples_positive=[
                    "건설적인 피드백을 잘 주고받습니다",
                    "조언을 받아들이고 개선하려는 자세가 좋습니다",
                    "동료에게 도움이 되는 피드백을 적절히 제공합니다"
                ],
                examples_negative=[
                    "피드백 수용 부분에서 개선이 필요해요",
                    "좀 더 개방적인 자세로 조언을 받아들이면 좋겠습니다"
                ]
            ),
            
            TagDefinition(
                keyword="#갈등관리",
                category=TagCategory.INTERPERSONAL,
                definition="팀 내 의견 충돌이나 갈등 상황을 원만하게 해결하는 능력",
                positive_keywords=["갈등해결", "중재", "조율", "원만", "화합", "중간역할", "해결사"],
                negative_keywords=["갈등조장", "중재부족", "해결능력부족", "갈등회피"],
                examples_positive=[
                    "팀 내 갈등 상황을 원만하게 해결해줍니다",
                    "의견 차이가 있을 때 좋은 중재 역할을 합니다",
                    "갈등을 건설적인 방향으로 해결하는 능력이 뛰어납니다"
                ],
                examples_negative=[
                    "갈등 상황 대처 능력 향상이 필요합니다",
                    "좀 더 적극적인 갈등 해결 자세가 필요해요"
                ]
            ),
            
            # ===== 개인 성향/태도 (Personal Attributes) =====
            TagDefinition(
                keyword="#책임감",
                category=TagCategory.PERSONAL_ATTRIBUTES,
                definition="맡은 업무를 자신의 일처럼 여기고 끝까지 완수하려는 태도",
                positive_keywords=["책임감", "책임", "의무감", "주인의식", "맡은일", "신뢰"],
                negative_keywords=["책임감부족", "무책임", "회피", "떠넘기기"],
                examples_positive=[
                    "맡은 업무에 대한 책임감이 매우 강합니다",
                    "자신의 일처럼 여기고 끝까지 책임져줍니다",
                    "신뢰할 수 있는 책임감 있는 동료입니다"
                ],
                examples_negative=[
                    "책임감 부분에서 좀 더 개선이 필요해요",
                    "맡은 일에 대한 책임의식 향상이 필요합니다"
                ]
            ),
            
            TagDefinition(
                keyword="#적극성",
                category=TagCategory.PERSONAL_ATTRIBUTES,
                definition="주어진 일 이상으로, 주도적으로 업무를 찾아서 하려는 태도",
                positive_keywords=["적극적", "주도적", "능동적", "자발적", "진취적", "앞장서는"],
                negative_keywords=["소극적", "수동적", "뒤처짐", "의존적", "수동"],
                examples_positive=[
                    "업무에 매우 적극적이고 주도적입니다",
                    "능동적으로 일을 찾아서 하는 자세가 좋습니다",
                    "진취적인 태도로 팀에 활력을 불어넣습니다"
                ],
                examples_negative=[
                    "좀 더 적극적인 자세가 필요해 보입니다",
                    "주도적인 업무 수행이 필요합니다"
                ]
            ),
            
            TagDefinition(
                keyword="#성실함",
                category=TagCategory.PERSONAL_ATTRIBUTES,
                definition="꾸준하고 진솔한 자세로 업무에 임하는 태도",
                positive_keywords=["성실", "꾸준", "진실", "정직", "신중", "성실함"],
                negative_keywords=["불성실", "일관성부족", "성의없음", "대충"],
                examples_positive=[
                    "매우 성실하고 꾸준한 자세로 업무에 임합니다",
                    "진솔하고 정직한 태도가 믿음직스럽습니다",
                    "꾸준함과 성실함이 돋보이는 동료입니다"
                ],
                examples_negative=[
                    "성실함 부분에서 좀 더 일관성이 필요해요",
                    "업무 태도의 성실성 향상이 필요합니다"
                ]
            ),
            
            TagDefinition(
                keyword="#성장지향",
                category=TagCategory.PERSONAL_ATTRIBUTES,
                definition="현재에 안주하지 않고, 배우고 발전하려는 의지",
                positive_keywords=["성장", "학습", "발전", "개선", "향상", "배움", "도전"],
                negative_keywords=["안주", "현상유지", "학습부족", "발전의지부족"],
                examples_positive=[
                    "끊임없이 배우고 성장하려는 의지가 강합니다",
                    "새로운 것을 배우는데 적극적이고 열정적입니다",
                    "자기 발전을 위해 지속적으로 노력하는 모습이 좋습니다"
                ],
                examples_negative=[
                    "성장 의지 부분에서 더 적극적이면 좋겠어요",
                    "학습과 발전에 대한 관심이 더 필요합니다"
                ]
            ),
            
            # ===== 리더십/영향력 (Leadership/Influence) =====
            TagDefinition(
                keyword="#리더십",
                category=TagCategory.LEADERSHIP,
                definition="공식적인 직책과 상관없이, 팀의 목표 달성을 위해 긍정적인 영향력을 발휘하는 능력",
                positive_keywords=["리더십", "이끌어감", "방향제시", "결정력", "판단력", "영향력"],
                negative_keywords=["리더십부족", "방향성부족", "결정력부족", "영향력부족"],
                examples_positive=[
                    "팀을 올바른 방향으로 이끌어가는 리더십이 뛰어납니다",
                    "어려운 상황에서도 팀을 이끌어가는 능력이 있습니다",
                    "자연스럽게 팀원들에게 긍정적인 영향을 미칩니다"
                ],
                examples_negative=[
                    "리더십 발휘 부분에서 성장이 필요합니다",
                    "팀을 이끄는 능력 향상이 필요해요"
                ]
            ),
            
            TagDefinition(
                keyword="#동기부여",
                category=TagCategory.LEADERSHIP,
                definition="자신과 동료들에게 긍정적인 자극을 주어 열의를 이끌어내는 능력",
                positive_keywords=["동기부여", "격려", "의욕", "에너지", "열정", "자극", "영감"],
                negative_keywords=["동기부여부족", "의욕저하", "에너지부족", "부정적영향"],
                examples_positive=[
                    "팀원들에게 좋은 동기부여를 제공합니다",
                    "긍정적인 에너지로 팀 분위기를 좋게 만듭니다",
                    "동료들의 의욕을 높이는 능력이 뛰어납니다"
                ],
                examples_negative=[
                    "동기부여 제공 능력 향상이 필요합니다",
                    "팀원들에게 더 긍정적인 영향을 미치면 좋겠어요"
                ]
            ),
            
            TagDefinition(
                keyword="#멘토링",
                category=TagCategory.LEADERSHIP,
                definition="자신의 지식과 경험을 동료에게 공유하여 성장을 돕는 행동",
                positive_keywords=["멘토링", "가르침", "공유", "도움", "지원", "조언", "코칭"],
                negative_keywords=["멘토링부족", "공유부족", "도움부족", "이기적"],
                examples_positive=[
                    "후배들을 잘 가르치고 도와주는 멘토링 능력이 뛰어납니다",
                    "자신의 지식과 경험을 아낌없이 공유해줍니다",
                    "동료들의 성장을 위해 적극적으로 도움을 줍니다"
                ],
                examples_negative=[
                    "멘토링 역할 수행이 더 필요해 보입니다",
                    "지식 공유를 좀 더 적극적으로 하면 좋겠어요"
                ]
            )
        ]
    
    def get_all_tags(self) -> List[TagDefinition]:
        """모든 태그 정의 반환"""
        return self._tags
    
    def get_tag_keywords(self) -> List[str]:
        """모든 태그 키워드 리스트 반환"""
        return [tag.keyword for tag in self._tags]
    
    def get_tag_by_keyword(self, keyword: str) -> Optional[TagDefinition]:
        """키워드로 태그 정의 조회"""
        return self._keyword_to_tag.get(keyword)
    
    def get_tags_by_category(self, category: TagCategory) -> List[TagDefinition]:
        """카테고리별 태그 조회"""
        return [tag for tag in self._tags if tag.category == category]
    
    def is_valid_tag(self, keyword: str) -> bool:
        """유효한 태그인지 확인"""
        return keyword in self._keyword_to_tag
    
    def get_formatted_tag_list(self) -> str:
        """AI 프롬프트용 포맷된 태그 리스트"""
        result = []
        for category in TagCategory:
            tags = self.get_tags_by_category(category)
            result.append(f"\n[{category.value}]")
            for tag in tags:
                result.append(f"{tag.keyword}: {tag.definition}")
        return "\n".join(result)
    
    def find_potential_tags(self, text: str) -> List[str]:
        """텍스트에서 잠재적 태그 찾기 (키워드 매칭 기반)"""
        text_lower = text.lower()
        potential_tags = []
        
        for tag in self._tags:
            # 긍정적 키워드 확인
            for keyword in tag.positive_keywords:
                if keyword in text_lower:
                    potential_tags.append(tag.keyword)
                    break
            
            # 부정적 키워드 확인 (이미 추가되지 않은 경우만)
            if tag.keyword not in potential_tags:
                for keyword in tag.negative_keywords:
                    if keyword in text_lower:
                        potential_tags.append(tag.keyword)
                        break
        
        return potential_tags

# 전역 인스턴스
master_tag_system = MasterTagSystem()
