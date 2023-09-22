from .serializers import FileSerializer
from .models import File
from .metadata import MetaData
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

class FileViewSet(viewsets.ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer

    @action(detail=True, methods=['get'])
    def rosbag(self, request, pk=None):
        object = File.objects.get(pk=pk)
        serializer = FileSerializer(object)
        meta_data = MetaData(serializer.data["file"])
        return Response(meta_data.read())

