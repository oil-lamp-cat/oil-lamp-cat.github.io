// Password Protection Script for Jekyll Posts
(function() {
  'use strict';

  // DOMContentLoaded 이벤트 대기
  document.addEventListener('DOMContentLoaded', function() {
    
    // 비밀번호 데이터 가져오기
    const passwordDataElement = document.getElementById('password-data');
    if (!passwordDataElement) {
      return; // 비밀번호 보호가 없는 페이지
    }

    let passwordData;
    try {
      passwordData = JSON.parse(passwordDataElement.textContent);
    } catch (e) {
      console.error('Password data parsing error:', e);
      return;
    }

    const correctPassword = passwordData.password;
    if (!correctPassword) {
      return;
    }

    // DOM 요소들 가져오기
    const passwordInput = document.getElementById('password-input');
    const passwordBtn = document.getElementById('password-btn');
    const errorMessage = document.getElementById('error-message');
    const passwordProtection = document.getElementById('password-protection');
    const protectedContent = document.getElementById('protected-content');

    // 요소 존재 확인
    if (!passwordInput || !passwordBtn || !errorMessage || !passwordProtection || !protectedContent) {
      console.error('Required password protection elements not found');
      return;
    }

    // 비밀번호 확인 함수
    function checkPassword() {
      const inputValue = passwordInput.value.trim();

      if (inputValue === correctPassword) {
        // 성공 시 부드러운 전환
        passwordProtection.style.transition = 'opacity 0.5s ease-out';
        passwordProtection.style.opacity = '0';

        setTimeout(function() {
          passwordProtection.style.display = 'none';
          protectedContent.style.display = 'block';
          protectedContent.style.opacity = '0';
          protectedContent.style.transition = 'opacity 0.5s ease-in';

          setTimeout(function() {
            protectedContent.style.opacity = '1';
          }, 50);
        }, 500);

        errorMessage.style.display = 'none';
        
        // 성공 알림 (선택사항)
        console.log('Password verified successfully');
        
      } else {
        // 실패 시 오류 표시
        errorMessage.style.display = 'block';
        passwordInput.value = '';
        passwordInput.focus();

        // 흔들림 애니메이션
        passwordInput.classList.add('shake-animation');
        setTimeout(function() {
          passwordInput.classList.remove('shake-animation');
        }, 600);
      }
    }

    // 이벤트 리스너 등록
    passwordBtn.addEventListener('click', checkPassword);

    passwordInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        checkPassword();
      }
    });

    // 페이지 로드 시 입력 필드에 포커스
    passwordInput.focus();

    // CSS 스타일 동적 추가
    addPasswordProtectionStyles();
  });

  // CSS 스타일 추가 함수
  function addPasswordProtectionStyles() {
    const styleId = 'password-protection-styles';
    
    // 이미 스타일이 추가되어 있으면 중복 방지
    if (document.getElementById(styleId)) {
      return;
    }

    const style = document.createElement('style');
    style.id = styleId;
    style.type = 'text/css';

    const css = `
      /* Password Protection Styles */
      .shake-animation {
        animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
        transform: translate3d(0, 0, 0);
      }

      @keyframes shake {
        10%, 90% { 
          transform: translate3d(-1px, 0, 0); 
        }
        20%, 80% { 
          transform: translate3d(2px, 0, 0); 
        }
        30%, 50%, 70% { 
          transform: translate3d(-4px, 0, 0); 
        }
        40%, 60% { 
          transform: translate3d(4px, 0, 0); 
        }
      }

      #password-protection .btn {
        transition: all 0.3s ease;
      }

      #password-protection .btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.15);
      }

      #password-protection .btn:active {
        transform: translateY(0);
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      }

      #password-input:focus {
        box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25) !important;
        border-color: rgba(102, 126, 234, 0.5) !important;
        outline: none;
      }

      #protected-content {
        opacity: 0;
        transition: opacity 0.5s ease-in;
      }

      #protected-content.show {
        opacity: 1;
      }

      /* Responsive adjustments */
      @media (max-width: 768px) {
        #password-protection .card-body {
          padding: 2rem 1rem !important;
        }
        
        #password-input {
          width: 100% !important;
          margin-bottom: 1rem !important;
        }
      }
    `;

    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

})();