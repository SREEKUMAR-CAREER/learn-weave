import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Outlet,
  Link as RouterLink,
  useNavigate,
  useLocation,
  useMatch,
} from "react-router-dom";
import {
  AppShell,
  Header,
  Navbar,
  Group,
  Title,
  useMantineTheme,
  ActionIcon,
  Box,
  Avatar,
  Menu,
  useMantineColorScheme,
  Badge,
  UnstyledButton,
  Text,
  ThemeIcon,
  Stack,
  Divider,
  Drawer,
  Paper,
} from "@mantine/core";
import {
  fadeIn,
  slideUp,
  scaleIn,
  buttonHover,
  pageTransition,
} from "../utils/animations";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";
import {
  IconSettings,
  IconSun,
  IconMoonStars,
  IconUser,
  IconLogout,
  IconHome2,
  IconPlus,
  IconChartLine,
  IconShieldCheck,
  IconInfoCircle,
  IconWorld,
  IconChevronRight,
  IconX,
  IconMenu2,
  IconFileExport,
  IconBook,
} from "@tabler/icons-react";
import AppFooter from "../components/AppFooter";
import TrackActivity from "../components/TrackActivity";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import CourseSidebar from "../components/CourseSidebar";
import { courseService } from "../api/courseService";
import './AppLayout.css';

// MainLink component for sidebar navigation
export const MainLink = ({
  icon,
  color,
  label,
  to,
  isActive,
  collapsed,
  onNavigate,
}) => {
  const navigate = useNavigate();
  const theme = useMantineTheme();

  const handleClick = () => {
    navigate(to);
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <UnstyledButton
      onClick={handleClick}
      className={`nav-link-premium ${isActive ? 'active' : ''}`}
      sx={{
        display: "block",
        width: collapsed ? "56px" : "calc(100% - 24px)",
        margin: collapsed ? "8px auto" : "4px 12px",
      }}
    >
      <Group
        spacing={collapsed ? 0 : 16}
        position={collapsed ? "center" : "left"}
        noWrap
      >
        <ThemeIcon
          className="icon-wrapper-premium"
          variant={isActive ? "filled" : "light"}
          color={color}
          size={40}
          sx={{
            flexShrink: 0,
            background: isActive
              ? `linear-gradient(135deg, ${theme.colors[color][6]}, ${theme.colors[color][8]})`
              : undefined
          }}
        >
          {icon}
        </ThemeIcon>

        {!collapsed && (
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Text
              size="sm"
              weight={isActive ? 800 : 600}
              color={isActive ? (theme.colorScheme === 'dark' ? 'white' : 'black') : 'dimmed'}
              sx={{
                transition: 'all 0.3s ease',
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {label}
            </Text>
          </Box>
        )}

        {!collapsed && isActive && (
          <motion.div
            layoutId="active-pill"
            style={{
              width: 6,
              height: 24,
              backgroundColor: theme.colors[color][6],
              borderRadius: '0 4px 4px 0',
              position: 'absolute',
              left: -12,
            }}
          />
        )}
      </Group>
    </UnstyledButton>
  );
};

function AppLayout() {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation to get current path
  const { user, logout } = useAuth();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { t } = useTranslation(["navigation", "app", "settings"]);
  const dark = colorScheme === "dark";
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [opened, setOpened] = useState(!isMobile);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { width: viewportWidth } = useViewportSize();
  // Scale bottom navigation elements on very small screens (min 80% up to 100%)
  const scale = Math.min(1, Math.max(0.8, (viewportWidth || 420) / 580));
  const bottomIconSize = Math.round(28 * scale);
  const bottomTextSize = Math.max(10, Math.round(12 * scale));
  const bottomPadding = Math.max(6, Math.round(6 * scale));

  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);

  // Check if the current route is a course or chapter view
  const courseViewMatch = location.pathname.match(
    /\/dashboard\/courses\/(\d+)/
  );
  const isCoursePage = !!courseViewMatch;
  const courseId = courseViewMatch ? courseViewMatch[1] : null;

  useEffect(() => {
    if (isCoursePage && courseId) {
      const fetchCourseData = async () => {
        try {
          const [courseData, chaptersData] = await Promise.all([
            courseService.getCourseById(courseId),
            courseService.getCourseChapters(courseId),
          ]);
          setCourse(courseData);
          setChapters(chaptersData || []);
        } catch (error) {
          console.error("Failed to fetch course data for sidebar:", error);
        }
      };
      fetchCourseData();
    } else {
      // Clear course data when not on a course page
      setCourse(null);
      setChapters([]);
    }
  }, [isCoursePage, courseId]);

  // Toggle navbar visibility
  const toggleNavbar = () => setOpened((o) => !o);

  // Update opened state when screen size changes
  useEffect(() => {
    // Only update if the user hasn't manually toggled the navbar
    // This prevents the navbar from changing when the user has specifically set it
    setOpened(!isMobile);
  }, [isMobile]);

  // Get current path to determine active link
  const currentPath = window.location.pathname;

  // Logic to determine avatar source
  let avatarSrc = null;
  if (user && user.profile_image_base64) {
    if (user.profile_image_base64.startsWith("data:image")) {
      avatarSrc = user.profile_image_base64;
    } else {
      avatarSrc = `data:image/jpeg;base64,${user.profile_image_base64}`;
    }
  }

  const mainLinksData = [
    {
      icon: <IconHome2 size={20} />,
      color: "blue",
      label: t("home", { ns: "navigation" }),
      to: "/dashboard",
    },
    {
      icon: <IconBook size={20} />,
      color: "violet",
      label: t("myCourses", { ns: "navigation", defaultValue: "My Courses" }),
      to: "/dashboard/my-courses",
    },
    {
      icon: <IconPlus size={20} />,
      color: "teal",
      label: t("newCourse", { ns: "navigation" }),
      to: "/dashboard/create-course",
    },
    {
      icon: <IconWorld size={22} />,
      color: "orange",
      label: t("publicCourses", { ns: "navigation", defaultValue: "Public Courses" }),
      to: "/dashboard/public-courses",
    },
    // Admin link - only shown to admin users
    ...(user?.is_admin
      ? [
        {
          icon: <IconShieldCheck size={20} />,
          color: "red",
          label: t("adminArea", { ns: "navigation" }),
          to: "/admin",
        },
        {
          icon: <IconFileExport size={20} />,
          color: "violet",
          label: "Anki Generator",
          to: "/dashboard/anki-generator",
        },
        {
          icon: <IconChartLine size={20} />,
          color: "grape",
          label: t("statistics", { ns: "navigation" }),
          to: "/dashboard/statistics",
        },
      ]
      : []),
  ];

  // Handler to close navbar on mobile when navigating
  const handleNavigate = () => {
    if (isMobile) {
      setOpened(false);
    }
  };

  const mainLinksComponents = mainLinksData.map((link) => (
    <MainLink
      {...link}
      key={link.label}
      isActive={currentPath === link.to}
      collapsed={!opened}
      onNavigate={handleNavigate}
    />
  ));

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  const isDashboard = useMatch("/dashboard");

  return (
    <>
      <TrackActivity user={user} />
      {/* FIX 1: Removed the <AnimatePresence> wrapper from here. It was causing errors by wrapping multiple static children. */}
      <AppShell
        styles={{
          main: {
            background: dark
              ? `linear-gradient(160deg, #050816 0%, #0a0f25 100%)`
              : `linear-gradient(160deg, #f8fafc 0%, #f1f5f9 100%)`,
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            width: "100%",
            paddingRight: 0,
            overflowX: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: dark ? 0.05 : 0.04,
              backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
              backgroundSize: "18px 18px",
              pointerEvents: "none",
            },
            paddingBottom: isMobile ? 'calc(96px + env(safe-area-inset-bottom))' : 0,
            position: "relative",
          },
        }}
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        header={
          <Header
            height={70}
            p="md"
            className="premium-header"
            sx={(theme) => ({
              background: dark
                ? 'rgba(5, 8, 22, 0.8)'
                : 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(20px) saturate(180%)',
              borderBottom: `1px solid ${dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`,
              zIndex: 300,
            })}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%" }}>
              <Group spacing="xs">
                {!opened && !isMobile && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    component={RouterLink}
                    to="/dashboard"
                    className="logo-wrapper"
                    style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}
                  >
                    <img
                      src={dark ? "/logo_white.png" : "/logo_black.png"}
                      alt="Logo"
                      style={{ height: 32, width: 'auto' }}
                    />
                    <Text className="logo-text-premium">
                      {t("title", { ns: "app" })}
                    </Text>
                  </motion.div>
                )}
                {isMobile && (
                  <Group spacing="xs">
                    <img
                      src={dark ? "/logo_white.png" : "/logo_black.png"}
                      alt="Logo"
                      style={{ height: 28, width: "auto" }}
                    />
                    <Text className="logo-text-premium" sx={{ fontSize: '1.2rem' }}>
                      {t("title", { ns: "app" })}
                    </Text>
                  </Group>
                )}
              </Group>

              <Group spacing="md">
                <ActionIcon
                  variant="subtle"
                  color={dark ? 'yellow' : 'gray'}
                  onClick={() => toggleColorScheme()}
                  size="lg"
                  radius="xl"
                >
                  {dark ? <IconSun size={22} /> : <IconMoonStars size={22} />}
                </ActionIcon>

                {isMobile && (
                  <ActionIcon
                    variant="subtle"
                    onClick={() => setMobileMenuOpen((o) => !o)}
                    size="lg"
                    radius="md"
                  >
                    <IconMenu2 size={24} />
                  </ActionIcon>
                )}
              </Group>
            </div>
          </Header>
        }
        navbar={
          <Navbar
            className={`premium-navbar ${!opened ? 'collapsed' : ''}`}
            p={0}
            hiddenBreakpoint="sm"
            hidden={isMobile || (!isMobile && !opened)}
            width={{
              sm: opened ? 300 : isMobile ? 0 : 88,
              lg: opened ? 300 : isMobile ? 0 : 88,
            }}
          >
            {/* Header section with logo, app name, and toggle */}
            <Box className="sidebar-header-premium">
              {opened ? (
                <Group spacing="sm" position="apart" sx={{ width: '100%' }} noWrap>
                  <div className="logo-container-premium">
                    <img
                      src={theme.colorScheme === "dark" ? "/logo_white.png" : "/logo_black.png"}
                      alt="Logo"
                      style={{ height: 32, width: "auto" }}
                    />
                    <Text className="app-title-premium">{t("title", { ns: "app" })}</Text>
                  </div>
                  <ActionIcon
                    variant="subtle"
                    onClick={() => setOpened(false)}
                    size="lg"
                    radius="xl"
                  >
                    <IconX size={18} />
                  </ActionIcon>
                </Group>
              ) : (
                <ActionIcon
                  variant="subtle"
                  onClick={() => setOpened(true)}
                  size="xl"
                  radius="xl"
                >
                  <IconMenu2 size={24} />
                </ActionIcon>
              )}
            </Box>

            {/* Navigation Links - Scrollable Section */}
            <Navbar.Section
              grow
              className="navbar-scroll-area"
              mt="md"
              sx={{
                overflowY: "auto",
                overflowX: "hidden",
                flex: "1 1 auto",
                paddingBottom: 20
              }}
            >
              <Box>
                {isCoursePage ? (
                  <CourseSidebar opened={opened} setopen={setOpened} />
                ) : (
                  <Stack spacing={4}>{mainLinksComponents}</Stack>
                )}
              </Box>
            </Navbar.Section>

            {/* Profile section at bottom - Fixed */}
            <Navbar.Section className="profile-section-premium">
              {opened ? (
                // Full profile menu when expanded
                <Menu shadow="xl" width={260} position="right-end" offset={10} withArrow>
                  <Menu.Target>
                    <UnstyledButton sx={{ width: '100%' }}>
                      <Group spacing="sm" noWrap>
                        <Avatar
                          src={avatarSrc}
                          radius="xl"
                          size={44}
                          className="user-avatar-premium"
                        >
                          {!avatarSrc && user.username?.substring(0, 2).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Text size="sm" weight={800} color={dark ? 'white' : 'black'} truncate>
                            {user.username}
                          </Text>
                          <Group spacing={4} noWrap>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                            <Text size="xs" color="dimmed" weight={600}>Online</Text>
                          </Group>
                        </Box>
                        <IconChevronRight size={14} color="gray" />
                      </Group>
                    </UnstyledButton>
                  </Menu.Target>
                  <Menu.Dropdown className="premium-menu-dropdown">
                    <Menu.Item
                      icon={<IconSettings size={18} color="var(--primary-teal)" />}
                      onClick={() => navigate("/dashboard/settings")}
                      className="premium-menu-item"
                    >
                      {t("settings", { ns: "navigation" })}
                    </Menu.Item>
                    <Menu.Item
                      icon={
                        dark ? (
                          <IconSun size={18} color="#fbbf24" />
                        ) : (
                          <IconMoonStars size={18} color="#6366f1" />
                        )
                      }
                      onClick={() => toggleColorScheme()}
                      className="premium-menu-item"
                    >
                      {t("theme", { ns: "settings" })}
                    </Menu.Item>

                    <Menu.Item
                      icon={<IconInfoCircle size={18} color="#06b6d4" />}
                      onClick={() => {
                        navigate("/");
                      }}
                      className="premium-menu-item"
                    >
                      {t("startpage", { ns: "navigation" })}
                    </Menu.Item>

                    <Divider className="premium-menu-divider" />
                    <Menu.Item
                      icon={<IconLogout size={18} />}
                      onClick={handleLogout}
                      className="premium-menu-item logout"
                    >
                      {t("logout", { ns: "navigation" })}
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ) : (
                // Collapsed profile - just avatar
                <Group position="center">
                  <Menu
                    shadow="xl"
                    width={260}
                    position="right-end"
                    offset={10}
                    withArrow
                  >
                    <Menu.Target>
                      <Avatar
                        src={avatarSrc}
                        radius="xl"
                        size={44}
                        className="user-avatar-premium"
                        sx={{ cursor: 'pointer' }}
                      >
                        {!avatarSrc && user.username?.substring(0, 2).toUpperCase()}
                      </Avatar>
                    </Menu.Target>
                    <Menu.Dropdown className="premium-menu-dropdown">
                      <Menu.Item
                        icon={<IconSettings size={18} color="var(--primary-teal)" />}
                        onClick={() => navigate("/dashboard/settings")}
                        className="premium-menu-item"
                      >
                        {t("settings", { ns: "navigation" })}
                      </Menu.Item>
                      <Menu.Item
                        icon={
                          dark ? (
                            <IconSun size={18} color="#fbbf24" />
                          ) : (
                            <IconMoonStars size={18} color="#6366f1" />
                          )
                        }
                        onClick={() => toggleColorScheme()}
                        className="premium-menu-item"
                      >
                        {t("theme", { ns: "settings" })}
                      </Menu.Item>
                      <Menu.Item
                        icon={<IconInfoCircle size={18} color="#06b6d4" />}
                        onClick={() => {
                          navigate("/about");
                        }}
                        className="premium-menu-item"
                      >
                        {t("about", { ns: "navigation" })}
                      </Menu.Item>
                      <Divider className="premium-menu-divider" />
                      <Menu.Item
                        icon={<IconLogout size={18} />}
                        onClick={handleLogout}
                        className="premium-menu-item logout"
                      >
                        {t("logout", { ns: "navigation" })}
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              )}
            </Navbar.Section>
          </Navbar>
        }
      >
        {/* FIX 2: Added <AnimatePresence> here, in the correct location around the content that changes. */}
        <AnimatePresence mode="wait">
          <Box
            component={motion.div}
            key={location.pathname} // This key is what AnimatePresence watches to trigger animations
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            sx={{
              flex: 1,
              padding: 0,
              paddingBottom: theme.spacing.xl,
              maxWidth: "100%",
              overflowX: "hidden",
              position: "relative",
            }}
          >
            <Outlet />
          </Box>
        </AnimatePresence>

        {!location.pathname.match(
          /^\/dashboard\/courses\/.*\/chapters\/.*$/
        ) && <AppFooter />}
      </AppShell>


      {/* Mobile Drawer Menu */}
      {isMobile && (
        <Drawer
          opened={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          position="bottom"
          size="auto"
          padding="xl"
          withCloseButton
          overlayProps={{ opacity: 0.5, blur: 10 }}
          styles={{
            drawer: {
              borderTopLeftRadius: '32px',
              borderTopRightRadius: '32px',
              background: dark ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              paddingBottom: 'calc(96px + env(safe-area-inset-bottom))',
            },
            header: {
              marginBottom: 20
            },
            title: {
              fontWeight: 900,
              fontSize: 24,
              color: dark ? 'white' : 'black'
            }
          }}
          title="Menu"
        >
          <Stack spacing="sm" sx={{ height: '100%', overflow: 'hidden' }}>
            {/* Navigation Links */}
            <Box sx={{
              flex: 1,
              overflowY: 'auto',
              paddingRight: 8,
              marginRight: -8,
              paddingBottom: 16,
              '&::-webkit-scrollbar': { width: 6 },
              '&::-webkit-scrollbar-track': {
                background: 'transparent',
                marginTop: 8,
                marginBottom: 8,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: dark ? theme.colors.dark[5] : theme.colors.gray[4],
                borderRadius: 3,
                '&:hover': {
                  backgroundColor: dark ? theme.colors.dark[4] : theme.colors.gray[5],
                },
              },
            }}>
              <Stack spacing="xs">
                {mainLinksData.map((link) => (
                  <MainLink
                    {...link}
                    key={`mobile-${link.to}`}
                    isActive={currentPath === link.to}
                    collapsed={false}
                    onNavigate={() => {
                      setMobileMenuOpen(false);
                    }}
                  />
                ))}

                {/* Settings Link */}
                <MainLink
                  icon={<IconSettings size={20} />}
                  color="gray"
                  label={t("settings", { ns: "navigation" })}
                  to="/dashboard/settings"
                  isActive={currentPath === "/dashboard/settings"}
                  collapsed={false}
                  onNavigate={() => {
                    setMobileMenuOpen(false);
                    navigate("/dashboard/settings");
                  }}
                />

                {/* Logout Link */}
                <MainLink
                  icon={<IconLogout size={20} />}
                  color="red"
                  label={t("logout", { ns: "navigation" })}
                  to="#"
                  isActive={false}
                  collapsed={false}
                  onNavigate={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                />
              </Stack>
            </Box>
          </Stack>
        </Drawer>
      )}

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <Paper
          shadow={dark ? "xl" : "sm"}
          radius={0}
          withBorder
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 999,
            borderTop: `1px solid ${dark ? theme.colors.dark[5] : theme.colors.gray[3]}`,
            background: dark ? theme.colors.dark[7] : theme.white,
          }}
        >
          <Group position="apart" px="md" py="xs">
            {[
              "/dashboard",
              "/dashboard/my-courses",
              "/dashboard/create-course",
            ].map((path) => {
              const item = mainLinksData.find((l) => l.to === path);
              if (!item) return null;
              const active = currentPath === item.to;
              return (
                <UnstyledButton
                  key={`bottom-${item.to}`}
                  onClick={() => navigate(item.to)}
                  sx={{
                    padding: bottomPadding,
                    borderRadius: 8,
                    color: active
                      ? theme.colors.blue[6]
                      : dark
                        ? theme.colors.dark[0]
                        : theme.colors.gray[7],
                  }}
                >
                  <Stack spacing={2} align="center">
                    <ThemeIcon
                      variant={active ? "filled" : "light"}
                      size={bottomIconSize}
                      color={active ? "blue" : "gray"}
                    >
                      {item.icon}
                    </ThemeIcon>
                    <Text weight={500} sx={{ whiteSpace: "nowrap", fontSize: `${bottomTextSize}px` }}>
                      {item.label}
                    </Text>
                  </Stack>
                </UnstyledButton>
              );
            })}
            {/* Mehr button opens the drawer */}
            <UnstyledButton
              key="bottom-more"
              onClick={() => setMobileMenuOpen((o) => !o)}
              sx={{
                padding: bottomPadding,
                borderRadius: 8,
                color: dark ? theme.colors.dark[0] : theme.colors.gray[7],
              }}
            >
              <Stack spacing={2} align="center">
                <ThemeIcon variant="light" size={bottomIconSize} color="gray">
                  <IconMenu2 size={Math.round(16 * scale)} />
                </ThemeIcon>
                <Text weight={500} sx={{ whiteSpace: "nowrap", fontSize: `${bottomTextSize}px` }}>
                  {t('more', { ns: 'navigation', defaultValue: 'Mehr' })}
                </Text>
              </Stack>
            </UnstyledButton>
          </Group>
        </Paper>
      )}
    </>
  );
};

export default AppLayout;