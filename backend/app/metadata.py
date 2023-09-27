import rosbag
import subprocess
import time
import os
from django.conf import settings

class MetaData:
    def __init__(self, file_path):
        self.file_path = os.path.dirname(settings.MEDIA_ROOT) + file_path
        self.meta_data = dict()
    def read(self):
        bag = rosbag.Bag(self.file_path, 'r')
        self.meta_data["filename"] = os.path.basename(bag.filename)
        self.meta_data["start_time"] = bag.get_start_time()
        self.meta_data["end_time"] = bag.get_end_time()
        self.meta_data["size"] = bag.size
        topics_info = []
        for topic, info in bag.get_type_and_topic_info().topics.items():
            topic_info = {"topic" : topic,
                          "msg_type" : info.msg_type,
                          "message_count" : info.message_count,
                          "connections" : info.connections,
                          "frequency" : info.frequency}
            topics_info.append(topic_info)
        self.meta_data["topics_info"] = topics_info
        print(self.meta_data)
        return self.meta_data