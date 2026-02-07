import { useState } from "react";
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
import { useTranslation } from "react-i18next";
import "./Login.css";

function Login() {
  const { t } = useTranslation("auth");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (value) =>
        !value ? t("usernameRequired") || "Username is required" : null,
      password: (value) =>
        !value
          ? t("passwordRequired") || "Password is required"
          : value.length < 3
            ? t("passwordLength") || "Password must be at least 3 characters"
            : null,
    },
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    setError("");
    form.clearErrors();

    try {
      const user = await login(values.username, values.password);
      if (user) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login page: Login failed", error);
      let errorMessage = t("loginError", "Invalid username or password.");
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    authService.redirectToGoogleOAuth();
  };

  return (
    <div className="login-container">
      {/* Left Side - Form */}
      <div className="login-left">
        <div className="login-form-wrapper">
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
              Welcome Back
            </Text>
            <Text color="dimmed" size="sm">
              Sign in to continue to your dashboard
            </Text>
          </Box>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack spacing="md">
              <TextInput
                label="Email or Username"
                placeholder="Enter your email or username"
                required
                size="md"
                styles={{
                  label: { marginBottom: 8, fontWeight: 500 },
                  input: { borderRadius: 8, height: 48 },
                }}
                {...form.getInputProps("username")}
              />

              <Box>
                <PasswordInput
                  label="Password"
                  placeholder="Enter your password"
                  required
                  size="md"
                  styles={{
                    label: { marginBottom: 8, fontWeight: 500 },
                    input: { borderRadius: 8, height: 48 },
                  }}
                  {...form.getInputProps("password")}
                />
                <Anchor
                  component={Link}
                  to="/forgot-password"
                  size="xs"
                  align="right"
                  display="block"
                  mt={8}
                  color="red"
                >
                  Forgot password?
                </Anchor>
              </Box>

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
                className="login-submit-btn"
              >
                Sign In
              </Button>

              <Divider label="or" labelPosition="center" my="sm" color="gray.2" />

              <Button
                leftIcon={<IconBrandGoogleFilled size={18} color="#4285F4" />}
                variant="outline"
                fullWidth
                size="md"
                onClick={handleGoogleLogin}
                className="google-login-btn"
              >
                Sign in with Google
              </Button>
            </Stack>
          </form>

          <Text align="center" mt="xl" size="sm" className="login-footer-text">
            Don't have an account?{" "}
            <Link to="/auth/signup" className="sign-up-link">
              Sign up
            </Link>
          </Text>
        </div>
      </div>

      {/* Right Side - Visual/Marketing */}
      <div className="login-right">
        <div className="login-visual-content">
          <h1 className="login-visual-title">
            Welcome Back to LearnWeave
          </h1>
          <p className="login-visual-subtitle">
            Continue your learning journey with AI-powered education tools designed to help you succeed.
          </p>

          <div className="feature-list">
            <div className="feature-item">
              <div className="feature-icon">
                <IconRocket size={24} />
              </div>
              <div className="feature-text">
                <h4>Pick Up Where You Left Off</h4>
                <p>Access your courses and continue learning instantly</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <IconSparkles size={24} />
              </div>
              <div className="feature-text">
                <h4>Personalized Learning</h4>
                <p>AI adapts to your pace and learning style</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <IconShieldCheck size={24} />
              </div>
              <div className="feature-text">
                <h4>Track Your Progress</h4>
                <p>Monitor achievements and stay motivated</p>
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

export default Login;
