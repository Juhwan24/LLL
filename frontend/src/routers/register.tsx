export const handlePersonalRegister = async (personalName: string, personalEmail: string, personalPassword: string, navigate: any) => {
    try {
      const response = await fetch('/api/users/signup/personal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: personalName,
          email: personalEmail,
          password: personalPassword,
          userType: '개인',
        }),
      });
      if (response.ok) {
        alert('회원가입 성공! 로그인 페이지로 이동합니다.');
        navigate('/login');
      } else {
        const data = await response.json();
        alert('회원가입 실패: ' + (data.message));
      }
    } catch (err) {
      alert('네트워크 오류');
    }
  };

export const handleCompanyRegister = async (name: string, companyName: string, companyEmail: string, companyPassword: string, navigate: any) => {
    try {
      const response = await fetch('/api/users/signup/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          companyName: companyName,
          email: companyEmail,
          password: companyPassword,
          userType: '기업',
        }),
      });
      if (response.ok) {
        alert('회원가입 성공! 로그인 페이지로 이동합니다.');
        navigate('/login');
      } else {
        const data = await response.json();
        alert('회원가입 실패: ' + (data.message));
      }
    } catch (err) {
      alert('네트워크 오류');
    }
  };