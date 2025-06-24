import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit2, Plus, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FileUpload } from "@/components/FileUpload";

interface Course {
  id: number;
  title: string;
  description: string;
  track: string;
  level: number;
  imageUrl?: string;
  accessTier: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Lesson {
  id: number;
  courseId: number;
  title: string;
  videoUrl?: string;
  workbookUrl?: string;
  requiredTier: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminCourses() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedCourseForLessons, setSelectedCourseForLessons] = useState<Course | null>(null);
  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Course form state
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    track: "architect",
    level: 1,
    imageUrl: "",
    accessTier: "beginner",
    isPublished: false,
  });

  // Lesson form state
  const [lessonForm, setLessonForm] = useState({
    title: "",
    videoUrl: "",
    workbookUrl: "",
    requiredTier: "beginner",
    order: 1,
  });

  // Fetch courses
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["/api/admin/courses"],
    retry: false,
  });

  // Fetch lessons for selected course
  const { data: lessons = [], refetch: refetchLessons } = useQuery({
    queryKey: ["/api/admin/courses", selectedCourseForLessons?.id, "lessons"],
    enabled: !!selectedCourseForLessons,
    retry: false,
  });

  // Create course mutation
  const createCourseMutation = useMutation({
    mutationFn: async (courseData: any) => {
      return fetch("/api/admin/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-id": "admin-dev-12345"
        },
        credentials: "include",
        body: JSON.stringify(courseData)
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: res.statusText }));
          throw new Error(errorData.error || res.statusText);
        }
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] });
      setIsCreateDialogOpen(false);
      resetCourseForm();
      toast({ title: "Course created successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to create course", description: error.message, variant: "destructive" });
    },
  });

  // Update course mutation
  const updateCourseMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return fetch(`/api/admin/courses/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-id": "admin-dev-12345"
        },
        credentials: "include",
        body: JSON.stringify(data)
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: res.statusText }));
          throw new Error(errorData.error || res.statusText);
        }
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] });
      setIsEditDialogOpen(false);
      setSelectedCourse(null);
      resetCourseForm();
      toast({ title: "Course updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to update course", description: error.message, variant: "destructive" });
    },
  });

  // Delete course mutation
  const deleteCourseMutation = useMutation({
    mutationFn: async (id: number) => {
      return fetch(`/api/admin/courses/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-id": "admin-dev-12345"
        },
        credentials: "include"
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: res.statusText }));
          throw new Error(errorData.error || res.statusText);
        }
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/courses"] });
      toast({ title: "Course deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to delete course", description: error.message, variant: "destructive" });
    },
  });

  // Create lesson mutation
  const createLessonMutation = useMutation({
    mutationFn: async ({ courseId, lessonData }: { courseId: number; lessonData: any }) => {
      return fetch(`/api/admin/courses/${courseId}/lessons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-id": "admin-dev-12345"
        },
        credentials: "include",
        body: JSON.stringify(lessonData)
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: res.statusText }));
          throw new Error(errorData.error || res.statusText);
        }
        return res.json();
      });
    },
    onSuccess: () => {
      refetchLessons();
      setIsLessonDialogOpen(false);
      resetLessonForm();
      toast({ title: "Lesson created successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to create lesson", description: error.message, variant: "destructive" });
    },
  });

  // Update lesson mutation
  const updateLessonMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return fetch(`/api/admin/lessons/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-id": "admin-dev-12345"
        },
        credentials: "include",
        body: JSON.stringify(data)
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: res.statusText }));
          throw new Error(errorData.error || res.statusText);
        }
        return res.json();
      });
    },
    onSuccess: () => {
      refetchLessons();
      setIsLessonDialogOpen(false);
      setEditingLesson(null);
      resetLessonForm();
      toast({ title: "Lesson updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to update lesson", description: error.message, variant: "destructive" });
    },
  });

  // Delete lesson mutation
  const deleteLessonMutation = useMutation({
    mutationFn: async (id: number) => {
      return fetch(`/api/admin/lessons/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-id": "admin-dev-12345"
        },
        credentials: "include"
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: res.statusText }));
          throw new Error(errorData.error || res.statusText);
        }
        return res.json();
      });
    },
    onSuccess: () => {
      refetchLessons();
      toast({ title: "Lesson deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Failed to delete lesson", description: error.message, variant: "destructive" });
    },
  });

  const resetCourseForm = () => {
    setCourseForm({
      title: "",
      description: "",
      track: "architect",
      level: 1,
      imageUrl: "",
      accessTier: "beginner",
      isPublished: false,
    });
  };

  const resetLessonForm = () => {
    setLessonForm({
      title: "",
      videoUrl: "",
      workbookUrl: "",
      requiredTier: "beginner",
      order: 1,
    });
  };

  const handleCreateCourse = () => {
    createCourseMutation.mutate(courseForm);
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description || "",
      track: course.track,
      level: course.level,
      imageUrl: course.imageUrl || "",
      accessTier: course.accessTier,
      isPublished: course.isPublished,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateCourse = () => {
    if (selectedCourse) {
      updateCourseMutation.mutate({ id: selectedCourse.id, data: courseForm });
    }
  };

  const handleDeleteCourse = (id: number) => {
    if (confirm("Are you sure you want to delete this course? This will also delete all lessons.")) {
      deleteCourseMutation.mutate(id);
    }
  };

  const handleManageLessons = (course: Course) => {
    setSelectedCourseForLessons(course);
  };

  const handleCreateLesson = () => {
    if (selectedCourseForLessons) {
      createLessonMutation.mutate({
        courseId: selectedCourseForLessons.id,
        lessonData: lessonForm,
      });
    }
  };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title,
      videoUrl: lesson.videoUrl || "",
      workbookUrl: lesson.workbookUrl || "",
      requiredTier: lesson.requiredTier,
      order: lesson.order,
    });
    setIsLessonDialogOpen(true);
  };

  const handleUpdateLesson = () => {
    if (editingLesson) {
      updateLessonMutation.mutate({ id: editingLesson.id, data: lessonForm });
    }
  };

  const handleDeleteLesson = (id: number) => {
    if (confirm("Are you sure you want to delete this lesson?")) {
      deleteLessonMutation.mutate(id);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-orange-100 text-orange-800";
      case "mastermind": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTrackColor = (track: string) => {
    switch (track) {
      case "architect": return "bg-blue-100 text-blue-800";
      case "alchemist": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (coursesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Course Management</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Course Title"
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
              />
              <Textarea
                placeholder="Course Description"
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <Select value={courseForm.track} onValueChange={(value) => setCourseForm({ ...courseForm, track: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Track" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="architect">Architect</SelectItem>
                    <SelectItem value="alchemist">Alchemist</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={courseForm.accessTier} onValueChange={(value) => setCourseForm({ ...courseForm, accessTier: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Access Tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="mastermind">Mastermind</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                type="number"
                placeholder="Level"
                value={courseForm.level}
                onChange={(e) => setCourseForm({ ...courseForm, level: parseInt(e.target.value) || 1 })}
              />
              <FileUpload
                label="Course Image"
                accept="image/*"
                fieldName="image"
                currentUrl={courseForm.imageUrl}
                onFileUploaded={(url) => setCourseForm({ ...courseForm, imageUrl: url })}
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={courseForm.isPublished}
                  onChange={(e) => setCourseForm({ ...courseForm, isPublished: e.target.checked })}
                />
                <label htmlFor="isPublished">Published</label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCourse} disabled={createCourseMutation.isPending}>
                  Create Course
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {selectedCourseForLessons && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Lessons for: {selectedCourseForLessons.title}</CardTitle>
              <div className="flex space-x-2">
                <Dialog open={isLessonDialogOpen} onOpenChange={setIsLessonDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Lesson
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingLesson ? "Edit Lesson" : "Create New Lesson"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input
                        placeholder="Lesson Title"
                        value={lessonForm.title}
                        onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                      />
                      <FileUpload
                        label="Lesson Video"
                        accept="video/*"
                        fieldName="video"
                        currentUrl={lessonForm.videoUrl}
                        onFileUploaded={(url) => setLessonForm({ ...lessonForm, videoUrl: url })}
                      />
                      <FileUpload
                        label="Lesson Workbook"
                        accept="application/pdf"
                        fieldName="workbook"
                        currentUrl={lessonForm.workbookUrl}
                        onFileUploaded={(url) => setLessonForm({ ...lessonForm, workbookUrl: url })}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Select value={lessonForm.requiredTier} onValueChange={(value) => setLessonForm({ ...lessonForm, requiredTier: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Required Tier" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                            <SelectItem value="mastermind">Mastermind</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          placeholder="Order"
                          value={lessonForm.order}
                          onChange={(e) => setLessonForm({ ...lessonForm, order: parseInt(e.target.value) || 1 })}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => {
                          setIsLessonDialogOpen(false);
                          setEditingLesson(null);
                          resetLessonForm();
                        }}>
                          Cancel
                        </Button>
                        <Button 
                          onClick={editingLesson ? handleUpdateLesson : handleCreateLesson}
                          disabled={createLessonMutation.isPending || updateLessonMutation.isPending}
                        >
                          {editingLesson ? "Update Lesson" : "Create Lesson"}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" onClick={() => setSelectedCourseForLessons(null)}>
                  Close
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lessons.map((lesson: Lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{lesson.order}. {lesson.title}</span>
                      <Badge className={getTierColor(lesson.requiredTier)}>
                        {lesson.requiredTier}
                      </Badge>
                    </div>
                    {lesson.videoUrl && (
                      <p className="text-sm text-gray-600 mt-1">Video: {lesson.videoUrl}</p>
                    )}
                    {lesson.workbookUrl && (
                      <p className="text-sm text-gray-600">Workbook: {lesson.workbookUrl}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditLesson(lesson)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDeleteLesson(lesson.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {lessons.length === 0 && (
                <p className="text-center text-gray-500 py-4">No lessons yet. Create your first lesson above.</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course: Course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <div className="flex space-x-2">
                  <Badge className={getTrackColor(course.track)}>
                    {course.track}
                  </Badge>
                  <Badge className={getTierColor(course.accessTier)}>
                    {course.accessTier}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 line-clamp-3">{course.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Level {course.level}</span>
                <Badge variant={course.isPublished ? "default" : "secondary"}>
                  {course.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <Button size="sm" variant="outline" onClick={() => handleManageLessons(course)}>
                  <Users className="w-4 h-4 mr-2" />
                  Lessons
                </Button>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEditCourse(course)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteCourse(course.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No courses yet</h3>
          <p className="text-gray-500">Create your first course to get started.</p>
        </div>
      )}

      {/* Edit Course Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Course Title"
              value={courseForm.title}
              onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
            />
            <Textarea
              placeholder="Course Description"
              value={courseForm.description}
              onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Select value={courseForm.track} onValueChange={(value) => setCourseForm({ ...courseForm, track: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Track" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="architect">Architect</SelectItem>
                  <SelectItem value="alchemist">Alchemist</SelectItem>
                </SelectContent>
              </Select>
              <Select value={courseForm.accessTier} onValueChange={(value) => setCourseForm({ ...courseForm, accessTier: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Access Tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="mastermind">Mastermind</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              type="number"
              placeholder="Level"
              value={courseForm.level}
              onChange={(e) => setCourseForm({ ...courseForm, level: parseInt(e.target.value) || 1 })}
            />
            <Input
              placeholder="Image URL (optional)"
              value={courseForm.imageUrl}
              onChange={(e) => setCourseForm({ ...courseForm, imageUrl: e.target.value })}
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="editIsPublished"
                checked={courseForm.isPublished}
                onChange={(e) => setCourseForm({ ...courseForm, isPublished: e.target.checked })}
              />
              <label htmlFor="editIsPublished">Published</label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateCourse} disabled={updateCourseMutation.isPending}>
                Update Course
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}