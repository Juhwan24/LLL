#!/usr/bin/env python3
"""
AI 파이프라인 2: Coaching Generation Engine
- MCP 패킷 기반 가설 생성
- 가설 검증 및 최적 가설 선택
- 최종 코칭 카드 생성
"""
import sys
import json
import time
import traceback
from typing import Dict, Any, List, Optional
import openai
from config import Config
from utils.logger import create_logger
from utils.metrics import create_metrics_collector

class CoachingGenerationPipeline:
    """AI 코칭 생성 파이프라인"""
    
    def __init__(self, correlation_id: Optional[str] = None):
        self.logger = create_logger(correlation_id)
        self.metrics = create_metrics_collector("coaching_generation")
        openai.api_key = Config.OPENAI_API_KEY
        
        if not Config.validate():
            raise ValueError("Configuration validation failed")
    
    def generate_coaching_response(self, mcp_packet: Dict[str, Any]) -> Dict[str, Any]:
        """
        MCP 패킷을 기반으로 최종 코칭 응답 생성
        
        Args:
            mcp_packet: MCP 형식의 입력 패킷
            
        Returns:
            {
                "success": true/false,
                "hypotheses": ["가설1", "가설2", "가설3"],
                "best_hypothesis": "선택된 최적 가설",
                "coaching_card": {
                    "goal": "코칭 목표",
                    "key_questions": ["질문1", "질문2"],
                    "things_to_avoid": ["주의사항1", "주의사항2"],
                    "data_summary": "데이터 요약",
                    "confidence_score": 0.85
                },
                "processing_info": {...},
                "error": "오류 메시지 (실패시)"
            }
        """
        
        with self.metrics:
            try:
                self.logger.info("코칭 생성 시작", {
                    "mcp_request_id": mcp_packet.get("metadata", {}).get("request_id"),
                    "target_user": mcp_packet.get("input_data", {}).get("target_context", {}).get("employee_id")
                })
                
                # 1. 가설 생성
                hypotheses = self._generate_hypotheses(mcp_packet)
                
                # 2. 가설 검증 및 최적 가설 선택
                best_hypothesis = self._select_best_hypothesis(hypotheses, mcp_packet)
                
                # 3. 최종 코칭 카드 생성
                coaching_card = self._generate_coaching_card(best_hypothesis, mcp_packet)
                
                result = {
                    "success": True,
                    "hypotheses": hypotheses,
                    "best_hypothesis": best_hypothesis,
                    "coaching_card": coaching_card,
                    "processing_info": {
                        "hypotheses_count": len(hypotheses),
                        "selection_method": "evidence_based",
                        "high_performance_model": Config.OPENAI_MODEL_HIGH_PERFORMANCE
                    }
                }
                
                self.logger.info("코칭 생성 완료", {
                    "hypotheses_count": len(hypotheses),
                    "confidence_score": coaching_card.get("confidence_score", 0)
                })
                
                return result
                
            except Exception as e:
                error_message = str(e)
                self.logger.error("코칭 생성 실패", {
                    "error": error_message,
                    "error_type": type(e).__name__,
                    "traceback": traceback.format_exc()
                })
                
                return {
                    "success": False,
                    "hypotheses": [],
                    "best_hypothesis": "",
                    "coaching_card": {},
                    "processing_info": {"method": "error", "error_type": type(e).__name__},
                    "error": error_message
                }
    
    def _generate_hypotheses(self, mcp_packet: Dict[str, Any]) -> List[str]:
        """MCP 패킷을 기반으로 가설 생성"""
        self.logger.debug("가설 생성 시작")
        
        prompt = self._build_hypothesis_prompt(mcp_packet)
        
        start_time = time.time()
        
        try:
            response = openai.chat.completions.create(
                model=Config.OPENAI_MODEL_HIGH_PERFORMANCE,
                messages=[
                    {"role": "system", "content": self._get_hypothesis_system_prompt()},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1000,
                temperature=0.4
            )
            
            api_duration = time.time() - start_time
            
            # API 호출 메트릭 기록
            self.metrics.record_api_call("openai", "chat_completions_hypotheses", api_duration)
            
            ai_response = response.choices[0].message.content
            hypotheses = self._parse_hypotheses_response(ai_response)
            
            self.logger.debug("가설 생성 완료", {
                "hypotheses_count": len(hypotheses),
                "api_duration": round(api_duration, 3),
                "tokens_used": response.usage.total_tokens
            })
            
            return hypotheses
            
        except Exception as e:
            self.logger.error("가설 생성 실패", {"error": str(e)})
            # 기본 가설 반환
            return [
                "직원의 업무 부담이 과중하여 스트레스가 증가한 상황으로 추정됩니다.",
                "팀 내 소통 문제로 인한 업무 효율성 저하가 발생했을 가능성이 있습니다.",
                "개인의 성장 욕구와 현재 업무 간의 미스매치가 동기 부여 저하를 야기했을 수 있습니다."
            ]
    
    def _select_best_hypothesis(self, hypotheses: List[str], mcp_packet: Dict[str, Any]) -> str:
        """가설 검증 및 최적 가설 선택"""
        self.logger.debug("가설 검증 시작", {"hypotheses_count": len(hypotheses)})
        
        if not hypotheses:
            return "데이터 부족으로 구체적인 분석이 어려운 상황입니다."
        
        # 단순화된 선택 로직 (향후 더 정교한 검증 알고리즘 도입 가능)
        # 현재는 첫 번째 가설을 선택 (실제로는 데이터 증명 점수, 질문 답변 점수 등으로 평가)
        
        scores = []
        for i, hypothesis in enumerate(hypotheses):
            # 가설별 점수 계산 (간소화된 버전)
            data_evidence_score = self._calculate_data_evidence_score(hypothesis, mcp_packet)
            query_relevance_score = self._calculate_query_relevance_score(hypothesis, mcp_packet)
            
            total_score = (data_evidence_score * 0.6) + (query_relevance_score * 0.4)
            scores.append(total_score)
            
            self.logger.debug(f"가설 {i+1} 점수", {
                "hypothesis_preview": hypothesis[:50] + "...",
                "data_evidence": data_evidence_score,
                "query_relevance": query_relevance_score,
                "total_score": total_score
            })
        
        # 최고 점수의 가설 선택
        best_index = scores.index(max(scores))
        best_hypothesis = hypotheses[best_index]
        
        self.logger.info("최적 가설 선택 완료", {
            "selected_index": best_index,
            "selected_score": scores[best_index],
            "hypothesis_preview": best_hypothesis[:100] + "..."
        })
        
        return best_hypothesis
    
    def _generate_coaching_card(self, hypothesis: str, mcp_packet: Dict[str, Any]) -> Dict[str, Any]:
        """최적 가설을 기반으로 코칭 카드 생성"""
        self.logger.debug("코칭 카드 생성 시작")
        
        prompt = self._build_coaching_card_prompt(hypothesis, mcp_packet)
        
        start_time = time.time()
        
        try:
            response = openai.chat.completions.create(
                model=Config.OPENAI_MODEL_HIGH_PERFORMANCE,
                messages=[
                    {"role": "system", "content": self._get_coaching_card_system_prompt()},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=800,
                temperature=0.3
            )
            
            api_duration = time.time() - start_time
            self.metrics.record_api_call("openai", "chat_completions_coaching", api_duration)
            
            ai_response = response.choices[0].message.content
            coaching_card = self._parse_coaching_card_response(ai_response)
            
            self.logger.debug("코칭 카드 생성 완료", {
                "api_duration": round(api_duration, 3),
                "tokens_used": response.usage.total_tokens
            })
            
            return coaching_card
            
        except Exception as e:
            self.logger.error("코칭 카드 생성 실패", {"error": str(e)})
            # 기본 코칭 카드 반환
            return {
                "goal": "팀원의 현재 상황을 파악하고 적절한 지원 방안을 모색합니다.",
                "key_questions": [
                    "최근 업무에서 어려움을 겪고 있는 부분이 있나요?",
                    "어떤 지원이 도움이 될 것 같나요?"
                ],
                "things_to_avoid": [
                    "성급한 판단이나 결론",
                    "일방적인 해결책 제시"
                ],
                "data_summary": "제한된 데이터로 인한 기본 분석 결과",
                "confidence_score": 0.3
            }
    
    def _build_hypothesis_prompt(self, mcp_packet: Dict[str, Any]) -> str:
        """가설 생성용 프롬프트 구성"""
        user_query = mcp_packet.get("input_data", {}).get("user_query", "")
        target_context = mcp_packet.get("input_data", {}).get("target_context", {})
        
        prompt = f"""
다음 정보를 바탕으로 서로 다른 관점의 분석 가설 3개를 생성하세요:

관리자 질문: "{user_query}"

직원 컨텍스트:
- 직원 ID: {target_context.get('employee_id', '미상')}
- 뼈대 데이터 (가중치 {target_context.get('weighted_skeleton_data', {}).get('weight', 0)}):
  {json.dumps(target_context.get('weighted_skeleton_data', {}), ensure_ascii=False)}

- 근육 데이터 (가중치 {target_context.get('weighted_muscle_data', {}).get('weight', 0)}):
  {json.dumps(target_context.get('weighted_muscle_data', {}), ensure_ascii=False)}

다음 형식의 JSON 배열로 응답하세요:
["가설1: 구체적이고 실행 가능한 분석", "가설2: 다른 관점의 분석", "가설3: 추가적인 시각의 분석"]

주의사항:
1. 각 가설은 제공된 데이터에 근거해야 합니다
2. 추측이나 가정은 최소화하세요
3. 실행 가능한 코칭 방향을 제시하세요
"""
        return prompt
    
    def _build_coaching_card_prompt(self, hypothesis: str, mcp_packet: Dict[str, Any]) -> str:
        """코칭 카드 생성용 프롬프트 구성"""
        return f"""
다음 가설을 바탕으로 리더가 즉시 사용할 수 있는 코칭 카드를 생성하세요:

선택된 가설: "{hypothesis}"

다음 형식의 JSON으로 응답하세요:
{{
    "goal": "명확한 코칭 목표",
    "key_questions": ["구체적인 질문1", "구체적인 질문2", "구체적인 질문3"],
    "things_to_avoid": ["피해야 할 행동1", "피해야 할 행동2"],
    "data_summary": "데이터 기반 한 줄 요약",
    "confidence_score": 0.0-1.0
}}

주의사항:
1. 실용적이고 즉시 적용 가능한 내용
2. 한국 조직 문화에 적합한 접근법
3. 신뢰도 점수는 데이터의 풍부함과 일관성을 반영
"""
    
    def _get_hypothesis_system_prompt(self) -> str:
        """가설 생성용 시스템 프롬프트"""
        return """당신은 HR 전문가이자 조직 심리학자입니다. 
제공된 직원 데이터와 관리자의 질문을 바탕으로, 
과학적이고 객관적인 분석 가설을 생성하는 것이 목표입니다.

데이터에 근거한 추론만을 사용하고, 
각기 다른 관점에서 상황을 분석하세요.
반드시 유효한 JSON 배열 형식으로만 응답하세요."""
    
    def _get_coaching_card_system_prompt(self) -> str:
        """코칭 카드 생성용 시스템 프롬프트"""
        return """당신은 경험 많은 리더십 코치입니다.
분석 가설을 바탕으로 관리자가 즉시 실행할 수 있는
구체적이고 실용적인 코칭 가이드를 제작하는 것이 목표입니다.

한국의 조직 문화와 업무 환경을 고려하여
현실적이고 효과적인 접근법을 제시하세요.
반드시 유효한 JSON 형식으로만 응답하세요."""
    
    def _parse_hypotheses_response(self, response: str) -> List[str]:
        """가설 응답 파싱"""
        try:
            parsed = json.loads(response)
            if isinstance(parsed, list):
                return parsed[:3]  # 최대 3개
            else:
                return [str(parsed)]
        except json.JSONDecodeError:
            # JSON 파싱 실패 시 텍스트에서 추출 시도
            return [response]
    
    def _parse_coaching_card_response(self, response: str) -> Dict[str, Any]:
        """코칭 카드 응답 파싱"""
        try:
            return json.loads(response)
        except json.JSONDecodeError:
            # 파싱 실패 시 기본 구조 반환
            return {
                "goal": "팀원과의 대화를 통한 상황 파악",
                "key_questions": ["현재 상황은 어떤가요?"],
                "things_to_avoid": ["성급한 결론"],
                "data_summary": "AI 응답 파싱 오류",
                "confidence_score": 0.2
            }
    
    def _calculate_data_evidence_score(self, hypothesis: str, mcp_packet: Dict[str, Any]) -> float:
        """데이터 증명 점수 계산 (간소화된 버전)"""
        # 실제로는 더 정교한 점수 계산 로직 필요
        target_context = mcp_packet.get("input_data", {}).get("target_context", {})
        
        # 데이터 가중치 합계로 기본 점수 계산
        skeleton_weight = target_context.get("weighted_skeleton_data", {}).get("weight", 0)
        muscle_weight = target_context.get("weighted_muscle_data", {}).get("weight", 0)
        
        base_score = min((skeleton_weight + muscle_weight) / 2, 1.0)
        
        # 가설 길이와 구체성 고려 (단순한 휴리스틱)
        specificity_bonus = min(len(hypothesis) / 200, 0.3)  # 최대 0.3 보너스
        
        return min(base_score + specificity_bonus, 1.0)
    
    def _calculate_query_relevance_score(self, hypothesis: str, mcp_packet: Dict[str, Any]) -> float:
        """질문 관련성 점수 계산 (간소화된 버전)"""
        user_query = mcp_packet.get("input_data", {}).get("user_query", "").lower()
        hypothesis_lower = hypothesis.lower()
        
        # 키워드 매칭으로 기본 관련성 계산
        query_keywords = user_query.split()
        matches = sum(1 for keyword in query_keywords if keyword in hypothesis_lower)
        
        if len(query_keywords) == 0:
            return 0.5
        
        return min(matches / len(query_keywords), 1.0)

def main():
    """커맨드라인에서 호출될 때 실행"""
    try:
        if len(sys.argv) < 2:
            result = {
                "success": False,
                "error": "mcp_packet argument required",
                "usage": "python pipeline2_coaching_generation.py <mcp_packet_json> [correlation_id]"
            }
            print(json.dumps(result, ensure_ascii=False))
            sys.exit(1)
        
        mcp_packet_json = sys.argv[1]
        correlation_id = sys.argv[2] if len(sys.argv) > 2 else None
        
        # MCP 패킷 파싱
        try:
            mcp_packet = json.loads(mcp_packet_json)
        except json.JSONDecodeError as e:
            result = {
                "success": False,
                "error": f"Invalid MCP packet JSON: {str(e)}",
                "hypotheses": [],
                "best_hypothesis": "",
                "coaching_card": {}
            }
            print(json.dumps(result, ensure_ascii=False))
            sys.exit(1)
        
        # 파이프라인 실행
        pipeline = CoachingGenerationPipeline(correlation_id)
        result = pipeline.generate_coaching_response(mcp_packet)
        
        # 결과 출력
        print(json.dumps(result, ensure_ascii=False))
        
        # 성공 여부에 따른 exit code 설정
        sys.exit(0 if result["success"] else 1)
        
    except Exception as e:
        # 최상위 예외 처리
        error_result = {
            "success": False,
            "error": f"Pipeline execution failed: {str(e)}",
            "error_type": type(e).__name__,
            "hypotheses": [],
            "best_hypothesis": "",
            "coaching_card": {},
            "processing_info": {"method": "error"}
        }
        
        print(json.dumps(error_result, ensure_ascii=False))
        sys.exit(1)

if __name__ == "__main__":
    main()
