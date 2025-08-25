#!/usr/bin/env python3
"""
강화된 AI 파이프라인 테스트 스크립트
"""
import sys
import json
from pipeline1_living_manual import LivingManualPipelineV2
from master_tags import master_tag_system

def test_classification_system():
    """분류 시스템 전체 테스트"""
    print("🧪 강화된 분류 시스템 테스트 시작\n")
    
    # 테스트 케이스들
    test_cases = [
        {
            "name": "긍정적 업무 능력 피드백",
            "text": "프로젝트에서 복잡한 문제를 체계적으로 분석해서 효과적인 해결 방안을 제시했습니다. 세부사항까지 놓치지 않고 꼼꼼하게 체크하는 모습이 인상적이었어요.",
            "expected_tags": ["#문제해결능력", "#꼼꼼함"],
            "expected_sentiment": "Positive"
        },
        {
            "name": "혼합 감정 피드백",
            "text": "소통 능력은 뛰어나지만 업무 속도 측면에서는 조금 더 개선이 필요해 보입니다.",
            "expected_tags": ["#소통능력", "#업무속도"],
            "expected_sentiment": "Mixed"
        },
        {
            "name": "리더십 관련 피드백",
            "text": "팀을 이끌어가는 리더십이 뛰어나고, 동료들에게 좋은 동기부여를 제공합니다. 후배들을 잘 가르치고 도와주는 멘토링 능력도 뛰어납니다.",
            "expected_tags": ["#리더십", "#동기부여", "#멘토링"],
            "expected_sentiment": "Positive"
        },
        {
            "name": "부정적 피드백",
            "text": "책임감이 부족하고 업무 처리 속도가 느려서 팀 전체 일정에 영향을 주었습니다.",
            "expected_tags": ["#책임감", "#업무속도"],
            "expected_sentiment": "Negative"
        }
    ]
    
    pipeline = LivingManualPipelineV2("test_enhanced")
    
    all_passed = True
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"📝 테스트 {i}: {test_case['name']}")
        print(f"   입력: {test_case['text']}")
        
        try:
            result = pipeline.process_feedback_text(test_case['text'])
            
            if result["success"]:
                classifications = result["classification_results"]
                print(f"   ✅ 성공: {len(classifications)}개 태그 분류")
                
                for cls in classifications:
                    print(f"      - {cls['keyword']} ({cls['sentiment']}, 신뢰도: {cls['confidence']:.2f})")
                    print(f"        근거: {cls['evidence'][:50]}...")
                    print(f"        카테고리: {cls['category']}")
                
                # 데이터 품질 확인
                quality = result["data_quality"]
                print(f"   📊 품질 점수: {quality.get('quality_score', 0):.2f}")
                if quality["issues"]:
                    print(f"   ⚠️  품질 이슈: {quality['issues']}")
                
                # 통계 정보
                stats = result["statistics"]
                print(f"   📈 통계: 평균 신뢰도 {stats['avg_confidence']:.2f}, 카테고리 분포 {stats['categories']}")
                
            else:
                print(f"   ❌ 실패: {result.get('error', 'Unknown error')}")
                all_passed = False
                
        except Exception as e:
            print(f"   💥 예외 발생: {str(e)}")
            all_passed = False
        
        print()
    
    return all_passed

def test_master_tags_system():
    """마스터 태그 시스템 테스트"""
    print("🏷️  마스터 태그 시스템 테스트")
    
    # 태그 개수 확인
    all_tags = master_tag_system.get_all_tags()
    print(f"   총 {len(all_tags)}개 마스터 태그 정의됨")
    
    # 카테고리별 분포
    from master_tags import TagCategory
    for category in TagCategory:
        tags = master_tag_system.get_tags_by_category(category)
        print(f"   {category.value}: {len(tags)}개")
        for tag in tags[:2]:  # 처음 2개만 출력
            print(f"      - {tag.keyword}: {tag.definition[:30]}...")
    
    # 키워드 검색 테스트
    test_text = "꼼꼼하고 성실하며 리더십이 뛰어난 동료입니다"
    potential_tags = master_tag_system.find_potential_tags(test_text)
    print(f"   '{test_text}'에서 발견된 잠재 태그: {potential_tags}")
    
    print()

