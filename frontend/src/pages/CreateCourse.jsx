import { useState, forwardRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container,
  Title,
  Text,
  Paper,
  Stepper,
  Button,
  Group,
  TextInput,
  Textarea,
  Select,
  Box,
  Image,
  List,
  ThemeIcon,
  Progress,
  Stack,
  useMantineTheme,
  RingProgress,
  Divider,
  Alert,
  SimpleGrid,
  FileButton,
  Card,
  Slider,
  ActionIcon,
  Center,
  Loader,
} from '@mantine/core';
import {
  IconBook,
  IconClock,
  IconGlobe,
  IconBrain,
  IconUpload,
  IconFile,
  IconPhoto,
  IconCheck,
  IconArrowRight,
  IconArrowLeft,
  IconSparkles,
  IconTarget,
  IconX,
  IconEdit,
  IconAlertCircle,
  IconFileText,
  IconSchool,
  IconRocket
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { toast } from 'react-toastify';
import courseService from '../api/courseService';
import ReactCountryFlag from 'react-country-flag';
import PremiumModal from '../components/PremiumModal';
import './CreateCourse.css';

const LanguageSelectItem = forwardRef(({ label, countryCode, ...others }, ref) => (
  <div ref={ref} {...others}>
    <Group noWrap>
      <ReactCountryFlag
        countryCode={countryCode}
        svg
        style={{ width: '1.5em', height: '1.5em' }}
        title={countryCode}
      />
      <Text size="sm">{label}</Text>
    </Group>
  </div>
));

function CreateCourse() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('createCourse');
  const theme = useMantineTheme();

  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm({
    initialValues: {
      query: '',
      time_hours: 2,
      language: i18n.language || 'en',
      difficulty: 'beginner',
      documents: [],
      images: [],
    },
    validate: {
      query: (value) => (!value ? t('form.validation.topicRequired') : null),
      time_hours: (value) => (value <= 0 ? t('form.validation.timePositive') : null),
      difficulty: (value) => (!value ? t('form.validation.difficultyRequired') : null),
    },
  });

  const steps = [
    { label: 'Goal', description: 'What to learn', icon: <IconBrain size={20} /> },
    { label: 'Duration', description: 'Study time', icon: <IconClock size={20} /> },
    { label: 'Settings', description: 'Level & Language', icon: <IconTarget size={20} /> },
    { label: 'Review', description: 'Confirm', icon: <IconCheck size={20} /> }
  ];

  const difficultyOptions = [
    { value: 'beginner', label: 'Beginner', description: 'New to this topic', icon: IconBook },
    { value: 'intermediate', label: 'Intermediate', description: 'Some knowledge', icon: IconBrain },
    { value: 'advanced', label: 'Advanced', description: 'Experienced learner', icon: IconSparkles },
    { value: 'university', label: 'University', description: 'Academic level', icon: IconSchool }
  ];

  const languageOptions = [
    { value: 'en', label: 'English', countryCode: 'US' },
    { value: 'de', label: 'Deutsch', countryCode: 'DE' },
  ];

  const handleDocumentUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const documentData = await courseService.uploadDocument(file);
      setUploadedDocuments(prev => [...prev, documentData]);
      toast.success(`Uploaded ${file.name}`);
      return documentData;
    } catch (err) {
      toast.error(`Upload failed: ${err.message}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const imageData = await courseService.uploadImage(file);
      setUploadedImages(prev => [...prev, imageData]);
      toast.success(`Uploaded ${file.name}`);
      return imageData;
    } catch (err) {
      toast.error(`Upload failed: ${err.message}`);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const nextStep = () => {
    if (activeStep < steps.length - 1) setActiveStep(prev => prev + 1);
  };

  const prevStep = () => {
    if (activeStep > 0) setActiveStep(prev => prev - 1);
  };

  const handleFileUpload = async (files, type) => {
    if (files && files.length > 0) {
      for (const file of files) {
        if (type === 'document') await handleDocumentUpload(file);
        else await handleImageUpload(file);
      }
    }
  };

  const removeFile = (index, type) => {
    if (type === 'document') setUploadedDocuments(prev => prev.filter((_, i) => i !== index));
    else setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const documentIds = uploadedDocuments.map(doc => doc.id);
      const imageIds = uploadedImages.map(img => img.id);

      const data = await courseService.createCourse({
        query: form.values.query,
        time_hours: form.values.time_hours,
        language: form.values.language,
        difficulty: form.values.difficulty,
        document_ids: documentIds,
        picture_ids: imageIds,
      });

      navigate(`/dashboard/courses/${data.course_id}`);
    } catch (err) {
      if (err.response?.status === 429) {
        setIsLimitReached(true);
        setShowPremiumModal(true);
      }
      setError(err.message || 'Creation failed');
      toast.error(err.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = (step) => {
    switch (step) {
      case 0: return form.values.query.trim().length > 0;
      case 1: return form.values.time_hours > 0;
      case 2: return form.values.difficulty && form.values.language;
      default: return true;
    }
  };

  const renderStepContent = () => {
    const stepTransition = {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
      transition: { duration: 0.4 }
    };

    switch (activeStep) {
      case 0:
        return (
          <motion.div key="step0" {...stepTransition}>
            <Stack spacing="xl">
              <Box ta="center">
                <ThemeIcon size={80} radius="24px" variant="gradient" gradient={{ from: 'teal', to: 'cyan' }} mb="md">
                  <IconBrain size={40} />
                </ThemeIcon>
                <Title order={2} weight={900}>What's your learning goal?</Title>
                <Text color="dimmed" mt="xs">Describe the topic you want to master in detail.</Text>
              </Box>

              <Textarea
                placeholder="e.g., I want a comprehensive course on Quantum Computing, focusing on qubits, entanglement, and Shor's algorithm for beginners."
                required
                autosize
                minRows={4}
                {...form.getInputProps('query')}
                className="premium-textarea"
              />

              <Divider label="Support with Materials" labelPosition="center" />

              <SimpleGrid cols={2} spacing="md">
                <FileButton onChange={(files) => handleFileUpload(files, 'document')} accept=".pdf,.doc,.docx,.txt" multiple>
                  {(props) => (
                    <Paper {...props} withBorder className="difficulty-card-premium" ta="center">
                      <ThemeIcon size={48} color="blue" variant="light" radius="xl" mb="sm">
                        <IconFileText size={24} />
                      </ThemeIcon>
                      <Text weight={700} size="sm">Add Documents</Text>
                      <Text size="xs" color="dimmed">PDF, Word, TXT</Text>
                    </Paper>
                  )}
                </FileButton>
                <FileButton onChange={(files) => handleFileUpload(files, 'image')} accept="image/*" multiple>
                  {(props) => (
                    <Paper {...props} withBorder className="difficulty-card-premium" ta="center">
                      <ThemeIcon size={48} color="teal" variant="light" radius="xl" mb="sm">
                        <IconPhoto size={24} />
                      </ThemeIcon>
                      <Text weight={700} size="sm">Add Images</Text>
                      <Text size="xs" color="dimmed">PNG, JPG, SVG</Text>
                    </Paper>
                  )}
                </FileButton>
              </SimpleGrid>

              {(uploadedDocuments.length > 0 || uploadedImages.length > 0) && (
                <Stack spacing="xs">
                  <Text weight={800} size="sm" color="dimmed">ATTACHED FILES</Text>
                  <Group spacing="sm">
                    {uploadedDocuments.map((doc, i) => (
                      <Badge key={doc.id} variant="light" color="blue" size="lg" radius="md" rightSection={<ActionIcon size="xs" onClick={() => removeFile(i, 'document')}><IconX size={10} /></ActionIcon>}>
                        {doc.filename}
                      </Badge>
                    ))}
                    {uploadedImages.map((img, i) => (
                      <Badge key={img.id} variant="light" color="teal" size="lg" radius="md" rightSection={<ActionIcon size="xs" onClick={() => removeFile(i, 'image')}><IconX size={10} /></ActionIcon>}>
                        {img.filename || 'Image'}
                      </Badge>
                    ))}
                  </Group>
                </Stack>
              )}
            </Stack>
          </motion.div>
        );

      case 1:
        return (
          <motion.div key="step1" {...stepTransition}>
            <Stack spacing="xl">
              <Box ta="center">
                <ThemeIcon size={80} radius="24px" variant="gradient" gradient={{ from: 'blue', to: 'teal' }} mb="md">
                  <IconClock size={40} />
                </ThemeIcon>
                <Title order={2} weight={900}>Study Duration</Title>
                <Text color="dimmed" mt="xs">How many hours can you dedicate to this course?</Text>
              </Box>

              <Center>
                <RingProgress
                  size={200}
                  thickness={12}
                  roundCaps
                  sections={[{ value: (form.values.time_hours / 30) * 100, color: '#0d9488' }]}
                  label={
                    <Stack align="center" spacing={0}>
                      <Text size={32} weight={900} color="#0d9488">{form.values.time_hours}</Text>
                      <Text weight={800} size="sm" color="dimmed">HOURS</Text>
                    </Stack>
                  }
                />
              </Center>

              <Box px="xl">
                <Slider
                  value={form.values.time_hours}
                  onChange={(v) => form.setFieldValue('time_hours', v)}
                  min={1}
                  max={30}
                  size="xl"
                  radius="xl"
                  color="teal"
                  marks={[
                    { value: 5, label: '5h' },
                    { value: 15, label: '15h' },
                    { value: 30, label: '30h' },
                  ]}
                />
              </Box>

              <SimpleGrid cols={3} spacing="md" mt="xl">
                {[
                  { label: 'Sprint', hours: '1-5h', desc: 'Focus sessions' },
                  { label: 'Deep Dive', hours: '5-20h', desc: 'Detailed study' },
                  { label: 'Mastery', hours: '20-30h', desc: 'Full mastery' }
                ].map((p, i) => (
                  <Paper key={i} p="md" withBorder radius="lg" ta="center">
                    <Text weight={900} color="#0d9488">{p.label}</Text>
                    <Text size="sm" weight={700}>{p.hours}</Text>
                    <Text size="xs" color="dimmed">{p.desc}</Text>
                  </Paper>
                ))}
              </SimpleGrid>
            </Stack>
          </motion.div>
        );

      case 2:
        return (
          <motion.div key="step2" {...stepTransition}>
            <Stack spacing="xl">
              <Box ta="center">
                <ThemeIcon size={80} radius="24px" variant="gradient" gradient={{ from: 'cyan', to: 'teal' }} mb="md">
                  <IconTarget size={40} />
                </ThemeIcon>
                <Title order={2} weight={900}>Personalize your Level</Title>
                <Text color="dimmed" mt="xs">Choose your current expertise and preferred language.</Text>
              </Box>

              <SimpleGrid cols={2} spacing="md">
                {difficultyOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = form.values.difficulty === opt.value;
                  return (
                    <Paper
                      key={opt.value}
                      withBorder
                      className="difficulty-card-premium"
                      data-selected={isSelected}
                      onClick={() => form.setFieldValue('difficulty', opt.value)}
                    >
                      <Group noWrap>
                        <ThemeIcon color={isSelected ? 'teal' : 'gray'} variant="light" size="lg" radius="md">
                          <Icon size={20} />
                        </ThemeIcon>
                        <Box>
                          <Text weight={800} size="sm">{opt.label}</Text>
                          <Text size="xs" color="dimmed">{opt.description}</Text>
                        </Box>
                      </Group>
                    </Paper>
                  );
                })}
              </SimpleGrid>

              <Box>
                <Text weight={800} size="sm" color="dimmed" mb="xs">PREFFERED LANGUAGE</Text>
                <Select
                  data={languageOptions}
                  itemComponent={LanguageSelectItem}
                  {...form.getInputProps('language')}
                  size="lg"
                  radius="xl"
                  icon={<IconGlobe size={20} color="#0d9488" />}
                />
              </Box>
            </Stack>
          </motion.div>
        );

      case 3:
        return (
          <motion.div key="step3" {...stepTransition}>
            <Stack spacing="xl">
              <Box ta="center">
                <ThemeIcon size={80} radius="24px" variant="gradient" gradient={{ from: 'green', to: 'teal' }} mb="md">
                  <IconRocket size={40} />
                </ThemeIcon>
                <Title order={2} weight={900}>Ready to Launch?</Title>
                <Text color="dimmed" mt="xs">Review your curriculum details before we generate it.</Text>
              </Box>

              <div className="summary-card-premium">
                <Stack spacing="md">
                  <Group position="apart">
                    <Text weight={800} color="dimmed" size="xs">TOPIC</Text>
                    <ActionIcon size="sm" onClick={() => setActiveStep(0)}><IconEdit size={16} /></ActionIcon>
                  </Group>
                  <Text weight={700} size="sm">{form.values.query}</Text>

                  <Divider />

                  <Group grow>
                    <Box>
                      <Text weight={800} color="dimmed" size="xs">DURATION</Text>
                      <Text weight={700}>{form.values.time_hours} Hours</Text>
                    </Box>
                    <Box>
                      <Text weight={800} color="dimmed" size="xs">DIFFICULTY</Text>
                      <Text weight={700} transform="capitalize">{form.values.difficulty}</Text>
                    </Box>
                    <Box>
                      <Text weight={800} color="dimmed" size="xs">LANGUAGE</Text>
                      <Text weight={700}>{languageOptions.find(l => l.value === form.values.language)?.label}</Text>
                    </Box>
                  </Group>
                </Stack>
              </div>

              {isSubmitting && (
                <Stack align="center" py="md">
                  <Loader color="teal" variant="dots" size="xl" />
                  <Text weight={700}>Weaving your personalized course...</Text>
                </Stack>
              )}
            </Stack>
          </motion.div>
        );
      default: return null;
    }
  };

  return (
    <div className="create-course-container">
      <PremiumModal opened={showPremiumModal} onClose={() => setShowPremiumModal(false)} limitReached={isLimitReached} />

      <div className="create-course-hero">
        <div className="hero-shape-rocket" />
        <Container size="lg">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="page-title">Curate Your Knowledge</h1>
            <p className="page-subtitle">Harness AI to build a specialized learning path tailored precisely to your goals and pace.</p>
          </motion.div>
        </Container>
      </div>

      <div className="stepper-container-premium">
        <Paper className="stepper-card-premium">
          <Stepper
            active={activeStep}
            breakpoint="sm"
            className="premium-stepper"
            iconSize={48}
          >
            {steps.map((s, i) => (
              <Stepper.Step key={i} label={s.label} description={s.description} icon={s.icon} />
            ))}
          </Stepper>

          <Box py={40} style={{ minHeight: 400 }}>
            <AnimatePresence mode="wait">
              {renderStepContent()}
            </AnimatePresence>
          </Box>

          {error && (
            <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red" mb="xl" radius="xl" variant="light" withCloseButton onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Divider mb="xl" />

          <Group position="apart">
            <Button
              variant="subtle"
              onClick={prevStep}
              disabled={activeStep === 0 || isSubmitting}
              className="nav-btn-premium prev-btn-premium"
              leftIcon={<IconArrowLeft size={18} />}
            >
              Previous
            </Button>

            {activeStep < steps.length - 1 ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid(activeStep) || isUploading}
                className="nav-btn-premium next-btn-premium"
                rightIcon={<IconArrowRight size={18} />}
              >
                Next Step
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid(activeStep) || isSubmitting}
                loading={isSubmitting}
                className="nav-btn-premium next-btn-premium"
                leftIcon={<IconSparkles size={18} />}
              >
                Generate Course
              </Button>
            )}
          </Group>
        </Paper>
      </div>
    </div>
  );
}

export default CreateCourse;