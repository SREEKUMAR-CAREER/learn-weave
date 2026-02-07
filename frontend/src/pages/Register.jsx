import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TextInput,
  PasswordInput,
  Button,
  Text,
  Anchor,
  Stack,
  Divider,
  Box,
  Group,
  Checkbox,
  UnstyledButton,
  Image,
} from "@mantine/core";
import {
  IconBrandGoogleFilled,
  IconRocket,
  IconSparkles,
  IconShieldCheck,
  IconChevronDown,
} from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useAuth } from "../contexts/AuthContext";
import authService from "../api/authService";
import { useTranslation, Trans } from "react-i18next";
import { Link as RouterLink } from "react-router-dom";
import { gsap } from "gsap";
import "./Register.css";

function Register() {
  const { t } = useTranslation("auth");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  const formRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
    gsap.fromTo(
      rightRef.current,
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
    );
  }, []);

  const form = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptPrivacyPolicy: false,
    },
    validate: {
      username: (val) => (val.length < 3 ? t("usernameLength") : null),
      email: (val) => (/^\S+@\S+$/.test(val) ? null : t("emailInvalid")),
      password: (val) => (val.length < 3 ? t("passwordLength") : null),
      confirmPassword: (val, values) =>
        val !== values.password ? t("passwordsDoNotMatch") : null,
      acceptPrivacyPolicy: (val) => (!val ? t("privacyPolicyRequired") : null),
    },
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    setError("");
    try {
      const result = await register(
        values.username,
        values.email,
        values.password
      );
      if (result) navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    authService.redirectToGoogleOAuth();
  };

  return (
    <div className="register-container">
      {/* Left Side - Form */}
      <div className="register-left">
        <div className="register-form-wrapper" ref={formRef}>
          {/* Back Button */}
          <Button
            variant="subtle"
            color="gray"
            leftIcon={<IconChevronDown size={16} style={{ transform: 'rotate(90deg)' }} />}
            onClick={() => navigate('/')}
            mb="md"
            styles={{
              root: {
                padding: '4px 12px',
                height: 'auto',
                fontWeight: 600,
                color: '#6b7280',
                '&:hover': {
                  backgroundColor: '#f3f4f6',
                }
              }
            }}
          >
            Back to Home
          </Button>

          <Group position="apart" mb={40}>
            <Text className="header-logo">LearnWeave</Text>
            <UnstyledButton>
              <Group spacing={4}>
                <Image src="https://flagcdn.com/w20/gb.png" width={16} />
                <Text size="xs" weight={600}>
                  EN
                </Text>
                <IconChevronDown size={14} />
              </Group>
            </UnstyledButton>
          </Group>

          <Box mb={32}>
            <Text size={32} weight={800} mb={4}>
              Create Account
            </Text>
            <Text color="dimmed" size="sm">
              Start your 14-day free trial. No credit card required.
            </Text>
          </Box>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack spacing="md">
              <TextInput
                label="Username"
                placeholder="Choose a handle"
                required
                size="md"
                styles={{
                  label: { marginBottom: 8, fontWeight: 500 },
                  input: { borderRadius: 8, height: 48 },
                }}
                {...form.getInputProps("username")}
              />

              <TextInput
                label="Email"
                placeholder="name@company.com"
                required
                size="md"
                styles={{
                  label: { marginBottom: 8, fontWeight: 500 },
                  input: { borderRadius: 8, height: 48 },
                }}
                {...form.getInputProps("email")}
              />

              <PasswordInput
                label="Password"
                placeholder="Min. 8 characters"
                required
                size="md"
                styles={{
                  label: { marginBottom: 8, fontWeight: 500 },
                  input: { borderRadius: 8, height: 48 },
                }}
                {...form.getInputProps("password")}
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="Repeat password"
                required
                size="md"
                styles={{
                  label: { marginBottom: 8, fontWeight: 500 },
                  input: { borderRadius: 8, height: 48 },
                }}
                {...form.getInputProps("confirmPassword")}
              />

              <Checkbox
                mt="xs"
                label={
                  <Text size="xs">
                    <Trans
                      i18nKey="auth:privacyPolicyAcceptance"
                      components={[
                        <RouterLink
                          to="/privacy"
                          style={{ color: "#667eea", fontWeight: 600 }}
                        />,
                      ]}
                    />
                  </Text>
                }
                {...form.getInputProps("acceptPrivacyPolicy", {
                  type: "checkbox",
                })}
              />

              {error && (
                <Text color="red" size="xs" weight={500}>
                  {error}
                </Text>
              )}

              <Button
                fullWidth
                type="submit"
                size="md"
                loading={isLoading}
                className="register-submit-btn"
                disabled={!form.values.acceptPrivacyPolicy}
              >
                Create Account
              </Button>

              <Divider label="or" labelPosition="center" my="sm" color="gray.2" />

              <Button
                leftIcon={<IconBrandGoogleFilled size={18} color="#4285F4" />}
                variant="outline"
                fullWidth
                size="md"
                onClick={handleGoogleSignup}
                className="google-register-btn"
              >
                Sign up with Google
              </Button>
            </Stack>
          </form>

          <Text align="center" mt="xl" size="sm" className="register-footer-text">
            Already have an account?{" "}
            <Link to="/auth/login" className="sign-in-link">
              Sign in
            </Link>
          </Text>
        </div>
      </div>

      {/* Right Side - Visual/Marketing */}
      <div className="register-right" ref={rightRef}>
        <div className="register-visual-content">
          <h1 className="register-visual-title">
            Join the Future of Learning
          </h1>
          <p className="register-visual-subtitle">
            Access your personalized AI-driven education dashboard and unlock
            unlimited learning potential.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">
                <IconRocket size={24} />
              </div>
              <div className="feature-text">
                <h4>Instant Course Generation</h4>
                <p>Create comprehensive courses in seconds with AI</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <IconSparkles size={24} />
              </div>
              <div className="feature-text">
                <h4>AI-Powered Tutoring</h4>
                <p>Get personalized help whenever you need it</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <IconShieldCheck size={24} />
              </div>
              <div className="feature-text">
                <h4>Secure Progress Tracking</h4>
                <p>Monitor your learning journey with detailed analytics</p>
              </div>
            </div>
          </div>

          <div className="social-proof">
            <div className="social-proof-stats">
              <div className="stat-item">
                <span className="stat-value">10k+</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">99%</span>
                <span className="stat-label">Satisfaction</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">24/7</span>
                <span className="stat-label">Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;