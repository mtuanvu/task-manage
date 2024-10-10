from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Task, CustomUser
from .serializers import TaskSerializer
from task_management.settings import db

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Lọc các công việc của người dùng hiện tại
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Gán người dùng hiện tại vào công việc mới tạo
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        # Cập nhật công việc
        serializer.save()

    def destroy(self, request, *args, **kwargs):
        # Xóa công việc
        task = self.get_object()
        task.delete()
        return Response({'message': 'Task deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=True, methods=['patch'])
    def toggle_completion(self, request, pk=None):
        """Chuyển đổi trạng thái hoàn thành của công việc"""
        task = self.get_object()
        task.is_completed = not task.is_completed
        task.save()
        return Response({'status': 'completion toggled', 'is_completed': task.is_completed}, status=status.HTTP_200_OK)


class TaskListView(APIView):
    permission_classes = [IsAuthenticated]  # Đảm bảo người dùng đã xác thực

    def get(self, request):
        # Lấy các công việc từ MongoDB, nếu cần thiết
        tasks = list(db.tasks.find({"user": request.user.username}))
        return Response(tasks, safe=False)


class RegisterView(APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        # Kiểm tra tên người dùng đã tồn tại
        if CustomUser.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)

        # Tạo người dùng mới
        user = CustomUser.objects.create_user(username=username, password=password)
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
