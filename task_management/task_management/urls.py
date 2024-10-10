# urls.py (task_management)
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('tasks.urls')),  # Prefix /api/
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Endpoint cấp phát token
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Endpoint làm mới token
]
