from .serializers import FileSerializer
from .models import File
from rest_framework import viewsets

class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer