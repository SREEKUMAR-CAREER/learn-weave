import { Outlet, useLocation, Link as RouterLink, useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mantine/hooks';
import {
  AppShell,
  Header,
  Group,
  useMantineTheme,
  ActionIcon,
  Box,
  Button,
  Avatar,
  Menu,
  useMantineColorScheme,
  Divider,
  UnstyledButton,
  Text,
  Stack,
} from '@mantine/core';
import {
  IconSettings,
  IconSun,
  IconMoonStars,
  IconLogout,
  IconHome2,
} from '@tabler/icons-react';
import AppFooter from '../components/AppFooter';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import './MainLayout.css';

function MainLayout() {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const { t } = useTranslation(['app', 'navigation', 'common']);
  const { pathname } = useLocation();
  const dark = colorScheme === 'dark';
  const isMobile = useMediaQuery('(max-width: 768px)');
  const hideHeader = pathname === '/auth/login' || pathname === '/auth/signup';

  let avatarSrc = null;
  if (user && user.profile_image_base64) {
    avatarSrc = user.profile_image_base64.startsWith('data:image')
      ? user.profile_image_base64
      : `data:image/jpeg;base64,${user.profile_image_base64}`;
  }

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <AppShell
      styles={{
        main: {
          background: dark ? '#050816' : '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100%',
          padding: 0,
        },
      }}
      header={
        !hideHeader ? (
          <Header height={72} className="premium-header">
            <div className="header-inner">
              <Group
                component={RouterLink}
                to={isAuthenticated ? "/dashboard" : "/"}
                className="logo-wrapper"
              >
                <img
                  src={dark ? "/logo_white.png" : "/logo_black.png"}
                  alt="Logo"
                  style={{ height: 34, width: 'auto' }}
                />
                {!isMobile && (
                  <Text className="logo-text-premium">
                    {t("title", { ns: "app" })}
                  </Text>
                )}
              </Group>

              <Group spacing="xl">
                <ActionIcon
                  variant="subtle"
                  color={dark ? 'yellow' : 'gray'}
                  onClick={() => toggleColorScheme()}
                  size="lg"
                  radius="xl"
                  sx={{ transition: 'all 0.3s ease' }}
                >
                  {dark ? <IconSun size={22} /> : <IconMoonStars size={22} />}
                </ActionIcon>

                {isAuthenticated ? (
                  <Menu shadow="xl" width={260} position="bottom-end" transition="pop-top-right">
                    <Menu.Target>
                      <UnstyledButton className="profile-trigger-premium">
                        <Group spacing="sm">
                          <Avatar
                            src={avatarSrc}
                            radius="xl"
                            size="md"
                            sx={{
                              border: `2px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                              transition: 'all 0.3s ease'
                            }}
                          />
                          {!isMobile && (
                            <Stack spacing={0}>
                              <Text size="sm" weight={800} color={dark ? 'white' : 'dark'}>{user.username}</Text>
                              <Text size="xs" color="dimmed" weight={600}>Account Settings</Text>
                            </Stack>
                          )}
                        </Group>
                      </UnstyledButton>
                    </Menu.Target>
                    <Menu.Dropdown className="premium-menu-dropdown">
                      <Menu.Item
                        icon={<IconHome2 size={20} color="var(--primary-teal)" />}
                        onClick={() => navigate('/dashboard')}
                        className="premium-menu-item"
                      >
                        {t('dashboard', { ns: 'navigation' })}
                      </Menu.Item>
                      <Menu.Item
                        icon={<IconSettings size={20} color="#64748b" />}
                        onClick={() => navigate('/dashboard/settings')}
                        className="premium-menu-item"
                      >
                        {t('settings', { ns: 'navigation' })}
                      </Menu.Item>
                      <Divider className="premium-menu-divider" />
                      <Menu.Item
                        icon={<IconLogout size={20} />}
                        onClick={handleLogout}
                        className="premium-menu-item logout"
                      >
                        {t('logout', { ns: 'navigation' })}
                      </Menu.Item>
                    </Menu.Dropdown>
                  </Menu>
                ) : (
                  <Group spacing="md">
                    {!isMobile && (
                      <Button
                        component={RouterLink}
                        to="/auth/login"
                        variant="subtle"
                        className="header-action-btn"
                      >
                        Login
                      </Button>
                    )}
                    <Button
                      component={RouterLink}
                      to="/auth/signup"
                      variant="gradient"
                      gradient={{ from: 'teal', to: 'cyan' }}
                      className="header-action-btn"
                    >
                      Start for Free
                    </Button>
                  </Group>
                )}
              </Group>
            </div>
          </Header>
        ) : null
      }
    >
      <Box sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <AppFooter />
    </AppShell>
  );
}

export default MainLayout;