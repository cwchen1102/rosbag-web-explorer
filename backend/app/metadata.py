import rosbag
import subprocess
import time

class MetaData:
    def __init__(self, file_path):
        self.file_path = file_path
        self.meta_data = dict()
    def read(self):
        bag = rosbag.Bag(self.file_path, 'r')
        self.meta_data["filename"] = bag.filename
        self.meta_data["start_time"] = bag.get_start_time()
        self.meta_data["end_time"] = bag.get_end_time()
        self.meta_data["size"] = bag.size
        return self.meta_data