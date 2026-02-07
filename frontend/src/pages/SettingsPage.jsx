import {
  Container,
  Paper,
  Title,
  TextInput,
  PasswordInput,
  Button,
  Group,
  Avatar,
  FileButton,
  Text,
  Alert,
  Divider,
  Box,
  Transition,
  ActionIcon,
  Tooltip,
  Badge,
  SimpleGrid,
  useMantineTheme,
  Stack,
  Center,
  Switch,
  useMantineColorScheme
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconAlertCircle,
  IconUpload,
  IconPhoto,
  IconSettings,
  IconLock,
  IconTrash,
  IconUser,
  IconAt,
  IconKey,
  IconDeviceFloppy,
  IconPalette,
  IconShieldLock,
  IconChevronRight,
  IconSun,
  IconMoonStars
} from '@tabler/icons-react';
import { useAuth } from '../contexts/AuthContext';
import userService from '../api/userService';
import { toast } from 'react-toastify';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import './SettingsPage.css';

const MAX_FILE_SIZE_MB = 12;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

function SettingsPage() {
  const theme = useMantineTheme();
  const { user, setUser, loading: authLoading } = useAuth();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';
  const { t } = useTranslation('settings');

  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(user?.profile_image_base64 || null);
  const resetRef = useRef(null);

  const generalForm = useForm({
    initialValues: {
      username: user?.username || '',
      email: user?.email || '',
    },
    validate: {
      username: (value) => (value && value.length < 3 ? t('validation.usernameMinLength', 'Username must be at least 3 characters') : null),
    },
  });

  const passwordForm = useForm({
    initialValues: {
      old_password: '',
      new_password: '',
      confirm_new_password: '',
    },
    validate: {
      old_password: (value) => (value ? null : t('validation.oldPasswordRequired', 'Old password is required')),
      new_password: (value) =>
        value.length < 3 ? t('validation.newPasswordMinLength', 'New password must be at least 3 characters') : null,
      confirm_new_password: (value, values) =>
        value !== values.new_password ? t('validation.passwordsDoNotMatch', 'Passwords do not match') : null,
    },
  });

  useEffect(() => {
    if (user) {
      if (!generalForm.values.username || generalForm.values.username === '') {
        generalForm.setFieldValue('username', user.username || '');
      }
      if (!generalForm.values.email || generalForm.values.email === '') {
        generalForm.setFieldValue('email', user.email || '');
      }
    }

    if (profileImageFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(profileImageFile);
    } else if (user?.profile_image_base64) {
      const img = user.profile_image_base64;
      setPreviewImage(img.startsWith('data:image') ? img : `data:image/jpeg;base64,${img}`);
    } else {
      setPreviewImage(null);
    }
  }, [user, profileImageFile]);

  const handleFileChange = (file) => {
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error(t('toast.fileTooLarge', { maxSize: MAX_FILE_SIZE_MB }));
        resetRef.current?.();
        return;
      }
      setProfileImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImageFile(null);
    setPreviewImage(null);
    resetRef.current?.();
  };

  const handleGeneralSubmit = async (formValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const userDataToUpdate = { username: formValues.username };
      if (!user?.id) throw new Error(t('authError.userIdMissing', "User ID missing"));

      if (profileImageFile || previewImage !== user.profile_image_base64) {
        userDataToUpdate.profile_image_base64 = previewImage;
      }

      const updatedUser = await userService.updateUser(user.id, userDataToUpdate);
      setUser(updatedUser);
      toast.success(t('toast.profileUpdateSuccess', 'Profile updated!'));
      setProfileImageFile(null);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message;
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (values) => {
    setIsLoading(true);
    setPasswordError(null);
    try {
      await userService.changePassword(user.id, values.old_password, values.new_password);
      toast.success(t('toast.passwordChangeSuccess', 'Password updated!'));
      passwordForm.reset();
    } catch (err) {
      const msg = err.response?.data?.detail || err.message;
      setPasswordError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) return <Center h="80vh"><Text weight={700}>Loading Premium Experience...</Text></Center>;

  const TabItem = ({ id, icon: Icon, label }) => (
    <div
      className={`settings-nav-item ${activeTab === id ? 'active' : ''}`}
      onClick={() => setActiveTab(id)}
    >
      <Icon size={20} />
      <Text sx={{ flex: 1 }}>{label}</Text>
      {activeTab === id && <IconChevronRight size={16} />}
    </div>
  );

  return (
    <Container size="xl" className="settings-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="settings-hero"
      >
        <Title className="settings-hero-title">{t('pageTitle', 'Account Settings')}</Title>
        <Text color="dimmed" size="lg" weight={500}>Customize your experience and manage your profile</Text>
      </motion.div>

      <div className="settings-grid">
        {/* Navigation Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Paper className="settings-card" p="md">
            <Stack spacing={8}>
              <TabItem id="profile" icon={IconUser} label="Profile Info" />
              <TabItem id="security" icon={IconShieldLock} label="Security" />
              <TabItem id="appearance" icon={IconPalette} label="Appearance" />
            </Stack>
          </Paper>
        </motion.div>

        {/* Content Area */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="settings-card">
                  <div className="settings-card-header">
                    <IconUser size={24} color="var(--primary-teal)" />
                    <Title order={3}>General Information</Title>
                  </div>
                  <div className="settings-card-body">
                    <form onSubmit={generalForm.onSubmit(handleGeneralSubmit)}>
                      <div className="settings-avatar-wrapper">
                        <Avatar
                          src={previewImage}
                          className="settings-avatar-main"
                        >
                          {!previewImage && user?.username?.charAt(0).toUpperCase()}
                        </Avatar>
                        <FileButton resetRef={resetRef} onChange={handleFileChange} accept="image/*">
                          {(props) => (
                            <div className="settings-avatar-badge" {...props}>
                              <IconPhoto size={20} />
                            </div>
                          )}
                        </FileButton>
                        {previewImage && (
                          <ActionIcon
                            color="red"
                            variant="filled"
                            radius="xl"
                            size="lg"
                            onClick={handleRemoveImage}
                            sx={{ position: 'absolute', top: 0, right: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                          >
                            <IconTrash size={18} />
                          </ActionIcon>
                        )}
                      </div>

                      <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                        <TextInput
                          label="Username"
                          placeholder="Your unique name"
                          icon={<IconUser size={18} />}
                          className="premium-input"
                          {...generalForm.getInputProps('username')}
                        />
                        <TextInput
                          label="Email Address"
                          placeholder="your@email.com"
                          icon={<IconAt size={18} />}
                          className="premium-input"
                          disabled
                          {...generalForm.getInputProps('email')}
                        />
                      </SimpleGrid>

                      <Button
                        type="submit"
                        className="premium-button"
                        fullWidth
                        mt={40}
                        loading={isLoading}
                        leftIcon={<IconDeviceFloppy size={20} />}
                      >
                        Save Profile Changes
                      </Button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="settings-card">
                  <div className="settings-card-header">
                    <IconLock size={24} color="#f59e0b" />
                    <Title order={3}>Security Settings</Title>
                  </div>
                  <div className="settings-card-body">
                    {passwordError && <Alert color="red" mb="lg" icon={<IconAlertCircle />}>{passwordError}</Alert>}
                    <form onSubmit={passwordForm.onSubmit(handleChangePassword)}>
                      <Stack spacing="xl">
                        <PasswordInput
                          label="Current Password"
                          icon={<IconKey size={18} />}
                          className="premium-input"
                          {...passwordForm.getInputProps('old_password')}
                        />
                        <PasswordInput
                          label="New Password"
                          icon={<IconKey size={18} />}
                          className="premium-input"
                          {...passwordForm.getInputProps('new_password')}
                        />
                        <PasswordInput
                          label="Confirm New Password"
                          icon={<IconKey size={18} />}
                          className="premium-input"
                          {...passwordForm.getInputProps('confirm_new_password')}
                        />
                      </Stack>
                      <Button
                        type="submit"
                        className="premium-button"
                        color="orange"
                        fullWidth
                        mt={40}
                        loading={isLoading}
                        leftIcon={<IconShieldLock size={20} />}
                        sx={{ background: 'linear-gradient(135deg, #f59e0b, #d97706) !important' }}
                      >
                        Update My Password
                      </Button>
                    </form>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'appearance' && (
              <motion.div
                key="appearance"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="settings-card">
                  <div className="settings-card-header">
                    <IconPalette size={24} color="#6366f1" />
                    <Title order={3}>Appearance & Interface</Title>
                  </div>
                  <div className="settings-card-body">
                    <Paper
                      p="xl"
                      radius="xl"
                      sx={(theme) => ({
                        background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
                        border: `1px dashed ${theme.colors.gray[4]}`
                      })}
                    >
                      <Group position="apart">
                        <Stack spacing={4}>
                          <Text weight={800} size="lg">Dark Mode Experience</Text>
                          <Text color="dimmed" size="sm">Switch between light and dark themes</Text>
                        </Stack>
                        <Switch
                          checked={dark}
                          onChange={() => toggleColorScheme()}
                          size="xl"
                          color="teal"
                          onLabel={<IconSun size={20} stroke={2.5} color="#fbbf24" />}
                          offLabel={<IconMoonStars size={20} stroke={2.5} color="#6366f1" />}
                          styles={{
                            track: { height: 42, width: 80 },
                            thumb: { width: 34, height: 34, left: 4 },
                          }}
                        />
                      </Group>
                    </Paper>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </Container>
  );
}

export default SettingsPage;
