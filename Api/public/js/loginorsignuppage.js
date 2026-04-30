/**
 * ============================================================
 * APNA MANDI — Login/Signup Page
 * ============================================================
 * 
 * Multi-step authentication flow:
 * 1. Mobile number input
 * 2. OTP verification
 * 3. User profile completion
 * 
 * Features:
 * - Phone number validation
 * - OTP input with auto-focus
 * - Resend timer
 * - Form validation
 * - Loading states
 * - Error handling
 * 
 * ============================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  try {
    initAuthFlow();
  } catch (err) {
    console.error('Auth page initialization error:', err);
    showToast('Failed to initialize page', 'error');
  }
});

/**
 * Initialize authentication flow
 */
function initAuthFlow() {
  // DOM elements
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
  const steps         = document.querySelectorAll('.step-dot');

  // Validate required elements
  if (!views.mobile || !mobileInput || !sendOtpBtn) {
    console.error('Required DOM elements not found');
    return;
  }

  // Initialize components
  initMobileInput(mobileInput, mobileError, sendOtpBtn, displayPhone, views, steps, otpInputs);
  initOtpInputs(otpInputs, verifyBtn, resendBtn, views, steps);
  initUserDataForm(userDataForm, mobileInput);
}

/**
 * Initialize mobile number input
 */
function initMobileInput(mobileInput, mobileError, sendOtpBtn, displayPhone, views, steps, otpInputs) {
  // Format input as user types
  mobileInput.addEventListener('input', () => {
    try {
      mobileInput.value = mobileInput.value.replace(/\D/g, '').slice(0, 10);
      mobileError?.classList.remove('visible');
      mobileInput.classList.remove('input-error');
      
      // Enable/disable button based on input
      if (sendOtpBtn) {
        sendOtpBtn.disabled = mobileInput.value.length !== 10;
      }
    } catch (err) {
      console.error('Mobile input error:', err);
    }
  });

  // Handle Enter key
  mobileInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !sendOtpBtn.disabled) {
      sendOtpBtn.click();
    }
  });

  // Send OTP button click
  sendOtpBtn.addEventListener('click', () => {
    try {
      const num = mobileInput.value.trim();
      
      // Validate phone number
      if (!isValidPhone(num)) {
        showError(mobileInput, mobileError, 'Please enter a valid 10-digit mobile number');
        return;
      }

      // Show loading state
      setButtonLoading(sendOtpBtn, true, 'Sending…');

      // Simulate OTP sending (replace with actual API call)
      setTimeout(() => {
        try {
          // Format and display phone number
          if (displayPhone) {
            displayPhone.textContent = formatPhone(num);
          }

          // Switch to OTP view
          switchView(views, 'otp');
          setStep(steps, 1);
          
          // Focus first OTP input
          if (otpInputs[0]) {
            otpInputs[0].focus();
          }

          // Start resend timer
          startResendTimer(resendBtn, otpInputs, verifyBtn);

          // Reset button
          setButtonLoading(sendOtpBtn, false, 'Get OTP');

          showToast('OTP sent successfully!', 'success');
        } catch (err) {
          console.error('OTP send success handler error:', err);
          setButtonLoading(sendOtpBtn, false, 'Get OTP');
          showToast('Failed to process OTP', 'error');
        }
      }, 1200);
    } catch (err) {
      console.error('Send OTP error:', err);
      setButtonLoading(sendOtpBtn, false, 'Get OTP');
      showToast('Failed to send OTP', 'error');
    }
  });
}

/**
 * Initialize OTP inputs
 */
