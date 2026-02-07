import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { Box, NavLink, Text, Button, ThemeIcon, Loader, useMantineTheme, ActionIcon } from '@mantine/core';
import {
  IconHome2,
  IconChevronRight,
  IconChevronDown,
  IconFileText,
  IconPhoto,
  IconQuestionMark,
  IconCircleCheck,
  IconCircleDashed,
  IconSchool,
} from '@tabler/icons-react';
import { courseService } from '../api/courseService';
import { useTranslation } from 'react-i18next';
import { MainLink } from "../layouts/AppLayout.jsx";
import { useMediaQuery } from "@mantine/hooks";

const ChapterLink = ({ chapter, activeChapter, index, handleChapterClick, handleNavigation, chapterId, courseId, opened, currentTab, isExpanded, ...props }) => {
  const [hasQuestions, setHasQuestions] = useState(false);
  const intervalRef = useRef(null);
  const theme = useMantineTheme();

  useEffect(() => {
    if (hasQuestions) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(async () => {
      try {
        const questions = await courseService.getChapterQuestions(courseId, chapter.id);
        if (questions && questions.length > 0) {
          setHasQuestions(true);
          clearInterval(intervalRef.current);
        }
      } catch (error) {
        console.error(`Error polling for quiz in chapter ${chapter.id}:`, error);
        clearInterval(intervalRef.current);
      }
    }, 500);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [courseId, chapter.id, hasQuestions]);

  if (!opened) {
    const isActive = chapterId === chapter.id.toString();
    return (
      <ActionIcon
        key={chapter.id}
        variant={isActive ? "filled" : "light"}
        size={44}
        color={chapter.is_completed ? 'teal' : isActive ? 'teal' : 'gray'}
        onClick={() => handleNavigation(chapter.id, 'content')}
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          marginBottom: 12,
          borderRadius: 14,
          boxShadow: isActive ? '0 8px 16px rgba(13, 148, 136, 0.2)' : 'none',
          transition: 'all 0.3s ease',
        }}
        title={`${index + 1}. ${chapter.caption}`}
      >
        <Text size="sm" weight={800}>{index + 1}</Text>
      </ActionIcon>
    );
  }

  const isCurrentChapter = chapterId === chapter.id.toString();

  return (
    <Box mb={4}>
      <NavLink
        key={chapter.id}
        label={
          <Text size="sm" weight={700} sx={{ lineHeight: 1.4 }}>
            {index + 1}. {chapter.caption}
          </Text>
        }
        opened={isExpanded}
        onClick={() => handleChapterClick(chapter.id.toString())}
        className="chapter-nav-link"
        sx={{
          backgroundColor: isCurrentChapter ? (theme.colorScheme === 'dark' ? 'rgba(13, 148, 136, 0.1)' : 'rgba(13, 148, 136, 0.05)') : 'transparent',
          borderLeft: isCurrentChapter ? `4px solid ${theme.colors.teal[6]}` : '4px solid transparent',
          padding: '12px 16px',
        }}
        icon={
          <ThemeIcon
            variant={chapter.is_completed ? "filled" : "light"}
            size={24}
            radius="xl"
            color={chapter.is_completed ? 'teal' : 'gray'}
          >
            {chapter.is_completed ? <IconCircleCheck size={14} /> : <IconCircleDashed size={14} />}
          </ThemeIcon>
        }
        rightSection={isExpanded ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
      >
        <Stack spacing={2} mt={4}>
          <NavLink
            label="Content"
            icon={<IconFileText size={16} />}
            onClick={(e) => {
              e.stopPropagation();
              handleNavigation(chapter.id, 'content');
            }}
            active={isCurrentChapter && currentTab === 'content'}
            sx={{ borderRadius: 12, margin: '0 8px' }}
            color="teal"
          />
          {chapter.file_count > 0 && (
            <NavLink
              label="Files"
              icon={<IconPhoto size={16} />}
              onClick={(e) => {
                e.stopPropagation();
                handleNavigation(chapter.id, 'files');
              }}
              active={isCurrentChapter && currentTab === 'files'}
              sx={{ borderRadius: 12, margin: '0 8px' }}
              color="teal"
            />
          )}
          {hasQuestions && (
            <NavLink
              label="Quiz"
              icon={<IconQuestionMark size={16} />}
              onClick={(e) => {
                e.stopPropagation();
                handleNavigation(chapter.id, 'quiz');
              }}
              active={isCurrentChapter && currentTab === 'quiz'}
              sx={{ borderRadius: 12, margin: '0 8px' }}
              color="teal"
            />
          )}
        </Stack>
      </NavLink>
    </Box>
  );
};

