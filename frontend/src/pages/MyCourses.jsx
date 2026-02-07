import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container,
  Title,
  Text,
  Grid,
  Image,
  Button,
  Group,
  Loader,
  Alert,
  Box,
  TextInput,
  Paper,
  Stack,
  ActionIcon,
  Modal,
  Textarea,
  Switch,
  Badge,
} from '@mantine/core';
import {
  IconBook,
  IconAlertCircle,
  IconSearch,
  IconPencil,
  IconTrash,
  IconCheck,
  IconLoader,
  IconPlus,
  IconChevronRight,
  IconArrowRight,
  IconSparkles,
  IconWorld,
  IconX
} from '@tabler/icons-react';
import courseService from '../api/courseService';
import { useTranslation } from 'react-i18next';
import PlaceGolderImage from '../assets/place_holder_image.png';
import './MyCourses.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courseToDeleteId, setCourseToDeleteId] = useState(null);
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [courseToRename, setCourseToRename] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation('dashboard');

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'CourseStatus.CREATING':
        return <Badge color="yellow" variant="filled" radius="xl" leftSection={<IconLoader size={12} />}>Creating</Badge>;
      case 'CourseStatus.COMPLETED':
        return <Badge color="green" variant="filled" radius="xl" leftSection={<IconCheck size={12} />}>Completed</Badge>;
      default:
        return <Badge color="blue" variant="filled" radius="xl" leftSection={<IconBook size={12} />}>In Progress</Badge>;
    }
  };

  // Calculate progress for a course
  const calculateProgress = (course) => {
    if (course.status === 'CourseStatus.COMPLETED') return 100;
    if (course.status === 'CourseStatus.CREATING') return 0;
    return (course?.chapter_count > 0)
      ? Math.round((100 * (course.completed_chapter_count || 0)) / course.chapter_count)
      : 0;
  };

  // Fetch user's courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const coursesData = await courseService.getUserCourses();
        setCourses(coursesData);
        setError(null);
      } catch (err) {
        setError(t('loadCoursesError'));
        console.error('Error fetching courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [t]);

  // Filter courses based on search
  useEffect(() => {
    if (!searchQuery) {
      setFilteredCourses(courses);
    } else {
      const query = searchQuery.toLowerCase().trim();
      const filtered = courses.filter(course => {
        const title = (course.title || '').toLowerCase();
        const description = (course.description || '').toLowerCase();
        return title.includes(query) || description.includes(query);
      });
      setFilteredCourses(filtered);
    }
  }, [searchQuery, courses]);

  // Handle deletion
  const handleDelete = (courseId) => {
    setCourseToDeleteId(courseId);
    setDeleteModalOpen(true);
  };

  const confirmDeleteHandler = async () => {
    if (!courseToDeleteId) return;
    try {
      await courseService.deleteCourse(courseToDeleteId);
      setCourses(prevCourses => prevCourses.filter(course => course.course_id !== courseToDeleteId));
      setDeleteModalOpen(false);
    } catch (err) {
      setError(t('errors.deleteCourse', { message: err.message || '' }));
      console.error('Error deleting course:', err);
    }
  };

  // Handle renaming/editing
  const handleRename = (course) => {
    setCourseToRename(course);
    setNewTitle(course.title || '');
    setNewDescription(course.description || '');
    setIsPublic(course.is_public || false);
    setRenameModalOpen(true);
  };

  const confirmRenameHandler = async () => {
    if (!courseToRename) return;
    try {
      await courseService.updateCoursePublicStatus(courseToRename.course_id, isPublic);
      const updatedCourse = await courseService.updateCourse(
        courseToRename.course_id,
        newTitle,
        newDescription
      );
      const finalUpdatedCourse = { ...updatedCourse, is_public: isPublic };

      setCourses(prevCourses =>
        prevCourses.map(course =>
          course.course_id === courseToRename.course_id ? finalUpdatedCourse : course
        )
      );
      setRenameModalOpen(false);
    } catch (err) {
      setError(t('errors.renameCourse', { message: err.message || '' }));
      console.error('Error updating course:', err);
    }
  };

  return (
    <div className="my-courses-container">
      {/* Hero Section */}
      <div className="my-courses-hero">
        <div className="hero-shape-circles" />
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="my-courses-hero-content"
          >
            <Group position="apart" align="flex-end">
              <div>
                <h1 className="page-title">{t('myCoursesTitle', { defaultValue: 'My Library' })}</h1>
                <p className="page-subtitle">
                  Manage your personal learning collection and track your progress across all AI-generated courses.
                </p>
              </div>
              <Button
                size="lg"
                variant="white"
                className="create-course-btn" // Reusing styling from dashboard or custom
                leftIcon={<IconPlus size={22} />}
                onClick={() => navigate('/dashboard/create-course')}
                style={{ borderRadius: '24px', color: '#0d9488', fontWeight: 800 }}
              >
                Create New
              </Button>
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
              placeholder={t('searchMyCoursesPlaceholder', { defaultValue: 'Search your courses...' })}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              icon={<IconSearch size={22} color="#0d9488" />}
              className="premium-search-input"
              size="xl"
            />
          </motion.div>
        </div>

        {/* Error/Loading */}
        {error && (
          <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" mt="xl" radius="xl" variant="outline" withCloseButton onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Stack align="center" py={120} spacing="md">
            <Loader size="xl" variant="dots" color="teal" />
            <Text weight={600} color="dimmed">Loading your library...</Text>
          </Stack>
        ) : filteredCourses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="empty-state-premium"
          >
            <div className="empty-icon-wrapper-premium">
              <IconBook size={48} color="#0d9488" />
            </div>
            <Title order={2} mb="sm">
              {searchQuery ? 'No matches found' : 'Your library is empty'}
            </Title>
            <Text color="dimmed" mb="xl" size="lg">
              {searchQuery
                ? 'Try adjusting your search terms to find what you looking for.'
                : 'Start your learning journey by creating your very first AI-powered course.'}
            </Text>
            {!searchQuery && (
              <Button
                size="xl"
                radius="xl"
                variant="gradient"
                gradient={{ from: 'teal', to: 'cyan' }}
                onClick={() => navigate('/dashboard/create-course')}
                leftIcon={<IconSparkles size={20} />}
              >
                Create First Course
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="courses-grid-section"
          >
            <Grid gutter={32}>
              {filteredCourses.map((course) => {
                const progress = calculateProgress(course);

                return (
                  <Grid.Col key={course.course_id} xs={12} sm={6} lg={4}>
                    <motion.div variants={itemVariants}>
                      <div className="course-card-premium">
                        <div className="course-image-wrapper">
                          <Image
                            src={course.image_url || PlaceGolderImage}
                            className="course-image-premium"
                            alt={course.title}
                            onClick={() => navigate(`/dashboard/courses/${course.course_id}`)}
                            style={{ cursor: 'pointer' }}
                          />
                          <div className="badge-overlay-premium">
                            {getStatusBadge(course.status)}
                          </div>
                        </div>

                        <div className="course-content-premium">
                          <h3
                            className="course-title-premium"
                            onClick={() => navigate(`/dashboard/courses/${course.course_id}`)}
                            style={{ cursor: 'pointer' }}
                          >
                            {course.title || 'Untitled Course'}
                          </h3>
                          <Text className="course-desc-premium" lineClamp={3}>
                            {course.description || 'No description provided for this course.'}
                          </Text>

                          <div className="progress-section-premium">
                            <div className="progress-header-premium">
                              <Text size="xs" weight={800} color="dimmed" transform="uppercase">Progress</Text>
                              <Text size="xs" weight={900} color="#0d9488">{progress}%</Text>
                            </div>
                            <div className="progress-track-premium">
                              <div className="progress-fill-premium" style={{ width: `${progress}%` }} />
                            </div>
                          </div>

                          <div className="card-actions-premium">
                            <button
                              className="primary-action-btn-premium"
                              onClick={() => navigate(`/dashboard/courses/${course.course_id}`)}
                            >
                              Open Course
                              <IconArrowRight size={18} />
                            </button>
                            <div
                              className="secondary-action-icon-premium"
                              onClick={() => handleRename(course)}
                            >
                              <IconPencil size={20} />
                            </div>
                            <div
                              className="secondary-action-icon-premium delete-action-icon-premium"
                              onClick={() => handleDelete(course.course_id)}
                            >
                              <IconTrash size={20} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Grid.Col>
                );
              })}
            </Grid>
          </motion.div>
        )}
      </Container>

      {/* Modals - Keeping them rounded as per global styles or specifically here */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={<Text weight={900} size="xl">Delete Course</Text>}
        centered
        radius="32px"
        padding="xl"
      >
        <Text size="lg" mb="xl">
          Are you sure you want to delete this course from your library? This action is permanent.
        </Text>
        <Group position="right" spacing="md">
          <Button variant="subtle" color="gray" onClick={() => setDeleteModalOpen(false)} radius="xl">
            Cancel
          </Button>
          <Button color="red" onClick={confirmDeleteHandler} radius="xl" leftIcon={<IconTrash size={18} />}>
            Confirm Delete
          </Button>
        </Group>
      </Modal>

      <Modal
        opened={renameModalOpen}
        onClose={() => setRenameModalOpen(false)}
        title={<Text weight={900} size="xl">Edit Course Details</Text>}
        size="lg"
        centered
        radius="32px"
        padding="xl"
      >
        <Stack spacing="xl">
          <TextInput
            label="Course Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            radius="16px"
            size="md"
            required
          />

          <Textarea
            label="Brief Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            minRows={4}
            radius="16px"
            size="md"
          />

          <Paper p="md" radius="16px" withBorder bg="#f8fafc">
            <Switch
              label="Public Visibility"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.currentTarget.checked)}
              description="Make this course visible to the public community."
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

export default MyCourses;
