import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container,
  Text,
  Grid,
  Image,
  Button,
  Group,
  Loader,
  Alert,
  useMantineTheme,
  Box,
  TextInput,
  Paper,
  Stack,
  ActionIcon,
  Modal,
  Textarea,
  Switch,
  rem,
  Badge,
  Avatar,
  Title,
} from '@mantine/core';
import {
  IconBook,
  IconAlertCircle,
  IconWorld,
  IconSearch,
  IconUser,
  IconBooks,
  IconPencil,
  IconTrash,
  IconX,
  IconArrowRight,
  IconSparkles,
  IconGlobe
} from '@tabler/icons-react';
import courseService from '../api/courseService';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import PlaceGolderImage from '../assets/place_holder_image.png';
import './PublicCourses.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

function PublicCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation('dashboard');
  const theme = useMantineTheme();
  const { user } = useAuth();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courseToDeleteId, setCourseToDeleteId] = useState(null);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [courseToRename, setCourseToRename] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    const fetchPublicCourses = async () => {
      try {
        setLoading(true);
        const publicCoursesData = await courseService.getPublicCourses();
        setCourses(publicCoursesData);
        setError(null);
      } catch (err) {
        setError(t('loadCoursesError'));
        console.error('Error fetching public courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicCourses();
  }, [t]);

  const handleDelete = (courseId) => {
    setCourseToDeleteId(courseId);
    setDeleteModalOpen(true);
  };

  const handleRename = (course) => {
    setCourseToRename(course);
    setNewTitle(course.title || '');
    setNewDescription(course.description || '');
    setIsPublic(course.is_public || false);
    setRenameModalOpen(true);
  };

  const confirmDeleteHandler = async () => {
    if (!courseToDeleteId) return;
    try {
      await courseService.deleteCourse(courseToDeleteId);
      setCourses(courses.filter(course => course.course_id !== courseToDeleteId));
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const confirmRenameHandler = async () => {
    if (!courseToRename) return;
    try {
      const updatedCourse = await courseService.updateCourse(
        courseToRename.course_id,
        newTitle,
        newDescription
      );

      if (isPublic !== courseToRename.is_public) {
        await courseService.updateCoursePublicStatus(courseToRename.course_id, isPublic);
        updatedCourse.is_public = isPublic;
      }

      setCourses(courses.map(course =>
        course.course_id === updatedCourse.course_id ? { ...course, ...updatedCourse } : course
      ));

      setRenameModalOpen(false);
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  const filteredCourses = courses.filter(course => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const title = (course.title || '').toLowerCase();
    const description = (course.description || '').toLowerCase();
    return title.includes(query) || description.includes(query);
  });

  return (
    <div className="public-courses-container">
      {/* Hero Section */}
      <div className="public-courses-hero">
        <div className="hero-shape-world" />
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="public-courses-hero-content"
          >
            <Group position="apart" align="flex-end">
              <div>
                <h1 className="page-title">{t('publicCoursesTitle', { defaultValue: 'Global Hall' })}</h1>
                <p className="page-subtitle">
                  Discover AI-generated curricula shared by learners worldwide. Expand your horizons with community knowledge.
                </p>
              </div>
              <IconGlobe size={80} color="rgba(255,255,255,0.2)" stroke={1.5} />
            </Group>
          </motion.div>
        </Container>
      </div>

      <Container size="lg">
        {/* Search Bar */}
        <div className="search-container-floating">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <TextInput
              placeholder={t('searchPublicCoursesPlaceholder', { defaultValue: 'Search courses across the community...' })}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              icon={<IconSearch size={22} color="#0d9488" />}
              className="premium-search-input"
              size="xl"
            />
          </motion.div>
        </div>

        {error && (
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" mt="xl" radius="xl" variant="outline" withCloseButton onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Stack align="center" py={120} spacing="md">
            <Loader size="xl" variant="dots" color="teal" />
            <Text weight={600} color="dimmed">Exploring the archives...</Text>
          </Stack>
        ) : filteredCourses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="empty-state-premium"
          >
            <div className="empty-icon-wrapper-premium">
              <IconBooks size={64} color="#0d9488" />
            </div>
            <Title order={2} mb="sm" weight={900}>
              {searchQuery ? 'No courses found' : 'The hall is quiet'}
            </Title>
            <Text color="dimmed" mb="xl" size="lg" weight={500}>
              {searchQuery
                ? 'We couldn\'t find any public courses matching your search. Try different keywords.'
                : 'No public courses are available yet. Be the first to share your journey!'}
            </Text>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="courses-grid-section"
          >
            <Grid gutter={32}>
              {filteredCourses.map((course) => (
                <Grid.Col key={course.course_id} sm={6} lg={4}>
                  <motion.div variants={itemVariants}>
                    <div
                      className="course-card-premium"
                      onClick={() => navigate(`/dashboard/courses/${course.course_id}`)}
                    >
                      <div className="course-image-wrapper">
                        <Image
                          src={course.image_url || PlaceGolderImage}
                          className="course-image-premium"
                          alt={course.title}
                        />
                        <div className="author-badge-overlay">
                          <Avatar size="sm" radius="xl" color="teal">
                            {course.user_name?.charAt(0) || 'U'}
                          </Avatar>
                          <Text size="xs" weight={800} color="#1f2937">
                            {course.user_name || 'Anonymous'}
                          </Text>
                        </div>

                        {user?.is_admin && (
                          <div className="admin-actions-premium">
                            <ActionIcon
                              className="admin-icon-btn"
                              color="blue"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRename(course);
                              }}
                            >
                              <IconPencil size={18} />
                            </ActionIcon>
                            <ActionIcon
                              className="admin-icon-btn"
                              color="red"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(course.course_id);
                              }}
                            >
                              <IconTrash size={18} />
                            </ActionIcon>
                          </div>
                        )}
                      </div>

                      <div className="course-content-premium">
                        <h3 className="course-title-premium">
                          {course.title || 'Untitled Knowledge'}
                        </h3>

                        <Text className="course-desc-premium" lineClamp={4}>
                          {course.description || 'A fascinating journey into the unknown provided by our community members.'}
                        </Text>

                        <button className="view-btn-premium">
                          View Course
                          <IconArrowRight size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </Grid.Col>
              ))}
            </Grid>
          </motion.div>
        )}
      </Container>

      {/* Admin Modals */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={<Text weight={900} size="xl">System Override: Delete</Text>}
        centered
        radius="32px"
        padding="xl"
      >
        <Text size="lg" mb="xl">
          Are you sure you want to remove this public record? This action cannot be reversed.
        </Text>
        <Group position="right" spacing="md">
          <Button variant="subtle" color="gray" onClick={() => setDeleteModalOpen(false)} radius="xl">
            Cancel
          </Button>
          <Button color="red" onClick={confirmDeleteHandler} radius="xl" leftIcon={<IconTrash size={18} />}>
            Permanent Delete
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={renameModalOpen}
        onClose={() => setRenameModalOpen(false)}
        title={<Text weight={900} size="xl">System Override: Edit</Text>}
        size="lg"
        centered
        radius="32px"
        padding="xl"
      >
        <Stack spacing="xl">
          <TextInput
            label="Knowledge Title"
            value={newTitle}
            onChange={(event) => setNewTitle(event.currentTarget.value)}
            radius="16px"
            size="md"
          />
          <Textarea
            label="Curriculum Description"
            value={newDescription}
            onChange={(event) => setNewDescription(event.currentTarget.value)}
            minRows={4}
            radius="16px"
            size="md"
          />

          <Paper p="md" radius="16px" withBorder bg="#f8fafc">
            <Switch
              label="Global Visibility"
              checked={isPublic}
              onChange={(event) => setIsPublic(event.currentTarget.checked)}
              description="Toggle whether this course is visible to the global community."
              thumbIcon={
                isPublic ? (
                  <IconWorld size={12} color="#0d9488" stroke={3} />
                ) : (
                  <IconX size={12} color="#dc2626" stroke={3} />
                )
              }
            />
          </Paper>

          <Group position="right" mt="xl">
            <Button variant="subtle" color="gray" onClick={() => setRenameModalOpen(false)} radius="xl">
              Discard
            </Button>
            <Button
              onClick={confirmRenameHandler}
              radius="xl"
              variant="gradient"
              gradient={{ from: 'teal', to: 'cyan' }}
              padding="0 32px"
            >
              Save Changes
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}

export default PublicCourses;
