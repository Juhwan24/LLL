#!/usr/bin/env python3
"""
AI 파이프라인 테스트 및 헬스체크 스크립트
"""
import sys
import json
import time
from config import Config

def health_check():
    """시스템 헬스체크"""
    try:
        # 1. 설정 검증
        config_valid = Config.validate()
        
        # 2. 기본 모듈 임포트 테스트
        try:
            import openai
            import pandas as pd
            openai_available = True
        except ImportError as e:
            openai_available = False
            import_error = str(e)
        
        # 3. OpenAI 연결 테스트 (간단한 요청)
        openai_connection = False
        if openai_available and config_valid:
            try:
                openai.api_key = Config.OPENAI_API_KEY
                # 매우 간단한 테스트 요청
                response = openai.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": "Hello"}],
                    max_tokens=1
                )
                openai_connection = True
            except Exception:
                openai_connection = False
        
        result = {
            "success": True,
            "status": "healthy",
            "checks": {
                "config_valid": config_valid,
                "openai_available": openai_available,
                "openai_connection": openai_connection
            },
            "timestamp": time.time(),
            "config_info": Config.get_runtime_info()
        }
        
        return result
        
    except Exception as e:
        return {
            "success": False,
            "status": "unhealthy",
            "error": str(e),
            "timestamp": time.time()
        }

def test_pipeline1():
    """파이프라인 1 간단 테스트"""
    try:
        from pipeline1_living_manual import LivingManualPipeline
        
        pipeline = LivingManualPipeline("test_corr_id")
        test_text = "동료가 매우 꼼꼼하고 성실하게 일을 처리합니다."
        
        result = pipeline.process_feedback_text(test_text)
        
        return {
            "success": True,
            "pipeline": "living_manual",
            "test_result": result
        }
        
    except Exception as e:
        return {
            "success": False,
            "pipeline": "living_manual",
            "error": str(e)
        }

def test_pipeline2():
    """파이프라인 2 간단 테스트"""
    try:
        from pipeline2_coaching_generation import CoachingGenerationPipeline
        
        # 테스트용 MCP 패킷
        test_mcp_packet = {
            "metadata": {"request_id": "test_123"},
            "input_data": {
                "user_query": "팀원이 번아웃 된 것 같아요",
                "target_context": {
                    "employee_id": "test_employee",
                    "weighted_skeleton_data": {"weight": 0.4, "traits": ["자율성_중시"]},
                    "weighted_muscle_data": {"weight": 0.6, "tags": [{"tag": "#업무부하", "sentiment": "Negative"}]}
                }
            }
        }
        
        pipeline = CoachingGenerationPipeline("test_corr_id")
        result = pipeline.generate_coaching_response(test_mcp_packet)
        
        return {
            "success": True,
            "pipeline": "coaching_generation",
            "test_result": result
        }
        
    except Exception as e:
        return {
            "success": False,
            "pipeline": "coaching_generation",
            "error": str(e)
        }

def main():
    """메인 함수"""
    if len(sys.argv) < 2:
        result = {
            "success": False,
            "error": "test_type argument required",
            "available_tests": ["health_check", "test_pipeline1", "test_pipeline2", "test_all"]
        }
        print(json.dumps(result, ensure_ascii=False))
        sys.exit(1)
    
    test_type = sys.argv[1]
    
    if test_type == "health_check":
        result = health_check()
    elif test_type == "test_pipeline1":
        result = test_pipeline1()
    elif test_type == "test_pipeline2":
        result = test_pipeline2()
    elif test_type == "test_all":
        health_result = health_check()
        pipeline1_result = test_pipeline1()
        pipeline2_result = test_pipeline2()
        
        result = {
            "success": health_result["success"] and pipeline1_result["success"] and pipeline2_result["success"],
            "health_check": health_result,
            "pipeline1_test": pipeline1_result,
            "pipeline2_test": pipeline2_result
        }
    else:
        result = {
            "success": False,
            "error": f"Unknown test type: {test_type}",
            "available_tests": ["health_check", "test_pipeline1", "test_pipeline2", "test_all"]
        }
    
    print(json.dumps(result, ensure_ascii=False))
    sys.exit(0 if result["success"] else 1)

if __name__ == "__main__":
    main()