function initOtpInputs(otpInputs, verifyBtn, resendBtn, views, steps) {
  if (!otpInputs || otpInputs.length === 0) return;

  otpInputs.forEach((inp, idx) => {
    // Handle input
    inp.addEventListener('input', () => {
      try {
        // Only allow digits
        inp.value = inp.value.replace(/\D/g, '').slice(0, 1);
        
        // Add filled class
        inp.classList.toggle('filled', inp.value.length === 1);
        
        // Auto-focus next input
        if (inp.value && idx < otpInputs.length - 1) {
          otpInputs[idx + 1].focus();
        }
        
        // Enable/disable verify button
        updateVerifyButton(otpInputs, verifyBtn);
      } catch (err) {
        console.error('OTP input error:', err);
      }
    });

    // Handle backspace
    inp.addEventListener('keydown', (e) => {
      try {
        if (e.key === 'Backspace' && !inp.value && idx > 0) {
          otpInputs[idx - 1].value = '';
          otpInputs[idx - 1].classList.remove('filled');
          otpInputs[idx - 1].focus();
        }
      } catch (err) {
        console.error('OTP backspace error:', err);
      }
    });

    // Handle paste
    inp.addEventListener('paste', (e) => {
      try {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const digits = pastedData.replace(/\D/g, '').slice(0, 4);
        
        digits.split('').forEach((digit, i) => {
          if (otpInputs[i]) {
            otpInputs[i].value = digit;
            otpInputs[i].classList.add('filled');
          }
        });
        
        updateVerifyButton(otpInputs, verifyBtn);
        
        // Focus last filled input
        const lastFilledIdx = Math.min(digits.length - 1, otpInputs.length - 1);
        if (otpInputs[lastFilledIdx]) {
          otpInputs[lastFilledIdx].focus();
        }
      } catch (err) {
        console.error('OTP paste error:', err);
      }
    });
  });

  // Verify OTP button
  if (verifyBtn) {
    verifyBtn.addEventListener('click', () => {
      try {
        const otp = otpInputs.map(i => i.value).join('');
        
        if (otp.length !== 4) {
          showToast('Please enter complete OTP', 'error');
          return;
        }

        setButtonLoading(verifyBtn, true, 'Verifying…');

        // Simulate OTP verification (replace with actual API call)
        setTimeout(() => {
          try {
            // In production, verify OTP with backend
            // For now, accept any 4-digit OTP
            switchView(views, 'userData');
            setStep(steps, 2);
            setButtonLoading(verifyBtn, false, 'Verify');
            showToast('OTP verified successfully!', 'success');
          } catch (err) {
            console.error('OTP verify success handler error:', err);
            setButtonLoading(verifyBtn, false, 'Verify');
            showToast('Verification failed', 'error');
          }
        }, 1200);
      } catch (err) {
        console.error('Verify OTP error:', err);
        setButtonLoading(verifyBtn, false, 'Verify');
        showToast('Failed to verify OTP', 'error');
      }
    });
  }

  // Resend OTP button
  if (resendBtn) {
    resendBtn.addEventListener('click', () => {
      try {
        // Clear OTP inputs
        otpInputs.forEach(inp => {
          inp.value = '';
          inp.classList.remove('filled');
        });
        
        updateVerifyButton(otpInputs, verifyBtn);
        
        // Focus first input
        if (otpInputs[0]) {
          otpInputs[0].focus();
        }

        // Start timer
        startResendTimer(resendBtn, otpInputs, verifyBtn);

        showToast('OTP resent successfully!', 'success');
      } catch (err) {
        console.error('Resend OTP error:', err);
        showToast('Failed to resend OTP', 'error');
      }
    });
  }
}

/**
 * Initialize user data form
 */
