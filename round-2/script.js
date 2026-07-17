document.addEventListener('DOMContentLoaded', () => {
  // Cache the main form and panel elements.
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const loginTab = document.getElementById('login-tab');
  const signupTab = document.getElementById('signup-tab');
  const loginPanel = document.getElementById('login-panel');
  const signupPanel = document.getElementById('signup-panel');

  // Return the nearest field wrapper for a form input.
  function getFieldGroup(input) {
    return input.closest('.field-group');
  }

  // Create or reuse the inline validation message element for a field.
  function ensureMessageElement(fieldGroup) {
    let message = fieldGroup.querySelector('.validation-message');

    if (!message) {
      message = document.createElement('p');
      message.className = 'validation-message';
      message.setAttribute('aria-live', 'polite');
      fieldGroup.appendChild(message);
    }

    return message;
  }

  // Update the field state so validation feedback is visible and accessible.
  function setFieldState(input, isValid, message = '') {
    const fieldGroup = getFieldGroup(input);

    if (!fieldGroup) {
      return;
    }

    const messageElement = ensureMessageElement(fieldGroup);
    const hasValue = input.value.trim() !== '';

    fieldGroup.classList.toggle('error', !isValid);
    fieldGroup.classList.toggle('success', isValid && hasValue);

    if (!isValid) {
      input.setAttribute('aria-invalid', 'true');
      messageElement.setAttribute('role', 'alert');
      messageElement.textContent = message;
      return;
    }

    input.removeAttribute('aria-invalid');
    messageElement.removeAttribute('role');
    messageElement.textContent = '';
  }

  // Remove prior validation feedback before re-checking a form.
  function clearFormState(form) {
    form.querySelectorAll('.field-group').forEach((fieldGroup) => {
      fieldGroup.classList.remove('error', 'success');
      const message = fieldGroup.querySelector('.validation-message');
      if (message) {
        message.textContent = '';
        message.removeAttribute('role');
      }
    });

    const status = form.querySelector('.form-status');
    if (status) {
      status.remove();
    }
  }

  // Show a summary message after a successful submission.
  function showFormStatus(form, message, type = 'success') {
    let status = form.querySelector('.form-status');

    if (!status) {
      status = document.createElement('p');
      status.className = `form-status ${type}`;
      form.appendChild(status);
    } else {
      status.className = `form-status ${type}`;
    }

    status.textContent = message;
  }

  // Validate basic email format.
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  // Ensure required fields are not empty.
  function validateRequired(input) {
    const trimmedValue = input.value.trim();

    if (!trimmedValue) {
      setFieldState(input, false, `${input.dataset.label || 'This field'} is required.`);
      return false;
    }

    setFieldState(input, true);
    return true;
  }

  function validateEmail(input) {
    const trimmedValue = input.value.trim();

    if (!trimmedValue) {
      setFieldState(input, false, `${input.dataset.label || 'Email'} is required.`);
      return false;
    }

    if (!isValidEmail(trimmedValue)) {
      setFieldState(input, false, 'Please enter a valid email address.');
      return false;
    }

    setFieldState(input, true);
    return true;
  }

  // Enforce the minimum password length.
  function validatePassword(input) {
    const trimmedValue = input.value.trim();

    if (!trimmedValue) {
      setFieldState(input, false, `${input.dataset.label || 'Password'} is required.`);
      return false;
    }

    if (trimmedValue.length < 8) {
      setFieldState(input, false, 'Password must be at least 8 characters long.');
      return false;
    }

    setFieldState(input, true);
    return true;
  }

  // Ensure the password confirmation matches the original value.
  function validateConfirmPassword(passwordInput, confirmInput) {
    const trimmedValue = confirmInput.value.trim();

    if (!trimmedValue) {
      setFieldState(confirmInput, false, 'Please confirm your password.');
      return false;
    }

    if (passwordInput.value.trim() !== trimmedValue) {
      setFieldState(confirmInput, false, 'Passwords do not match.');
      return false;
    }

    setFieldState(confirmInput, true);
    return true;
  }

  // Validate the login form before submission.
  function validateLoginForm() {
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    let isValid = true;

    isValid = validateEmail(emailInput) && isValid;
    isValid = validatePassword(passwordInput) && isValid;

    return isValid;
  }

  // Validate the signup form before submission.
  function validateSignupForm() {
    const nameInput = document.getElementById('signup-name');
    const emailInput = document.getElementById('signup-email');
    const passwordInput = document.getElementById('signup-password');
    const confirmInput = document.getElementById('signup-confirm-password');
    let isValid = true;

    isValid = validateRequired(nameInput) && isValid;
    isValid = validateEmail(emailInput) && isValid;
    isValid = validatePassword(passwordInput) && isValid;
    isValid = validateConfirmPassword(passwordInput, confirmInput) && isValid;

    return isValid;
  }

  // Switch between the login and signup panels.
  function switchPanel(panel) {
    const isLogin = panel === 'login';

    loginTab.classList.toggle('active', isLogin);
    signupTab.classList.toggle('active', !isLogin);
    loginTab.setAttribute('aria-selected', String(isLogin));
    signupTab.setAttribute('aria-selected', String(!isLogin));
    loginPanel.hidden = !isLogin;
    signupPanel.hidden = isLogin;
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearFormState(loginForm);

      if (validateLoginForm()) {
        showFormStatus(loginForm, 'Login details look good. Welcome back!', 'success');
        loginForm.reset();
      }
    });

    loginForm.querySelectorAll('input').forEach((input) => {
      input.addEventListener('input', () => {
        if (input.id === 'login-email') {
          validateEmail(input);
        }

        if (input.id === 'login-password') {
          validatePassword(input);
        }
      });

      input.addEventListener('blur', () => {
        if (input.id === 'login-email') {
          validateEmail(input);
        }

        if (input.id === 'login-password') {
          validatePassword(input);
        }
      });
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (event) => {
      event.preventDefault();
      clearFormState(signupForm);

      if (validateSignupForm()) {
        showFormStatus(signupForm, 'Account created successfully. You can now sign in.', 'success');
        signupForm.reset();
        switchPanel('login');
      }
    });

    signupForm.querySelectorAll('input').forEach((input) => {
      input.addEventListener('input', () => {
        if (input.id === 'signup-name') {
          validateRequired(input);
        }

        if (input.id === 'signup-email') {
          validateEmail(input);
        }

        if (input.id === 'signup-password') {
          validatePassword(input);
          const confirmInput = document.getElementById('signup-confirm-password');
          if (confirmInput.value.trim()) {
            validateConfirmPassword(input, confirmInput);
          }
        }

        if (input.id === 'signup-confirm-password') {
          validateConfirmPassword(document.getElementById('signup-password'), input);
        }
      });

      input.addEventListener('blur', () => {
        if (input.id === 'signup-name') {
          validateRequired(input);
        }

        if (input.id === 'signup-email') {
          validateEmail(input);
        }

        if (input.id === 'signup-password') {
          validatePassword(input);
          const confirmInput = document.getElementById('signup-confirm-password');
          if (confirmInput.value.trim()) {
            validateConfirmPassword(input, confirmInput);
          }
        }

        if (input.id === 'signup-confirm-password') {
          validateConfirmPassword(document.getElementById('signup-password'), input);
        }
      });
    });
  }

  loginTab.addEventListener('click', () => switchPanel('login'));
  signupTab.addEventListener('click', () => switchPanel('signup'));

  document.querySelectorAll('.password-toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const wrapper = toggle.closest('.password-wrapper');
      const input = wrapper?.querySelector('input');

      if (!input) {
        return;
      }

      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      toggle.textContent = isPassword ? 'Hide' : 'Show';
      toggle.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  });

  // Attach accessible labels to each field for validation messages.
  document.querySelectorAll('.field-group').forEach((fieldGroup) => {
    const input = fieldGroup.querySelector('input');
    const label = fieldGroup.querySelector('label');

    if (input && label) {
      input.dataset.label = label.textContent.trim();
    }
  });
});