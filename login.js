
/* =========================================================
   STACKLY AUTO CARE — LOGIN PAGE INTERACTIONS

   Features:
   1. Registration
   2. Login with registered credentials
   3. Password hashing using Web Crypto API
   4. Required-field validation
   5. Password visibility toggles
   6. Session creation
   7. Dashboard redirect
   8. Forgot-password demo message
   9. Google sign-in demo message

   NOTE:
   Frontend-only authentication demo.
   Production authentication requires a secure backend.
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const getElement = (id) => document.getElementById(id);

  const authForm = getElement("authForm");

  if (!authForm) return;

  const authTitle = getElement("authTitle");
  const authDescription = getElement("authDescription");

  const signInTab = getElement("signInTab");
  const signUpTab = getElement("signUpTab");
  const switchToSignUp = getElement("switchToSignUp");
  const authSwitchCopy = getElement("authSwitchCopy");

  const nameField = getElement("nameField");
  const confirmPasswordField = getElement("confirmPasswordField");
  const termsField = getElement("termsField");
  const rememberOptions = getElement("rememberOptions");

  const fullName = getElement("fullName");
  const email = getElement("email");
  const password = getElement("password");
  const confirmPassword = getElement("confirmPassword");
  const acceptTerms = getElement("acceptTerms");
  const rememberMe = getElement("rememberMe");

  const authSubmit = getElement("authSubmit");
  const authSubmitText = getElement("authSubmitText");
  const authMessage = getElement("authMessage");

  const passwordToggle = getElement("passwordToggle");
  const confirmPasswordToggle = getElement("confirmPasswordToggle");

  const forgotPasswordLink = getElement("forgotPasswordLink");
  const googleSignIn = getElement("googleSignIn");

  const USERS_KEY = "autocare_demo_users";
  const SESSION_KEY = "autocare_demo_session";

  let currentMode = "signin";
  let isSubmitting = false;

  /* =====================================================
     1. STATUS MESSAGES
  ===================================================== */

  function showMessage(message, type = "error") {
    authMessage.textContent = message;
    authMessage.className = `auth-message ${type}`;
    authMessage.hidden = false;
  }

  function clearMessage() {
    authMessage.textContent = "";
    authMessage.className = "auth-message";
    authMessage.hidden = true;
  }

  /* =====================================================
     2. FIELD ERRORS
  ===================================================== */

  const fieldErrors = {
    fullName: getElement("nameError"),
    email: getElement("emailError"),
    password: getElement("passwordError"),
    confirmPassword: getElement("confirmPasswordError")
  };

  function setFieldError(input, message) {
    if (!input) return;

    const field = input.closest(".auth-field");
    const errorElement = fieldErrors[input.id];

    if (field) {
      field.classList.toggle("has-error", Boolean(message));
    }

    if (errorElement) {
      errorElement.textContent = message;
    }

    input.setAttribute("aria-invalid", String(Boolean(message)));
  }

  function clearFieldErrors() {
    [fullName, email, password, confirmPassword].forEach((input) => {
      setFieldError(input, "");
    });
  }

  /* =====================================================
     3. USER STORAGE
  ===================================================== */

  function readUsers() {
    try {
      const stored = localStorage.getItem(USERS_KEY);

      if (!stored) return [];

      const parsed = JSON.parse(stored);

      if (!Array.isArray(parsed)) {
        throw new Error("Saved account data is invalid.");
      }

      return parsed.filter((user) => {
        return (
          user &&
          typeof user.name === "string" &&
          typeof user.email === "string" &&
          typeof user.salt === "string" &&
          typeof user.passwordHash === "string"
        );
      });
    } catch (error) {
      console.error("Unable to read accounts:", error);

      throw new Error(
        "Unable to access saved accounts. Please check browser storage."
      );
    }
  }

  function saveUsers(users) {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error("Unable to save accounts:", error);

      throw new Error(
        "Account could not be saved. Check your browser storage."
      );
    }
  }

  /* =====================================================
     4. PASSWORD HASHING
  ===================================================== */

  function bytesToHex(bytes) {
    return Array.from(bytes)
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  function randomSalt() {
    if (!window.crypto || !window.crypto.getRandomValues) {
      throw new Error(
        "Secure cryptography is unavailable in this browser."
      );
    }

    const bytes = new Uint8Array(16);

    window.crypto.getRandomValues(bytes);

    return bytesToHex(bytes);
  }

  async function hashPassword(passwordValue, saltHex) {
    if (!window.crypto || !window.crypto.subtle) {
      throw new Error(
        "Secure browser cryptography is unavailable. Open the site using localhost or HTTPS."
      );
    }

    const saltPairs = saltHex.match(/.{2}/g);

    if (!saltPairs || saltPairs.length !== 16) {
      throw new Error("Invalid password security data.");
    }

    const salt = new Uint8Array(
      saltPairs.map((pair) => Number.parseInt(pair, 16))
    );

    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(passwordValue),
      "PBKDF2",
      false,
      ["deriveBits"]
    );

    const derivedBits = await window.crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt,
        iterations: 310000,
        hash: "SHA-256"
      },
      keyMaterial,
      256
    );

    return bytesToHex(new Uint8Array(derivedBits));
  }

  /* =====================================================
     5. ACCOUNT MODE
  ===================================================== */

  function setMode(mode) {
    currentMode = mode === "signup" ? "signup" : "signin";

    const isSignup = currentMode === "signup";

    signInTab.classList.toggle("active", !isSignup);
    signUpTab.classList.toggle("active", isSignup);

    signInTab.setAttribute("aria-pressed", String(!isSignup));
    signUpTab.setAttribute("aria-pressed", String(isSignup));

    nameField.hidden = !isSignup;
    confirmPasswordField.hidden = !isSignup;
    termsField.hidden = !isSignup;
    rememberOptions.hidden = isSignup;

    fullName.required = isSignup;
    email.required = true;
    password.required = true;
    confirmPassword.required = isSignup;

    // Custom validation below handles the checkbox because
    // the form intentionally uses novalidate.
    acceptTerms.required = false;

    password.autocomplete = isSignup
      ? "new-password"
      : "current-password";

    authTitle.textContent = isSignup
      ? "Create Your Account"
      : "Welcome Back";

    authDescription.textContent = isSignup
      ? "Create an account to manage your automotive needs."
      : "Sign in to continue your journey with us.";

    authSubmitText.textContent = isSignup
      ? "Create Account"
      : "Sign In";

    authSwitchCopy.innerHTML = isSignup
      ? 'Already have an account? <button type="button" id="switchToSignIn">Sign in</button>'
      : 'New to AUTO-CARE? <button type="button" id="switchToSignUp">Create an account</button>';

    clearFieldErrors();
    clearMessage();

    const switchButton = getElement(
      isSignup ? "switchToSignIn" : "switchToSignUp"
    );

    switchButton?.addEventListener("click", () => {
      setMode(isSignup ? "signin" : "signup");
    });

    if (isSignup) {
      window.setTimeout(() => fullName.focus(), 50);
    }
  }

  signInTab.addEventListener("click", () => setMode("signin"));
  signUpTab.addEventListener("click", () => setMode("signup"));

  switchToSignUp.addEventListener("click", () => {
    setMode("signup");
  });

  /* =====================================================
     6. PASSWORD VISIBILITY
  ===================================================== */

  function setupPasswordToggle(input, button) {
    if (!input || !button) return;

    button.addEventListener("click", () => {
      const shouldShow = input.type === "password";

      input.type = shouldShow ? "text" : "password";
      button.textContent = shouldShow ? "Hide" : "Show";

      button.setAttribute(
        "aria-label",
        shouldShow ? "Hide password" : "Show password"
      );

      button.setAttribute("aria-pressed", String(shouldShow));
    });
  }

  setupPasswordToggle(password, passwordToggle);
  setupPasswordToggle(confirmPassword, confirmPasswordToggle);

  /* =====================================================
     7. FORM VALIDATION
  ===================================================== */

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validateForm() {
    clearFieldErrors();
    clearMessage();

    let valid = true;

    const nameValue = fullName.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value;

    if (currentMode === "signup") {
      if (nameValue.length < 2) {
        setFieldError(
          fullName,
          "Please enter your full name (at least 2 characters)."
        );

        valid = false;
      }
    }

    if (!emailValue) {
      setFieldError(email, "Email address is required.");
      valid = false;
    } else if (!validateEmail(emailValue)) {
      setFieldError(email, "Enter a valid email address.");
      valid = false;
    }

    if (!passwordValue) {
      setFieldError(password, "Password is required.");
      valid = false;
    } else if (
      currentMode === "signup" &&
      passwordValue.length < 8
    ) {
      setFieldError(
        password,
        "Password must contain at least 8 characters."
      );

      valid = false;
    }

    if (currentMode === "signup") {
      if (!confirmPassword.value) {
        setFieldError(
          confirmPassword,
          "Please confirm your password."
        );

        valid = false;
      } else if (confirmPassword.value !== passwordValue) {
        setFieldError(
          confirmPassword,
          "Passwords do not match."
        );

        valid = false;
      }

      if (!acceptTerms.checked) {
        showMessage(
          "Please accept the Terms and Privacy Policy to create your account."
        );

        valid = false;
      }
    }

    if (!valid && authMessage.hidden) {
      showMessage("Please check the highlighted fields.");
    }

    if (!valid) {
      const firstInvalid = [
        fullName,
        email,
        password,
        confirmPassword
      ].find((input) => {
        if (!input || input.closest(".auth-field")?.hidden) {
          return false;
        }

        return input.getAttribute("aria-invalid") === "true";
      });

      firstInvalid?.focus();
    }

    return valid;
  }

  [fullName, email, password, confirmPassword].forEach((input) => {
    input.addEventListener("input", () => {
      setFieldError(input, "");
      clearMessage();
    });
  });

  acceptTerms.addEventListener("change", () => {
    clearMessage();
  });

  /* =====================================================
     8. SESSION CREATION
  ===================================================== */

  function createSession(user) {
    const session = {
      name: user.name,
      email: user.email,
      authenticatedAt: Date.now()
    };

    try {
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify(session)
      );
    } catch (error) {
      console.error("Unable to create session:", error);

      throw new Error(
        "Unable to start your session. Please try again."
      );
    }
  }

  /* =====================================================
     9. REGISTRATION AND LOGIN
  ===================================================== */

  authForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    if (!validateForm()) return;

    isSubmitting = true;
    authSubmit.disabled = true;

    try {
      const emailValue = email.value.trim().toLowerCase();
      const passwordValue = password.value;

      if (currentMode === "signup") {
        const users = readUsers();

        const existingUser = users.some((user) => {
          return user.email.toLowerCase() === emailValue;
        });

        if (existingUser) {
          showMessage(
            "This email is already registered. Please sign in instead."
          );

          return;
        }

        const salt = randomSalt();

        const passwordHash = await hashPassword(
          passwordValue,
          salt
        );

        const newUser = {
          name: fullName.value.trim(),
          email: emailValue,
          salt,
          passwordHash
        };

        users.push(newUser);
        saveUsers(users);

        // Registration does not automatically log the user in.
        // The user must sign in with the registered credentials.
        setMode("signin");

        email.value = emailValue;
        password.value = "";
        confirmPassword.value = "";

        showMessage(
          "Account created successfully! Please sign in using your registered email and password.",
          "success"
        );

        email.focus();

        return;
      }

      const users = readUsers();

      const existingUser = users.find((user) => {
        return user.email.toLowerCase() === emailValue;
      });

      if (!existingUser) {
        showMessage(
          "No account found with this email. Please create an account first."
        );

        return;
      }

      const enteredHash = await hashPassword(
        passwordValue,
        existingUser.salt
      );

      if (enteredHash !== existingUser.passwordHash) {
        showMessage(
          "Incorrect password. Please check your password and try again."
        );

        setFieldError(password, "Incorrect password.");
        password.focus();

        return;
      }

      createSession(existingUser);

      showMessage(
        "Login successful! Opening your dashboard...",
        "success"
      );

      window.setTimeout(() => {
        window.location.assign("dashboard.html");
      }, 500);
    } catch (error) {
      console.error("Authentication error:", error);

      showMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      isSubmitting = false;
      authSubmit.disabled = false;
    }
  });

  /* =====================================================
     10. FORGOT PASSWORD
  ===================================================== */

  forgotPasswordLink.addEventListener("click", (event) => {
    event.preventDefault();

    clearFieldErrors();
    clearMessage();

    const emailValue = email.value.trim();

    if (!emailValue) {
      showMessage("Enter your email address first.");
      email.focus();
      return;
    }

    if (!validateEmail(emailValue)) {
      setFieldError(email, "Enter a valid email address.");
      email.focus();
      return;
    }

    showMessage(
      "Password reset requires a configured backend and email service."
    );
  });

  /* =====================================================
     11. GOOGLE SIGN-IN
  ===================================================== */

  googleSignIn.addEventListener("click", () => {
    showMessage(
      "Google sign-in is not configured yet. OAuth and backend integration are required."
    );
  });

  /* =====================================================
     12. INITIAL STATE
  ===================================================== */

  setMode("signin");
});
