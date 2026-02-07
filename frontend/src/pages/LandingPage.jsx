import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Title,
    Text,
    Button,
    Grid,
    Card,
    Group,
    Stack,
    ThemeIcon,
    Transition,
    Box,
    useMantineTheme,
    keyframes,
    createStyles,
    Badge,
    Avatar,
} from "@mantine/core";

import {
    IconCheck,
    IconBrain,
    IconChartBar,
    IconUser,
    IconArrowRight,
    IconSparkles,
    IconRocket,
    IconQuote,
} from "@tabler/icons-react";
import { useAuth } from "../contexts/AuthContext";
import { useMediaQuery } from '@mantine/hooks';
import { HeroAnimation } from "../components/HeroAnimation";

// --- Animations ---
const float = keyframes({
    '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
    '50%': { transform: 'translateY(-20px) rotate(2deg)' }
});

const shine = keyframes({
    '0%': { left: '-100%' },
    '100%': { left: '100%' }
});

const useStyles = createStyles((theme) => ({
    root: {
        backgroundColor: theme.colorScheme === 'dark' ? '#050816' : '#f8fafc',
        overflowX: 'hidden',
    },

    // Premium Mesh Background
    meshGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '100vh',
        zIndex: 0,
        opacity: theme.colorScheme === 'dark' ? 0.5 : 0.2,
        background: `
      radial-gradient(at 0% 0%, ${theme.colors.teal[9]} 0px, transparent 50%),
      radial-gradient(at 100% 0%, ${theme.colors.cyan[8]} 0px, transparent 50%),
      radial-gradient(at 100% 100%, ${theme.colors.blue[9]} 0px, transparent 50%),
      radial-gradient(at 0% 100%, ${theme.colors.indigo[9]} 0px, transparent 50%)
    `,
        filter: 'blur(80px)',
    },

    hero: {
        position: 'relative',
        paddingTop: 'clamp(100px, 15vh, 200px)',
        paddingBottom: 'clamp(100px, 10vh, 150px)',
        minHeight: '90vh',
    },

    title: {
        fontSize: 'clamp(40px, 5vw, 72px)',
        fontWeight: 900,
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
        color: theme.colorScheme === 'dark' ? theme.white : theme.colors.gray[9],

        '& span': {
            background: theme.fn.linearGradient(45, theme.colors.teal[4], theme.colors.cyan[4]),
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
        }
    },

    // Glassmorphic Feature Cards
    glassCard: {
        backgroundColor: theme.colorScheme === 'dark'
            ? 'rgba(17, 25, 40, 0.75)'
            : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(16px) saturate(180%)',
        border: `1px solid ${theme.colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
        borderRadius: theme.radius.xl,
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',

        '&:hover': {
            transform: 'translateY(-12px)',
            boxShadow: theme.shadows.xl,
            borderColor: theme.colors.teal[5],
        }
    },

    primaryButton: {
        height: 54,
        padding: '0 34px',
        borderRadius: theme.radius.xl,
        fontSize: theme.fontSizes.md,
        background: theme.fn.linearGradient(45, theme.colors.teal[6], theme.colors.cyan[6]),
        transition: 'all 0.3s ease',
        border: 0,
        position: 'relative',
        overflow: 'hidden',

        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 12px 24px ${theme.fn.rgba(theme.colors.teal[6], 0.4)}`,
            background: theme.fn.linearGradient(45, theme.colors.teal[5], theme.colors.cyan[5]),
        },
    },

    statBadge: {
        backgroundColor: theme.colorScheme === 'dark' ? 'rgba(0,0,0,0.3)' : theme.white,
        border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]}`,
        padding: '8px 16px',
        borderRadius: theme.radius.xl,
        width: 'fit-content',
    },

    sectionTitle: {
        position: 'relative',
        '&::after': {
            content: '""',
            display: 'block',
            width: 60,
            height: 4,
            borderRadius: 2,
            backgroundColor: theme.colors.teal[5],
            margin: '16px auto',
        }
    }
}));

function LandingPage() {
    const { t } = useTranslation("landingPage");
    const { classes, cx } = useStyles();
    const theme = useMantineTheme();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');

    useEffect(() => {
        setVisible(true);
    }, []);

    return (
        <Box className={classes.root}>
            <div className={classes.meshGradient} />

            {/* --- Hero Section --- */}
            <Container size="xl" className={classes.hero}>
                <Stack spacing={80} align="center" justify="center" sx={{ minHeight: '70vh' }}>
                    <Grid gutter={60} align="center" justify="center" sx={{ width: '100%' }}>
                        <Grid.Col md={6} lg={6}>
                            <Transition mounted={visible} transition="slide-up" duration={800}>
                                {(styles) => (
                                    <Stack spacing="xl" style={styles} align={isMobile ? "center" : "flex-start"}>
                                        <Title className={classes.title} sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                                            {t('hero.title_part1', 'Empower Your')} <br />
                                            <span>{t('hero.title_highlight', 'Future with AI')}</span>
                                        </Title>

                                        <Text
                                            size="xl"
                                            color="dimmed"
                                            sx={{
                                                lineHeight: 1.6,
                                                maxWidth: 550,
                                                textAlign: isMobile ? 'center' : 'left'
                                            }}
                                        >
                                            {t('hero.subtitle', 'The all-in-one ecosystem for creators and students. Generate courses, automate grading, and scale your knowledge with artificial intelligence.')}
                                        </Text>

                                        <Group spacing="lg" position={isMobile ? "center" : "left"}>
                                            <Button
                                                className={classes.primaryButton}
                                                rightIcon={<IconArrowRight size={20} />}
                                                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth/signup')}
                                            >
                                                {isAuthenticated ? 'Enter Dashboard' : 'Get Started Free'}
                                            </Button>
                                            <Button
                                                variant="subtle"
                                                color="gray"
                                                size="lg"
                                                radius="xl"
                                                leftIcon={<IconRocket size={20} />}
                                            >
                                                View Demo
                                            </Button>
                                        </Group>

                                        <Group mt="xl" spacing={40} position={isMobile ? "center" : "left"}>
                                            {[['10k+', 'Active Users'], ['99%', 'AI Accuracy'], ['24/7', 'Support']].map(([val, label]) => (
                                                <Box key={label} sx={{ textAlign: isMobile ? 'center' : 'left' }}>
                                                    <Text weight={800} size="xl">{val}</Text>
                                                    <Text size="xs" color="dimmed" tt="uppercase" lts={1}>{label}</Text>
                                                </Box>
                                            ))}
                                        </Group>
                                    </Stack>
                                )}
                            </Transition>
                        </Grid.Col>

                        <Grid.Col md={6} lg={5} sx={{
                            position: 'relative',
                            marginTop: '-120px', // Push 3D closer to header
                            '@media (max-width: 900px)': { marginTop: 0 }
                        }}>
                            <Box sx={{ animation: `${float} 6s ease-in-out infinite` }}>
                                <HeroAnimation />
                            </Box>
                        </Grid.Col>
                    </Grid>
                </Stack>
            </Container>

            {/* --- Features Section (Bento Style) --- */}
            <Container size="xl" py={100} id="features">
                <Stack align="center" mb={60}>
                    <Badge variant="dot" color="teal" size="lg">Capabilities</Badge>
                    <Title order={2} className={classes.sectionTitle} align="center">
                        Everything you need to <br /> scale education
                    </Title>
                </Stack>

                <Grid gutter="xl">
                    <Grid.Col md={4}>
                        <Card className={classes.glassCard} p="xl">
                            <ThemeIcon size={60} radius="xl" variant="light" color="teal" mb="xl">
                                <IconBrain size={34} />
                            </ThemeIcon>
                            <Title order={3} mb="sm">Adaptive AI Curriculums</Title>
                            <Text color="dimmed" mb="lg">Our AI analyzes student performance in real-time to adjust course difficulty and content delivery dynamically.</Text>
                        </Card>
                    </Grid.Col>

                    <Grid.Col md={8}>
                        <Card className={classes.glassCard} p="xl" sx={{ height: '100%' }}>
                            <Grid align="center">
                                <Grid.Col sm={7}>
                                    <Title order={3} mb="sm">Predictive Analytics Dashboard</Title>
                                    <Text color="dimmed">Visualize the future. Our platform doesn't just show past grades; it predicts student success rates and identifies bottlenecks before they happen.</Text>
                                    <Button variant="outline" color="teal" mt="xl" radius="md">Explore Analytics</Button>
                                </Grid.Col>
                                <Grid.Col sm={5}>
                                    <ThemeIcon size={120} radius="xl" variant="light" color="cyan" sx={{ opacity: 0.5 }}>
                                        <IconChartBar size={80} />
                                    </ThemeIcon>
                                </Grid.Col>
                            </Grid>
                        </Card>
                    </Grid.Col>

                    <Grid.Col md={7}>
                        <Card className={classes.glassCard} p="xl">
                            <Group position="apart" mb="xl">
                                <Title order={3}>Collaborative Workspace</Title>
                                <IconUser color={theme.colors.indigo[5]} />
                            </Group>
                            <Text color="dimmed">Built-in tools for peer review, group projects, and instructor feedback loops that actually work.</Text>
                        </Card>
                    </Grid.Col>

                </Grid>

                {/* Ready to Start CTA Card */}
                <Card
                    className={classes.glassCard}
                    p="xl"
                    mt="xl"
                    sx={{
                        background: theme.fn.linearGradient(45, theme.colors.teal[6], theme.colors.cyan[6]),
                        border: 0,
                        color: 'white',
                        cursor: 'pointer',
                        '&:hover': {
                            transform: 'translateY(-8px)',
                        }
                    }}
                    onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth/signup')}
                >
                    <Group position="apart" align="center">
                        <div>
                            <Title order={3} color="white">Ready to start?</Title>
                            <Text color="white" opacity={0.9}>Join 500+ institutions worldwide today.</Text>
                        </div>
                        <IconArrowRight size={32} />
                    </Group>
                </Card>
            </Container>

            {/* --- Testimonial Section --- */}
            <Box py={100} sx={{ backgroundColor: theme.colorScheme === 'dark' ? 'rgba(255,255,255,0.02)' : 'white' }}>
                <Container size="xl">
                    <Title order={2} align="center" mb={50}>Proven results from leaders</Title>
                    <Grid>
                        {[1, 2, 3].map((i) => (
                            <Grid.Col md={4} key={i}>
                                <Card className={classes.glassCard} p="xl">
                                    <IconQuote size={40} color={theme.colors.teal[5]} style={{ opacity: 0.3 }} />
                                    <Text size="lg" mb="xl" italic>
                                        "The speed at which we can now deploy high-quality training modules is simply unprecedented."
                                    </Text>
                                    <Group>
                                        <Avatar radius="xl" color="teal">JD</Avatar>
                                        <div>
                                            <Text weight={700}>Director of Learning</Text>
                                            <Text size="xs" color="dimmed">Fortune 500 Co.</Text>
                                        </div>
                                    </Group>
                                </Card>
                            </Grid.Col>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* --- Final CTA --- */}
            <Container size="md" py={120}>
                <Box
                    p={isMobile ? 40 : 80}
                    sx={{
                        borderRadius: theme.radius.xl,
                        background: theme.colorScheme === 'dark' ? '#111827' : theme.white,
                        border: `1px solid ${theme.colors.teal[8]}`,
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <Title order={2} size={42} mb="md">Start your AI journey today</Title>
                        <Text size="xl" color="dimmed" mb={40}>
                            No credit card required. Cancel anytime.
                        </Text>
                        <Button
                            className={classes.primaryButton}
                            size="xl"
                            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth/signup')}
                        >
                            Create Your First Course
                        </Button>
                    </div>
                </Box>
            </Container>
        </Box>
    );
}

export default LandingPage;