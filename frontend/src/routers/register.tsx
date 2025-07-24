import { signUpPersonal, signUpCompany } from '../api/auth';

export const handlePersonalRegister = async (personalName: string, personalEmail: string, personalPassword: string, navigate: any) => {
  try {
    await signUpPersonal({
      userName: personalName,
      email: personalEmail,
      password: personalPassword,
      userType: 'personal',
    });
    
    alert('회원가입 성공! 로그인 페이지로 이동합니다.');
    navigate('/login');
  } catch (error: any) {
    alert('회원가입 실패: ' + error.message);
    console.error('개인 회원가입 오류:', error);
  }
};

export const handleCompanyRegister = async (name: string, companyName: string, companyEmail: string, companyPassword: string, navigate: any) => {
  try {
    await signUpCompany({
      userName: name,
      companyName: companyName,
      email: companyEmail,
      password: companyPassword,
      userType: 'company',
    });
    
    alert('회원가입 성공! 로그인 페이지로 이동합니다.');
    navigate('/login');
  } catch (error: any) {
    alert('회원가입 실패: ' + error.message);
    console.error('기업 회원가입 오류:', error);
  }
};