from django.db import models

class File(models.Model):
    file = models.FileField(upload_to='files')

    def __str__(self):
        return self.file