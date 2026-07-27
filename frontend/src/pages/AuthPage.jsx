import React from "react";
import LoginForm from "../features/auth/LoginForm";
import RegisterForm from "../features/auth/RegisterForm";

export const AuthPage = ({
  authMode,
  onLogin,
  onRegister,
  isLoading,
  onSwitchMode,
}) => {
  return (
    <div className="auth-wrapper">
      {authMode === "login" ? (
        <LoginForm
          onLogin={onLogin}
          isLoading={isLoading}
          onNavigateRegister={() => onSwitchMode("register")}
        />
      ) : (
        <RegisterForm
          onRegister={onRegister}
          isLoading={isLoading}
          onNavigateLogin={() => onSwitchMode("login")}
        />
      )}
    </div>
  );
};

export default AuthPage;
