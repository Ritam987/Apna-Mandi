'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const views = {
    mobile:   document.getElementById('mobile-input-view'),
    otp:      document.getElementById('otp-view'),
    userData: document.getElementById('user-data-view')
  };

  const mobileInput   = document.getElementById('mobile-number');
  const mobileError   = document.getElementById('mobile-error');
  const sendOtpBtn    = document.getElementById('send-otp-btn');
  const otpInputs     = [...document.querySelectorAll('.otp-box')];
  const verifyBtn     = document.getElementById('verify-otp-btn');
  const resendBtn     = document.getElementById('resend-otp-btn');
  const displayPhone  = document.getElementById('display-mobile-number');
  const userDataForm  = document.getElementById('user-data-form');

  // Step indicators
  const steps = document.querySelectorAll('.step-dot');
  function setStep(n) {
    steps.forEach((s, i) => {
      s.classList.toggle('active', i === n);
      s.classList.toggle('done',   i < n);
    });
  }

  /* ── Mobile input ─────────────────────────────────────────── */
  mobileInput?.addEventListener('input', () => {
    mobileInput.value = mobileInput.value.replace(/\D/g, '').slice(0, 10);
    mobileError.classList.remove('visible');
    mobileInput.classList.remove('input-error');
  });

  sendOtpBtn?.addEventListener('click', () => {
    const num = mobileInput.value.trim();
    if (!/^\d{10}$/.test(num)) {
      mobileError.classList.add('visible');
      mobileInput.classList.add('input-error', 'animate-shake');
      setTimeout(() => mobileInput.classList.remove('animate-shake'), 700);
      return;
    }
    sendOtpBtn.disabled = true;
    sendOtpBtn.innerHTML = `<span class="spinner"></span> Sending…`;

    setTimeout(() => {
      displayPhone.textContent = `+91 ${num.slice(0,5)} ${num.slice(5)}`;
      switchView('otp');
      setStep(1);
      otpInputs[0]?.focus();
      startResendTimer();
      sendOtpBtn.disabled = false;
      sendOtpBtn.innerHTML = `<span class="button-content"><span>Get OTP</span></span>`;
    }, 1200);
  });

  /* ── OTP inputs ───────────────────────────────────────────── */
  otpInputs.forEach((inp, idx) => {
    inp.addEventListener('input', () => {
      inp.value = inp.value.replace(/\D/g, '').slice(0, 1);
      inp.classList.toggle('filled', inp.value.length === 1);
      if (inp.value && idx < otpInputs.length - 1) otpInputs[idx + 1].focus();
      verifyBtn.disabled = !otpInputs.every(i => i.value.length === 1);
    });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Backspace' && !inp.value && idx > 0) {
        otpInputs[idx - 1].value = '';
        otpInputs[idx - 1].classList.remove('filled');
        otpInputs[idx - 1].focus();
      }
    });
    inp.addEventListener('paste', e => {
      e.preventDefault();
      const digits = (e.clipboardData.getData('text').replace(/\D/g, '')).slice(0, 4);
      digits.split('').forEach((d, i) => {
        if (otpInputs[i]) { otpInputs[i].value = d; otpInputs[i].classList.add('filled'); }
      });
      verifyBtn.disabled = !otpInputs.every(i => i.value.length === 1);
    });
  });

  verifyBtn?.addEventListener('click', () => {
    verifyBtn.disabled = true;
    verifyBtn.innerHTML = `<span class="spinner"></span> Verifying…`;
    setTimeout(() => {
      switchView('userData');
      setStep(2);
      verifyBtn.innerHTML = 'Verify';
    }, 1200);
  });

  /* ── Resend timer ─────────────────────────────────────────── */
  function startResendTimer() {
    let t = 30;
    resendBtn.disabled = true;
    const timer = setInterval(() => {
      t--;
      resendBtn.textContent = `Resend in ${t}s`;
      if (t <= 0) {
        clearInterval(timer);
        resendBtn.disabled = false;
        resendBtn.textContent = 'Resend OTP';
      }
    }, 1000);
  }

  resendBtn?.addEventListener('click', () => {
    otpInputs.forEach(i => { i.value = ''; i.classList.remove('filled'); });
    verifyBtn.disabled = true;
    otpInputs[0]?.focus();
    startResendTimer();
    showToast('OTP resent!', 'success');
  });

  /* ── User data form ───────────────────────────────────────── */
  userDataForm?.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(userDataForm));
    data.phone = mobileInput?.value || '';

    const submitBtn = userDataForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner"></span> Saving…`;

    setTimeout(() => {
      User.save(data);
      submitBtn.innerHTML = `✓ Done!`;
      showToast('Profile created!', 'success');
      setTimeout(() => { window.location.href = '/pages/location'; }, 800);
    }, 1200);
  });

  /* ── View switcher ────────────────────────────────────────── */
  function switchView(name) {
    Object.values(views).forEach(v => v?.classList.add('hidden'));
    const target = views[name];
    if (target) {
      target.classList.remove('hidden');
      target.classList.add('auth-view');
    }
  }
});