def test_data_quality_validation():
    """데이터 품질 검증 테스트"""
    print("🔍 데이터 품질 검증 테스트")
    
    pipeline = LivingManualPipelineV2("test_quality")
    
    # 품질이 좋은 케이스
    good_case = "매우 꼼꼼하고 성실한 태도로 업무에 임합니다. 세부사항까지 놓치지 않고 정확하게 처리합니다."
    result = pipeline.process_feedback_text(good_case)
    
    quality = result["data_quality"]
    print(f"   좋은 케이스 품질 점수: {quality.get('quality_score', 0):.2f}")
    print(f"   검증 통과: {quality['validation_passed']}")
    
    # 품질이 나쁜 케이스 (짧은 텍스트)
    bad_case = "좋음"
    result = pipeline.process_feedback_text(bad_case)
    
    quality = result["data_quality"]
    print(f"   나쁜 케이스 품질 점수: {quality.get('quality_score', 0):.2f}")
    print(f"   검증 통과: {quality['validation_passed']}")
    print(f"   이슈들: {quality['issues']}")
    
    print()

def test_performance():
    """성능 테스트"""
    print("⚡ 성능 테스트")
    
    import time
    
    pipeline = LivingManualPipelineV2("test_perf")
    test_text = "팀워크가 뛰어나고 문제 해결 능력이 좋으며 꼼꼼한 성격의 동료입니다."
    
    # 5회 실행하여 평균 시간 측정
    times = []
    for i in range(5):
        start_time = time.time()
        result = pipeline.process_feedback_text(test_text)
        end_time = time.time()
        
        duration = end_time - start_time
        times.append(duration)
        
        if result["success"]:
            print(f"   실행 {i+1}: {duration:.2f}초 ({len(result['classification_results'])}개 태그)")
        else:
            print(f"   실행 {i+1}: 실패")
    
    if times:
        avg_time = sum(times) / len(times)
        print(f"   평균 처리 시간: {avg_time:.2f}초")
    
    print()

def main():
    """전체 테스트 실행"""
    print("🚀 강화된 AI 파이프라인 종합 테스트\n")
    
    # 설정 확인
    from config import Config
    if not Config.validate():
        print("❌ 설정 검증 실패 - OPENAI_API_KEY 확인 필요")
        return False
    
    print("✅ 설정 검증 통과\n")
    
    # 각 테스트 실행
    test_results = []
    
    # 마스터 태그 시스템 테스트
    test_master_tags_system()
    
    # 분류 시스템 테스트
    classification_passed = test_classification_system()
    test_results.append(("분류 시스템", classification_passed))
    
    # 데이터 품질 검증 테스트
    test_data_quality_validation()
    
    # 성능 테스트 (API 키가 있을 때만)
    if Config.OPENAI_API_KEY:
        test_performance()
    else:
        print("⚠️  OPENAI_API_KEY가 없어 성능 테스트 스킵")
    
    # 최종 결과
    print("📋 테스트 결과 요약")
    passed_count = sum(1 for _, passed in test_results if passed)
    total_count = len(test_results)
    
    for test_name, passed in test_results:
        status = "✅ 통과" if passed else "❌ 실패"
        print(f"   {test_name}: {status}")
    
    print(f"\n🎯 전체 결과: {passed_count}/{total_count} 통과")
    
    if passed_count == total_count:
        print("🎉 모든 테스트 통과! 시스템이 정상 작동합니다.")
        return True
    else:
        print("⚠️  일부 테스트 실패. 문제를 확인해주세요.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
