from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FileViewSet

router = DefaultRouter()
router.register("files", FileViewSet)
urlpatterns = [
    path('api/', include(router.urls)),
]