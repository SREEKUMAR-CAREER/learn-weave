import {
  Container,
  Title,
  Text,
  Grid,
  Button,
  Stack,
  Box,
  Badge,
  useMantineTheme,
  Group,
} from '@mantine/core';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  IconRocket,
  IconBulb,
  IconUserCheck,
  IconWorld,
  IconBrain,
  IconArrowRight,
  IconSparkles,
  IconFlame,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import './About.css';

function About() {
  const { t } = useTranslation('about');
  const theme = useMantineTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(isAuthenticated ? '/dashboard' : '/auth/login');
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="about-wrapper">
      <div className="about-decor-1" />
      <div className="about-decor-2" />

      <Container size="xl">
        {/* --- Hero Section --- */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="about-hero"
        >
          <Badge
            variant="filled"
            size="lg"
            mb="xl"
            sx={{
              background: 'rgba(13, 148, 136, 0.1)',
              color: '#0d9488',
              fontWeight: 800,
              padding: '12px 20px',
              borderRadius: '12px'
            }}
          >
            THE FUTURE OF LEARNING
          </Badge>
          <Title className="about-title">
            <Box component="span" sx={{
              background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Architecting Human Potential
            </Box>
          </Title>
          <Text className="about-description">
            LearnWeave is more than a platform. It's an intelligent ecosystem designed to weave together knowledge, focus, and progress into a seamless mastery experience.
          </Text>
        </motion.div>

        {/* --- Bento Grid Section --- */}
        <div className="bento-grid">
          {/* Card 1: Main Vision */}
          <Box
            component={motion.div}
            className="bento-item bento-large"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="bento-icon-box">
              <IconBrain size={32} />
            </div>
            <span className="bento-tag">The Core Vision</span>
            <Title order={2} size={36} mb="xl" weight={900}>Neural Learning Optimization</Title>
            <Text size="lg" color="dimmed" sx={{ lineHeight: 1.8, maxWidth: '90%' }}>
              We believe learning shouldn't be fragmented. By utilizing advanced AI algorithms, we "weave" complex subjects into structured, digestible hierarchies that align with how the human brain actually processes information.
            </Text>
            <Box sx={{ flex: 1 }} />
            <Group mt={40}>
              <Button
                variant="subtle"
                color="teal"
                rightIcon={<IconArrowRight size={18} />}
                sx={{ fontWeight: 800 }}
                onClick={handleButtonClick}
              >
                Explore Dashboard
              </Button>
            </Group>
          </Box>

          {/* Card 2: Global Impact */}
          <Box
            component={motion.div}
            className="bento-item bento-small"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="bento-icon-box" style={{ color: '#06b6d4' }}>
              <IconWorld size={32} />
            </div>
            <span className="bento-tag" style={{ color: '#06b6d4' }}>Accessibility</span>
            <Title order={3} size={24} mb="md" weight={900}>Global Knowledge Mesh</Title>
            <Text color="dimmed">
              Breaking down geographical and economic barriers to high-level education through decentralized AI-driven curriculums.
            </Text>
          </Box>

          {/* Card 3: Experience */}
          <Box
            component={motion.div}
            className="bento-item bento-small"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="bento-icon-box" style={{ color: '#6366f1' }}>
              <IconSparkles size={32} />
            </div>
            <span className="bento-tag" style={{ color: '#6366f1' }}>Experience</span>
            <Title order={3} size={24} mb="md" weight={900}>Premium Workflow</Title>
            <Text color="dimmed">
              A distraction-free interface engineered for deep work session and state-of-the-art information retention.
            </Text>
          </Box>

          {/* Card 4: Focus */}
          <Box
            component={motion.div}
            className="bento-item bento-medium"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="bento-icon-box" style={{ color: '#f59e0b' }}>
              <IconFlame size={32} />
            </div>
            <span className="bento-tag" style={{ color: '#f59e0b' }}>Methodology</span>
            <Title order={3} size={28} mb="md" weight={900}>The Weaving Method</Title>
            <Text color="dimmed" size="lg">
              Our unique approach combines Spaced Repetition, Pomodoro focus techniques, and AI synthesis to create a curriculum that evolves with your performance.
            </Text>
          </Box>

          {/* Card 5: Trust */}
          <Box
            component={motion.div}
            className="bento-item bento-medium"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="bento-icon-box" style={{ color: '#ec4899' }}>
              <IconUserCheck size={32} />
            </div>
            <span className="bento-tag" style={{ color: '#ec4899' }}>Community</span>
            <Title order={3} size={28} mb="md" weight={900}>User-Centric Design</Title>
            <Text color="dimmed" size="lg">
              Every feature we build is directly inspired by our community of lifelong learners, researchers, and professional developers.
            </Text>
          </Box>
        </div>

        {/* --- Final CTA --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <Box className="glass-cta">
            <div className="glass-cta-inner">
              <Stack align="center" spacing="xl">
                <IconRocket size={64} />
                <Title size={isMobile ? 32 : 54} weight={900} lts={-2}>Ready to Weave Your Future?</Title>
                <Text size="xl" sx={{ maxWidth: 600, opacity: 0.9, fontWeight: 500 }}>
                  Join thousands of elite learners who are already using LearnWeave to master complex subjects at 5x speed.
                </Text>
                <Button
                  size="xl"
                  variant="white"
                  color="teal"
                  radius="xl"
                  px={60}
                  mt={20}
                  onClick={handleButtonClick}
                  rightIcon={<IconArrowRight size={22} />}
                  sx={{
                    height: 70,
                    fontSize: 20,
                    fontWeight: 900,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px) scale(1.02)',
                      boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
                    }
                  }}
                >
                  Start Mastery Now
                </Button>
              </Stack>
            </div>
          </Box>
        </motion.div>
      </Container>
    </div>
  );
}

const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;

export default About;
