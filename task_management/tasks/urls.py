from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet, TaskListView, RegisterView

router = DefaultRouter()
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('list/', TaskListView.as_view(), name='task-list'),
    path('register/', RegisterView.as_view(), name='register'),
]