function initUserDataForm(userDataForm, mobileInput) {
  if (!userDataForm) return;

  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();

    try {
      // Get form data
      const formData = new FormData(userDataForm);
      const data = Object.fromEntries(formData);
      
      // Add phone number
      data.phone = mobileInput?.value || '';

      // Validate required fields
      const requiredFields = ['fullName', 'age', 'gender'];
      const missingFields = requiredFields.filter(field => !data[field]);
      
      if (missingFields.length > 0) {
        showToast('Please fill all required fields', 'error');
        
        // Highlight first missing field
        const firstMissing = userDataForm.querySelector(`[name="${missingFields[0]}"]`);
        if (firstMissing) {
          firstMissing.focus();
          firstMissing.classList.add('input-error', 'animate-shake');
          setTimeout(() => firstMissing.classList.remove('animate-shake'), 700);
        }
        return;
      }

      // Validate email if provided
      if (data.email && !isValidEmail(data.email)) {
        showToast('Please enter a valid email address', 'error');
        const emailInput = userDataForm.querySelector('[name="email"]');
        if (emailInput) {
          emailInput.focus();
          emailInput.classList.add('input-error', 'animate-shake');
          setTimeout(() => emailInput.classList.remove('animate-shake'), 700);
        }
        return;
      }

      // Validate age
      const age = parseInt(data.age);
      if (isNaN(age) || age < 18 || age > 120) {
        showToast('Please enter a valid age (18-120)', 'error');
        const ageInput = userDataForm.querySelector('[name="age"]');
        if (ageInput) {
          ageInput.focus();
          ageInput.classList.add('input-error', 'animate-shake');
          setTimeout(() => ageInput.classList.remove('animate-shake'), 700);
        }
        return;
      }

      // Show loading state
      const submitBtn = userDataForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        setButtonLoading(submitBtn, true, 'Saving…');
      }

      // Save user data
      setTimeout(() => {
        try {
          User.save(data);
          
          if (submitBtn) {
            submitBtn.innerHTML = `<svg width="18" height="18" fill="currentColor" viewBox="0 0 256 256"><path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"/></svg> Done!`;
          }
          
          showToast('Profile created successfully!', 'success');
          
          // Redirect to location page
          setTimeout(() => {
            window.location.href = '/pages/location';
          }, 800);
        } catch (err) {
          console.error('Save user data error:', err);
          if (submitBtn) {
            setButtonLoading(submitBtn, false, 'Complete Profile');
          }
          showToast('Failed to save profile', 'error');
        }
      }, 1200);
    } catch (err) {
      console.error('Form submit error:', err);
      showToast('Failed to submit form', 'error');
    }
  });

  // Real-time validation for email
  const emailInput = userDataForm.querySelector('[name="email"]');
  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      if (emailInput.value && !isValidEmail(emailInput.value)) {
        emailInput.classList.add('input-error');
        showToast('Invalid email format', 'error');
      } else {
        emailInput.classList.remove('input-error');
      }
    });
  }

  // Real-time validation for age
  const ageInput = userDataForm.querySelector('[name="age"]');
  if (ageInput) {
    ageInput.addEventListener('input', () => {
      ageInput.value = ageInput.value.replace(/\D/g, '').slice(0, 3);
    });
  }
}

/* ── Helper Functions ───────────────────────────────────────── */

/**
 * Show error message and highlight input
 */
function showError(input, errorEl, message) {
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }
  if (input) {
    input.classList.add('input-error', 'animate-shake');
    input.focus();
    setTimeout(() => input.classList.remove('animate-shake'), 700);
  }
  showToast(message, 'error');
}

/**
 * Set button loading state
 */
function setButtonLoading(button, isLoading, text) {
  if (!button) return;
  
  button.disabled = isLoading;
  
  if (isLoading) {
    button.innerHTML = `<span class="spinner"></span> ${text}`;
  } else {
    button.innerHTML = `<span class="button-content"><span>${text}</span></span>`;
  }
}

/**
 * Update verify button state based on OTP inputs
 */
function updateVerifyButton(otpInputs, verifyBtn) {
  if (!verifyBtn) return;
  
  const allFilled = otpInputs.every(inp => inp.value.length === 1);
  verifyBtn.disabled = !allFilled;
}

/**
 * Start resend OTP timer
 */
function startResendTimer(resendBtn, otpInputs, verifyBtn) {
  if (!resendBtn) return;

  let timeLeft = 30;
  resendBtn.disabled = true;
  
  const timer = setInterval(() => {
    timeLeft--;
    resendBtn.textContent = `Resend in ${timeLeft}s`;
    
    if (timeLeft <= 0) {
      clearInterval(timer);
      resendBtn.disabled = false;
      resendBtn.textContent = 'Resend OTP';
    }
  }, 1000);
}

/**
 * Switch between views
 */
function switchView(views, viewName) {
  try {
    // Hide all views
    Object.values(views).forEach(view => {
      if (view) {
        view.classList.add('hidden');
      }
    });

    // Show target view
    const targetView = views[viewName];
    if (targetView) {
      targetView.classList.remove('hidden');
      targetView.classList.add('auth-view', 'animate-fade-in');
    }
  } catch (err) {
    console.error('Switch view error:', err);
  }
}

/**
 * Update step indicators
 */
function setStep(steps, stepNumber) {
  try {
    steps.forEach((step, index) => {
      step.classList.toggle('active', index === stepNumber);
      step.classList.toggle('done', index < stepNumber);
    });
  } catch (err) {
    console.error('Set step error:', err);
  }
}
