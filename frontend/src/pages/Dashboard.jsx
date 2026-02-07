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
  Stack,
  Badge,
  ActionIcon,
  Loader,
  Alert,
  Modal,
  TextInput,
  Textarea,
  Box,
  Switch,
  Paper,
} from '@mantine/core';
import {
  IconBook,
  IconTrash,
  IconPencil,
  IconWorld,
  IconX,
  IconPlus,
  IconAlertCircle,
  IconClock,
  IconFlame,
  IconChevronRight,
  IconSparkles,
  IconArrowRight,
} from '@tabler/icons-react';
import courseService from '../api/courseService';
import statisticsService from '../api/statisticsService';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import PlaceHolderImage from '../assets/place_holder_image.png';
import './Dashboard.css';

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

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courseToDeleteId, setCourseToDeleteId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [totalLearnTime, setTotalLearnTime] = useState(0);

  const navigate = useNavigate();
  const { t } = useTranslation('dashboard');
  const { user } = useAuth();

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const coursesData = await courseService.getUserCourses();
        setCourses(coursesData);
        setError(null);
      } catch (error) {
        setError('Failed to load courses');
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch total learn time
  useEffect(() => {
    const fetchTotalLearnTime = async () => {
      if (!user?.id) return;

      try {
        const data = await statisticsService.getTotalLearnTime(user.id);
        setTotalLearnTime(data ? Math.round(data / 3600) : 0);
      } catch (err) {
        console.error('Error fetching total learn time:', err);
      }
    };

    fetchTotalLearnTime();
  }, [user?.id]);

  // Calculate progress for a course
  const calculateProgress = (course) => {
    if (course.status === 'CourseStatus.COMPLETED') return 100;
    if (course.status === 'CourseStatus.CREATING') return 0;

    return (course && course.chapter_count && course.chapter_count > 0)
      ? Math.round((100 * (course.completed_chapter_count || 0) / course.chapter_count))
      : 0;
  };

  // Delete course
  const handleDelete = (courseId) => {
    setCourseToDeleteId(courseId);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!courseToDeleteId) return;
    try {
      await courseService.deleteCourse(courseToDeleteId);
      setCourses(prevCourses => prevCourses.filter(course => course.course_id !== courseToDeleteId));
      setError(null);
    } catch (err) {
      setError('Failed to delete course');
      console.error('Error deleting course:', err);
    } finally {
      setDeleteModalOpen(false);
      setCourseToDeleteId(null);
    }
  };

  // Edit course
  const handleEdit = (course) => {
    setCourseToEdit(course);
    setNewTitle(course.title || '');
    setNewDescription(course.description || '');
    setIsPublic(course.is_public || false);
    setEditModalOpen(true);
  };

  const confirmEdit = async () => {
    if (!courseToEdit) return;

    try {
      await courseService.updateCoursePublicStatus(courseToEdit.course_id, isPublic);
      const updatedCourse = await courseService.updateCourse(
        courseToEdit.course_id,
        newTitle,
        newDescription
      );

      const finalUpdatedCourse = { ...updatedCourse, is_public: isPublic };
      setCourses(prevCourses =>
        prevCourses.map(course =>
          course.course_id === courseToEdit.course_id ? finalUpdatedCourse : course
        )
      );
      setEditModalOpen(false);
    } catch (err) {
      setError('Failed to update course');
      console.error('Error updating course:', err);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'CourseStatus.CREATING':
        return <Badge color="yellow" variant="light" radius="xl">Creating</Badge>;
      case 'CourseStatus.COMPLETED':
        return <Badge color="green" variant="light" radius="xl">Completed</Badge>;
      default:
        return <Badge color="blue" variant="light" radius="xl">In Progress</Badge>;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-bg-glow" />

      {/* Hero Section */}
      <div className="dashboard-hero">
        <div className="hero-shape-1" />
        <div className="hero-shape-2" />
        <Container size="lg">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="dashboard-hero-content"
          >
            <Group position="apart" align="flex-end">
              <div>
                <h1 className="dashboard-welcome-title">
                  Welcome back, {user?.username?.split('@')[0] || 'Learner'}! 👋
                </h1>
                <p className="dashboard-welcome-subtitle">
                  Your personalized AI-powered learning journey continues here.
                  Achieve your daily goals and expand your knowledge.
                </p>
              </div>
              <Button
                size="lg"
                leftIcon={<IconPlus size={22} />}
                onClick={() => navigate('/dashboard/create-course')}
                className="create-course-btn"
              >
                New Course
              </Button>
            </Group>
          </motion.div>
        </Container>
      </div>

      <Container size="lg">
        {/* Stats Section */}
        <div className="stats-container">
          <Grid gutter="xl">
            {[
              { label: 'Day Streak', value: user?.login_streak || 0, icon: <IconFlame size={32} /> },
              { label: 'Total Courses', value: courses.length, icon: <IconBook size={32} /> },
              { label: 'Hours Learned', value: totalLearnTime, icon: <IconClock size={32} /> },
            ].map((stat, idx) => (
              <Grid.Col key={idx} xs={12} sm={4}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1, duration: 0.6 }}
                >
                  <Paper className="stat-card">
                    <div className="stat-icon-wrapper">
                      {stat.icon}
                    </div>
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </Paper>
                </motion.div>
              </Grid.Col>
            ))}
          </Grid>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <Alert
                icon={<IconAlertCircle size={16} />}
                title="Error"
                color="red"
                mb="xl"
                mt="xl"
                variant="outline"
                withCloseButton
                onClose={() => setError(null)}
                radius="xl"
              >
                {error}
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Courses Section */}
        <Box className="courses-section">
          <div className="section-header">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="section-title">Continue Learning</h2>
              <Text size="sm" color="dimmed" mt={4} weight={500}>
                {courses.length > 0
                  ? `You have ${courses.length} active course${courses.length !== 1 ? 's' : ''}`
                  : 'Start your journey by creating a specialized course'}
              </Text>
            </motion.div>
          </div>

          {loading ? (
            <Stack align="center" py={100} spacing="md">
              <Loader size="xl" variant="dots" color="teal" />
              <Text weight={600} color="dimmed">Weaving your dashboard...</Text>
            </Stack>
          ) : courses.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="empty-state"
              style={{ textAlign: 'center', padding: '100px 0' }}
            >
              <div className="empty-state-icon" style={{
                width: 100, height: 100, borderRadius: '50%',
                background: 'rgba(13, 148, 136, 0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 24px'
              }}>
                <IconSparkles size={48} color="#0d9488" />
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12 }}>Unlock Your Potential</h3>
              <p style={{ color: '#6b7280', maxWidth: 400, margin: '0 auto 32px' }}>
                Create your first AI-driven curriculum in seconds. Just type a topic and let LearnWeave do the rest.
              </p>
              <Button
                size="xl"
                radius="xl"
                variant="gradient"
                gradient={{ from: 'teal', to: 'cyan' }}
                onClick={() => navigate('/dashboard/create-course')}
                leftIcon={<IconPlus size={20} />}
              >
                Begin Your Journey
              </Button>
            </motion.div>
          ) : (
            <Grid gutter={32}>
              {courses.map((course, idx) => {
                const progress = calculateProgress(course);

                return (
                  <Grid.Col key={course.course_id} xs={12} sm={6} lg={4}>
                    <motion.div
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: 0.6 + idx * 0.1 }}
                    >
                      <Paper className="course-card">
                        <div className="course-image-container">
                          <Image
                            src={course.image_url || PlaceHolderImage}
                            alt={course.title}
                            className="course-image"
                            onClick={() => navigate(`/dashboard/courses/${course.course_id}`)}
                            style={{ cursor: 'pointer' }}
                          />
                          <div className="course-badge-overlay">
                            {getStatusBadge(course.status)}
                          </div>
                        </div>

                        <div className="course-content">
                          <Group position="apart" mb="md">
                            <h3
                              className="course-title"
                              onClick={() => navigate(`/dashboard/courses/${course.course_id}`)}
                              style={{ cursor: 'pointer' }}
                            >
                              {course.title || 'Untitled Course'}
                            </h3>
                            <Group spacing={8}>
                              <ActionIcon
                                size="lg"
                                radius="md"
                                variant="subtle"
                                color="blue"
                                onClick={() => handleEdit(course)}
                              >
                                <IconPencil size={20} />
                              </ActionIcon>
                              <ActionIcon
                                size="lg"
                                radius="md"
                                variant="subtle"
                                color="red"
                                onClick={() => handleDelete(course.course_id)}
                              >
                                <IconTrash size={20} />
                              </ActionIcon>
                            </Group>
                          </Group>

                          <p className="course-description" style={{
                            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
                          }}>
                            {course.description || 'No description available'}
                          </p>

                          <div className="premium-progress-container">
                            <div className="progress-label-group">
                              <Text size="sm" weight={700} color="#1f2937">Current Progress</Text>
                              <Text size="sm" weight={800} color="#0d9488">{progress}%</Text>
                            </div>
                            <div className="progress-bar-bg">
                              <div
                                className="progress-bar-fill"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>

                          <button
                            className="premium-action-btn"
                            onClick={() => navigate(`/dashboard/courses/${course.course_id}`)}
                          >
                            Continue Learning
                            <IconArrowRight size={18} />
                          </button>
                        </div>
                      </Paper>
                    </motion.div>
                  </Grid.Col>
                );
              })}
            </Grid>
          )}
        </Box>
      </Container>


      {/* Delete Modal */}
      <Modal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={<Text weight={700} size="lg">Delete Course</Text>}
        centered
      >
        <Text mb="lg">
          Are you sure you want to delete this course? This action cannot be undone.
        </Text>
        <Group position="right">
          <Button variant="default" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={confirmDelete} leftIcon={<IconTrash size={16} />}>
            Delete
          </Button>
        </Group>
      </Modal>

      {/* Edit Modal */}
      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title={<Text weight={700} size="lg">Edit Course</Text>}
        centered
        size="md"
      >
        <Stack spacing="md">
          <TextInput
            label="Course Title"
            placeholder="Enter course title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.currentTarget.value)}
          />
          <Textarea
            label="Description"
            placeholder="Enter course description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.currentTarget.value)}
            minRows={3}
          />
          <Switch
            checked={isPublic}
            onChange={(e) => setIsPublic(e.currentTarget.checked)}
            label="Make course public"
            description="Public courses can be viewed by anyone"
            thumbIcon={
              isPublic ? (
                <IconWorld size={12} color="#0d9488" stroke={3} />
              ) : (
                <IconX size={12} color="#dc2626" stroke={3} />
              )
            }
          />
          <Group position="right" mt="md">
            <Button variant="default" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmEdit} className="action-btn">
              Save Changes
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}

export default Dashboard;