const CourseSidebar = ({ opened, setopen }) => {
  const { t } = useTranslation(['navigation', 'app', 'settings']);
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId, chapterId } = useParams();

  const [course, setCourse] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState(new Set());
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Get current tab from URL search params
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'content';

  // Refs to hold interval IDs for cleanup
  const coursePollInterval = useRef(null);

  // Update activeChapter when chapterId changes
  useEffect(() => {
    // Ensure the active chapter is always expanded
    if (chapterId && !expandedChapters.has(chapterId)) {
      setExpandedChapters(prev => new Set([...prev, chapterId]));
    }
  }, [chapterId]);

  // Toggle chapter expansion
  const toggleChapter = (chapterId) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  // --- Polling and Data Fetching Logic ---

  // Fetches initial course and chapter data
  const fetchInitialData = async () => {
    if (!courseId) return;
    try {
      setLoading(true);
      const [courseData, chaptersData] = await Promise.all([
        courseService.getCourseById(courseId),
        courseService.getCourseChapters(courseId),
      ]);

      setCourse(courseData);
      // Initialize chapters with has_questions as false. It will be updated by polling.
      const initialChapters = (chaptersData || []).map(ch => ({ ...ch, has_questions: false }));
      setChapters(initialChapters);

      // If the course is being created, start polling for updates
      if (courseData?.status === 'CourseStatus.CREATING') {
        startCoursePolling();
      }
    } catch (error) {
      console.error('Failed to fetch initial course data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Polls for course status and new chapters
  const startCoursePolling = () => {
    if (coursePollInterval.current) clearInterval(coursePollInterval.current);

    coursePollInterval.current = setInterval(async () => {
      try {
        const [updatedCourse, updatedChaptersData] = await Promise.all([
          courseService.getCourseById(courseId),
          courseService.getCourseChapters(courseId),
        ]);

        setCourse(updatedCourse);

        // Check for newly added chapters
        setChapters(prevChapters => {
          const newChapters = (updatedChaptersData || []).map(newChap => {
            const existing = prevChapters.find(p => p.id === newChap.id);
            return existing ? existing : { ...newChap, has_questions: false };
          });

          return newChapters;
        });

        // If course creation is finished, stop polling
        if (updatedCourse?.status === 'CourseStatus.FINISHED') {
          clearInterval(coursePollInterval.current);
        }
      } catch (error) {
        console.error('Error during course polling:', error);
        clearInterval(coursePollInterval.current); // Stop on error
      }
    }, 2000); // Poll every 2 seconds
  };

  // --- Effects ---

  // Initial data load
  useEffect(() => {
    fetchInitialData();

    // Cleanup function to clear all intervals when the component unmounts
    return () => {
      if (coursePollInterval.current) {
        clearInterval(coursePollInterval.current);
      }
    };
  }, [courseId]);

  // --- Handlers ---

  const handleChapterClick = (id) => {
    toggleChapter(id);
  };

  const handleNavigation = (chapId, tab) => {
    // Force navigation even if we're already on the same chapter
    const newUrl = `/dashboard/courses/${courseId}/chapters/${chapId}?tab=${tab}`;
    navigate(newUrl);

    // Close mobile sidebar after navigation
    if (isMobile) {
      setopen(false);
    }
  };

  const handleCourseTitleClick = () => {
    navigate(`/dashboard/courses/${courseId}`);

    // Close mobile sidebar after navigation
    if (isMobile) {
      setopen(false);
    }
  };

  const handleNavigate = () => {
    if (isMobile) {
      setopen(false);
    }
  };

  // --- Render Logic ---

  if (loading) {
    return (
      <Box p="md" style={{ textAlign: 'center' }}>
        <Loader />
        <Text size="sm" mt="sm">Loading Course...</Text>
      </Box>
    );
  }

  const link = { icon: <IconHome2 size={20} />, color: 'blue', label: t('home', { ns: 'navigation' }), to: '/dashboard' }

  return (
    <Box>
      <MainLink
        {...link}
        key={link.label}
        isActive={false}
        collapsed={!opened}
        onNavigate={handleNavigate}
      />

      {opened ? (
        <UnstyledButton
          className="course-title-btn-premium"
          onClick={handleCourseTitleClick}
          sx={{ width: 'calc(100% - 24px)', display: 'block' }}
        >
          <Group spacing="sm" noWrap>
            <ThemeIcon variant="light" color="teal" size="lg" radius="md">
              <IconSchool size={20} />
            </ThemeIcon>
            <Text weight={900} size="sm" sx={{ flex: 1, lineHeight: 1.2 }}>
              {course?.title && course?.title != "None" ? course?.title : 'Course Overview'}
            </Text>
          </Group>
        </UnstyledButton>
      ) : (
        <ActionIcon
          variant="light"
          size={44}
          color="teal"
          onClick={handleCourseTitleClick}
          style={{ display: 'flex', justifyContent: 'center', width: '100%', margin: '24px 0', borderRadius: 14 }}
          title={course?.title || 'Course Overview'}
        >
          <IconSchool size={24} />
        </ActionIcon>
      )}

      <Box px={opened ? 0 : 0}>
        {chapters.map((chapter, index) =>
          (chapter.id !== null) ? (
            <ChapterLink
              key={chapter.id}
              chapter={chapter}
              index={index}
              activeChapter={chapterId}
              handleChapterClick={handleChapterClick}
              handleNavigation={handleNavigation}
              chapterId={chapterId}
              courseId={courseId}
              opened={opened}
              currentTab={currentTab}
              isExpanded={expandedChapters.has(chapter.id.toString())}
            />
          ) : null
        )}
      </Box>
    </Box>
  );
};

export default CourseSidebar;
